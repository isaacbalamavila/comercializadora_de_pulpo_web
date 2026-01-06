import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { SearchComponent } from '@shared-components/filters/search/search.component';
import { ButtonsFilterComponent } from "@shared-components/filters/buttons/buttons.component";
import { ProductInventory } from '@interfaces/Product Inventory/ProductInventory';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { ProductInventoryService } from '@services/product-inventory.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from "@base-ui/pagination/pagination.component";

@Component({
  selector: 'app-product-inventory',
  imports: [PageTitleComponent, PageLoaderComponent, PageErrorComponent, SearchComponent, ButtonsFilterComponent,
    NoContentComponent, CommonModule, NgxPaginationModule, PaginationComponent],
  templateUrl: './product-inventory.component.html',
  styleUrl: './product-inventory.component.css'
})
export class ProductInventoryComponent implements OnInit {

  //* Injections
  _productInventoryService = inject(ProductInventoryService);

  //* Data Variables
  _products = signal<ProductInventory[]>([]);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage = signal<number>(11);

  //* Filters
  _searchFilter = signal<string | null>(null);
  _statusFilter = signal<boolean | null>(null);

  //* Filtered Inventory
  _filteredProducts = computed<ProductInventory[]>(() => {
    const data = this._products();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const status = this._statusFilter();
    return data.filter((p) => {

      const searchMatch = search
        ? p.name.replaceAll(' ', '').toLowerCase().includes(search)
        || p.sku.replaceAll(' ', '').toLowerCase().includes(search)
        : true;

      const statusMatch = status != null
        ? (status ? p.quantity > p.stockMin : p.quantity <= p.stockMin) : true;

      return searchMatch && statusMatch;
    });
  });

  //* Constructor
  constructor() {
    effect(() => {
      this._searchFilter();
      this._statusFilter();
      this._currentPage.set(1);
    });
  }

  //* Component Init
  ngOnInit(): void {
    this._getInventory();
  }


  //* Get Inventory
  _getInventory(): void {
    this._isLoading.set(true);
    this._productInventoryService.getProductInventory().subscribe({
      next: (res) => {
        this._products.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }
}
