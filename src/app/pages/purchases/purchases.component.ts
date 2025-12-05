import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { PaginacionComponent } from '@base-ui/paginacion-backend/paginacion.component';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PurchasePaginationResposne } from '@interfaces/Purchases/PurchaseDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { PurchaseService as PurchaseService } from '@services/purchase.service';
import { AddButtonComponent } from '@shared-components/buttons/add-button/add-button.component';
import { RawMaterialFilterComponent } from '@shared-components/filters/raw-material-filter/raw-material-filter.component';
import { SearchComponent } from '@shared-components/filters/search/search.component';
import { SuppliersFilterComponent } from '@shared-components/filters/suppliers-filter/suppliers-filter.component';
import { ViewPurchaseDetailsModal } from 'app/components/purchases/modals/view-purchase-details-modal/view-purchase-details-modal.component';

@Component({
  selector: 'app-purchases',
  imports: [PageTitleComponent, AddButtonComponent, RawMaterialFilterComponent, PageLoaderComponent,
    PageErrorComponent, NoContentComponent, CurrencyPipe, DatePipe, PaginacionComponent, SuppliersFilterComponent,
    SearchComponent
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {

  //* Injections
  _purchaseService = inject(PurchaseService);
  _modalService = inject(ModalService);
  _router = inject(Router)

  //* Data Variables
  _response = signal<PurchasePaginationResposne | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage: number = 13;

  //* Filters
  _rawMaterialFilter = signal<number | null>(null);
  _supplierFilter = signal<string | null>(null);
  _dateFilter = signal<string | null>(null);
  _searchFilter = signal<string | null>(null);

  //* Component Init
  ngOnInit(): void {
    this._getPurchases();
  }

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getPurchases();
    }
  }

  //* Constructor
  constructor() {

    let filtersInitialized = false;
    effect(() => {
      const page = this._currentPage();
      this._getPurchases();
    });

    effect(() => {
      const rm = this._rawMaterialFilter();
      const sup = this._supplierFilter();
      const date = this._dateFilter();
      const search = this._searchFilter();

      if (filtersInitialized) {
        this._currentPage.set(1);
      } else {
        filtersInitialized = true;
      }
    });
  }

  //* Get Purchases
  _getPurchases(): void {
    this._isLoading.set(true);
    this._purchaseService.getPurchases(this._itemsPerPage, this._currentPage(), this._dateFilter(), this._rawMaterialFilter(), this._supplierFilter(), this._searchFilter()).subscribe({
      next: (res) => {
        this._response.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* View Purchase Details
  _viewPurchaseDetails(id: string): void {
    this._modalService.open(ViewPurchaseDetailsModal, { purchaseId: id });
  }

  //* Date Validations & Format
  _onDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._dateFilter.set(value ? new Date(value).toISOString() : null);
  }

  //* Redirect to Make a Purchase
  _makePurchase():void{
    this._router.navigate(['home/purchase']);
  }
}
