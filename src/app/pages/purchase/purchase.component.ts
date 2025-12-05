import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInfoComponent } from '@base-ui/user-info/user-info.component';
import { CreatePurchaseDTO } from '@interfaces/Purchases/CreatePurchaseDTO';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { PurchaseService } from '@services/purchase.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { SearchSupplierComponent } from "@shared-components/filters/search-supplier/search-supplier.component";
import { NumberInputComponent } from '@shared-components/forms/number-input/number-input.component';
import { SelectRawMaterialsFormsComponent } from '@shared-components/forms/select-raw-materials/select-raw-materials-form.component';
import { phoneFormatter } from '@utils/phone-formatter';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-purchase',
  imports: [UserInfoComponent, SearchSupplierComponent, SelectRawMaterialsFormsComponent, NumberInputComponent,
    ReactiveFormsModule, CurrencyPipe, LoadingButtonComponent
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent {

  //* Injections
  private readonly _purchaseService = inject(PurchaseService);
  private readonly _modalService = inject(ModalService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //*Data
  _supplierSelected = signal<SupplierDTO | null>(null);
  total = signal(0);


  //* UI Variables
  _isLoading = signal<boolean>(false);
  _supplierlabel = computed<string>(() => {

    if (!this._supplierSelected()) return '';

    const parts = this._supplierSelected()!.name.split(' ').filter(p => p.length > 0);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + (parts[2] ? parts[2][0] : parts[1][0])).toUpperCase();
    }
  });
  _phoneFormat = computed<string>(() => this._supplierSelected ? phoneFormatter(this._supplierSelected()!.phone) : '');

  //* Form
  _createPurchaseForm: FormGroup = this._fb.group({
    rawMaterial: this._fb.control<number | null>(null, {
      validators: [Validators.required]
    }),
    totalKg: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    priceKg: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
  });

  //* Constructor
  constructor() {
    this._createPurchaseForm.get('totalKg')?.valueChanges.subscribe(() => {
      this.updateTotal();
    });

    this._createPurchaseForm.get('priceKg')?.valueChanges.subscribe(() => {
      this.updateTotal();
    });
  }

  //* Total
  updateTotal() {
    const totalKg = this._createPurchaseForm.get('totalKg')?.value ?? 0;
    const priceKg = this._createPurchaseForm.get('priceKg')?.value ?? 0;
    this.total.set(totalKg * priceKg);
  }

  //* Make Purchase
  _createPurchase(): void {

    this._isLoading.set(true);
    const form = this._createPurchaseForm.value;

    const body: CreatePurchaseDTO = {
      supplierId: this._supplierSelected()!.id,
      rawMaterialId: form.rawMaterial,
      totalKg: form.totalKg,
      totalPrice: this.total()
    }

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Confirmación de Compra',
      message: '¿Estás seguro realizar la compra?'
    }).pipe(filter((confirmation: boolean) => confirmation),
      switchMap(() => this._purchaseService.createPurchase(body)))
      .subscribe({
        next: (res) => {
          this._notificationService.success("Compra Exitosa", `La compra se registro con éxito con el SKU '${res.sku}'`);
          this._supplierSelected.set(null);
          this._createPurchaseForm.reset();
        },
        error: (err) => {
          const errorMessage =
            Object.values(err.error.errors || {}).flat()[0] ??
            err?.error?.message ??
            err?.error?.errorDetails ??
            err?.error?.title ??
            "Ocurrió un error al intentar registrar al cliente";

          this._notificationService.error('Ocurrió un Error', errorMessage);
          this._isLoading.set(false)
        },
        complete: () => this._isLoading.set(false)
      });


  }


}
