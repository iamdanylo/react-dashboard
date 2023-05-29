import { all } from 'redux-saga/effects';
import authSaga from 'sagas/authSaga';
import placesSaga from 'sagas/placesSaga';
import usersSaga from 'sagas/usersSaga';
import productsSaga from 'sagas/productsSaga';
import partnersSaga from 'sagas/partnersSaga';
import checkinsSaga from 'sagas/checkinsSaga';
import experiencesSaga from 'sagas/experiencesSaga';
import citiesSaga from 'sagas/citiesSaga';

export default function* rootSaga() {
  yield all([authSaga(), placesSaga(), usersSaga(), productsSaga(), partnersSaga(), checkinsSaga(), experiencesSaga(), citiesSaga()]);
}