import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EditEmployeeModal } from '@employee-modals/edit-employee/edit-employee.component';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { EmployeeDetailsDTO, EmployeeDTO, EmployeeDTOFromDetails } from '@interfaces/Employees/EmployeesDTO';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { EmployeesService } from '@services/employees.service';
import { ModalService } from '@services/modal.service';
import { NotificationService } from '@services/notifications.service';
import { ConfirmDialogComponent } from '@shared-components/confirm-dialog/confirm-dialog.component';
import { CopyButtonComponent } from '@helpers/copy-button/copy-button.component';
import { EmailButtonComponent } from '@helpers/email-button/email-button.component';
import { filter, switchMap } from 'rxjs';
import { ModalRespose } from '@interfaces/ModalResponse';
import { popupAnimation } from '@animations';
import { phoneFormatter } from '@utils/phone-formatter';
import { BaseModalComponent } from "@base-ui/base-modal/base-modal.component";
import { LoadingButtonComponent } from "@shared-components/buttons/loading-button/loading-button.component";

@Component({
  selector: 'app-view-employee-details',
  imports: [PageLoaderComponent, PageErrorComponent, CopyButtonComponent, EmailButtonComponent, DatePipe,
    BaseModalComponent, LoadingButtonComponent],
  animations: [popupAnimation],
  templateUrl: './view-employee-details.component.html',
})
export class ViewEmployeeDetailsModal implements OnInit {

  //* Injections
  _modalService = inject(ModalService);
  _employeeService = inject(EmployeesService);
  _notificationService = inject(NotificationService);

  //* Data Variables
  originalEmployee!: EmployeeDTO;
  _employee = signal<EmployeeDetailsDTO | null>(null);
  _hasChanges = computed(() => {
    const original = this.originalEmployee;
    const current = this._employee();

    return original.email != current!.email
      || original.name != current!.name
      || original.lastName != current!.lastName
      || (original.phone ?? null) != (current!.phone ?? null)
      || original.isDeleted != current!.isDeleted
  }
  );

  //* UI Variables
  _isLoading = signal<boolean>(true);
  _deleteLoading = signal<boolean>(false);
  _restoreLoading = signal<boolean>(false);
  _resetLoading = signal<boolean>(false);
  _error = signal<ErrorResponse | null>(null);

  //* Component Init
  ngOnInit(): void {
    this._getEmployeeDetails();
  }

  //* Get Employee
  _getEmployeeDetails(): void {
    this._isLoading.set(true);
    this._employeeService.getEmployee(this.originalEmployee.id).subscribe({
      next: (res) => {
        res.phone = res.phone ? phoneFormatter(res.phone) : '';
        this._employee.set(res);
      },
      error: (err) => {
        this._error.set({ statusCode: err.status, title: '' });
        this._isLoading.set(false);
      },
      complete: () => this._isLoading.set(false)
    });
  }

  //* Edit Employee
  editEmployee(): void {
    this._modalService.open(EditEmployeeModal, { originalEmployee: this._employee()! }).subscribe({
      next: (res: ModalRespose<EmployeeDetailsDTO | null>) => {
        if (res.hasChanges && res.data) {
          res.data.phone = phoneFormatter(res.data.phone);
          this._employee.set(res.data);
        }

      }
    });
  }

  //* Delete Employee
  _deleteEmployee(): void {
    this._deleteLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Dar de Baja al Empleado',
      message: '¿Estás seguro de dar de baja a este empleado?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._employeeService.deleteEmployee(this.originalEmployee.id))
    ).subscribe({
      next: () => {
        this._employee.update(emp => ({ ...emp!, isDeleted: true }));
        this._notificationService.success(
          'Empleado dado de Baja',
          `Se dio de baja con éxito al empleado "${this._employee()!.name} ${this._employee()!.lastName}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar dar de baja al empleado';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._deleteLoading.set(false);
      },
      complete: () => this._deleteLoading.set(false)
    });

  }

  //* Restore Employee
  _restoreEmployee(): void {
    this._restoreLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Restaurar Empleado',
      message: '¿Deseas restaurar a este empleado?'
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._employeeService.restoreEmployee(this.originalEmployee.id))
    ).subscribe({
      next: () => {
        this._employee.update(emp => ({ ...emp!, isDeleted: false }));
        this._notificationService.success(
          'Empleado Restaurado',
          `Se restauró con éxito al empleado "${this._employee()!.name} ${this._employee()!.lastName}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar restaurar al empleado';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._restoreLoading.set(false);
      },
      complete: () => this._restoreLoading.set(false)
    });

  }

  //* Reset Password
  _resetPassword(): void {

    this._resetLoading.set(true);

    this._modalService.open(ConfirmDialogComponent, {
      title: 'Restablecer Contraseña',
      message: '¿Estás seguro de restablecer la contraseña de este empleado?',
    }).pipe(
      filter((confirmation: boolean) => confirmation),
      switchMap(() => this._employeeService.resetEmployeePassword(this.originalEmployee.id))
    ).subscribe({
      next: () => {
        this._notificationService.success(
          'Contraseña Restaurada',
          `Se restauró con éxito la contraseña de "${this._employee()!.name} ${this._employee()!.lastName}".`
        );
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ??
          err?.error?.title ??
          'Ocurrió un error al intentar restablecer la contraseña';

        this._notificationService.error('Ocurrió un Error', errorMessage);
        this._resetLoading.set(false);
      },
      complete: () => this._resetLoading.set(false)
    });
  }

  //* Close & Check Changes
  _close(): void {

    if (this._error()) {
      this._modalService.close<ModalRespose<EmployeeDTO | null>>({ hasChanges: false, data: null });
    }

    if (this._hasChanges()) {
      const updateEmployee: EmployeeDTO = EmployeeDTOFromDetails(this._employee()!);
      this._modalService.close<ModalRespose<EmployeeDTO | null>>({ hasChanges: true, data: updateEmployee });
    }
    this._modalService.close<ModalRespose<EmployeeDTO | null>>({ hasChanges: false, data: null });
  }



}
