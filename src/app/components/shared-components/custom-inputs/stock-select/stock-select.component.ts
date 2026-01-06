import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'; // Asegúrate de esta importación
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'stock-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stock-select.component.html',
  styleUrl: './stock-select.component.css'
})
export class StockInputComponent {

  //* UI Variables
  max = input.required<number>();
  min = input<number>(1);
  value = signal<number | null>(null);

  //* Interactions
  onValueSelect = output<number | null>();

  constructor() {
    const value$ = toObservable(this.value);

    value$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(() => {
      this._validateLimits();
    });
  }

  _validateLimits(): void {
    const currentVal = this.value();
    if (currentVal != null) {
      if (currentVal > this.max()) {
        this.value.set(this.max());
      } else if (currentVal < this.min()) {
        this.value.set(this.min());
      }

      this.onValueSelect.emit(this.value());
    }
  }

  clear(): void {
    this.value.set(null);
    this.onValueSelect.emit(null);
  }
}