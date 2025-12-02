import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'text-input-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input-filter.component.html',
  styleUrl: './text-input-filter.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputFilterComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => TextInputFilterComponent),
    multi: true,
  }]
})
export class TextInputFilterComponent implements ControlValueAccessor, Validator, OnDestroy {

  @Input() placeholder: string = 'placeholder';
  @Input() bgColor: string = 'white';

  isValid: boolean = true;
  value: string = '';
  isFocus: boolean = false;

  //required variables
  touched: boolean = false;

  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Funciones internas del ControlValueAccessor
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    this.inputSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((valor) => {
        // console.log('Valor emitido:', valor);
        this.onChange(valor);
      });
  }

  onInputChange(valor: string): void {
    this.value = valor;
    this.inputSubject.next(valor);
    this.onTouched();
  }

  // Métodos requeridos por ControlValueAccessor
  writeValue(valor: string): void {
    this.value = valor;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;

  }

  //métodos requeridos de validate
  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  //Metodos Auxiliares
  isInvalid(value: string): boolean {
    return !value?.trim();
  }

  //Marca como tocado
  markAsTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
    this.isFocus = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearValue(): void {
    this.value = '';
    this.onChange(this.value);
    this.markAsTouched();
    this.isFocus = false
  }

}
