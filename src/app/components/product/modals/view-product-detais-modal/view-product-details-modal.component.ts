import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ProductDetailsDTO, ProductDTO, ProductDTOFromDetails } from '@interfaces/Products/ProductDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ProductsService } from '@services/products.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { filter, Subject, switchMap } from 'rxjs';
import { EditProductModalComponent as EditProductModal } from '../edit-product-modal/edit-product-modal.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';

@Component({
  selector: 'product-detais-modal',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, CurrencyPipe, LoadingButtonComponent,
    CopyButtonComponent
  ],
  templateUrl: './view-product-details-modal.component.html',
  styleUrl: './view-product-details-modal.component.css'
})
export class ViewProductDetailsModal implements OnInit {

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
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Edit Product
  _editProduct():void{
    this._modalService.open(EditProductModal, {originalProduct: this._product()!}).subscribe({
      next: (res: ModalRespose<ProductDetailsDTO|null>)=>{
        if(res.hasChanges && res.data){
          this._product.set(res.data);
        }
      }
    });
  }

  //* Delete Suppliers
  _deleteProduct(): void {
    this._deleteLoading.set(true);
    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de baja el Producto',
      message: '¿Estás seguro en dar de baja el producto?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._productService.deleteProduct(this.originalProduct.id))
    ).subscribe({
      next: () => {
        this._product.update((p) => ({ ...p!, isDeleted: true }));
        this._notificationService.success(
          'Producto dado de Baja',
          `Se dio de baja con éxito el producto "${this._product()!.name}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar dar de baja el producto';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._deleteLoading.set(false);
      },
      complete: () => this._deleteLoading.set(false)
    });
  }

  //* Restore Supplier
  _restoreProduct(): void {
    this._restoreLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Restaurar Producto',
      message: '¿Estás seguro de restaurar el producto?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._productService.restoreProduct(this.originalProduct.id))
    )
      .subscribe({
        next: () => {
          this._product.update((p) => ({ ...p!, isDeleted: false }));;
          this._notificationService.success(
            'Producto Restaurado',
            `Se restauró con éxito el producto "${this._product()!.name}".`
          );
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ??
            err?.error?.title ??
            'Ocurrió un error al intentar restaurar el producto';

          this._notificationService.error('Ocurrió un Error', errorMessage);
          this._restoreLoading.set(false);
        },
        complete: () => this._restoreLoading.set(false)
      });
  }

  //* Close Modal & Check Changes
  _close(): void {
    if (this._error()) {
      this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: false, data: null });
      return;
    }

    if (this._hasChanges()) {
      const updatedProduct: ProductDTO = ProductDTOFromDetails(this._product()!);
      this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: true, data: updatedProduct });
    }


    this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: false, data: null });
  }
}
