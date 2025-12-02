import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isAdminOrManager } from '@utils/userAuth';


export const productsAccessGuard: CanActivateFn = (route, state) => {

  //- Injections
  const router = inject(Router);

  if (!isAdminOrManager()) {
    router.navigate(['/home/products-catalog']);
    return false
  }

  return true;
};
