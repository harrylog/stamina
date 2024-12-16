import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/routes').then((m) => m.USER_ROUTES),
    // canActivate: [authGuard],
  },
];
