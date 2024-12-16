import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, switchMap, take } from 'rxjs';
import { selectRouteParam } from '../../../router.selectors';
import { UserActions } from '../../store/user.actions';
import { User } from '../../models/user.model';
import { selectCurrentUser, selectSelectedUserId } from '../../store/user.selectors';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  userId$ = this.store.select(selectRouteParam('id'));
  currentUser$ = this.store.select(selectCurrentUser);

  

  ngOnInit() {
    // Load user details when component initializes
    this.userId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        this.store.dispatch(UserActions.selectUser({ id }));
      }
    });
  }

  goBack() {
    this.router.navigate(['/users']);
  }
}
