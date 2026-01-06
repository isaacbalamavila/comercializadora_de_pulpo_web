import { Component, computed, ElementRef, HostListener, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductInventory } from '@interfaces/Product Inventory/ProductInventory';
import { ProductInventoryService } from '@services/product-inventory.service';

@Component({
  selector: 'product-sale-input',
  imports: [FormsModule],
  templateUrl: './product-sale-filter.component.html',
  styleUrl: './product-sale-filter.component.css'
})
export class ProductSaleInputComponent implements OnInit {
  //* Injections
  private readonly _inventoryService = inject(ProductInventoryService);

  //* UI Variables
  _showOptions = signal<boolean>(false);
  _search = signal<string | null>(null);
  placeholder = input<string>("Buscar Producto (Nombre, SKU)");

  //* Data Variables
  _products = signal<ProductInventory[]>([]);
  _selectedProduct = signal<ProductInventory | null>(null);
  _filteredProducts = computed<ProductInventory[]>(() => {

    const search = this._search()?.replaceAll(' ', '')
    return this._products().filter(p => {
      const match = search ? p.name.replaceAll(' ', '').includes(search) || p.sku.includes(search) : true;

      return match;
    }
    );
  });

  //* Interactions
  onSelect = output<ProductInventory | null>();

  //* Ref Helper
  @ViewChild('productSaleFilter', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      if (!this._selectedProduct()) {
        this._search.set(null);
      }
      this._showOptions.set(false);
    }
  }

  //* Component Init
  ngOnInit(): void {
    this._inventoryService.getProductInventory().subscribe({
      next: res => this._products.set(res)
    });
  }

  //* Select Product
  _selectProduct(product: ProductInventory): void {
    this._search.set(product.name);
    this._selectedProduct.set(product);
    this._showOptions.set(false);
    this.onSelect.emit(product);

  }

  //* Clear
  clear(): void {
    this._selectedProduct.set(null);
    this._search.set(null);
    this._showOptions.set(false);
    this.onSelect.emit(null);
  }
}
