import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { popupAnimation } from '@animations';
import { PhoneDirective } from '@directives/phone.directive';
import { RequestSupplierDTO as SupplierRequestDTO } from '@interfaces/Suppliers/CreateSupplierDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { SuppliersService } from '@services/suppliers.service';
import { InputFormComponent } from "@forms/input-form/input-form.component";
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { LoadingButtonComponent } from "@buttons/loading-button/loading-button.component";
import { EMAIL_REGEX, NAME_REGEX, RFC_REGEX } from 'config/regex';

@Component({
  selector: 'app-create-supplier-modal',
  imports: [BaseModalComponent, PhoneDirective,  ReactiveFormsModule, InputFormComponent, LoadingButtonComponent],
  templateUrl: './create-supplier-modal.component.html'
})
export class CreateSupplierModal {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _supplierService = inject(SuppliersService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* UI Variables
  _isLoading = signal<boolean>(false);

  //* Form
  _createSupplierForm: FormGroup = this._fb.group({
    name: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(NAME_REGEX)
      ],
    }),
    email: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.pattern(EMAIL_REGEX)
      ],
    }),
    phone: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ],
    }),
    rfc: this._fb.control<string | null>(null, {
      validators: [
        Validators.minLength(12),
        Validators.maxLength(13),
        Validators.pattern(RFC_REGEX)
      ],
    }),
    altPhone: this._fb.control<string | null>(null, {
      validators: [
        Validators.minLength(12),
        Validators.maxLength(12)
      ],
    }),
    altEmail: this._fb.control<string | null>(null, {
      validators: [
        Validators.minLength(10),
        Validators.maxLength(50),
        Validators.pattern(EMAIL_REGEX)
      ],
    }),
  });

  //* Create Supplier
  _createSupplier(): void {
    this._isLoading.set(true);

    const formValue = this._createSupplierForm.value;

    const newSupplier: SupplierRequestDTO = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone?.replaceAll('-', ''),
      rfc: formValue.rfc?.trim(),
      altPhone: formValue.altPhone?.replaceAll('-', ''),
      altEmail: formValue.altEmail ?? undefined
    }

    this._supplierService.createSupplier(newSupplier).subscribe({
      next: (res) => {
        this._notificationService.success('Registro Éxitoso', 'El proveedor se registró correctamente');
        this._modalService.close<ModalRespose<SupplierDTO | null>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        console.log(err)
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar al proveedor";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false)
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Close Modal
  _close(): void {
    this._modalService.close<ModalRespose<SupplierDTO | null>>({ hasChanges: false, data: null });
  }

}
