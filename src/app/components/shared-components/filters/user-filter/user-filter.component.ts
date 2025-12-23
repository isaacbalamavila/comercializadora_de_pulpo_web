import { Component, computed, ElementRef, HostListener, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { EmployeesService } from '@services/employees.service';

@Component({
  selector: 'user-filter',
  imports: [FormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.css'
})
export class UserFilterComponent implements OnInit{
  
  //* Injections
  _userService = inject(EmployeesService);

  //* UI Variables
  _search = signal<string | null>(null);
  _showOptions = signal<boolean>(false);
  _selectedUser = signal<EmployeeDTO | null>(null);

  //* Interactions
  onSelect = output<string | null>();

  //* Data
  _users = signal<EmployeeDTO[]>([]);
  _productsFiltered = computed<EmployeeDTO[]>(() => {
    const suppliers = this._users();

    return suppliers.filter((sp) => {
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

  //* Get Suppliers
  _getSuppliers(): void {
    this._userService.getAllEmployees().subscribe({
      next: (res) => {
        this._users.set(res)
      }
    })
  }

  //* Select Supplier
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
