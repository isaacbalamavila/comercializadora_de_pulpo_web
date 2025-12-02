import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostListener, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor, OnDestroy {

  @Input({ required: true }) placeholder: string = '';
  @Input({ required: true }) options: { value: any, label: string }[] = [];
  @Input() bgColor: string = 'white';

  value: any | null = null;
  label: string = '';
  showMenu: boolean = false;
  showOptions: boolean = false;

  @ViewChild('selectRef', { static: false }) selectRef?: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.selectRef?.nativeElement) return;

    if (!this.selectRef.nativeElement.contains(event.target)) {
      this.showOptions = false;
      this.showMenu = false;
    }
  }

  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Funciones internas del ControlValueAccessor
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    this.inputSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(valor => {
        // console.log('Valor emitido:', valor);
        this.onChange(valor);
      });
  }

  onInputChange(valor: any, label: string): void {
    this.value = valor;
    this.label = label;
    this.showMenu = false;
    this.showOptions = false;
    this.inputSubject.next(valor);
    this.onTouched();
  }

  // Métodos requeridos por ControlValueAccessor
  writeValue(valor: any): void {
    this.value = valor;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  //Clases Auxiliares
  isNullOrEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  ClearValue(): void {
    this.value = null;
    this.showMenu = false;
    this.onChange(this.value);
    this.onTouched();
  }

  VerifyValue(): boolean {
    return !this.isNullOrEmpty(this.value) || this.showOptions;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
