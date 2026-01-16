import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../state/auth.selectors.js';

// Prevent authenticated users from visiting the login page; send them to dashboard instead.
export const loginRedirectGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    map((isAuthed) => (isAuthed ? router.createUrlTree(['/dashboard']) : true)),
  );
};
