import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { UsersState } from 'redux/reducers/users';

export const usersSelector = (state: RootState): UsersState => state.users;

export const allUsersSelector = createSelector(
  usersSelector,
  (users) => users.users
);

export const selectedUserSelector = createSelector(
  usersSelector,
  (users) => users.selectedUser
);

export const userByIdSelector = (memberId: string) =>
  createSelector(usersSelector, (users) =>
    users.users.find((user) => user._id === memberId)
  );

export const totalUsersSelector = createSelector(
  usersSelector,
  (users) => users.totalUsers
);

export const usersLoadingSelector = createSelector(
  usersSelector,
  (users) => users.loading
);

export const selectedUserReferralsSelector = createSelector(
  usersSelector,
  (users) => users.selectedUserReferrals
);

export const selectedUserCheckinsSelector = createSelector(
  usersSelector,
  (users) => users.selectedUserCheckins
);

export const usersErrorSelector = createSelector(
  usersSelector,
  (users) => users.error
);
