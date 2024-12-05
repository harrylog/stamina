import { User } from '../../users/models/user.model';

// state/auth/auth.state.ts
export interface AuthState {
  user: User | null; // Use your existing User type instead of AuthUser
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null, // Use your existing User type instead of AuthUser
  isAuthenticated: false,
  loading: false,
  error: null,
};
