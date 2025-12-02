import { Component, ElementRef, forwardRef, input, OnInit, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFormComponent),
  multi: true
}

const VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => InputFormComponent),
  multi: true
}

@Component({
  selector: 'input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
  providers: [VALUE_ACCESSOR, VALIDATORS]
})
export class InputFormComponent implements OnInit, ControlValueAccessor, Validator {

  //* Inputs
  type = input<'email' | 'text' | 'tel' | 'number'>('text')
  label = input.required<string>();
  requiredMark = input<boolean>(false);
  name = input.required<string>();
  maxLength = input<number | undefined>(undefined);
  minLength = input<number | undefined>(undefined);
  customMaxLengthForFormat = input<number | undefined>(undefined);
  customMinLengthForFormat = input<number | undefined>(undefined);
  placeholder = input<string>('placeholder');
  RegexErrorMessage = input<string>('Formato inválido')
  _disabled = signal<boolean>(false);

  //* Helpers
  _article = signal<string>('El');
  _value = signal<string>('');
  _errors = signal<{ name: string; value: any }[]>([]);
  _touched = signal(false);
  inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');

  //* Private Helper Handlers
  private _onChange: (value: string) => void = () => { };
  private _onTouched: () => void = () => { };
  private _onValidatorChange: () => void = () => { };

  _onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    this._value.set(value)
    this._onChange(value);
    this._onValidatorChange();
  }

  _onFocus() {
    this._touched.set(true);
    this._onTouched();
  }

  //* On Init
  ngOnInit(): void {
    const article = this.name() != null ? (this.name()!.toLowerCase().endsWith('a') ? 'La' : 'El') : (this.label()!.toLowerCase().endsWith('a') ? 'La' : 'El');
    this._article.set(article)
  }

  //* Value Accessor Methods
  writeValue(value: string): void {
    this._value.set(value);
    this.inputElement().nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  //* Validate Methods
  validate(control: AbstractControl): ValidationErrors | null {

    const entries = Object.entries(control.errors ?? {});

    const formatted = entries.map(([name, value]) => ({
      name,
      value
    }));

    this._errors.set(formatted);
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onValidatorChange = fn;
  }

  //* Clear
  clearValue(): void {
    this.writeValue('');
    this._onChange('');
    this._onTouched();
    this._onValidatorChange();
  }

}


