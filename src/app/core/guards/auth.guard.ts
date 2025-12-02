import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  //- Injections
  const router = inject(Router);
  const authService = inject(AuthService);

  //- Validate Session
  const refreshToken = authService.getRefreshToken();
  if (!refreshToken) {
    router.navigate(['/login']);
    return false;
  }

  //- Validate Token Expiration
  const now = new Date();
  const tokenExpiration = new Date(refreshToken!.expiresAt);
  if (now.getTime() >= tokenExpiration.getTime()) {
    authService.deleteSession();
    router.navigate(['/login']);
    return false;
  }

  return true;
};
