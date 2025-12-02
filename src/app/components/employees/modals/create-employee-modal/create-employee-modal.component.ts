import { Component, inject, signal } from '@angular/core';
import { ModalService } from '@services/modal.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '@services/employees.service';
import { NotificationService } from '@services/notifications.service';
import { EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { ModalRespose } from '@interfaces/ModalResponse';
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { createEmployeeDTO } from '@interfaces/Employees/CreateEmployeeDTO';
import { PhoneDirective } from '@directives/phone.directive';
import { InputFormComponent } from '@shared-components/forms/input-form/input-form.component';
import { SelectRolesFormComponent } from "@shared-components/forms/select-roles-form/select-roles-form.component";
import { LoadingButtonComponent } from "@shared-components/buttons/loading-button/loading-button.component";
import { EMAIL_REGEX, NAME_USER_REGEX } from 'config/regex';

@Component({
  selector: 'app-create-employee-modal',
  imports: [PhoneDirective, ReactiveFormsModule, BaseModalComponent, InputFormComponent, SelectRolesFormComponent, LoadingButtonComponent],
  templateUrl: './create-employee-modal.component.html',
})
export class CreateEmployeeModal {

  //* Injections
  private readonly _modalService = inject(ModalService);
  private readonly _employeeService = inject(EmployeesService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _fb = inject(FormBuilder);

  //* UI Variables
  _isLoading = signal<boolean>(false);

  //* Form
  _createEmployeeForm: FormGroup = this._fb.group({
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
    }),
    role: this._fb.control<string|null>(null,{
      validators: [Validators.required]
    })
  });

  _createEmployee(): void {

    this._isLoading.set(true);

     const formValue = this._createEmployeeForm.value;

     const newEmployee: createEmployeeDTO = {
       email: formValue.email,
       name: formValue.name,
       lastName: formValue.lastName,
       roleId: formValue.role,
       phone: formValue.phone?.replaceAll('-', '')
     };
    
    this._employeeService.createEmployee(newEmployee).subscribe({
      next: (res) => {
        this._notificationService.success('Registro Éxitoso', 'El empleado se registró correctamente');
        this._modalService.close<ModalRespose<EmployeeDTO>>({ hasChanges: true, data: res });
      },
      error: (err) => {
        const errorMessage =
          Object.values(err.error.errors || {}).flat()[0] ??
          err?.error?.message ??
          err?.error?.errorDetails ??
          err?.error?.title ??
          "Ocurrió un error al intentar registrar al empleado";

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  _close(): void {
    this._modalService.close<ModalRespose<EmployeeDTO | null>>({ hasChanges: false, data: null });
  }

}
