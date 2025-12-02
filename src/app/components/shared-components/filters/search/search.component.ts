import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Input, OnDestroy, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'search-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy{

  //*Data Variables
  @Input({ required: true }) value = signal<string | null>(null);

  //* UI Variables
  placeholder = input<string>('Buscar');
  bgColor = input<string>('white');
  _isFocus = signal<boolean>(false);
  showClear = computed(() => !!this.value());


  private inputSubject = new Subject<string | null>();
  private destroy$ = new Subject<void>();

  constructor() {
    this.inputSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(valor => {
        this.value.set(valor);
      });
  }

  //* Llamar en el template con (input)
  onInputChange(value: string | null): void {
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


