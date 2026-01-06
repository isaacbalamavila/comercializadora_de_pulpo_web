import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductDTO } from '@interfaces/Products/ProductDTO';
import { ProductsService } from '@services/products.service';

@Component({
  selector: 'product-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent implements OnInit {

  //* Injections
  _productService = inject(ProductsService)

  //* UI Variables
  _search = signal<string | null>(null);
  _showOptions = signal<boolean>(false);
  _selectedProduct = signal<ProductDTO | null>(null);
  placeholder = input<string>('Producto');
  isSearch = input<boolean>(false);
  onlyActives = input<boolean>(false);

  //* Interactions
  onSelect = output<string | null>();

  //* Data
  _products = signal<ProductDTO[]>([]);
  _productsFiltered = computed<ProductDTO[]>(() => {
    const products = this._products();

    return products.filter((sp) => {
      const searchMatch = this._search()
        ? sp.name.toLowerCase().replaceAll(' ', '').includes(this._search()!.toLowerCase().replaceAll(' ', ''))
        : true;

      return searchMatch;
    });
  });

  //* Ref Helper
  @ViewChild('productFilter', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this._showOptions.set(false);
      if (!this._selectedProduct()) {
        this._search.set(null);
      }
    }
  }

  //* Component Init
  ngOnInit(): void {
    this.onlyActives()
      ? this._getActiveProducts()
      : this._getProducts()
  }

  //* Get Product
  _getProducts(): void {
    this._productService.getProducts().subscribe({
      next: (res) => this._products.set(res)
    })
  }

  //* Get Product
  _getActiveProducts(): void {
    this._productService.getActiveProducts().subscribe({
      next: (res) => this._products.set(res)
    })
  }

  

  //* Select Product
  selectSupplier(product: ProductDTO): void {
    this._showOptions.set(false);
    this._selectedProduct.set(product);
    this._search.set(this.isSearch() ? null : product.name);
    this.onSelect.emit(product.id);
  }

  _clear(): void {
    this._showOptions.set(false);
    this._selectedProduct.set(null);
    this._search.set(null);
    this.onSelect.emit(null);
  }
}
