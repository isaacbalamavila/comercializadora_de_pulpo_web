import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, input, signal, ViewChild } from '@angular/core';
import { RawMaterialDTO } from '@interfaces/Raw Materials/RawMaterialDTO';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { RawMaterialsService } from '@services/raw-materials.service';
import { RAW_MATERIAL_STORAGE } from 'config/constansts';

@Component({
  selector: 'raw-material-filter',
  imports: [CommonModule, SmallLoaderComponent],
  templateUrl: './raw-material-filter.component.html',
  styleUrl: './raw-material-filter.component.css'
})
export class RawMaterialFilterComponent {

  //* Data Variables
  @Input({ required: true }) value = signal<number | null>(null);

  //* Injections
  _rawMaterialService = inject(RawMaterialsService);

  //* UI Variables
  placeholder = input<string>('Materia Prima');
  bgColor = input<string>('white');
  _isFocus = signal<boolean>(false);
  _isLoading = signal<boolean>(true);
  _label = signal<string | null>(null)
  _options: RawMaterialDTO[] = [];

  //* Ref Helper
  @ViewChild('roleSelect', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this._isFocus.set(false);
    }
  }

  //* Component Init
  ngOnInit(): void {
    const savedRawMaterials = localStorage.getItem(RAW_MATERIAL_STORAGE);
    if (savedRawMaterials) {
      this._options = JSON.parse(savedRawMaterials);
      this._isLoading.set(false);
    }
    else {
      this._getRawMaterials();
    }

  }

  //* Get Raw Materials
  _getRawMaterials(): void {
    this._isLoading.set(true);
    this._options = [];

    this._rawMaterialService.getRawMaterials().subscribe(
      {
        next: (res: RawMaterialDTO[]) => {
          this._options = res;
          const stingifyRoles = JSON.stringify(this._options);
          localStorage.setItem(RAW_MATERIAL_STORAGE, stingifyRoles);
          this._isLoading.set(false);
        }
      }
    );
  }

  //* Value Change
  onValueChange(role: RawMaterialDTO):void{
    this.value.set(role.id);
    this._label.set(role.name);
    this._isFocus.set(false);
  }

  //* Clear Filter
  clearValue(): void {
    this.value.set(null);
    this._label.set(null);
    this._isFocus.set(false);
  }
}
