import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { ClientDetailsDTO } from '@interfaces/Clients/ClientDTO';
import { ClientRequestDTO } from '@interfaces/Clients/ClientRequestDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ClientsService } from '@services/clients.service';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { InputFormComponent } from '@shared-components/forms/input-form/input-form.component';
import { NAME_REGEX, EMAIL_REGEX, RFC_REGEX } from 'config/regex';

@Component({
  selector: 'app-edit-client-modal',
  imports: [BaseModalComponent, InputFormComponent, ReactiveFormsModule, LoadingButtonComponent],
  templateUrl: './edit-client-modal.component.html',
})
export class EditClientModal implements OnInit {

  //* Injections
  _modalService = inject(ModalService);
  _clientService = inject(ClientsService);
  _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* UI Variables
  _isLoading = signal<boolean>(false);

  //* Data Variables
  originalClient!: ClientDetailsDTO;

  //* Form
  _updateClientForm: FormGroup = this._fb.group({
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

  //* Change Detection
  _hasChanges = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {
    if (this.originalClient) {
      this._updateClientForm.patchValue(this.originalClient);
      this._updateClientForm.valueChanges.subscribe(() => {
        const current = this._updateClientForm.getRawValue();
        const original = this.originalClient;

        this._hasChanges.set(
          original.email !== current.email
          || original.name !== current.name
          || original.phone !== current.phone
          || (original.rfc ?? null) !== (current.rfc ?? null)
        );
      });
    }
  }

  //* Update Client
  _updateClient(): void {
    this._isLoading.set(true);

    const formValue = this._updateClientForm.value;

    const updatedClient: ClientRequestDTO = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone.replaceAll('-', ''),
      rfc: formValue.rfc?.trim(),
    };

    this._clientService.updateClient(this.originalClient.id, updatedClient).subscribe({
      next: (res) => {
        this._notificationService.success('Actualización Exitosa', 'El cliente se actualizó correctamente');
        this._modalService.close<ModalRespose<ClientDetailsDTO | null>>({ hasChanges: true, data: res });
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
    this._modalService.close<ModalRespose<ClientDetailsDTO | null>>({ hasChanges: false, data: null });
  }

}
