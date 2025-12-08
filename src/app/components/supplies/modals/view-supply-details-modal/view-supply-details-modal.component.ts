import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { ModalService } from '@services/modal.service';
import { SuppliesInventoryService } from '@services/supplies-inventory.service';
import { SupplyDetailsDTO, SupplyDTO } from '@interfaces/Supplies Inventory/SupplyDTO';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NumberInputComponent } from '@shared-components/forms/number-input/number-input.component';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { NotificationService } from '@services/notifications.service';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ModalRespose } from '@interfaces/ModalResponse';

@Component({
  selector: 'app-view-supply-details-modal',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, CopyButtonComponent, DatePipe, CommonModule,
    NumberInputComponent, LoadingButtonComponent, ReactiveFormsModule],
  templateUrl: './view-supply-details-modal.component.html',
  styleUrl: './view-supply-details-modal.component.css'
})
export class ViewSupplyDetailsModalComponent implements OnInit {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _suppliesService = inject(SuppliesInventoryService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* Data
  originalSupply!: SupplyDTO;
  _supply = signal<SupplyDetailsDTO | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _disposeLoading = signal<boolean>(false);
  _updateLoading = signal<boolean>(false);
  _error = signal<ErrorResponse | null>(null);
  _hasChanges = computed<boolean>(() => {
    const original = this.originalSupply;
    const current = this._supply();

    return original.weightRemainKg !== current!.weightRemainKg;
  });

  //*On Init
  ngOnInit(): void {
    this._getSupplyDetails();
  }

  //* Update Available Weight Form 
  _updateWeightForm!: FormGroup;


  //* Get Supply Details
  _getSupplyDetails(): void {
    this._suppliesService.getSupplyDetails(this.originalSupply.id).subscribe({
      next: (res) => {
        this._supply.set(res);

        this._updateWeightForm = this._fb.group({
          weight: this._fb.control(res.weightRemainKg, {
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(res.weightRemainKg)
            ]
          })
        });
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)

    });
  }

  //* Update Weight
  _updateWeight(): void {
    this._updateLoading.set(true);
    const value = this._updateWeightForm.value.weight;
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Actualizar Kilogramos Disponibles',
      message: '¿Estás seguro de actualizar los kilogramos disponibles de este lote?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._suppliesService.updateWeightRemain(this.originalSupply.id, value))
    ).subscribe({
      next: () => {
        this._supply.update((sp) => ({ ...sp!, weightRemainKg: value }));
        this._notificationService.success(
          'Kilos disponibles actulizados',
          `Se actualizaron correctamente los kilos disponibles del lote '${this.originalSupply.sku}'".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar actualizar el lote';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._updateLoading.set(false);
      },
      complete: () => this._updateLoading.set(false)
    });
  }

  //* Update Weight
  _disposeSupply(): void {
    this._disposeLoading.set(true);
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de Baja el Lote',
      message: '¿Estás seguro de dar de baja este lote?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._suppliesService.disposeSupllyRemain(this.originalSupply.id))
    ).subscribe({
      next: () => {
        this._supply.update((sp) => ({ ...sp!, weightRemainKg: 0 }));
        this._notificationService.success(
          'Kilos disponibles actulizados',
          `Se actualizaron correctamente los kilos disponibles del lote '${this.originalSupply.sku}'".`
        );
        this._updateWeightForm.reset();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar dar de baja el lote';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._disposeLoading.set(false);
      },
      complete: () => this._disposeLoading.set(false)
    });
  }


  //* Close
  _close() {
    if (this._error()) {
      this._modalService.close<ModalRespose<number | null>>({ hasChanges: false, data: null });
      return;
    }

    if (this._hasChanges()) {
      this._modalService.close<ModalRespose<number | null>>({ hasChanges: true, data: this._supply()!.weightRemainKg });
      return;
    }

    this._modalService.close<ModalRespose<number | null>>({ hasChanges: false, data: null });
  }
}
