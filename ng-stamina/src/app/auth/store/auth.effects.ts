// state/auth/auth.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '../auth.service';
import { AuthUser, mapToAuthUser } from '../models/auth.model';
import { AuthResponse } from './auth.state';

export const authEffects = {
  login: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.login),
        exhaustMap(({ email, password }) =>
          authService.login(email, password ).pipe(
            tap((response: AuthResponse) => {
              localStorage.setItem('token', response.access_token);
              localStorage.setItem(
                'token_expires',
                String(Date.now() + response.expiresIn * 1000)
              );
            }),
            map((response: AuthResponse) =>
              AuthActions.loginSuccess({
                user: response.user,
                token: response.access_token,
              })
            ),
            catchError((error) =>
              of(AuthActions.loginFailure({ error: error.message }))
            )
          )
        )
      );
    },
    { functional: true }
  ),

  signup: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.signup),
        exhaustMap(({ email, password }) =>
          authService.signup(email, password ).pipe(
            map((response: AuthResponse) =>
              AuthActions.signupSuccess({
                user: response.user,
                token: response.access_token,
              })
            ),
            catchError((error) =>
              of(AuthActions.signupFailure({ error: error.message }))
            )
          )
        )
      );
    },
    { functional: true }
  ),

  signupSuccess: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(() => {
          console.log('success signup');
          router.navigate(['/auth/login']); // Navigation in effect
        })
      );
    },
    { functional: true, dispatch: false }
  ),
  loginSuccess: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => router.navigate(['/users']))
      );
    },
    { functional: true, dispatch: false }
  ),

  logout: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('auth_token');
          router.navigate(['/auth/login']);
        })
      );
    },
    { functional: true, dispatch: false }
  ),
};
