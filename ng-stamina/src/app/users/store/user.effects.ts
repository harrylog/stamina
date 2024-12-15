import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, filter } from 'rxjs/operators';
import { UserActions } from './user.actions';
import { Store } from '@ngrx/store';
import { selectRouteParam } from '../../router.selectors';
import { UserService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../models/user.model';

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
          map((response) => UserActions.loadUsersSuccess({ response })),
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
        this.userService.createUser(user as CreateUserDto).pipe(
          map((user) => UserActions.createUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.createUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ id, user }) =>
        this.userService.updateUser(id, user as UpdateUserDto).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => UserActions.deleteUserSuccess({ id })),
          catchError((error) =>
            of(UserActions.deleteUserFailure({ error: error.message }))
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

  verifyUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.verifyUser),
      mergeMap(({ email, password }) =>
        this.userService.verifyUser(email, password).pipe(
          map((user) => UserActions.verifyUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.verifyUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Add other effects for update and delete...
}
