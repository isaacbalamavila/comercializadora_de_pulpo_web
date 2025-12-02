import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { EmailButtonComponent } from '@helpers/email-button/email-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { SupplierDetailsDTO } from '@interfaces/Suppliers/SupplierDTO';
import { SupplierDTO, SupplierDTOFromDetails } from '@interfaces/Suppliers/SupplierDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { SuppliersService } from '@services/suppliers.service';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { filter, first, Subject, switchMap, takeUntil } from 'rxjs';
import { ModalRespose } from '@interfaces/ModalResponse';
import { DatePipe } from '@angular/common';
import { EditSupplierModal } from '@suppliers-modals/edit-supplier-modal/edit-supplier-modal.component';
import { phoneFormatter } from '@utils/phone-formatter';
import { LoadingButtonComponent } from "@shared-components/buttons/loading-button/loading-button.component";
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";

@Component({
  selector: 'app-view-supplier-details',
  imports: [PageLoaderComponent, PageErrorComponent, CopyButtonComponent, EmailButtonComponent,
    DatePipe, LoadingButtonComponent, BaseModalComponent],
  templateUrl: './view-supplier-details.component.html',
})
export class ViewSupplierDetailsModal implements OnInit {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _supplierService = inject(SuppliersService);
  private readonly _modalService = inject(ModalService);
  private readonly _notificationService = inject(NotificationService);

  //* Data Variables
  originalSupplier!: SupplierDTO;
  _supplier = signal<SupplierDetailsDTO | null>(null);
  _hasChanges = computed<boolean>(() => {
    const original = this.originalSupplier;
    const current = this._supplier();
    return original.name != current!.name
      || original.email != current!.email
      || original.phone != current!.phone
      || original.rfc != current!.rfc
      || original.isDeleted != current!.isDeleted
  });

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _deleteLoading = signal<boolean>(false);
  _restoreLoading = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {
    this._getSupplierDetails();
  }

  //* Get Supplier Details
  _getSupplierDetails(): void {
    this._supplierService.getSupplierDetails(this.originalSupplier.id).pipe(first(), takeUntil(this._destroy$)).subscribe({
      next: (res) => {
        res.phone = phoneFormatter(res.phone);
        res.altPhone = res.altPhone ? phoneFormatter(res.altPhone) : null;
        this._supplier.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);

      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Edit Supplier
  _editSupplier(): void {
    let supplier: SupplierDetailsDTO = { ...this._supplier()! };
    this._modalService.open(EditSupplierModal, { originalSupplier: supplier }).subscribe({
      next: (res: ModalRespose<SupplierDetailsDTO | null>) => {
        if (res.hasChanges && res.data) {
          res.data.phone = phoneFormatter(res.data.phone);
          res.data.altPhone = phoneFormatter(res.data.altPhone);
          this._supplier.set(res.data);
        }
      }
    });
  }

  //* Delete Supplier
  _deleteSupplier(): void {
    this._deleteLoading.set(true);
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de baja al Proveedor',
      message: '¿Estás seguro en dar de baja al proveedor?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._supplierService.deleteSupplier(this.originalSupplier.id))
    ).subscribe({
      next: () => {
        this._supplier.update((sp) => ({ ...sp!, isDeleted: true }));
        this._notificationService.success(
          'Proveedor dado de Baja',
          `Se dio de baja con éxito al proveedor "${this._supplier()!.name}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar dar de baja al proveedor';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._deleteLoading.set(false);
      },
      complete: () => this._deleteLoading.set(false)
    });
  }

  //* Restore Supplier
  _restoreSupplier(): void {
    this._restoreLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Restaurar Proveedor',
      message: '¿Estás seguro de restaurar al proveedor?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._supplierService.restoreSupplier(this.originalSupplier.id))
    )
      .subscribe({
        next: () => {
          this._supplier.update((sp) => ({ ...sp!, isDeleted: false }));;
          this._notificationService.success(
            'Proveedor Restaurado',
            `Se restauró con éxito al proveedor "${this._supplier()!.name}".`
          );
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ??
            err?.error?.title ??
            'Ocurrió un error al intentar restaurar al proveedor';

          this._notificationService.error('Ocurrió un Error', errorMessage);
          this._restoreLoading.set(false);
        },
        complete: () => this._restoreLoading.set(false)
      });
  }

  //* Close & Check Changes
  _close(): void {
    if (this._error()) {
      this._modalService.close<ModalRespose<SupplierDTO | null>>({ hasChanges: false, data: null });
      return;
    }

    if (this._hasChanges()) {
      const updatedSupplier = SupplierDTOFromDetails(this._supplier()!);
      this._modalService.close<ModalRespose<SupplierDTO | null>>({ hasChanges: true, data: updatedSupplier });
      return;
    }

    this._modalService.close<ModalRespose<SupplierDTO | null>>({ hasChanges: false, data: null });
  }

}
