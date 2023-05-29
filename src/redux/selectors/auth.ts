import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { AuthState } from 'redux/reducers/auth';

export const authSelector = (state: RootState): AuthState => state.auth;

export const currentUserSelector = createSelector(
  authSelector,
  (auth) => auth.currentUser
);

export const authErrorSelector = createSelector(
  authSelector,
  (auth) => auth.error
);

export const authLoadingSelector = createSelector(
  authSelector,
  (auth) => auth.loading
);