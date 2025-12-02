import { Component, ElementRef, forwardRef, HostListener, inject, Input, input, OnInit, signal, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '@services/employees.service';
import { RoleDetailsDTO } from '@interfaces/Employees/RoleDetailsInterface';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { ROLES_STORAGE } from 'config/constansts';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectRolesFormComponent),
  multi: true
}

const VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SelectRolesFormComponent),
  multi: true
}

@Component({
  selector: 'select-roles-form',
  imports: [CommonModule, SmallLoaderComponent],
  templateUrl: './select-roles-form.component.html',
  styleUrl: './select-roles-form.component.css',
  providers: [VALUE_ACCESSOR, VALIDATORS]
})
export class SelectRolesFormComponent implements OnInit, ControlValueAccessor, Validator {

  //* Inputs
  requiredMark = input<boolean>(true);

  //* Data Variables
  _value = signal<number | null>(null);

  //* Injections
  _employeeService = inject(EmployeesService);

  //* UI Variables
  placeholder = input<string>('Selecciona el rol');
  _isFocus = signal<boolean>(false);
  _isLoading = signal<boolean>(true);
  _label = signal<string | null>(null)
  _roles: { label: string, id: number }[] = [];
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
    const saveRoles = localStorage.getItem(ROLES_STORAGE);
    if (saveRoles) {
      this._roles = JSON.parse(saveRoles);
      this._isLoading.set(false);
    }
    else {
      this.getRoles();
    }

  }

  //* Get Roles
  getRoles(): void {
    this._isLoading.set(true);
    this._roles = [];

    this._employeeService.getRoles().subscribe(
      {
        next: (res: RoleDetailsDTO[]) => {
          res.map((role: RoleDetailsDTO) => this._roles.push({ label: role.name, id: role.id }))
          const stingifyRoles = JSON.stringify(this._roles);
          localStorage.setItem(ROLES_STORAGE, stingifyRoles);
          this._isLoading.set(false);
        }
      }
    );
  }

  //* Value Change
  onValueChange(role: { label: string, id: number }): void {
    this._value.set(role.id);
    this._label.set(role.label);
    this._isFocus.set(false);
    this._onChange(role.id);
    this._onTouched();
    this._onValidatorChange();
  }

  //* Value Accessor Methods
  writeValue(value: number | null): void {
    this._value.set(value);

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
