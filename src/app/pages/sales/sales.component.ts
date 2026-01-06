import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { SalesResponse } from '@interfaces/Sales/SaleDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { SalesService } from '@services/sales.service';
import { AddButtonComponent } from '@shared-components/buttons/add-button/add-button.component';
import { ClientFilterComponent } from '@shared-components/filters/client-filter/client-filter.component';
import { UserFilterComponent } from "@shared-components/filters/user-filter/user-filter.component";
import { PaginacionComponent } from "@base-ui/paginacion-backend/paginacion.component";
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  imports: [PageTitleComponent, AddButtonComponent, UserFilterComponent, PageLoaderComponent, NoContentComponent, ClientFilterComponent, PageErrorComponent,
    CurrencyPipe, DatePipe, PaginacionComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {

  //* Injections
  private readonly _salesService = inject(SalesService);
  private readonly _router = inject(Router);

  //* Data Variables
  _response = signal<SalesResponse | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage: number = 11;

  //* Filters
  _clientFilter = signal<string | null>(null);
  _employeeFilter = signal<string | null>(null);
  _dateFilter = signal<string | null>(null);

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getSales();
    }
  }

  //* Constructor
  constructor() {

    let filtersInitialized = false;
    effect(() => {
      const page = this._currentPage();
      this._getSales();
    });

    effect(() => {
      const cl = this._clientFilter();
      const emp = this._employeeFilter();
      const date = this._dateFilter();

      if (filtersInitialized) {
        this._currentPage.set(1);
      } else {
        filtersInitialized = true;
      }
    });
  }

  //* Get Sales
  _getSales(): void {
    this._isLoading.set(true);
    this._salesService.getSales(this._itemsPerPage, this._currentPage(), this._employeeFilter(), this._clientFilter(), this._dateFilter(),
    ).subscribe({
      next: (res) => this._response.set(res),
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Date Validations & Format
  _onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._dateFilter.set(value ? new Date(value).toISOString() : null);
  }

  //* Redirect to Details
  _redirectToDetails(id: string): void {
    this._router.navigate(['home/sales', id]);
  }

  //* Redirect to Make Sale
  _reditectToMakeSale(): void {
    this._router.navigate(['home/sales/make-sale']);
  }
}
