import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { SaleDetailsDTO } from '@interfaces/Sales/SaleDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { PrintService } from '@services/print.service';
import { SalesService } from '@services/sales.service';

@Component({
  selector: 'app-sale-details',
  imports: [PageLoaderComponent, PageErrorComponent, DatePipe, CopyButtonComponent, CurrencyPipe],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css'
})
export class SaleDetailsComponent implements OnInit {

  //* Injections
  private readonly _saleService = inject(SalesService);
  private readonly _route = inject(ActivatedRoute);
  readonly _printService = inject(PrintService);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);

  //* Data Variables
  _saleId = signal<string | null>(null);
  _response = signal<SaleDetailsDTO | null>(null);


  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getSaleDetails(this._saleId()!);
    }
  }

  //* Component Init
  ngOnInit(): void {
    this._saleId.set(this._route.snapshot.paramMap.get('id'));
    this._getSaleDetails(this._saleId()!);
  }

  //* Get Sale Details
  _getSaleDetails(id: string): void {
    this._isLoading.set(true);
    this._saleService.getSaleDetails(id).subscribe({
      next: (res) => this._response.set(res),
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Print Ticket

  _printTicket(): void {
    this._printService.saleTicket(this._response()!);
  }

  //* Back to History
  _back(): void {
    window.history.back();
  }

}
