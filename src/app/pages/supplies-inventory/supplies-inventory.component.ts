import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { PageTitleComponent } from '@base-ui/page-title/page-title.component';
import { PaginacionComponent } from '@base-ui/paginacion-backend/paginacion.component';
import { InventoryStatusComponent } from '@base-ui/supply-status/supply-status.component';
import { NoContentComponent } from '@error-handlers/no-content/no-content.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ModalRespose } from '@interfaces/ModalResponse';
import { SuppliesPaginationResponseDTO as SuppliesResponseDTO, SupplyDTO } from '@interfaces/Supplies Inventory/SupplyDTO';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { ModalService } from '@services/modal.service';
import { SuppliesInventoryService } from '@services/supplies-inventory.service';
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { RawMaterialFilterComponent } from '@shared-components/filters/raw-material-filter/raw-material-filter.component';
import { SearchComponent } from '@shared-components/filters/search/search.component';
import { ViewSupplyDetailsModalComponent as ViewSupplyDetailsModal } from 'app/components/supplies/modals/view-supply-details-modal/view-supply-details-modal.component';

@Component({
  selector: 'app-supplies-inventory',
  imports: [PageTitleComponent, SearchComponent, RawMaterialFilterComponent, ButtonsFilterComponent, PageLoaderComponent, PageErrorComponent
    , NoContentComponent, DatePipe, InventoryStatusComponent, CommonModule, PaginacionComponent],
  templateUrl: './supplies-inventory.component.html',
  styleUrl: './supplies-inventory.component.css'
})
export class SuppliesInventoryComponent {

  //* Injections
  private readonly _suppliesService = inject(SuppliesInventoryService);
  private readonly _modalService = inject(ModalService);

  //* Data Variables
  _response = signal<SuppliesResponseDTO | null>(null);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage: number = 11;

  //* Filters
  _rawMaterialFilter = signal<number | null>(null);
  _searchFilter = signal<string | null>(null);
  _availablesFilter = signal<boolean | null>(null);

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getSupplies();
    }
  }

  //* Constructor
  constructor() {

    let filtersInitialized = false;
    effect(() => {
      const page = this._currentPage();
      this._getSupplies();
    });

    effect(() => {
      const rm = this._rawMaterialFilter();
      const av = this._availablesFilter();
      const search = this._searchFilter();

      if (filtersInitialized) {
        this._currentPage.set(1);
      } else {
        filtersInitialized = true;
      }
    });
  }

  //* Get Supplies
  _getSupplies(): void {
    this._isLoading.set(true);
    this._suppliesService.getSupplies(this._itemsPerPage, this._currentPage(), this._availablesFilter(),
      this._rawMaterialFilter(), this._searchFilter()).subscribe({
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

  //* View Supply Details
  _viewSupplyDetails(supply: SupplyDTO) {
    this._modalService.open(ViewSupplyDetailsModal, { originalSupply: supply })
      .subscribe({
        next: (res: ModalRespose<number>) => {
          if (!res.hasChanges || res.data == null) return;
          const newWeight = res.data;

          this._response.update(prev => {
            if (!prev) return prev;

            return {
              ...prev,
              supplies: prev.supplies.map(item =>
                item.id === supply.id
                  ? { ...item, weightRemainKg: newWeight }
                  : item
              )
            };
          });
        }
      });
  }

}
