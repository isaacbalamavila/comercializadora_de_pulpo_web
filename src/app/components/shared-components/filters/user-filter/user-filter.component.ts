import { Component, computed, ElementRef, HostListener, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { EmployeesService } from '@services/employees.service';
import { Roles } from 'config/roles';

@Component({
  selector: 'user-filter',
  imports: [FormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.css'
})
export class UserFilterComponent implements OnInit {

  //* Injections
  _userService = inject(EmployeesService);

  //* UI Variables
  _search = signal<string | null>(null);
  _showOptions = signal<boolean>(false);
  _selectedUser = signal<EmployeeDTO | null>(null);
  general = input<boolean>(false);
  warehouse = input<boolean>(false);

  //* Interactions
  onSelect = output<string | null>();

  //* Data
  _users = signal<EmployeeDTO[]>([]);
  _usersFiltered = computed<EmployeeDTO[]>(() => {
    const users = this._users();

    return users.filter((sp) => {
      const searchMatch = this._search()
        ? sp.name.toLowerCase().replaceAll(' ', '').includes(this._search()!.toLowerCase().replaceAll(' ', ''))
        : true;

      return searchMatch;
    });
  });

  //* Ref Helper
  @ViewChild('userFilter', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this._showOptions.set(false);
      if (!this._selectedUser()) {
        this._search.set(null);
      }
    }
  }

  //* Component Init
  ngOnInit(): void {
    this._getSuppliers()
  }

  //* Get Users
  _getSuppliers(): void {
    this._userService.getAllEmployees().subscribe({
      next: (res) => {
        if (this.general()) {
          this._users.set(res.filter(us => us.role != Roles.warehouse))
        }
        else if (this.warehouse()) {
          this._users.set(res.filter(us => us.role != Roles.generalEmployee))
        }
        else {
          this._users.set(res)
        }
      }
    })
  }

  //* Select User
  selectSupplier(user: EmployeeDTO): void {
    this._showOptions.set(false);
    this._selectedUser.set(user);
    this._search.set(`${user.name} ${user.lastName}`);
    this.onSelect.emit(user.id);
  }

  _clear(): void {
    this._showOptions.set(false);
    this._selectedUser.set(null);
    this._search.set(null);
    this.onSelect.emit(null);
  }
}
