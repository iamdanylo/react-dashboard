import { PayloadAction } from '@reduxjs/toolkit';
import usersApi from 'api/users';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { usersActions } from 'redux/reducers/users';
import {
  GetUserByIdRequest,
  GetUserByIdResponse,
  GetUsersResponse,
  GetUsersRequest,
  GetUserCheckinsResponse,
  GetUserReferralsResponse,
} from 'types/users';

function* getUsers(data: PayloadAction<GetUsersRequest>) {
  try {
    const response: GetUsersResponse = yield call(
      usersApi.getUsers,
      data.payload
    );
    yield put(usersActions.getUsersSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch users`, error);
    if (axios.isAxiosError(error)) {
      yield put(usersActions.getUsersFailed(error.response?.data.message));
    }
  }
};

function* getUserById(data: PayloadAction<GetUserByIdRequest>) {
  try {
    const response: GetUserByIdResponse = yield call(
      usersApi.getUserById,
      data.payload
    );
    yield put(usersActions.getUserByIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch place by id`, error);
    if (axios.isAxiosError(error)) {
      yield put(usersActions.getUserByIdFailed(error.response?.data.message));
    }
  }
};

function* getUserCheckins(data: PayloadAction<GetUserByIdRequest>) {
  try {
    const response: GetUserCheckinsResponse = yield call(
      usersApi.getUserCheckins,
      data.payload
    );
    yield put(usersActions.getUserCheckinsSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch user's checkins`, error);
    if (axios.isAxiosError(error)) {
      yield put(
        usersActions.getUserCheckinsFailed(error.response?.data.message)
      );
    }
  }
};

function* getUserReferrals(data: PayloadAction<GetUserByIdRequest>) {
  try {
    const response: GetUserReferralsResponse = yield call(
      usersApi.getUserReferrals,
      data.payload
    );
    yield put(usersActions.getUserReferralsSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch user's referrals`, error);
    if (axios.isAxiosError(error)) {
      yield put(
        usersActions.getUserReferralsFailed(error.response?.data.message)
      );
    }
  }
};

function* approveUser(data: PayloadAction<GetUserByIdRequest>) {
  try {
    yield call(
      usersApi.approveUser,
      data.payload
    );
    const response: GetUserByIdResponse = yield call(
      usersApi.getUserById,
      data.payload
    );
    yield put(usersActions.getUserByIdSuccess(response));
    yield put(usersActions.approveUserSuccess());
  } catch (error) {
    console.log(`Failed to approve user`, error);
    if (axios.isAxiosError(error)) {
      yield put(usersActions.approveUserError(error.response?.data.message));
    }
  }
};

export default function* usersSaga() {
  yield takeLatest(usersActions.getUsers.type, getUsers);
  yield takeLatest(usersActions.getUserById.type, getUserById);
  yield takeLatest(usersActions.getUserCheckins.type, getUserCheckins);
  yield takeLatest(usersActions.getUserReferrals.type, getUserReferrals);
  yield takeLatest(usersActions.approveUser.type, approveUser);
};
