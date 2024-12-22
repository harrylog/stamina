// learning.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import(
            './components/course/course-management/course-management.component'
          ).then((m) => m.CourseManagementComponent),
        // canActivate: [authGuard],
      },
      // Future routes for sections, units, etc.
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
];
