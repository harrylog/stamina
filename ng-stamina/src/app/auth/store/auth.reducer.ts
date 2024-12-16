// state/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  tokenExpires: null
};

export const authReducer = createReducer(
  initialState,
  
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  

  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),
  
  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.signupSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),


  on(AuthActions.logout, () => initialState)
);