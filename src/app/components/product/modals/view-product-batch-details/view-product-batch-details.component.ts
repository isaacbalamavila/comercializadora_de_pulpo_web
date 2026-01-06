import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ProductBatchDetails } from '@interfaces/Product Inventory/ProductBatchDetails';
import { ProductBatch } from '@interfaces/Product Inventory/ProductBatches';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { ProductInventoryService } from '@services/product-inventory.service';
import { NumberInputComponent } from "@shared-components/forms/number-input/number-input.component";
import { LoadingButtonComponent } from "@shared-components/buttons/loading-button/loading-button.component";
import { NotificationService } from '@services/notifications.service';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-view-product-batch-details',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, CopyButtonComponent, DatePipe,
    CurrencyPipe, NumberInputComponent, LoadingButtonComponent, ReactiveFormsModule],
  templateUrl: './view-product-batch-details.component.html',
  styleUrl: './view-product-batch-details.component.css'
})
export class ViewProductBatchDetailsModal implements OnInit {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _productInventoryService = inject(ProductInventoryService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* Data Variables
  originalProductBatch!: ProductBatch;
  _productBatchDetails = signal<ProductBatchDetails | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _disposeLoading = signal<boolean>(false);
  _updateLoading = signal<boolean>(false);
  _hasChanges = computed<boolean>(() => {
    const original = this.originalProductBatch;
    const current = this._productBatchDetails();

    return original.quantityRemain !== current!.quantityRemain;
  });

  //* Component Init
  ngOnInit(): void {
    this._getProductBatchDetails();
  }

  //* Update Available Weight Form 
  _updateRemainForm!: FormGroup;

  //* Get Product Batch Details
  _getProductBatchDetails(): void {
    this._productInventoryService.getProductBatchDetails(this.originalProductBatch.id).subscribe({
      next: (res) => {
        this._productBatchDetails.set(res)
        this._updateRemainForm = this._fb.group({
          amount: this._fb.control(res.quantityRemain, {
            validators: [
              Validators.required,
              Validators.min(0),
              Validators.max(res.quantityRemain)
            ]
          })
        });
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Update Product Batch Remain
  _updateProductBatchRemain(): void {
    this._updateLoading.set(true);
    const value = this._updateRemainForm.value.amount;
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Actualizar Kilogramos Disponibles',
      message: '¿Estás seguro de actualizar la cantidad disponible de este lote?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._productInventoryService.updateProductBatchRemain(this.originalProductBatch.id, value))
    ).subscribe({
      next: () => {
        this._productBatchDetails.update((sp) => ({ ...sp!, quantityRemain: value }));
        this._notificationService.success(
          'Cantidad disponible actualizada',
          `Se actualizó correctamente la cantidad disponible del lote '${this.originalProductBatch.sku}'".`
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

  //* Dispose Weight
  _disposeBatch(): void {
    this._disposeLoading.set(true);
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de Baja el Lote',
      message: '¿Estás seguro de dar de baja este lote?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._productInventoryService.disposeProductBatch(this.originalProductBatch.id))
    ).subscribe({
      next: () => {
        this._productBatchDetails.update((sp) => ({ ...sp!, quantityRemain: 0 }));
        this._notificationService.success(
          'Baja Exitosa',
          `Se dio de baja correctamente el lote '${this.originalProductBatch.sku}'".`
        );
        this._updateRemainForm.reset();
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
  _onClose() {
    if (this._error()) {
      this._modalService.close<ModalRespose<number | null>>({ hasChanges: false, data: null });
      return;
    }

    if (this._hasChanges()) {
      this._modalService.close<ModalRespose<number | null>>({ hasChanges: true, data: this._productBatchDetails()!.quantityRemain });
      return;
    }

    this._modalService.close<ModalRespose<number | null>>({ hasChanges: false, data: null });
  }
}
