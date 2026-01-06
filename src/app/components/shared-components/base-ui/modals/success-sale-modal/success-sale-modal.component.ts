import { Component, inject } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { SaleDetailsDTO } from '@interfaces/Sales/SaleDTO';
import { ModalService } from '@services/modal.service';
import { PrintService } from '@services/print.service';

@Component({
  selector: 'app-success-sale-modal',
  imports: [BaseModalComponent, CopyButtonComponent],
  templateUrl: './success-sale-modal.component.html',
  styleUrl: './success-sale-modal.component.css'
})
export class SuccessSaleModalComponent {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _printService = inject(PrintService);

  //* Data 
  ticketInfo!: SaleDetailsDTO;

  //* Print Ticket
  _printTicket():void{
    this._printService.saleTicket(this.ticketInfo);
  }

  //* Close Modal
  _onClose(): void {
    this._modalService.close();
  }

}
