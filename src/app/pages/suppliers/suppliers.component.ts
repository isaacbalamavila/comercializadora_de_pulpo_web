import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { SuppliersService } from '@services/suppliers.service';
import { CreateSupplierModal } from '@suppliers-modals/create-supplier-modal/create-supplier-modal.component';
import { ViewSupplierDetailsModal } from '@suppliers-modals/view-supplier-details/view-supplier-details.component';
import { SupplierCardComponent } from '@suppliers/supplier-card/supplier-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from "@base-ui/pagination/pagination.component";
import { AddButtonComponent } from "@buttons/add-button/add-button.component";
import { SearchComponent } from "@filters/search/search.component";
import { ButtonsFilterComponent } from '@filters/buttons/buttons.component';
import { first, Subject, takeUntil } from 'rxjs';
import { PageTitleComponent } from "@base-ui/page-title/page-title.component";
import { phoneFormatter } from '@utils/phone-formatter';

@Component({
  selector: 'app-suppliers',
  imports: [PageLoaderComponent, PageErrorComponent, NoContentComponent, NgxPaginationModule, SupplierCardComponent,
    CommonModule, FormsModule, PaginationComponent, AddButtonComponent, SearchComponent, ButtonsFilterComponent, PageTitleComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent implements OnInit {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _suppliersService = inject(SuppliersService);
  private readonly _modalService = inject(ModalService);

  //* Data Variables
  _suppliers = signal<SupplierDTO[]>([]);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage = signal<number>(16); // Columns * Rows

  //* Filters
  _searchFilter = signal<string | null>(null);
  _statusFilter = signal<boolean | null>(null);

  //* Filtered Suppliers
  _filteredSuppliers = computed<SupplierDTO[]>(() => {
    const data = this._suppliers();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const status = this._statusFilter();

    return data.filter((supplier) => {
      const searchMatch = search
        ? supplier.email.toLowerCase().includes(search)
        || supplier.name.replaceAll(' ','').toLowerCase().includes(search)
        || supplier.phone.includes(search)
        : true;

      const statusMatch = status !== null
        ? supplier.isDeleted === status
        : true;

      return searchMatch && statusMatch;
    });
  });

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getSuppliers();
    }
  }

  //* Constructor
  constructor() {
    effect(() => {
      this._searchFilter();
      this._statusFilter();
      this._currentPage.set(1);
    });
  }

  //* Component Init
  ngOnInit(): void {
    this._getSuppliers();
  }

  //* Get Suppliers
  _getSuppliers(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._suppliersService.getSuppliers().pipe(first(), takeUntil(this._destroy$)).subscribe({
      next: (res) => {
        this._suppliers.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)

    });

  }

  //* View Supplier Details
  _viewSupplierDetails(selectedSupplier: SupplierDTO): void {
    selectedSupplier = { ...selectedSupplier, phone: phoneFormatter(selectedSupplier.phone) };
    this._modalService.open(ViewSupplierDetailsModal, { originalSupplier: selectedSupplier }).subscribe({
      next: (res: ModalRespose<SupplierDTO | null>) => {
        if (res.hasChanges && res.data) {
          res.data.phone = res.data.phone.replace(/-/g, '')
          if (res.hasChanges && res.data) {
            this._suppliers.update(list =>
              list.map(sp => sp.id === res.data!.id ? res.data! : sp)
            );
          }
        }
      }
    }
    );

  }

  //* Create Supplier
  _createSupplier(): void {
    this._modalService.open(CreateSupplierModal).subscribe({
      next: (res: ModalRespose<SupplierDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._suppliers.set([res.data, ...this._suppliers()]);
        }
      }
    });

  }

}
