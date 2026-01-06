import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, viewChild, ViewChild } from '@angular/core';
import { UserInfoComponent } from '@base-ui/user-info/user-info.component';
import { ClientDetailsDTO } from '@interfaces/Clients/ClientDTO';
import { ClientsService } from '@services/clients.service';
import { ClientFilterComponent } from '@shared-components/filters/client-filter/client-filter.component';
import { phoneFormatter } from '@utils/phone-formatter';
import { ProductSaleInputComponent } from "@shared-components/custom-inputs/product-sale-input/product-sale-filter.component";
import { ProductInventory, ProductList } from '@interfaces/Product Inventory/ProductInventory';
import { StockInputComponent } from '@shared-components/custom-inputs/stock-select/stock-select.component';
import { NotificationService } from '@services/notifications.service';
import { PaymentMethodSelectComponent } from '@shared-components/custom-inputs/payment-method-select/payment-method-select.component';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { CustomCheckboxComponent } from "@shared-components/custom-inputs/custom-checkbox/custom-checkbox.component";
import { ModalService } from '@services/modal.service';
import { SalesService } from '@services/sales.service';
import { SuccessSaleModalComponent } from '@base-ui/modals/success-sale-modal/success-sale-modal.component';
import { fadeInOut, fadeSlideList, popupAnimation } from '@animations';
import { SaleItem } from '@interfaces/Sales/MakeSaleDTO';

@Component({
  selector: 'app-sale',
  imports: [UserInfoComponent, ClientFilterComponent, DatePipe, ProductSaleInputComponent, StockInputComponent,
    CurrencyPipe, PaymentMethodSelectComponent, SmallLoaderComponent, CustomCheckboxComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
  animations: [fadeInOut]
})
export class SaleComponent {

  //* Inject
  private readonly _clientService = inject(ClientsService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _modalService = inject(ModalService);
  private readonly _saleService = inject(SalesService);

  //* Filters
  _clientFilter = signal<string | null>(null);

  //* Data Variables
  _clientSelected = signal<ClientDetailsDTO | null>(null);
  _productSelected = signal<ProductInventory | null>(null);
  _quantity = signal<number | null>(null);
  _productsCart = signal<ProductList[]>([]);
  _selectedProducts = signal<string[]>([]);
  _paymentMethod = signal<number | null>(null);

  //* UI Variables
  _clientLabel = computed<string>(() => {

    if (!this._clientSelected()) return '';

    const parts = this._clientSelected()!.name.split(' ').filter(p => p.length > 0);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    } else {
      return (parts[0][0] + (parts[2] ? parts[2][0] : parts[1][0])).toUpperCase();
    }
  });
  _phoneFormat = computed<string>(() => this._clientSelected ? phoneFormatter(this._clientSelected()!.phone) : '');
  _maxPieces = signal<number>(0);
  _total = computed<number>(() => {
    return this._productsCart().reduce((total, product) => { return total + product.subtotal }, 0)
  });
  _isLoading = signal<boolean>(false);
  _validSale = computed<boolean>(() => {
    return (
      !!this._clientSelected() &&
      !!this._paymentMethod() &&
      this._productsCart().length > 0
    );
  });

  //* Children References
  @ViewChild('productSelectInput') productSelectInput!: ProductSaleInputComponent;
  @ViewChild('stockInput') stockInput!: StockInputComponent;
  @ViewChild('paymentInput') paymentInput!: PaymentMethodSelectComponent;

  //* Constructor
  constructor() {
    effect(() => {
      const saleFilter = this._clientFilter();
      this.clientDetails();

    });
  }

  //* Get Client Details
  clientDetails(): void {
    if (this._clientFilter()) {

      this._clientService.getClient(this._clientFilter()!).subscribe({
        next: (res) => this._clientSelected.set(res)
      });
    }

    return;
  }

  //* Select Product
  _onSelectProduct(product: ProductInventory | null): void {
    this._productSelected.set(product);
    this._maxPieces.set(product?.quantity ?? 0);
  }

  //* Add Product to Cart
  _addProductToCart(): void {

    // Esencial Values Verification
    if (!this._productSelected() || !this._quantity()) return;

    // Already product in list verification
    if (this._productsCart().some(p => p.id === this._productSelected()!.id)) {
      this._notificationService.warning("Producto en carrito", "Este artículo ya ha sido añadido anteriormente");
      this.productSelectInput.clear();
      this.stockInput.clear();
      return;
    }

    const productCart: ProductList = {
      id: this._productSelected()!.id,
      sku: this._productSelected()!.sku,
      name: this._productSelected()!.name,
      price: this._productSelected()!.price,
      quantity: this._quantity()!,
      subtotal: this._productSelected()!.price * this._quantity()!
    };

    this._productsCart.update((p: ProductList[]) => [...p, productCart]);
    this.productSelectInput.clear();
    this.stockInput.clear();
  }

  //* Delete Selected Products
  _deleteSelectedProducts(): void {
    this._productsCart.update(currentCart => currentCart.filter(product => !this._selectedProducts().includes(product.id)));
    this._selectedProducts.set([]);
    this._notificationService.success("Productos eliminados", "Se han eliminado los productos seleccionados");
  }

  //* On selected
  _onSelected(value: boolean, product: ProductList): void {
    if (value) {
      this._selectedProducts.update(currentCart => [...currentCart, product.id]);
    }
    else {
      this._selectedProducts.update(currentCart => currentCart.filter(p => p !== product.id))
    }
  }

  //* Make Sale
  _makeSale(): void {
    this._isLoading.set(true);

    if (!this._validSale()) return;

    // Map Body Field
    const client: string = this._clientSelected()!.id;
    const paymentMethod: number = this._paymentMethod()!;

    const productList: SaleItem[] = this._productsCart().map(p => ({ productId: p.id, quantity: p.quantity }));

    this._saleService.makeSale(client, paymentMethod, productList).subscribe({
      next: (res) => {
        this._modalService.open(SuccessSaleModalComponent, { ticketInfo: res });
        // Clear Flields
        this._clientSelected.set(null);
        this._paymentMethod.set(null);
        this.paymentInput.clearValue();
        this._clientSelected.set(null);
        this.productSelectInput.clear();
        this.stockInput.clear();
        this._productsCart.set([]);

      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar realizar la compra";

        this._notificationService.error('Ocurrió un error al procesar la venta', errorMessage, 8000);
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    })
  }
}
