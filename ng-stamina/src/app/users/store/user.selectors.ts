import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { selectRouteParam } from '../../router.selectors';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectSelectedUserId = createSelector(
  selectUserState,
  (state) => state.selectedUserId
);

export const selectSelectedUser = createSelector(
  selectUsers,
  selectSelectedUserId,
  (users, selectedId) => users.find((user) => user.id === selectedId)
);

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectCurrentUser = createSelector(
  selectRouteParam('id'),
  selectUsers,
  (userId, users) => users.find((user) => user.id === Number(userId))
);
