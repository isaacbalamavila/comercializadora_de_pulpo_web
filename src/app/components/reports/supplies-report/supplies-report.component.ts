import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { PrintService } from '@services/print.service';
import { ReportsService } from '@services/reports.service';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { ToggleButtonComponent } from '@shared-components/buttons/toggle-button/toggle-button.component';
import { getFirstDayOfMonth, getFirstDayOfWeek } from '@utils/date-helper';

@Component({
  selector: 'supplies-report',
  imports: [BaseModalComponent, ToggleButtonComponent, LoadingButtonComponent, FormsModule],
  templateUrl: './supplies-report.component.html',
  styleUrl: './supplies-report.component.css'
})
export class SuppliesReportModal {

  //* Injections 
  _modalService = inject(ModalService);
  _reportService = inject(ReportsService);
  _printService = inject(PrintService);
  _notificationService = inject(NotificationService);

  //* UI Variables
  _customPeriod = signal<boolean>(false);
  _customLoading = signal<boolean>(false);
  _weekLoading = signal<boolean>(false);
  _monthLoading = signal<boolean>(false);


  //* Data Variables
  _startDate = signal<Date | null>(null);
  _endDate = signal<Date | null>(null);


  _customReport(): void {
    if ((!this._startDate() && !this._endDate()) || this._customLoading()) return;
    this._customLoading.set(true);

    const start = this._startDate()!;
    const end = this._endDate()!;

    this._reportService.getSuppliesReport(start, end).subscribe({
      next: (res) => {
        // Generate PDF Logic
        this._printService.suppliesReport(res);
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar el producto";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._customLoading.set(false);
      },
      complete: () => this._customLoading.set(false)
    })


  }

  _monthReport(): void {
    if (this._monthLoading()) return;

    this._monthLoading.set(true);

    const start = getFirstDayOfMonth();
    const end = new Date(Date.now());

    this._reportService.getSuppliesReport(start, end).subscribe({
      next: (res) => {
        // Generate PDF Logic
        this._printService.suppliesReport(res);
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar el producto";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._monthLoading.set(false);
      },
      complete: () => this._monthLoading.set(false)
    })
  }

  _weekReport(): void {
    if (this._weekLoading()) return;

    this._weekLoading.set(true);

    const start = getFirstDayOfWeek();
    const end = new Date(Date.now());

    this._reportService.getSuppliesReport(start, end).subscribe({
      next: (res) => {
        // Generate PDF Logic
        this._printService.suppliesReport(res);
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar el producto";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._weekLoading.set(false);
      },
      complete: () => this._weekLoading.set(false)
    })
  }

  //* Close
  _close(): void {
    this._modalService.close();
  }
}
