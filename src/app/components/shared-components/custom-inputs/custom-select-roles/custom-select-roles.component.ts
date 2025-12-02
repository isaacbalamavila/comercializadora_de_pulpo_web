import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostListener, inject, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EmployeesService } from '@services/employees.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SmallLoaderComponent } from "@loaders/small-loader/small-loader.component";

@Component({
  selector: 'custom-select-roles',
  imports: [CommonModule, SmallLoaderComponent],
  templateUrl: './custom-select-roles.component.html',
  styleUrl: './custom-select-roles.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectRolesComponent),
      multi: true
    }
  ]
})
export class CustomSelectRolesComponent implements OnInit {

  //* Inputs
  @Input() placeholder: string = 'Roles';
  @Input() bgColor: string = 'white';
  @Input() inputLabel: string = 'roles';
  @Input() showLabel: boolean = false;
  @Input() required: boolean = false;

  //* Injectiosn
  employeeService = inject(EmployeesService);


  //* UI Variables
  value: any | null = null;
  label: string = '';
  options: { value: any, label: string }[] = [];
  showMenu: boolean = false;
  showOptions: boolean = false;
  isLoading: boolean = false;

  isTouched: boolean = false;

  ngOnInit(): void {
    const saveRoles = localStorage.getItem('saveRoles');
    if (saveRoles) {
      this.options = JSON.parse(saveRoles);
    }
    else {
      this.getRoles();
    }
  }

  getRoles(): void {
    this.isLoading = true;
    this.options = []

    this.employeeService.getRoles().subscribe({
      next: (res) => {
        res.map((role) => {
          this.options.push({ value: role.id, label: role.name })
          const stingifyOptions = JSON.stringify(this.options);
          localStorage.setItem('saveRoles', stingifyOptions);
        });
      },
      complete: () => this.isLoading = false
    })

  }

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
      // .pipe(debounceTime(300), takeUntil(this.destroy$)) <- Debounce
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
