import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { PhoneDirective } from '@directives/phone.directive';
import { ClientDTO } from '@interfaces/Clients/ClientDTO';
import { ClientRequestDTO } from '@interfaces/Clients/ClientRequestDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ClientsService } from '@services/clients.service';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { InputFormComponent } from '@shared-components/forms/input-form/input-form.component';
import { NAME_REGEX, EMAIL_REGEX, RFC_REGEX } from 'config/regex';

@Component({
  selector: 'app-create-client',
  imports: [BaseModalComponent, PhoneDirective, ReactiveFormsModule, InputFormComponent, LoadingButtonComponent],
  templateUrl: './create-client-modal.component.html',
})
export class CreateClientModal {
  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _clientService = inject(ClientsService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* UI Variables
  _isLoading = signal<boolean>(false);

  //* Form
  _createClientForm: FormGroup = this._fb.group({
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
    })
  });

  //* Create Supplier
  _createSupplier(): void {
    this._isLoading.set(true);

    const formValue = this._createClientForm.value;

    const newClient: ClientRequestDTO = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone?.replaceAll('-', ''),
       rfc: formValue.rfc?.trim()
    }

    this._clientService.createClient(newClient).subscribe({
      next: (res) => {
        this._notificationService.success('Registro Éxitoso', 'El cliente se registró correctamente');
        this._modalService.close<ModalRespose<ClientDTO | null>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        console.log(err)
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

  //* Close Modal
  _close(): void {
    this._modalService.close<ModalRespose<ClientDTO | null>>({hasChanges: false, data: null});
  }

}
