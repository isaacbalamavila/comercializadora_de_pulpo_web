import { Component, computed, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from "@base-ui/page-title/page-title.component";
import { ClientDTO } from '@interfaces/Clients/ClientDTO';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { ClientsService } from '@services/clients.service';
import { ModalService } from '@services/modal.service';
import { AddButtonComponent } from "@shared-components/buttons/add-button/add-button.component";
import { ButtonsFilterComponent } from '@shared-components/filters/buttons/buttons.component';
import { SearchComponent } from "@shared-components/filters/search/search.component";
import { first, Subject, takeUntil } from 'rxjs';
import { PageLoaderComponent } from "@loaders/page-loader/page-loader.component";
import { PageErrorComponent } from "@error-handlers/page-error/page-error.component";
import { NoContentComponent } from "@error-handlers/no-content/no-content.component";
import { ClientCardComponent } from "app/components/clients/client-card/client-card.component";
import { ViewClientsDetailsModal } from 'app/components/clients/modals/view-clients-details/view-clients-details.component';
import { phoneFormatter } from '@utils/phone-formatter';
import { ModalRespose } from '@interfaces/ModalResponse';
import { PaginationComponent } from "@base-ui/pagination/pagination.component";
import { CreateClientModal } from 'app/components/clients/modals/create-client/create-client-modal.component';
@Component({
  selector: 'app-clients',
  imports: [PageTitleComponent, AddButtonComponent, SearchComponent, ButtonsFilterComponent, PageLoaderComponent,
    PageErrorComponent, NoContentComponent, ClientCardComponent, PaginationComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  //* Subject
  private _destroy$ = new Subject<void>();

  //* Injections
  private readonly _clientService = inject(ClientsService);
  private readonly _modalService = inject(ModalService);

  //*Data Variables
  _clients = signal<ClientDTO[]>([]);

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _error = signal<ErrorResponse | null>(null);
  _currentPage = signal<number>(1);
  _itemsPerPage = signal<number>(16); // Columns * Rows

  //* Filters
  _searchFilter = signal<string | null>(null);
  _statusFilter = signal<boolean | null>(null);

  _filteredClients = computed<ClientDTO[]>(() => {
    const data = this._clients();
    const search = this._searchFilter()?.replaceAll(' ', '').toLowerCase();
    const status = this._statusFilter();

    return data.filter((cl) => {
      const searchMatch = search
        ? cl.email.toLowerCase().includes(search)
        || cl.name.replaceAll(' ','').toLowerCase().includes(search)
        || cl.phone.includes(search)
        : true;

      const statusMatch = status !== null
        ? cl.isDeleted === status
        : true;

      return searchMatch && statusMatch;
    });
  });

  //* Host Listener
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      this._getClients();
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

  //* Components Init
  ngOnInit(): void {
    this._getClients();
  }

  //* Get Clients
  _getClients(): void {
    this._isLoading.set(true);
    this._clientService.getClients().pipe(first(), takeUntil(this._destroy$)).subscribe({
      next: (res) => {
        this._clients.set(res)
      },
      error: (err) => {
        this._error.set({ statusCode: err.status });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });

  }

  //* View Client Details
  _viewDetails(selectedClient: ClientDTO): void {
    selectedClient = { ...selectedClient, phone: phoneFormatter(selectedClient.phone) };
    this._modalService.open(ViewClientsDetailsModal, { originalClient: selectedClient }).subscribe({
      next: (res: ModalRespose<ClientDTO | null>) => {
        if (res.hasChanges && res.data) {
          res.data.phone = res.data.phone.replace(/-/g, '')
          this._clients.update(list =>
            list.map(cl => cl.id === res.data!.id ? res.data! : cl)
          );
        }

      }
    });

  }

  //* Create Client
  _createClient(): void {
    this._modalService.open(CreateClientModal).subscribe({
      next: (res: ModalRespose<ClientDTO | null>) => {
        if (res.hasChanges && res.data) {
          this._clients.set([res.data, ...this._clients()]);
        }
      }
    });
  }

}
