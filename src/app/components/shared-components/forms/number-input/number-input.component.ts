import { Component, ElementRef, forwardRef, input, OnInit, signal, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors, ControlValueAccessor, Validator } from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberInputComponent),
  multi: true
}

const VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NumberInputComponent),
  multi: true
}

@Component({
  selector: 'input-number-form',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
  providers: [VALUE_ACCESSOR, VALIDATORS]
})
export class NumberInputComponent implements OnInit, ControlValueAccessor, Validator {

  //* Inputs
  label = input.required<string>();
  min = input<number>(0);
  max = input<number | null>(null);

  //* UI Variables
  placeholder = input<string>('0');
  requiredMark = input<boolean>(false);
  showLabel = input<boolean>(true);
  name = input<string>();
  _disabled = signal<boolean>(false);

  //* Helpers
  _article = signal<string>('El');
  _value = signal<number>(0);
  _errors = signal<{ name: string; value: any }[]>([]);
  _touched = signal(false);
  inputElement = viewChild.required<ElementRef<HTMLInputElement>>('input');

  //* Private Helper Handlers
  private _onChange: (value: number) => void = () => { };
  private _onTouched: () => void = () => { };
  private _onValidatorChange: () => void = () => { };

  _onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = Number(target.value);
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
  writeValue(value: number): void {

    if (value < 0) {
      value = this.min();
    }

    if (value) {
      this._value.set(value);
      this.inputElement().nativeElement.value = value.toString();
      this._onValidatorChange();
    }
    else {
      this._value.set(0)
      this.inputElement().nativeElement.value = '';
    }
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

  //* HelpersButtons
  _helperButton(value: number): void {
    this._touched.set(true);
    if (value <= 0) {
      value = this.min();
    }

    this.writeValue(value);
    this._onChange(value);
    this._onTouched();
    this._onValidatorChange();
  }

}
