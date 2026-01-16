// guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap, take, of } from 'rxjs';
import { selectIsAuthenticated } from '../store/auth.selectors';
import { environment } from '../../../environments/environment';

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  // In dev mode, bypass auth guard (auto-login happens in background)
  if (environment.devMode) {
    return of(true);
  }

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    }),
    map((isAuthenticated) => isAuthenticated)
  );
};
