import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserResponseDto } from '../models/user.model';

export interface UserState {
  users: UserResponseDto[]; // Updated to use UserResponseDto
  selectedUserId: string;
  loading: boolean;
  error: string | null;
  total: number; // Added to match our UsersResponse
}

export const initialState: UserState = {
  users: [],
  selectedUserId: '',
  loading: false,
  error: null,
  total: 0,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
  })),
  // Here's the fix - destructure 'response' instead of 'users'
  on(UserActions.loadUsersSuccess, (state, { response }) => ({
    ...state,
    users: response.users,
    loading: false,
    error: null,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    selectedUserId: id,
  }))
);
