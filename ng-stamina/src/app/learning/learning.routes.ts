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
      {
        path: 'sections',
        loadComponent: () =>
          import(
            './components/section/section-management/section-management.component'
          ).then((m) => m.SectionManagementComponent),
      },
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
];
