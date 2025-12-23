import { Component, input } from '@angular/core';

@Component({
  selector: 'supply-status',
  imports: [],
  templateUrl: './supply-status.component.html',
  styleUrl: './supply-status.component.css'
})
export class SupplyStatusComponent {
  //* Input
  weight = input.required<number>()
}
