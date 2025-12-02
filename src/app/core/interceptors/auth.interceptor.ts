import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ⛔ Evitar que el refresh vuelva a pasar por el interceptor
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();

  if (!accessToken) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken.token}` },
  });

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.deleteSession();
          router.navigate(['/login']);
          return throwError(() => err);
        }

        return authService.refreshAccessTokenRequest(refreshToken.token).pipe(
          switchMap((res) => {
            authService.saveNewAccessToken(res);

            const newReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            });

            return next(newReq);
          }),
          catchError((refreshErr) => {
            authService.deleteSession();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
