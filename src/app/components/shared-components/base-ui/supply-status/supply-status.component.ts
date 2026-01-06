import { Component, input } from '@angular/core';

@Component({
  selector: 'inventory-status',
  imports: [],
  templateUrl: './supply-status.component.html',
  styleUrl: './supply-status.component.css'
})
export class InventoryStatusComponent {
  //* Input
  remain = input.required<number>()
}
