import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { EmployeesService } from '@services/employees.service';
import { EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { EmployeeCardComponent } from '@employee/employee-card/employee-card.component';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from "@loaders/page-loader/page-loader.component";
import { NoContentComponent } from "@error-handlers/no-content/no-content.component";
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { FormsModule } from '@angular/forms';
import { ModalService } from '@services/modal.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '@base-ui/pagination/pagination.component';
import { ViewEmployeeDetailsModal } from '@employee-modals/view-employee-details/view-employee-details.component';
import { SearchComponent } from '@shared-components/filters/search/search.component';
import { ModalRespose } from '@interfaces/ModalResponse';
import { fadeInOut } from '@animations';
import { RoleFilterComponent } from '@shared-components/filters/role-filter/role-filter.component';
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { PageTitleComponent } from "@base-ui/page-title/page-title.component";
import { AddButtonComponent } from "@shared-components/buttons/add-button/add-button.component";
import { phoneFormatter } from '@utils/phone-formatter';
import { CreateEmployeeModal } from '@employee-modals/create-employee-modal/create-employee-modal.component';

@Component({
  selector: 'app-employees',
  imports: [EmployeeCardComponent, CommonModule, RoleFilterComponent, PageLoaderComponent, NoContentComponent,
    PageErrorComponent, FormsModule, NgxPaginationModule, PaginationComponent, SearchComponent, ButtonsFilterComponent, PageTitleComponent, AddButtonComponent],
  animations: [fadeInOut],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {

  //* Injections
  private readonly _employeesService = inject(EmployeesService);
  private readonly _modalService = inject(ModalService);

  //* Data Variables
  _employees = signal<EmployeeDTO[]>([]);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage = signal<number>(20); // Columns * Rows

  //* Filters
  _searchFilter = signal<string | null>(null);
  _statusFilter = signal<boolean | null>(null);
  _roleFilter = signal<number | null>(null);

  //* Filtered Employees
  _filteredEmployees = computed<EmployeeDTO[]>(() => {
    const data = this._employees();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const status = this._statusFilter();
    const role = this._roleFilter();

    return data.filter(emp => {
      const fullName = emp.name.toLowerCase() + emp.lastName.toLowerCase();
      const searchMatch = search
        ? emp.email.toLowerCase().includes(search)
        || fullName.toLowerCase().includes(search)
        || emp.phone?.includes(search)
        : true;

      const statusMatch = status != null
        ? emp.isDeleted === status
        : true;

      const roleMatch = role !== null
        ? emp.roleId === role
        : true;

      return searchMatch && statusMatch && roleMatch;
    });
  });

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getEmployees();
    }
  }

  //* Constructos
  constructor() {
    effect(() => {
      this._searchFilter();
      this._statusFilter();
      this._roleFilter();
      this._currentPage.set(1);
    });
  }

  //* Component Init
  ngOnInit(): void {
    this._getEmployees();
  }

  //* Get Employees
  _getEmployees(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._employeesService.getEmployees().subscribe({
      next: (res) => {
        this._employees.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* View Details
  _viewDetails(selectedEmployee: EmployeeDTO): void {
    selectedEmployee = { ...selectedEmployee, phone: phoneFormatter(selectedEmployee.phone) }
    this._modalService.open(ViewEmployeeDetailsModal, { originalEmployee: selectedEmployee }).subscribe({
      next: (res: ModalRespose<EmployeeDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._employees.update(list =>
            list.map(emp => emp.id === res.data!.id ? res.data! : emp)
          );
        }
      }
    });;
  }

  //* Create Employee
  _createEmployee(): void {
    this._modalService.open(CreateEmployeeModal).subscribe({
      next: (res: ModalRespose<EmployeeDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._employees.set([res.data, ...this._employees()]);
        }
      }
    }
    )
  }

  //* Clear Filters
  _clearFilters(): void {
    this._searchFilter.set(null);
    this._statusFilter.set(null);
    this._roleFilter.set(null);
  }

}
