import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhoneDirective } from '@directives/phone.directive';
import { EmployeesService } from '@services/employees.service';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { EmployeeDetailsDTO, EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { EditEmployeeDTO as UpdateEmployeeDTO } from '@interfaces/Employees/EditEmployeeDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { BaseModalComponent } from '@base-ui/base-modal/base-modal.component';
import { InputFormComponent } from '@shared-components/forms/input-form/input-form.component';
import { LoadingButtonComponent } from '@shared-components/buttons/loading-button/loading-button.component';
import { EMAIL_REGEX, NAME_USER_REGEX } from 'config/regex';

@Component({
  selector: 'app-edit-employee',
  imports: [FormsModule, ReactiveFormsModule, PhoneDirective, BaseModalComponent, InputFormComponent,
    LoadingButtonComponent
  ],
  templateUrl: './edit-employee.component.html'
})
export class EditEmployeeModal implements OnInit {

  //* Injections
  _modalService = inject(ModalService);
  _employeeService = inject(EmployeesService);
  _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* UI Variables
  _isLoading = signal<boolean>(false)

  //* Data Variables
  originalEmployee!: EmployeeDTO;

  //* Form
  _updateEmployeeForm: FormGroup = this._fb.group({
    name: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(NAME_USER_REGEX)
      ],
    }),
    lastName: this._fb.control<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(NAME_USER_REGEX)
      ],
    }),
    email: this._fb.control<string>('', {
      validators: [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(50),
      Validators.pattern(EMAIL_REGEX)
      ]
    }),
    phone: this._fb.control<string | null>(null, {
      validators: [
        Validators.minLength(12),
        Validators.maxLength(12)
      ],
    })
  });

  //* Change Detection
  _hasChanges = signal<boolean>(false);

  //* Component Init
  ngOnInit(): void {

    if (this.originalEmployee) {
      this._updateEmployeeForm.patchValue(this.originalEmployee);

      this._updateEmployeeForm.valueChanges.subscribe(() => {
        const current = this._updateEmployeeForm.getRawValue();
        const original = this.originalEmployee;

        console.log('current:', current);
        console.log('original:', original);
        this._hasChanges.set(
          original.email !== current.email
          || original.name !== current.name
          || original.lastName !== current.lastName
          || (original.phone ?? null) !== (current.phone ?? null)
        )
      });
    }
  }

  _updateEmployee(): void {
    this._isLoading.set(true)

    const formValue = this._updateEmployeeForm.value;

    const updatedEmployee: UpdateEmployeeDTO = {
      email: formValue.email,
      name: formValue.name,
      lastName: formValue.lastName,
      phone: formValue.phone ? formValue.phone.replaceAll('-', '') : null
    };

    this._employeeService.editEmployee(this.originalEmployee.id, updatedEmployee).subscribe({
      next: (res) => {

        console.log(res);
        this._notificationService.success('Actualización Éxitosa', 'Los cambios se guardaron correctamente');
        this._modalService.close<ModalRespose<EmployeeDetailsDTO | null>>({ hasChanges: true, data: res })
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar actualizar la información";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });


  }


  _close(): void {
    this._modalService.close<ModalRespose<EmployeeDetailsDTO | null>>({ hasChanges: false, data: null })
  }
}
