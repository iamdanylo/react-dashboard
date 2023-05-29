import { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'api/auth';
import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { authActions } from 'redux/reducers/auth';
import { CurrentUserResponse, LoginRequest, LoginResponse } from 'types/auth';
import { ACCESS_TOKEN } from 'utils/storageKeys';
import history from 'utils/route-history';

function* login(data: PayloadAction<LoginRequest>) {
  try {
    const response: LoginResponse = yield call(authApi.login, data.payload);
    yield put(authActions.loginSuccess(response));
    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
    history.push('/');
  } catch (error) {
    console.log(`Failed to login`, error);
    if (axios.isAxiosError(error)) {
      yield put(authActions.loginFailed(error.response?.data.message));
    }
  }
}

function* getCurrentUser() {
  try {
    const response: CurrentUserResponse = yield call(authApi.getCurrentUser);
    yield put(authActions.getCurrentUserSuccess(response));
  } catch (error) {
    console.log(`Failed to get current user`, error);
    if (axios.isAxiosError(error)) {
      yield put(authActions.getCurrentUserFailed(error.response?.data.message));
    }
  }
};

export default function* authSaga() {
  yield takeLatest(authActions.login.type, login);
  yield takeLatest(authActions.getCurrentUser.type, getCurrentUser);
}
