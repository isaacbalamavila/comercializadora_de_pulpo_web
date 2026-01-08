import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'toggle-button',
  imports: [CommonModule],
  template: `
  <div class="toggle-btn" [ngClass]="_isActive() ? 'active' : 'inactive'" (click)="_click()">
    <div class="circle"></div>
  </div>`,
  styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {

  //* UI Variables
  _isActive = signal<boolean>(false);

  //*  Interactions
  change = output<boolean>();

  _click(): void {
    this._isActive.update((v) => !v);
    this.change.emit(this._isActive());
  }
}
