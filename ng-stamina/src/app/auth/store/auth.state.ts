import { User } from '../../users/models/user.model';

// state/auth/auth.state.ts
export interface AuthState {
  user: User | null;
  token: string | null; // Add this
  tokenExpires: number | null; // Add this
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  tokenExpires: Number(localStorage.getItem('token_expires')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export interface AuthResponse {
  access_token: string;
  user: User;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
  roles?: string[];
}

// Optional: Interface for decoded JWT token
export interface TokenPayload {
  email: string;
  roles: string[];
  exp: number;
  iat: number;
  userId: string;
}
