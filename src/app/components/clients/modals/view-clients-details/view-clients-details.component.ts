import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { ClientDetailsDTO, ClientDTO, ClientDTOFromDetails } from '@interfaces/Clients/ClientDTO';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ClientsService } from '@services/clients.service';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { phoneFormatter } from '@utils/phone-formatter';
import { filter, first, Subject, switchMap, takeUntil } from 'rxjs';
import { PageLoaderComponent } from "@loaders/page-loader/page-loader.component";
import { PageErrorComponent } from "@error-handlers/page-error/page-error.component";
import { EmailButtonComponent } from "@helpers/email-button/email-button.component";
import { CopyButtonComponent } from "@helpers/copy-button/copy-button.component";
import { DatePipe } from '@angular/common';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { EditClientModal } from '../edit-client-modal/edit-client-modal.component';

@Component({
  selector: 'app-view-clients-details',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, EmailButtonComponent, CopyButtonComponent, DatePipe,
    LoadingButtonComponent],
  templateUrl: './view-clients-details.component.html',
})
export class ViewClientsDetailsModal implements OnInit {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _clientService = inject(ClientsService);
  private readonly _modalService = inject(ModalService);
  private readonly _notificationService = inject(NotificationService);

  //* Data Variables
  originalClient!: ClientDTO;
  _client = signal<ClientDetailsDTO | null>(null);
  _hasChanges = computed(() => {
    const original = this.originalClient;
    const current = this._client();

    return original.email !== current!.email
      || original.name !== current!.name
      || original.phone !== current!.phone
      || original.isDeleted !== current!.isDeleted;
  });

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _deleteLoading = signal<boolean>(false);
  _restoreLoading = signal<boolean>(false);

  ngOnInit(): void {
    this._getClientDetails();
  }

  //* Get Client Details
  _getClientDetails(): void {
    this._isLoading.set(true);
    this._clientService.getClient(this.originalClient.id).pipe(first(), takeUntil(this._destroy$)).subscribe({
      next: (res) => {
        res.phone = phoneFormatter(res.phone);
        this._client.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false)

      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Edit Client
  _editClient(): void {
    let client: ClientDetailsDTO = { ...this._client()! };
    this._modalService.open(EditClientModal, { originalClient: client }).subscribe({
      next: (res: ModalRespose<ClientDetailsDTO | null>) => {
        if (res.hasChanges && res.data) {
          res.data.phone = phoneFormatter(res.data.phone);
          this._client.set(res.data);

        }
      }
    });
  }

  //* Delete Client
  _deleteClient(): void {
    this._deleteLoading.set(true);
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de baja al Cliente',
      message: '¿Estás seguro en dar de baja al cliente?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._clientService.deleteClient(this.originalClient.id))
    ).subscribe({
      next: () => {
        this._client.update((cl) => ({ ...cl!, isDeleted: true }));
        this._notificationService.success(
          'Cliente dado de Baja',
          `Se dio de baja con éxito al cliente "${this._client()!.name}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar dar de baja al cliente';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._deleteLoading.set(false);
      },
      complete: () => this._deleteLoading.set(false)
    });
  }
  //* Restore Client
  _restoreClient(): void {
    this._restoreLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Restaurar Cliente',
      message: '¿Estás seguro de restaurar al cliente?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._clientService.restoreClient(this.originalClient.id))
    )
      .subscribe({
        next: () => {
          this._client.update((cl) => ({ ...cl!, isDeleted: false }));;
          this._notificationService.success(
            'Cliente Restaurado',
            `Se restauró con éxito al cliente "${this._client()!.name}".`
          );
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ??
            err?.error?.title ??
            'Ocurrió un error al intentar restaurar al cliente';

          this._notificationService.error('Ocurrió un Error', errorMessage);
          this._restoreLoading.set(false);
        },
        complete: () => this._restoreLoading.set(false)
      });
  }

  //* Close & Cheeck Changes
  _close() {
    if (this._error()) {
      this._modalService.close<ModalRespose<ClientDTO | null>>({ hasChanges: false, data: null });
      return;
    }

    if (this._hasChanges()) {
      const updatedClient = ClientDTOFromDetails(this._client()!);
      this._modalService.close<ModalRespose<ClientDTO | null>>({ hasChanges: true, data: updatedClient });
      return;
    }

    this._modalService.close<ModalRespose<ClientDTO | null>>({ hasChanges: false, data: null });
  }

}
