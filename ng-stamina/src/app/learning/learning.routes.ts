// learning.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth.guard';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./learning.component').then((m) => m.LearningComponent),
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import(
            './components/course/course-management/course-management.component'
          ).then((m) => m.CourseManagementComponent),
        canActivate: [authGuard],
      },
      {
        path: 'sections',
        loadComponent: () =>
          import(
            './components/section/section-management/section-management.component'
          ).then((m) => m.SectionManagementComponent),
      },
      {
        path: 'units',
        loadComponent: () =>
          import(
            './components/units/unit-management/unit-management.component'
          ).then((m) => m.UnitManagementComponent),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import(
            './components/question/question-management/question-management.component'
          ).then((m) => m.QuestionManagementComponent),
      },
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
];
