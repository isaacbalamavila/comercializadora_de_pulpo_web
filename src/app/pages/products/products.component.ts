import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalService } from '@services/modal.service';
import { AddButtonComponent } from '@shared-components/buttons/add-button/add-button.component';
import { Subject } from 'rxjs';
import { SearchComponent } from "@shared-components/filters/search/search.component";
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { ProductDTO } from '@interfaces/Products/ProductDTO';
import { ProductsService } from '@services/products.service';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { ProductCardComponent } from "app/components/product/product-card/product-card.component";
import { CreateProductModal } from 'app/components/product/modals/create-product-modal/create-product-modal.component';
import { ModalRespose } from '@interfaces/ModalResponse';
import { PaginationComponent } from '@base-ui/pagination/pagination.component';
import { RawMaterialFilterComponent } from '@shared-components/filters/raw-material-filter/raw-material-filter.component';
import { PriceFilterComponent } from '@shared-components/filters/price-filter/price-filter.component';
import { ViewProductDetailsModal } from 'app/components/product/modals/view-product-detais-modal/view-product-details-modal.component';

@Component({
  selector: 'app-products',
  imports: [PageTitleComponent, AddButtonComponent, SearchComponent, RawMaterialFilterComponent, ButtonsFilterComponent, PriceFilterComponent,
    PageLoaderComponent, PageErrorComponent, NoContentComponent, NgxPaginationModule, ProductCardComponent, PaginationComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

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
  _statusFilter = signal<boolean | null>(null);
  _rawMaterialFilter = signal<number | null>(null);
  _minPriceFilter = signal<number | null>(null);
  _maxPriceFilter = signal<number | null>(null);

  //* Filtered Products
  _filteredProducts = computed<ProductDTO[]>(() => {
    const data = this._products();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const status = this._statusFilter();
    const rawMaterialId = this._rawMaterialFilter();
    const maxPrice = this._maxPriceFilter();
    const minPrice = this._minPriceFilter();

    return data.filter((p) => {
      const searchMatch = search
        ? p.name.replaceAll(' ', '').toLowerCase().includes(search)
        || p.description.replaceAll(' ', '').toLowerCase().includes(search)
        || p.sku.replaceAll(' ', '').toLowerCase().includes(search)
        : true;

      const statusMatch = status !== null
        ? p.isDeleted === status
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

      return searchMatch && statusMatch && rawMaterialMatch && maxPriceMatch && minPriceMatch;
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
      this._statusFilter();
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
    this._productService.getProducts().subscribe({
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

  //* Create Product
  _createProduct(): void {
    this._modalService.open(CreateProductModal).subscribe({
      next: (res: ModalRespose<ProductDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._products.set([res.data, ...this._products()])
        }

      }
    });
  }

  //* View Product Details
  _viewProductDetails(selectedProduct: ProductDTO): void {

    this._modalService.open(ViewProductDetailsModal, { originalProduct: selectedProduct }).subscribe({
      next: (res: ModalRespose<ProductDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._products.update(list =>
            list.map(p => p.id === res.data!.id ? res.data! : p)
          );
        }
      }
    });
  }

}
