import { Component, inject } from '@angular/core';
import { ModalService } from '@services/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  //* Injections
  modalService = inject(ModalService);

  //* UI Variables
  title: string = 'Title';
  message: string = 'message';
  color: string = 'var(--primary-color)';
  confirmLabel: string = 'Confirmar'

  close(confirm: boolean): void {
    this.modalService.close(confirm)
  }

}
