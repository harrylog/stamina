import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Create User
    'Create User': props<{ user: Omit<User, 'id'> }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    // Update User
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Select User
    'Select User': props<{ id: string }>(),
  },
});
