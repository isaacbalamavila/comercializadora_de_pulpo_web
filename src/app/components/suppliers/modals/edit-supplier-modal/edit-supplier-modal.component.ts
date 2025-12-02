import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PhoneDirective } from '@directives/phone.directive';
import { RequestSupplierDTO } from '@interfaces/Suppliers/CreateSupplierDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { SuppliersService } from '@services/suppliers.service';
import { InputFormComponent } from "@shared-components/forms/input-form/input-form.component";
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { LoadingButtonComponent } from "@buttons/loading-button/loading-button.component";
import { SupplierDetailsDTO } from '@interfaces/Suppliers/SupplierDTO';
import { EMAIL_REGEX, NAME_REGEX, RFC_REGEX } from 'config/regex';

@Component({
  selector: 'app-edit-supplier-modal',
  imports: [PhoneDirective, ReactiveFormsModule, InputFormComponent, BaseModalComponent, LoadingButtonComponent],
  templateUrl: './edit-supplier-modal.component.html',
})
export class EditSupplierModal implements OnInit {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _supplierService = inject(SuppliersService);
  private readonly _notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  //* Data Variables
  originalSupplier!: SupplierDetailsDTO;

  //* UI Variables
  _isLoading = signal<boolean>(false);

  //* Form
  _updateSupplierForm: FormGroup = this.fb.group({
    name: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(NAME_REGEX)
      ],
    }),
    email: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.pattern(EMAIL_REGEX)
      ],
    }),
    phone: this.fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ],
    }),
    rfc: this.fb.control<string | null>(null, {
      validators: [
        Validators.minLength(12),
        Validators.maxLength(13),
        Validators.pattern(RFC_REGEX)
      ],
    }),
    altPhone: this.fb.control<string | null>(null, {
      validators: [
        Validators.minLength(12),
        Validators.maxLength(12)
      ],
    }),
    altEmail: this.fb.control<string | null>(null, {
      validators: [
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.pattern(EMAIL_REGEX)
      ],
    }),
  });


  //* Change Detection
  _hasChanges = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {
    if (this.originalSupplier) {
      this._updateSupplierForm.patchValue(this.originalSupplier);
      this._updateSupplierForm.valueChanges.subscribe(() => {
        const current = this._updateSupplierForm.getRawValue();
        const original = this.originalSupplier;
        this._hasChanges.set(
          current.name !== original.name ||
          current.email !== original.email ||
          current.phone !== original.phone ||
          (current.rfc ?? null) !== (original.rfc ?? null) ||
          (current.altPhone ?? null) !== (original.altPhone ?? null) ||
          (current.altEmail ?? null) !== (original.altEmail ?? null)
        );
      });
    }
  }

  //* Update Supplier
  _updateSupplier(): void {
    this._isLoading.set(true);

    const formValue = this._updateSupplierForm.value;

    const updatedSupplier: RequestSupplierDTO = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone.replaceAll('-', ''),
      rfc: formValue.rfc?.trim(),
      altPhone: formValue.altPhone ? formValue.altPhone.replaceAll('-', '') : null,
      altEmail: formValue.altEmail ? formValue.altEmail : null
    };

    this._supplierService.updateSupplier(this.originalSupplier.id, updatedSupplier).subscribe({
      next: (res) => {
        this._notificationService.success('Registro Éxitoso', 'El proveedor se actualizó correctamente');
        this._modalService.close<ModalRespose<SupplierDetailsDTO | null>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar actualizar la información del proveedor";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Close Modal
  _close(): void {
    this._modalService.close<ModalRespose<SupplierDetailsDTO | null>>({ hasChanges: false, data: null });
  }
}
