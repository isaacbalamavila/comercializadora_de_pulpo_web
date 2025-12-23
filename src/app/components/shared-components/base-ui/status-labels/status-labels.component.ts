import { Component, input } from '@angular/core';

@Component({
  selector: 'status-label',
  imports: [],
  templateUrl: './status-labels.component.html',
  styleUrl: './status-labels.component.css'
})
export class StatusLabelComponent {

  //* Inputs
  status = input.required<number>();

}
