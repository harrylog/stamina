import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments';

interface User {
  email: string;
  id: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private user$ = new BehaviorSubject<User | null>(null);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string) {
    return this.http
      .post<User>(
        `${this.apiUrl}/signin`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          // observe: 'response', 
        }
      )
      .pipe(
        tap((user) => this.user$.next(user)),
        tap({
          error: (error) => console.error('Signup error:', error),
        })
      );
  }

  signup(email: string, password: string) {
    return this.http
      .post<User>(
        `${this.apiUrl}/signup`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(tap((user) => this.user$.next(user)));
  }

  logout() {
    this.user$.next(null);
  }

  getUser() {
    return this.user$.asObservable();
  }
}
