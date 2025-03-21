import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectUserState = (state: RootState) => state.user;

export const selectCurrentUser = createSelector(
  [selectUserState],
  (userState) => userState.currentUser
);

export const selectUserLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectUserError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

export const selectIsAuthenticated = createSelector(
  [selectUserState],
  (userState) => !!userState.currentUser
); 