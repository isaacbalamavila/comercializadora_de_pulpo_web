import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { ModalRespose } from '@interfaces/ModalResponse';
import { CreateProductDTO } from '@interfaces/Products/CreateProductDTO';
import { ProductDTO } from '@interfaces/Products/ProductDTO';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ProductsService } from '@services/products.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { InputFormComponent } from "@shared-components/forms/input-form/input-form.component";
import { SelectRawMaterialsFormsComponent } from "@shared-components/forms/select-raw-materials/select-raw-materials-form.component";
import { SelectUnitsFormsComponent } from "@shared-components/forms/select-units-forms/select-units-forms.component";
import { NAME_REGEX, EMAIL_REGEX, RFC_REGEX, PRODUCT_NAME_REGEX } from 'config/regex';

@Component({
  selector: 'app-create-product-modal',
  imports: [BaseModalComponent, InputFormComponent, SelectRawMaterialsFormsComponent, SelectUnitsFormsComponent,
    ReactiveFormsModule, LoadingButtonComponent],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.css'
})
export class CreateProductModal {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _productService = inject(ProductsService);
  private readonly _fb = inject(FormBuilder);

  //* Image
  _imageSelected = signal<File | undefined>(undefined);
  _imagePreviewURL = signal<string>('');

  //* UI Variables
  _maxLenght: number = 255;
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
  _createProductForm: FormGroup = this._fb.group({
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
    content: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    unit: this._fb.control<number | null>(null, {
      validators: [
        Validators.required
      ]
    }),
    rawMaterial: this._fb.control<number | null>(null, {
      validators: [
        Validators.required
      ]
    }),
    stockMin: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
    rawMaterialNeeded: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(0.0000000001)
      ]
    }),
    timeNeeded: this._fb.control<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(1)
      ]
    }),
  });

  get description(): AbstractControl | null {
    return this._createProductForm.get('description');
  }

  //* Create Form
  _createProduct(): void {
    this._isLoading.set(true);

    const formValue = this._createProductForm.value;

    const newProduct: CreateProductDTO = {
      img: this._imageSelected()!,
      name: formValue.name,
      description: formValue.description,
      rawMaterialId: formValue.rawMaterial,
      content: formValue.content,
      unitId: formValue.unit,
      price: formValue.price,
      stockMin: formValue.stockMin,
      rawMaterialNeededKg: formValue.rawMaterialNeeded,
      timeNeededMin: formValue.timeNeeded
    };

    this._productService.createProduct(newProduct).subscribe({
      next: (res: ProductDTO) => {
        this._notificationService.success('Registro Éxitoso', 'El producto se registró correctamente');
        this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        console.log(err)
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar al cliente";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false)
      },
      complete: () => this._isLoading.set(false)
    });

  }


  //* Close Modal
  _close(): void {
    this._modalService.close<ModalRespose<ProductDTO | null>>({ hasChanges: false, data: null });
  }

}
