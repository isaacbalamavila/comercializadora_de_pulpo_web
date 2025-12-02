import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ProductDTO } from '@interfaces/Products/ProductDTO';
import { ModalService } from '@services/modal.service';
import { ProductsService } from '@services/products.service';
import { PriceFilterComponent } from '@shared-components/filters/price-filter/price-filter.component';
import { RawMaterialFilterComponent } from '@shared-components/filters/raw-material-filter/raw-material-filter.component';
import { Subject } from 'rxjs';
import { SearchComponent } from "@shared-components/filters/search/search.component";
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PaginationComponent } from '@base-ui/pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardComponent } from 'app/components/product/product-card/product-card.component';
import { ViewProductCatalogDetailsModal } from 'app/components/product/modals/view-product-catalog-details/view-product-catalog-details.component';
import { ModalRespose } from '@interfaces/ModalResponse';

@Component({
  selector: 'app-products-catalog',
  imports: [PageTitleComponent, RawMaterialFilterComponent, PriceFilterComponent, SearchComponent,
    PageLoaderComponent, PageErrorComponent, NoContentComponent, PaginationComponent, NgxPaginationModule,
    ProductCardComponent],
  templateUrl: './products-catalog.component.html',
  styleUrl: './products-catalog.component.css'
})
export class ProductsCatalogComponent implements OnInit {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _productService = inject(ProductsService);

  //* Data Variables
  _products = signal<ProductDTO[]>([]);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage = signal<number>(12); // Columns * Rows

  //* Filters
  _searchFilter = signal<string | null>(null);
  _rawMaterialFilter = signal<number | null>(null);
  _minPriceFilter = signal<number | null>(null);
  _maxPriceFilter = signal<number | null>(null);

  //* Filtered Products
  _filteredProducts = computed<ProductDTO[]>(() => {
    const data = this._products();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const rawMaterialId = this._rawMaterialFilter();
    const maxPrice = this._maxPriceFilter();
    const minPrice = this._minPriceFilter();

    return data.filter((p) => {
      const searchMatch = search
        ? p.name.replaceAll(' ', '').toLowerCase().includes(search)
        || p.description.replaceAll(' ', '').toLowerCase().includes(search)
        || p.sku.replaceAll(' ', '').toLowerCase().includes(search)
        : true;

      const rawMaterialMatch = rawMaterialId
        ? p.rawMaterialId === rawMaterialId
        : true;

      const maxPriceMatch = maxPrice
        ? p.price <= maxPrice
        : true;

      const minPriceMatch = minPrice
        ? p.price >= minPrice
        : true;

      return searchMatch && rawMaterialMatch && maxPriceMatch && minPriceMatch;
    });
  });

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getProducts();
    }
  }

  //* Constructor
  constructor() {
    effect(() => {
      this._searchFilter();
      this._rawMaterialFilter();
      this._maxPriceFilter();
      this._minPriceFilter();
      this._currentPage.set(1);
    });
  }

  //* Component Init
  ngOnInit(): void {
    this._getProducts();
  }

  //* Get Products
  _getProducts(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._productService.getActiveProducts().subscribe({
      next: (res) => {
        this._products.set([...res]);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* View Product Details
  _viewProductDetails(selectedProduct: ProductDTO): void {

    this._modalService.open(ViewProductCatalogDetailsModal, { originalProduct: selectedProduct }).subscribe({
      next: (res: ModalRespose<ProductDTO | null>) => {

        console.log('has changes: ', res.hasChanges)
        if (res.hasChanges && res.data) {
          this._products.update(list => {
            return res.data!.isDeleted
              ? list.filter(p => p.id !== res.data!.id)
              : list.map(p => p.id === res.data!.id ? res.data! : p);
          });
        }
      }
    });

  }


}
