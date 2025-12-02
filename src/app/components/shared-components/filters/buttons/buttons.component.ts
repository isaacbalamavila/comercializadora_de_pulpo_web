import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'buttons-filter',
  imports: [],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsFilterComponent {

  //* Data Variables
  @Input({ required: true }) value = signal<any>(null);
  @Input({ required: true }) options: { label: string, value: any }[] = [];

}
