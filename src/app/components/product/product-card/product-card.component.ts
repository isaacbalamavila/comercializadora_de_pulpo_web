import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ProductDTO } from '@interfaces/Products/ProductDTO';

@Component({
  selector: 'product-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  //* Data
  product = input.required<ProductDTO>();

  //* UI Variables
  imgLoading = signal<boolean>(true);
  imgError = signal<boolean>(false);
  showStatus = input<boolean>(true);

}
