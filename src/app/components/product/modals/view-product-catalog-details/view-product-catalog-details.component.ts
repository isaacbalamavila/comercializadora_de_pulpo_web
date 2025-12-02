import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ProductDTO, ProductDTOFromDetails, ProductDetailsDTO } from '@interfaces/Products/ProductDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ProductsService } from '@services/products.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-product-catalog-details',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, CopyButtonComponent, CurrencyPipe],
  templateUrl: './view-product-catalog-details.component.html',
  styleUrl: './view-product-catalog-details.component.css'
})
export class ViewProductCatalogDetailsModal {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _productService = inject(ProductsService);
  private readonly _notificationService = inject(NotificationService);

  //* Data Variables
  originalProduct!: ProductDTO;
  _product = signal<ProductDetailsDTO | null>(null);
  _hasChanges = computed<boolean>(() => {
    const current = this._product();
    const original = this.originalProduct;

    return original.name !== current!.name 
      || original.description !== current!.description
      || original.img !== current!.img
      || original.price !== current!.price
      || original.isDeleted !== current!.isDeleted;
  });

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _deleteLoading = signal<boolean>(false);
  _restoreLoading = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {
    this._getProductDetails();
  }

  //* Get Product Details
  _getProductDetails(): void {
    this._productService.getProductDetails(this.originalProduct.id).subscribe({
      next: (res) => {
        this._product.set(res);
        if (res.isDeleted) {
          this._error.set({ statusCode: 404 })
        }
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Close Modal & Check Changes
  _close(): void {
    if (this._hasChanges()) {
      const updatedProduct: ProductDTO = ProductDTOFromDetails(this._product()!);
      this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: true, data: updatedProduct });
    }

    if (this._error()) {
      this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: false, data: null });
      return;
    }

    this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: false, data: null });
  }

}
