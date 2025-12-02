import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Token } from '../Interfaces/Authorization/TokenInterface';

export const authLoginGuard: CanActivateFn = (route, state) => {

  //- Injections
  const router = inject(Router);
  const authService = inject(AuthService);

  //- Validate Session
  const refreshToken = authService.getRefreshToken();

  if (!refreshToken) return true;


  //- Validate Token Expiration
  if (refreshToken) {

    const tokenExpiration = new Date(refreshToken.expiresAt);
    const now = new Date();

    if (now.getTime() > tokenExpiration.getTime()) {
      return true;
    }
    else {
      router.navigate(['/home']);
      return false;
    }
  }

  return true;
};
