// state/auth/auth.model.ts
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
  }
  
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }

  export interface AuthApiResponse {
    id: string;  // Changed to string to match your User type
    email: string;
    name?: string;
    token?: string;
    access_token?: string;
    // ... any other fields from your API
  }

  export function mapToAuthUser(response: AuthApiResponse): AuthUser {
    return {
      id: response.id,
      email: response.email,
      name: response.name || '',
      token: response.token || response.access_token || '',
    };
  }