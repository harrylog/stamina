import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
  },
];
