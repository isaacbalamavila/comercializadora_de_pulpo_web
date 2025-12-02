import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { EmployeesService } from '../../core/services/employees.service';
import { EmployeeDetailsDTO, EmployeeDTO } from '@interfaces/Employees/EmployeesDTO';
import { UserAvatarSquareComponent } from "@base-ui/user-avatar/user-avatar.component";
import { DatePipe } from '@angular/common';
import { PageLoaderComponent } from '@loaders/page-loader/page-loader.component';
import { PasswordInputComponent } from "@custom-inputs/password-input/password-input.component";
import { FormsModule } from '@angular/forms';
import { NotificationService } from '@services/notifications.service';
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { PageErrorComponent } from '@error-handlers/page-error/page-error.component';
import { ValidationTextComponent } from '@forms/validation-text/validation-text.component';

@Component({
  selector: 'app-account-settings',
  imports: [UserAvatarSquareComponent, DatePipe, PageLoaderComponent, PasswordInputComponent,
    FormsModule, SmallLoaderComponent, PageErrorComponent, ValidationTextComponent],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {

  //- Injections
  authService = inject(AuthService);
  employeeService = inject(EmployeesService);
  notificationService = inject(NotificationService);

  //* Data Variables
  user: EmployeeDetailsDTO | null = null;

  //- UI Variables
  isLoading: boolean = true;
  newPassword: string | null = null;
  newPasswordConfirmation: string | null = null;
  requestLoading: boolean = false;
  error: ErrorResponse | null = null;
  userLabel!: string;

  //- Validation Variables
  equalPasswords: boolean = false;
  passwordMininumLeght: boolean = false;
  passwordHasSpecialCharacters: boolean = false;
  passwordHasMayus: boolean = false;
  specialCharactersRegex = /(?=.*[!@#$%^&(),.?\"{}|<>_\-+=])/;
  mayusRegex = /(?=.*[A-Z])/;
  specialCharacterMessage = 'La contraseña debe incluir al menos un carácter especial (!@#$%^&(),.?{}|<>_-+=).';

  ngOnInit(): void {
    const saveUser = this.authService.getUser();
    this.userLabel = saveUser ? saveUser.name.substring(0, 1) + saveUser.lastName.substring(0, 1) : 'NA';

    saveUser
      ? this.getUserInfo(saveUser.id)
      : this.error = {
        statusCode: 404, title: "Usuario no Encontrado"
      }


  }

  //** Change Password
  changePassword(): void {

    if (!this.user) {
      return;
    }

    this.requestLoading = true;

    this.employeeService.changePassword(this.user!.id, this.newPassword!).subscribe({
      next: (res) => {

        //* Save Session
        let user = this.authService.getUser();
        if (user) {
          user.firstLogin = false;
          this.authService.saveUser(user);
        }
        this.newPassword = null;
        this.newPasswordConfirmation = null;

        //* Clear Validations
        this.equalPasswords = false;
        this.passwordMininumLeght = false;
        this.passwordHasSpecialCharacters = false;
        this.passwordHasMayus = false;

        //* Show Notification
        this.notificationService.success("¡Contraseña Actualizada!", "La contraseña se ha actualizado con éxito.");
      },
      error: (err) => {
        console.log(err)

        //* Show Notification
        const errorMessage =
          err?.error?.errors?.NewPassword?.[0] ??
          err?.error?.title ??
          "Ocurrió un error al intentar actualizar la contraseña";

        this.notificationService.error("¡Ocurrió un error!", errorMessage);

        this.requestLoading = false;
      },
      complete: () => this.requestLoading = false
    });
  }

  //** Get User Info
  getUserInfo(id: string): void {
    this.isLoading = true;

    this.employeeService.getEmployee(id).subscribe({
      next: (res) => {
        this.user = res;
        this.user!.phone = this.FormatedPhone(res.phone);
        this.userLabel = this.user ? this.user?.name.substring(0, 1) + this.user.lastName.substring(0, 1) : "NA";
      },
      error: (err) => {
        console.log(err)
        this.error = { statusCode: err.status, title: "¡Ocurrio un Error!" };
      },
      complete: () => this.isLoading = false
    });

  }

  verifyPasswords(): void {
    this.equalPasswords = !!(
      this.newPassword &&
      this.newPasswordConfirmation &&
      this.newPassword === this.newPasswordConfirmation
    );

    this.passwordMininumLeght = !!(this.newPassword && this.newPassword.length >= 8);

    this.passwordHasSpecialCharacters = this.specialCharactersRegex.test(this.newPassword!);

    this.passwordHasMayus = this.mayusRegex.test(this.newPassword!);
  }

  isValidPassword(): boolean {
    return !!(this.equalPasswords && this.passwordMininumLeght && this.passwordHasSpecialCharacters
      && this.passwordHasMayus && this.newPassword && this.newPasswordConfirmation);
  }

  FormatedPhone(phone: string | null): string | null {
    return phone ? `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}` : null;
  }

}
