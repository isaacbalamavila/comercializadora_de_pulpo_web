import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'payment-method-select',
  imports: [CommonModule],
  templateUrl: './payment-method-select.component.html',
  styleUrl: './payment-method-select.component.css'
})
export class PaymentMethodSelectComponent {

  //* Inputs
  requiredMark = input<boolean>(true);

  //* Interactions
  onSelect = output<number | null>();

  //* Data Variables
  _value = signal<number | null>(null);
  _options: { id: number, label: string }[] = [
    { id: 1, label: 'Efectivo' },
    { id: 2, label: 'Tarjeta de Débito' },
    { id: 3, label: 'Tarjeta de Crédito' },
    // { id: 4, label: 'Transferencia' },
    // { id: 5, label: 'Depósito' }
  ];

  //* UI Variables
  placeholder = input<string>('Método de pago');
  _isFocus = signal<boolean>(false);
  _label = signal<string | null>(null)
  _touched = signal(false);

  //* Focus
  _onFocus(): void {
    this._isFocus.set(!this._isFocus())
    this._touched.set(true);
  }

  _selectValue(option: { id: number, label: string }): void {
    this._label.set(option.label);
    this._value.set(option.id);
    this._isFocus.set(false);
    this.onSelect.emit(option.id);
  }


  //* Clear Value
  clearValue(): void {
    this._value.set(null);
    this._label.set(null);
    this._isFocus.set(false);
    this.onSelect.emit(null);
  }

}
