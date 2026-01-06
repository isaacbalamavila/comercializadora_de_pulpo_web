import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDTO } from '@interfaces/Clients/ClientDTO';
import { ClientsService } from '@services/clients.service';

@Component({
  selector: 'client-filter',
  imports: [CommonModule,FormsModule],
  templateUrl: './client-filter.component.html',
  styleUrl: './client-filter.component.css'
})
export class ClientFilterComponent {

  //* Injections
  _clientService = inject(ClientsService)

  //* UI Variables
  _search = signal<string | null>(null);
  _showOptions = signal<boolean>(false);
  _selectedProduct = signal<ClientDTO | null>(null);
  placeholder = input<string>('Buscar cliente');
  isSearch = input<boolean>(false);
  onlyActives = input<boolean>(false);

  //* Interactions
  onSelect = output<string | null>();

  //* Data
  _clients = signal<ClientDTO[]>([]);
  _clientsFiltered = computed<ClientDTO[]>(() => {
    const clients = this._clients();

    return clients.filter((sp) => {
      const searchMatch = this._search()
        ? sp.name.toLowerCase().replaceAll(' ', '').includes(this._search()!.toLowerCase().replaceAll(' ', ''))
        : true;

      return searchMatch;
    });
  });

  //* Ref Helper
  @ViewChild('clientFilter', { static: false }) selectRef?: ElementRef;

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
      ? this._getActiveSuppliers()
      : this._getProducts()
  }

  //* Get Clients
  _getProducts(): void {
    this._clientService.getClients().subscribe({
      next: (res) => this._clients.set(res)
    })
  }

  //* Get Clients
  _getActiveSuppliers(): void {
    this._clientService.getAllClients().subscribe({
      next: (res) => this._clients.set(res.filter(cl => !cl.isDeleted))
    })
  }

  //* Select Client
  selectSupplier(client: ClientDTO): void {
    this._showOptions.set(false);
    this._selectedProduct.set(client);
    this._search.set(this.isSearch() ? null : client.name);
    this.onSelect.emit(client.id);
  }

  _clear(): void {
    this._showOptions.set(false);
    this._selectedProduct.set(null);
    this._search.set(null);
    this.onSelect.emit(null);
  }
}
