import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [RouterLink],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordComponentModal {
  
  //- Injections
  modalService = inject(ModalService);

  close():void{
    this.modalService.close()
  }

}
