import { Routes } from '@angular/router';

export const LEARNING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./learning.component').then((m) => m.LearningComponent),
    data: { title: 'learning' },
  },
];
