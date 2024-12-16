import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { selectUsers, selectLoading } from '../../store/user.selectors';
import { UserActions } from '../../store/user.actions';
import {
  RouterNavigatedAction,
  routerNavigatedAction,
} from '@ngrx/router-store';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  loading$ = this.store.select(selectLoading);

  // Fixed dataSource to always be an array
  users$ = this.store.select(selectUsers).pipe(
    map((users) => {
      if (!users) return [];
      return users.map((usr) => ({
        ...usr,
        name: usr.email?.split('@')[0] || 'No name',
      }));
    }),
    catchError((error) => {
      console.error('Error loading users:', error);
      return of([]);
    })
  );

  displayedColumns = ['name', 'email', 'roles', 'ops'];

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(UserActions.deleteUser({ id }));
    }
  }
  navigateToUser(id: string) {
    // Both will be tracked in the store
    this.router.navigate(['/users', id]);
  }
}
