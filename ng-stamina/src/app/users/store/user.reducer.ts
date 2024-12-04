import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { UserActions } from './user.actions';

export interface UserState {
  users: User[];
  selectedUserId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  selectedUserId: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // Add other action handlers...
  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    selectedUserId: id,
  }))
);
