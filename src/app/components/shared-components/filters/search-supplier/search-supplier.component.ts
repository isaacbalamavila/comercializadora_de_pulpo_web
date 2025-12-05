import { Component, computed, ElementRef, HostListener, inject, output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierDTO } from '@interfaces/Suppliers/SupplierDTO';
import { SuppliersService } from '@services/suppliers.service';

@Component({
  selector: 'search-supplier',
  imports: [FormsModule],
  templateUrl: './search-supplier.component.html',
  styleUrl: './search-supplier.component.css'
})
export class SearchSupplierComponent {
  //* Injections
  _supplierService = inject(SuppliersService)

  //* UI Variables
  _search = signal<string | null>(null);
  _showOptions = signal<boolean>(false);
  _selectedSupplier = signal<SupplierDTO | null>(null);

  //* Interactions
  onSelect = output<SupplierDTO | null>();

  //* Data
  _suppliers = signal<SupplierDTO[]>([]);
  _suppliersFiltered = computed<SupplierDTO[]>(() => {
    const suppliers = this._suppliers();

    return suppliers.filter((sp) => {
      const searchMatch = this._search()
        ? sp.name.toLowerCase().replaceAll(' ', '').includes(this._search()!.toLowerCase().replaceAll(' ', ''))
        : true;

      return searchMatch;
    });
  });

  //* Ref Helper
  @ViewChild('supplierFilter', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this._showOptions.set(false);
      if (!this._selectedSupplier()) {
        this._search.set(null);
      }
    }
  }

  //* Component Init
  ngOnInit(): void {
    this._getSuppliers()
  }

  //* Get Suppliers
  _getSuppliers(): void {
    this._supplierService.getActiveSuppliers().subscribe({
      next: (res) => {
        this._suppliers.set(res)
      }
    })
  }

  //* Select Supplier
  selectSupplier(supplier: SupplierDTO): void {
    this._showOptions.set(false);
    this._selectedSupplier.set(supplier);
    this._search.set(null);
    this.onSelect.emit(supplier);
  }

  _clear(): void {
    this._showOptions.set(false);
    this._selectedSupplier.set(null);
    this._search.set(null);
    this.onSelect.emit(null);
  }

}
