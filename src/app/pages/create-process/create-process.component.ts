import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserInfoComponent } from '@base-ui/user-info/user-info.component';
import { ProductDetailsDTO } from '@interfaces/Products/ProductDTO';
import { ProductsService } from '@services/products.service';
import { ProductFilterComponent } from "@shared-components/filters/product-filter/product-filter.component";
import { NumberInputComponent } from '@shared-components/forms/number-input/number-input.component';
import { FormsModule } from "@angular/forms";
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { CommonModule } from '@angular/common';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ProcessesService } from '@services/processes.service';

@Component({
  selector: 'app-create-process',
  imports: [UserInfoComponent, ProductFilterComponent, NumberInputComponent, FormsModule, LoadingButtonComponent, CommonModule],
  templateUrl: './create-process.component.html',
  styleUrl: './create-process.component.css'
})
export class CreateProcessComponent {

  //* Injections
  _productService = inject(ProductsService);
  _processService = inject(ProcessesService);
  _modalService = inject(ModalService);
  _notificationService = inject(NotificationService);

  //* UI Variables
  _productId = signal<string | null>(null);
  _product = signal<ProductDetailsDTO | null>(null);
  _amount = signal<number | null>(null);
  _isLoading = signal<boolean>(false);

  _validAmount = computed<boolean>(() => {
    const amount = this._amount();
    if (amount === null) return true;
    return amount >= 1 && Number.isInteger(amount);
  });

  _allowSchedule = computed<boolean>(() => {
    const product = this._product();
    const amount = this._amount();

    if (!product || !amount) return false;

    const now = new Date();
    const totalMinutes = product.timeNeededMin * amount;
    const endTime = new Date(now.getTime() + totalMinutes * 60_000);

    const limit = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      45,
      0
    );

    return endTime <= limit;
  });

  _totalMaterial = computed<number>(() => {
    if (!this._product() && !this._amount)
      return 0

    return this._amount()! * this._product()!.rawMaterialNeededKg
  });

  _totalTime = computed<number>(() => {
    if (!this._product() && !this._amount)
      return 0

    return this._amount()! * this._product()!.timeNeededMin
  });

  formattedTotalTime = computed(() => {
    const totalMinutes = this._totalTime();

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
    }

    return parts.length ? parts.join(' y ') : '0 minutos';
  });

  constructor() {
    effect(() => {
      if (this._productId != null) {
        this._getProductDetails();
      }
      else {
        this._product.set(null);
      }
    });
  }

  //* Get Product Details
  _getProductDetails(): void {

    if (!this._productId()) return;

    this._productService.getProductDetails(this._productId()!).subscribe({
      next: (res) => this._product.set(res)
    });
  }

  //* Create Process
  _createProcess(): void {
    if (!this._product() || !this._amount() || !this._allowSchedule())
      return;

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Confirmar Proceso',
      message: '¿Estás seguro de realizar el proceso?'
    }).pipe(filter((confirmation: boolean) => confirmation),
      switchMap(() => this._processService.createProcess(this._product()!.id, this._amount()!)))
      .subscribe({
        next: (res) => {
          this._notificationService.success('Creación del Proceso Exitoso', `El proceso se creo de forma exitosa con el SKU del producto : '${this._product()!.sku}'`);
          this._product.set(null);
          this._amount.set(null);
        },
        error: (err) => {
          const errorMessage =
            Object.values(err.error.errors || {}).flat()[0] ??
            err?.error?.message ??
            err?.error?.errorDetails ??
            err?.error?.title ??
            "Ocurrió un error al intentar crear el proceso";

          this._notificationService.error('Ocurrió un Error', errorMessage);
          this._isLoading.set(false)
        },
        complete: () => this._isLoading.set(false)
      });
  }

}
