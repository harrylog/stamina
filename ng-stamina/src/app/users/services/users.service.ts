// services/real-user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  CreateUserDto,
  UpdateUserDto,
  User,
  UserResponseDto,
  UsersResponse,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apis.users}`; // You'll define this in your environment

  private transformResponse(user: UserResponseDto): UserResponseDto {
    return {
      ...user,
      id: user._id, // Add id while keeping _id
    };
  }

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}`).pipe(
      map((response) => ({
        ...response,
        users: response.users.map(this.transformResponse),
      }))
    );
  }
  getUser(id: string): Observable<UserResponseDto> {
    return this.http
      .get<UserResponseDto>(`${this.apiUrl}/${id}`, {
        withCredentials: true,
      })
      .pipe(map(this.transformResponse));
  }

  getUserByEmail(email: string): Observable<UserResponseDto> {
    return this.http
      .get<UserResponseDto>(`${this.apiUrl}/email/${email}`, {
        withCredentials: true,
      })
      .pipe(map(this.transformResponse));
  }

  createUser(user: CreateUserDto): Observable<UserResponseDto> {
    return this.http
      .post<UserResponseDto>(this.apiUrl, user, {
        withCredentials: true,
      })
      .pipe(map(this.transformResponse));
  }

  updateUser(id: string, user: UpdateUserDto): Observable<UserResponseDto> {
    // Remove id from update payload if it exists
    const { ...updateData } = user;
    return this.http
      .put<UserResponseDto>(`${this.apiUrl}/${id}`, updateData, {
        withCredentials: true,
      })
      .pipe(map(this.transformResponse));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  verifyUser(
    email: string,
    password: string
  ): Observable<Omit<UserResponseDto, 'password'>> {
    return this.http
      .post<Omit<UserResponseDto, 'password'>>(
        `${this.apiUrl}/verify`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((user) => ({
          ...user,
          id: user._id,
        }))
      );
  }
}
