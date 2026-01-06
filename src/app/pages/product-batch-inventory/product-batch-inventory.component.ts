import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { InventoryStatusComponent } from '@base-ui/supply-status/supply-status.component';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ProductBatch, ProductBatchResponse } from '@interfaces/Product Inventory/ProductBatches';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ProductInventoryService } from '@services/product-inventory.service';
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { SearchComponent } from '@shared-components/filters/search/search.component';
import { PaginacionComponent } from "@base-ui/paginacion-backend/paginacion.component";
import { ProductFilterComponent } from "@shared-components/filters/product-filter/product-filter.component";
import { ModalService } from '@services/modal.service';
import { ViewProductBatchDetailsModal } from 'app/components/product/modals/view-product-batch-details/view-product-batch-details.component';
import { ModalRespose } from '@interfaces/ModalResponse';

@Component({
  selector: 'app-product-batch-inventory',
  imports: [PageTitleComponent, SearchComponent, ButtonsFilterComponent, PageLoaderComponent, PageErrorComponent,
    NoContentComponent, CurrencyPipe, DatePipe, InventoryStatusComponent, PaginacionComponent, ProductFilterComponent],
  templateUrl: './product-batch-inventory.component.html',
  styleUrl: './product-batch-inventory.component.css'
})
export class ProductBatchInventoryComponent {

  //* Injections
  private readonly _productInventoryService = inject(ProductInventoryService);
  private readonly _modalService = inject(ModalService);

  //* Data Variables
  _response = signal<ProductBatchResponse | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage: number = 11;

  //* Filters
  _searchFilter = signal<string | null>(null);
  _availablesFilter = signal<boolean | null>(null);
  _productFilter = signal<string | null>(null);

  //* Constructor
  constructor() {

    let filtersInitialized = false;
    effect(() => {
      const page = this._currentPage();
      this._getProductInventory();
    });

    effect(() => {
      const av = this._availablesFilter();
      const search = this._searchFilter();

      if (filtersInitialized) {
        this._currentPage.set(1);
      } else {
        filtersInitialized = true;
      }
    });
  }

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getProductInventory();
    }
  }

  //* Get Inventory
  _getProductInventory(): void {
    this._isLoading.set(true);
    this._productInventoryService.getProductBatchInventory(this._itemsPerPage, this._currentPage(),
      this._availablesFilter(), this._searchFilter(), this._productFilter()).subscribe({
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

  //* View Details
  _viewProductBatchDetails(productBatch: ProductBatch): void {
    this._modalService.open(ViewProductBatchDetailsModal, { originalProductBatch: productBatch })
      .subscribe({
        next: (res: ModalRespose<number>) => {
          if (!res.hasChanges || res.data == null) return;
          const newAmount = res.data;

          this._response.update(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              productbatches: prev.productbatches.map(item =>
                item.id === productBatch.id
                  ? { ...item, quantityRemain: newAmount }
                  : item
              )
            };
          });
        }
      });
  }


}
