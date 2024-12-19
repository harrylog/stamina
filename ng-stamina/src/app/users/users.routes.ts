import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
    data: { title: 'Users List' },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
    data: {
      isEditMode: false,
      title: 'Create New User',
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
    data: { title: 'User Details' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/user-form/user-form.component').then(
        (m) => m.UserFormComponent
      ),
    data: {
      isEditMode: true,
      title: 'Edit User',
    },
  },
];
