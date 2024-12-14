import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments';
import { User } from '../users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private http = inject(HttpClient);
  private user$ = new BehaviorSubject<User | null>(null);
  private apiUrl = `${environment.apis.auth}`;

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, {
      email,
      password,
    });
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
