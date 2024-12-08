import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../mock-data/users.data';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [...MOCK_USERS];
  private delay = 500; // Simulate network delay

  private http = inject(HttpClient);
  private apiUrl = 'your-api-endpoint/users'; // Replace with your API endpoint

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(this.delay));
  }

  getUser(id: number): Observable<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    return of(user).pipe(delay(this.delay));
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = {
      ...user,
      id: this.getNextId(),
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(this.delay));
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    this.users[index] = { ...user };
    return of(this.users[index]).pipe(delay(this.delay));
  }

  deleteUser(id: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    this.users.splice(index, 1);
    return of(void 0).pipe(delay(this.delay));
  }

  private getNextId(): number {
    return Math.max(...this.users.map((user) => user.id)) + 1;
  }
}
