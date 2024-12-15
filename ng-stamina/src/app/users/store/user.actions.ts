import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserResponseDto,
  UsersResponse,
} from '../models/user.model';
export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ response: UsersResponse }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Create User
    'Create User': props<{ user: CreateUserDto }>(),
    'Create User Success': props<{ user: UserResponseDto }>(),
    'Create User Failure': props<{ error: string }>(),

    // Update User
    'Update User': props<{ id: string; user: UpdateUserDto }>(),
    'Update User Success': props<{ user: UserResponseDto }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Select User
    'Select User': props<{ id: string }>(),

    // Verify User
    'Verify User': props<{ email: string; password: string }>(),
    'Verify User Success': props<{ user: Omit<UserResponseDto, 'password'> }>(),
    'Verify User Failure': props<{ error: string }>(),
  },
});
