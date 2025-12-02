import { Component, input, output } from '@angular/core';
import { popupAnimation } from '@animations';

@Component({
  selector: 'modal',
  imports: [],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.css',
  animations:[popupAnimation]
})
export class BaseModalComponent {

  //* Inputs
  width = input.required<number>();
  height = input.required<number>();
  gap = input<number>(1)

  //* Outputs 
  onClose = output<void>()

  //* Close
  _close(): void {
    this.onClose.emit()
  }

}
