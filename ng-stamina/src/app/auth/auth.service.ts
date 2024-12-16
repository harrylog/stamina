import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments';
import { User } from '../users/models/user.model';
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from './store/auth.state';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private user$ = new BehaviorSubject<User | null>(null);
  private apiUrl = `${environment.apis.auth}`;

  login(email: string, password: string) {
    return this.http.post<{
      access_token: string;
      user: User;
      expiresIn: number;
    }>(
      `${this.apiUrl}/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );
  }

  signup(email: string, password: string) {
    return this.http.post<{
      access_token: string;
      user: User;
      expiresIn: number;
    }>(
      `${this.apiUrl}/signup`,
      { email, password },
      {
        withCredentials: true,
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('token_expires');

    if (!token || !expires) return false;
    return Number(expires) > Date.now();
  }

  getToken(): string | null {
    return this.isTokenValid() ? localStorage.getItem('token') : null;
  }
}
