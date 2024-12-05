import { Component, inject } from '@angular/core';
import { selectQueryParam, selectRouteParam } from '../../../router.selectors';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/user.selectors';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  private store = inject(Store);

  // Get route parameters
  userId$ = this.store.select(selectRouteParam('id'));

  // Get query parameters
  sortBy$ = this.store.select(selectQueryParam('sort'));

  currentUser$ = this.store.select(selectCurrentUser);
}
