import { CommonModule } from '@angular/common';
import { Component, computed, Input, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'price-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.css'
})
export class PriceFilterComponent {

  //*Data Variables
  @Input({ required: true }) value = signal<number | null>(null);

  minValue = input<number>(0);

  //* UI Variables
  placeholder = input<string>('Buscar');
  bgColor = input<string>('white');
  _isFocus = signal<boolean>(false);
  showClear = computed(() => !!this.value());


  private inputSubject = new Subject<number | null>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.inputSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(valor => {
        this.value.set(valor);
      });
  }

  //* Llamar en el template con (input)
  onInputChange(value: number | null): void {
    if (value && value < this.minValue()) value = this.minValue();
    this.inputSubject.next(value);
  }

  //* Limpia el valor
  clearValue(): void {
    this._isFocus.set(false);
    this.value.set(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
