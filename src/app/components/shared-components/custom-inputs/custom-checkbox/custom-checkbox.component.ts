import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
@Component({
  selector: 'custom-checkbox',
  imports: [CommonModule],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.css'
})
export class CustomCheckboxComponent {

  //* UI Variables
  isChecked = signal<boolean>(false);

  //* Interactions
  onCheked = output<boolean>();

  _onChecked(): void {
    this.isChecked.update(v => !v);
    this.onCheked.emit(this.isChecked());
  }

}
