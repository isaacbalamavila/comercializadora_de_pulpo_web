import { Component, inject } from '@angular/core';
import { ModalService } from '@services/modal.service';
import { ClientsReportModal } from 'app/components/reports/clients-report/clients-report.component';
import { ProductsReportModal } from 'app/components/reports/products-report/products-report.component';
import { PurchasesReportModal } from 'app/components/reports/purchases-report/purchases-report.component';
import { SalesReportModal } from 'app/components/reports/sales-report/sales-report.component';
import { SuppliesReportModal } from 'app/components/reports/supplies-report/supplies-report.component';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  //* Injections
  _modalService = inject(ModalService);

  //* SalesReport
  _saleReport(): void {
    this._modalService.open(SalesReportModal);
  }

  _purchaseReport(): void {
    this._modalService.open(PurchasesReportModal)
  }

  _clientsReport(): void {
    this._modalService.open(ClientsReportModal);
  }

  _productsReport(): void {
    this._modalService.open(ProductsReportModal);
  }

  _suppliesReport(): void {
    this._modalService.open(SuppliesReportModal);
  }

}
