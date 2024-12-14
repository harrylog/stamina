// services/real-user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apis.users}`; // You'll define this in your environment

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.apiUrl);
  // }

  getUsers(
    page = 1,
    limit = 10
  ): Observable<{
    users?: User[];
    total?: number;
    page?: number;
    totalPages?: number;
  }> {
    return this.http
      .get<{ users: User[]; total: number; page: number; totalPages: number }>(
        `${this.apiUrl}/users`,
        {
          params: new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString()),
          withCredentials: true, // Add this to send cookies
        }
      )
      .pipe(
        map((response) => ({
          ...response,
          users: response.users.map((user) => ({
            ...user,
            id: user._id, // Map MongoDB _id to id for frontend consistency
          })),
        }))
      );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
