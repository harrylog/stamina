// state/auth/auth.actions.ts
import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { AuthUser } from '../models/auth.model';
import { User } from '../../users/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    // Signup
    Signup: props<{ email: string; password: string;  }>(),
    'Signup Success': props<{ user: User }>(),
    'Signup Failure': props<{ error: string }>(),

    // Logout
    Logout: emptyProps(),
    'Logout Success': emptyProps(),

    // Check Auth Status
    'Check Auth': emptyProps(),
  },
});
