import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, input, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { RoleDetailsDTO } from '@interfaces/Employees/RoleDetailsInterface';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { EmployeesService } from '@services/employees.service';

@Component({
  selector: 'role-filter',
  imports: [SmallLoaderComponent, CommonModule],
  templateUrl: './role-filter.component.html',
  styleUrl: './role-filter.component.css'
})
export class RoleFilterComponent implements OnInit {

  //* Data Variables
  @Input({required:true}) value = signal<number | null>(null);

  //* Injections
  _employeeService = inject(EmployeesService);

  //* UI Variables
  placeholder = input<string>('Rol');
  bgColor = input<string>('white');
  _isFocus = signal<boolean>(false);
  _isLoading = signal<boolean>(true);
  _label = signal<string | null>(null)
  _roles: { label: string, id: number }[] = [];

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
    const saveRoles = localStorage.getItem('saveRoles');
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
          localStorage.setItem('saveRoles', stingifyRoles);
          this._isLoading.set(false);
        }
      }
    );
  }

  //* Value Change
  onValueChange(role: { label: string, id: number }): void {
    this.value.set(role.id);
    this._label.set(role.label);
    this._isFocus.set(false);
  }

  //* Clear Filter
  clearValue(): void {
    this.value.set(null);
    this._label.set(null);
    this._isFocus.set(false);
  }

}
