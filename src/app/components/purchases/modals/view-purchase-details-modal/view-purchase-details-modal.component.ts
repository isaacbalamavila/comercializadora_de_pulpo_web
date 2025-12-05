import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PurchaseDetailsDTO } from '@interfaces/Purchases/PurchaseDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { PurchaseService } from '@services/purchase.service';
import { phoneFormatter } from '@utils/phone-formatter';

@Component({
  selector: 'app-view-purchase-details-modal',
  imports: [BaseModalComponent, PageLoaderComponent, PageErrorComponent, CopyButtonComponent, CurrencyPipe, DatePipe],
  templateUrl: './view-purchase-details-modal.component.html',
  styleUrl: './view-purchase-details-modal.component.css'
})
export class ViewPurchaseDetailsModal implements OnInit{

  //* Data
  purchaseId!: string;
  purchase = signal<PurchaseDetailsDTO | null>(null)

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _purchaseService = inject(PurchaseService);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);

  ngOnInit(): void {
    this._getPurchaseDetails();
  }

  //* Close
  _close(): void {
    this._modalService.close()
  }

  //* Get Purchase Details
  _getPurchaseDetails(): void {
    this._purchaseService.getPurchaseDetails(this.purchaseId).subscribe({
      next: (res) => {
        res.supplierPhone = phoneFormatter(res.supplierPhone);
        this.purchase.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)

    });

  }
}
