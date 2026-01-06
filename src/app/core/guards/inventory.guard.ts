import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isAdminOrManager } from '@utils/userAuth';

export const inventoryGuard: CanActivateFn = (route, state) => {
    //- Injections
  const router = inject(Router);

  if (!isAdminOrManager()) {
    router.navigate(['/home/inventory']);
    return false
  }

  return true;
};
