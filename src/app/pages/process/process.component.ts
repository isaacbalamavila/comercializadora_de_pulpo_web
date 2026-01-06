import { DatePipe } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { PaginacionComponent as PaginationComponent } from '@base-ui/paginacion-backend/paginacion.component';
import { StatusLabelComponent as StatusLabelComponent } from '@base-ui/status-labels/status-labels.component';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { ProcessDTO, ProcessResponseDTO } from '@interfaces/Process/ProcessInterface';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { ProcessesService } from '@services/processes.service';
import { AddButtonComponent } from '@shared-components/buttons/add-button/add-button.component';
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { ProductFilterComponent } from '@shared-components/filters/product-filter/product-filter.component';
import { UserFilterComponent } from '@shared-components/filters/user-filter/user-filter.component';
import { ViewProcessDetailsModal } from 'app/components/process/view-process-details-modal/view-process-details-modal.component';

@Component({
  selector: 'app-process',
  imports: [PageTitleComponent, AddButtonComponent, ProductFilterComponent, UserFilterComponent, ButtonsFilterComponent,
    PageLoaderComponent, PageErrorComponent, NoContentComponent, PaginationComponent, DatePipe, StatusLabelComponent
  ],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css'
})
export class ProcessComponent {

  //* Injections
  private readonly _processService = inject(ProcessesService);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);


  //* Data Variables
  _response = signal<ProcessResponseDTO | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage: number = 11;

  //* Filters
  _productFilter = signal<string | null>(null);
  _userFilter = signal<string | null>(null);
  _statusFilter = signal<number | null>(null);

  //* Constructor
  constructor() {

    let filtersInitialized = false;
    effect(() => {
      const page = this._currentPage();
      this._getProcesses();
    });

    effect(() => {
      const p = this._productFilter();
      const u = this._userFilter();
      const s = this._statusFilter();

      if (filtersInitialized) {
        this._currentPage.set(1);
      } else {
        filtersInitialized = true;
      }
    });
  }

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getProcesses();
    }
  }

  //* Get Supplies
  _getProcesses(): void {
    this._isLoading.set(true);
    this._processService.getProcesses(this._itemsPerPage, this._currentPage(), this._productFilter(),
      this._userFilter(), this._statusFilter()).subscribe({
        next: (res) => {
          this._response.set(res);
        },
        error: (err) => {
          this._error.set({ statusCode: err.status });
          this._isLoading.set(false);
        },
        complete: () => this._isLoading.set(false)
      });
  }

  //* View Process Details
  _viewProcessDetails(process: ProcessDTO): void {
    this._modalService.open(ViewProcessDetailsModal, { originalProcess: process }).subscribe({
      next: (res: ModalRespose<null>) => {
        if (res.hasChanges) {
          this._getProcesses();
        }
      }
    });
  }

  //* Create Process
  _createProcess(): void {
    console.log('click')
    this._router.navigate(['home/freezing-proccess/create-process']);
  }

}
