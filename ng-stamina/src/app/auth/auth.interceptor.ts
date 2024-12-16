import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthActions } from './store/auth.actions';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const store = inject(Store);
  const router = inject(Router);

  // Check token expiration
  const expires = localStorage.getItem('token_expires');
  if (expires && Number(expires) < Date.now()) {
    // Token expired
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    store.dispatch(AuthActions.logout());
    return next(req);
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('token_expires');
          store.dispatch(AuthActions.logout());
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
