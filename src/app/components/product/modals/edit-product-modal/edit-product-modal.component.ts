import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ProductDetailsDTO } from '@interfaces/Products/ProductDTO';
import { UpdateProductDTO } from '@interfaces/Products/UpdatedProductDTO';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ProductsService } from '@services/products.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { InputFormComponent } from '@shared-components/forms/input-form/input-form.component';
import { PRODUCT_NAME_REGEX } from 'config/regex';

@Component({
  selector: 'app-edit-product-modal',
  imports: [BaseModalComponent, InputFormComponent, InputFormComponent,
    ReactiveFormsModule, LoadingButtonComponent, SmallLoaderComponent],
  templateUrl: './edit-product-modal.component.html',
  styleUrl: './edit-product-modal.component.css'
})
export class EditProductModalComponent implements OnInit {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _fb = inject(FormBuilder);
  private readonly _notificationService = inject(NotificationService);
  private readonly _productService = inject(ProductsService);

  //* Image
  _imageSelected = signal<File | null>(null);
  _imagePreviewURL = signal<string>('');

  //* Data
  originalProduct!: ProductDetailsDTO;

  //* UI Variables
  _maxLenght: number = 255;
  _imgLoading = signal<boolean>(false);
  _isLoading = signal<boolean>(false);


  //* Select File
  _onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return; // evita el error

    this._imagePreviewURL.set(URL.createObjectURL(file));
    this._imageSelected.set(file);
  }


  //* Form
  _updateProductInfoForm: FormGroup = this._fb.group({
    name: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
        Validators.pattern(PRODUCT_NAME_REGEX)
      ],
    }),
    description: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255)
      ],
    }),
    price: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    stockMin: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
  });

  get description(): AbstractControl | null {
    return this._updateProductInfoForm.get('description');
  }

  //* Change Detection
  _hasChanges = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {
    if (this.originalProduct) {
      this._updateProductInfoForm.patchValue(this.originalProduct);
      this._updateProductInfoForm.valueChanges.subscribe(() => {
        const current = this._updateProductInfoForm.getRawValue();
        const original = this.originalProduct;

        this._hasChanges.set(
          current.name.toLowerCase().trim() !== original.name.toLowerCase().trim()
          || current.description.trim() !== original.description.trim()
          || Number(current.price) !== Number(original.price)
          || Number(current.stockMin) !== Number(original.stockMin)
        );
      })
    }
  }

  //*Update Product
  _updateProduct(): void {

    this._isLoading.set(true);

    const formValue = this._updateProductInfoForm.value;
    const body: UpdateProductDTO = {
      name: formValue.name,
      description: formValue.description,
      price: Number(formValue.price),
      stockMin: Number(formValue.stockMin),
      img: this._imageSelected()
    };

    this._productService.updateProduct(this.originalProduct.id, body).subscribe({
      next: (res) => {
        this._notificationService.success(
          'Producto actualizado con éxito',
          `Se actualizó con éxito el producto ${this.originalProduct.name}`
        );

        this._modalService.close<ModalRespose<ProductDetailsDTO | null>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar actualizar la información del proveedor";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)

    });
  }

  //* Close 
  _close(): void {
    this._modalService.close<ModalRespose<ProductDetailsDTO | null>>({ hasChanges: false, data: null });
  }


}
