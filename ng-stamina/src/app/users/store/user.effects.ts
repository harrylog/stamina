import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { UserActions } from './user.actions';
import { Store } from '@ngrx/store';
import { selectRouteParam } from '../../router.selectors';
import { UserService } from '../services/users.service';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      mergeMap(({ user }) =>
        this.userService.createUser(user).pipe(
          map((newUser) => UserActions.createUserSuccess({ user: newUser })),
          catchError((error) =>
            of(UserActions.createUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.store.select(selectRouteParam('id')).pipe(
      filter((id): id is string => id !== undefined && id !== null),
      map((id) => UserActions.selectUser({ id }))
    )
  );

  // Add other effects for update and delete...
}
