import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../environments';
import { User } from '../users/models/user.model';
interface LoginResponse {
  access_token: string;
  user: User;
  expiresIn?: number;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private user$ = new BehaviorSubject<User | null>(null);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((response: LoginResponse) => {
          // Store the token
          localStorage.setItem('auth_token', response.access_token);
          // Update the user subject
          this.user$.next(response.user);
        }),
        map((response: LoginResponse) => response.user) // Return just the user for the store
      );
  }

  signup(email: string, password: string, name?: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, {
      email,
      password,
    });
  }
  logout() {
    this.user$.next(null);
  }

  getUser() {
    return this.user$.asObservable();
  }
}
