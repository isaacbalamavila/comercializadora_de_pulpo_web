import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostListener, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { UnitDTO } from '@interfaces/Units/UnitDTO';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { UnitsService } from '@services/units.service';
import { UNITS_STORAGE } from 'config/constansts';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectUnitsFormsComponent),
  multi: true
}

const VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SelectUnitsFormsComponent),
  multi: true
}

@Component({
  selector: 'select-units-forms',
  imports: [CommonModule, SmallLoaderComponent],
  templateUrl: './select-units-forms.component.html',
  styleUrl: './select-units-forms.component.css',
  providers: [VALUE_ACCESSOR, VALIDATORS]
})
export class SelectUnitsFormsComponent implements OnInit, ControlValueAccessor, Validator {

  //* Inputs
  requiredMark = input<boolean>(true);

  //* Data Variables
  _value = signal<number | null>(null);

  //* Injections
  _unitService = inject(UnitsService);

  //* UI Variables
  placeholder = input<string>('Unidad');
  _isFocus = signal<boolean>(false);
  _isLoading = signal<boolean>(true);
  _label = signal<string | null>(null)
  _options: UnitDTO[] = [];
  _touched = signal(false);

  //* Private Helper Handlers
  private _onChange: (value: number | null) => void = () => { };
  private _onTouched: () => void = () => { };
  private _onValidatorChange: () => void = () => { };
  _errors = signal<{ name: string; value: any }[]>([]);

  _onFocus(): void {
    this._isFocus.set(!this._isFocus())
    this._touched.set(true);
    this._onTouched();
  }

  //* Ref Helper
  @ViewChild('roleSelect', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this._isFocus.set(false);
    }
  }

  //* Component Init
  ngOnInit(): void {
    const saveRawMaterials = localStorage.getItem(UNITS_STORAGE);
    if (saveRawMaterials) {
      this._options = JSON.parse(saveRawMaterials);
      this._isLoading.set(false);
    }
    else {
      this.getRoles();
    }

  }

  //* Get Units
  getRoles(): void {
    this._isLoading.set(true);
    this._options = [];

    this._unitService.getUnits().subscribe(
      {
        next: (res: UnitDTO[]) => {
          this._options = res;
          const stingifyRoles = JSON.stringify(this._options);
          localStorage.setItem(UNITS_STORAGE, stingifyRoles);
          this._isLoading.set(false);
        }
      }
    );
  }

  //* Value Change
  onValueChange(option: UnitDTO): void {
    this._value.set(option.id);
    this._label.set(option.label);
    this._isFocus.set(false);
    this._onChange(option.id);
    this._onTouched();
    this._onValidatorChange();
  }

  //* Value Accessor Methods
  writeValue(value: number | null): void {
    if (value) {
      const option = this._options.find(op => op.id === value);
      this._value.set(option!.id);
      this._label.set(option!.label)

    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // Disabled Logic
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

  //* Clear Value
  clearValue(): void {
    this._value.set(null);
    this._label.set(null);
    this._isFocus.set(false);
    this._onChange(null);
    this._onTouched();
    this._onValidatorChange();
  }

}
