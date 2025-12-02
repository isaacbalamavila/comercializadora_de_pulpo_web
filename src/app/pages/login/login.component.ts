import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { PasswordInputComponent } from "@custom-inputs/password-input/password-input.component";
import { EmailInputComponent } from '@custom-inputs/email-input/email-input.component';
import { ErrorSpanComponent } from "@error-handlers/error-span/error-span.component";
import { SmallLoaderComponent } from '@loaders/small-loader/small-loader.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { LoginRequest } from '@interfaces/Authorization/LoginRequest';
import { ErrorResponse } from '@interfaces/ErrorInterface';
import { Router, RouterLink } from '@angular/router';
import { Tokens } from '@interfaces/Authorization/TokensInterfaces';
import { UserInfo } from '@interfaces/UserInfo';
import { Roles } from 'config/roles';

@Component({
  selector: 'app-login',
  imports: [
    PasswordInputComponent,
    EmailInputComponent,
    ErrorSpanComponent,
    SmallLoaderComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {

  //* Injections
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  //* UI Variables
  error = signal<ErrorResponse | null>(null);
  isLoading = signal(false);
  tryings = 0;
  maxTryings = 3;
  refreshTryingsTime = 1.5 * 60; // 1.5 min → segundos
  remainTime = signal<string>('');

  //* Form Variables
  email: string | null = null;
  password: string | null = null;

  private intervalId: any = null;

  ngOnInit(): void {

    //- Verify Previous Tryings
    const tryingsSaved = Number(localStorage.getItem('tryings') || 0);
    this.tryings = tryingsSaved;

    if (this.tryings >= this.maxTryings) {
      this.startTryingsTimer();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startTryingsTimer(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    let remaining = Number(localStorage.getItem('timeRemaining') || this.refreshTryingsTime);

    this.intervalId = setInterval(() => {
      remaining--;
      localStorage.setItem('timeRemaining', remaining.toString());

      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      this.remainTime.set(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

      if (remaining <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.error.set(null);
        this.tryings = 0;
        localStorage.removeItem('tryings');
        localStorage.removeItem('timeRemaining');
      } else {
        this.error.set({
          title: `Has alcanzado el número máximo de intentos. Vuelve a intentarlo en ${this.remainTime()}.`,
          errorDetails: ''
        });
      }
    }, 1000);
  }

  login(): void {
    if (this.tryings >= this.maxTryings) {
      this.startTryingsTimer();
      return;
    }

    this.isLoading.set(true);

    const body: LoginRequest = { email: this.email!, password: this.password! };

    this.authService.login(body).subscribe({
      next: (res) => {
        //! Verficar los roles
        if (res.role == Roles.warehouse) {
          this.error.set({ title: 'Usuario sin acceso a la aplicación Web' });
        }
        else {
          //- Save Tokens
          const tokens: Tokens = {
            accessToken: {
              token: res.accessToken,
              expiresAt: res.accessTokenExpiratesAt
            },
            refreshToken: {
              token: res.refreshToken,
              expiresAt: res.refreshTokenExpiresAt
            }
          };
          this.authService.saveTokens(tokens);

          //- Save User
          const user: UserInfo = {
            id: res.id,
            email: res.email,
            name: res.userName,
            lastName: res.userLastName,
            roleId: res.roleId,
            role: res.role,
            firstLogin: res.firstLogin
          };
          this.authService.saveUser(user);

          //- Reset Tryings
          localStorage.removeItem('tryings');
          localStorage.removeItem('timeRemaining');

          this.router.navigate(['/home']);
        }
      },
      error: (errResponse) => {
        console.error(errResponse);
        this.error.set({ title: errResponse.error.message });
        this.tryings++;

        //- Save Tryings
        localStorage.setItem('tryings', this.tryings.toString());
        this.isLoading.set(false);

        //- Verify Tryings
        if (this.tryings >= this.maxTryings) {
          this.startTryingsTimer();
        }
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
