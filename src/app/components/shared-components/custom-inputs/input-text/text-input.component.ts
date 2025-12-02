import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'text-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true,
  }]
})
export class TextInputComponent implements ControlValueAccessor, Validator, OnDestroy {

  @Input() label: string | null = null;
  @Input() placeholder: string = 'placeholder';
  @Input() required: boolean = false;
  @Input() bgColor: string = 'var(--input-background)';
  @Input() isValidCustom: boolean = true;
  @Input() customInvalidMessage: string | undefined = '';
  @Input() maxlength: number | null = null;
  @Input() minlength: number | null = null;


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
    if (this.required && this.isInvalid(this.value)) {
      return { required: true };
    }
    return null;
  }

  //Metodos Auxiliares
  isInvalid(value: string): boolean {
    /* 
    *Es inválido si:
      -Está vacío y es requerido
      -Si la validación personalizada está desactivada
    */
    return (this.required && !value?.trim()) || !this.isValidCustom;
  }

  //Marca como tocado
  markAsTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //Clear Value
  clearValue(): void {
    this.value = '';
    this.onChange(this.value);
    this.markAsTouched();
    this.isFocus = false
  }

}
