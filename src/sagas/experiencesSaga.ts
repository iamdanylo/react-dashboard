import { PayloadAction } from '@reduxjs/toolkit';
import experiencesApi from 'api/experiences';
import axios from 'axios';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { appActions } from 'redux/reducers/app';
import { experiencesActions } from 'redux/reducers/experiences';
import {
  CreateExperienceRequest,
  GetExperienceByIdRequest,
  GetExperienceByIdResponse,
  GetExperiencesResponse,
  GetExperiencesRequest,
  GetExperienceByTimeSlotIdRequest,
  GetExperienceByTimeSlotIdResponse,
  UpdateExperienceRequest,
  DeleteExperienceRequest,
} from 'types/experiences';
import history from 'utils/route-history';

function* getUpcomingExperiences(data: PayloadAction<GetExperiencesRequest>) {
  try {
    const response: GetExperiencesResponse = yield call(experiencesApi.getUpcomingExperiences, data.payload);
    yield put(experiencesActions.getUpcomingExperiencesSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch upcoming experiences`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.getUpcomingExperiencesFailed(error.response?.data.message));
    }
  }
}

function* getHistoryExperiences(data: PayloadAction<GetExperiencesRequest>) {
  try {
    const response: GetExperiencesResponse = yield call(experiencesApi.getHistoryExperiences, data.payload);
    yield put(experiencesActions.getHistoryExperiencesSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch experiences history`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.getHistoryExperiencesFailed(error.response?.data.message));
    }
  }
}

function* getExperienceById(data: PayloadAction<GetExperienceByIdRequest>) {
  try {
    const response: GetExperienceByIdResponse = yield call(
      experiencesApi.getExperienceById,
      data.payload
    );
    yield put(experiencesActions.getExperienceByIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch experience by id`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.getExperienceByIdFailed(error.response?.data.message));
    }
  }
}

function* createExperience(data: PayloadAction<CreateExperienceRequest>) {
  try {
    yield call(experiencesApi.createExperience, data.payload);
    yield put(appActions.setToast({
      open: true,
      message: 'The experience was successfuly created!',
      severity: 'success',
    }))
    history.push('/experiences/upcoming')
  } catch (error) {
    console.log(`Failed to create experience`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.createExperienceError(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error.response?.data.message,
        severity: 'error',
      }))
    }
  }
}

function* updateExperience(data: PayloadAction<UpdateExperienceRequest>) {
  try {
    yield call(experiencesApi.updateExperience, data.payload);
    yield put(appActions.setToast({
      open: true,
      message: 'The experience was successfuly updated!',
      severity: 'success',
    }))
    history.push('/experiences/upcoming')
  } catch (error) {
    console.log(`Failed to update experience`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.updateExperienceError(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error.response?.data.message,
        severity: 'error',
      }))
    }
  }
}

function* getExperienceByTimeSlotId(data: PayloadAction<GetExperienceByTimeSlotIdRequest>) {
  try {
    const response: GetExperienceByTimeSlotIdResponse = yield call(
      experiencesApi.getExperienceByTimeSlotId,
      data.payload
    );
    yield put(experiencesActions.getExperienceByTimeSlotIdSuccess(response));
  } catch (error) {
    console.log(`Failed to fetch experience time slot information`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.getExperienceByTimeSlotIdFailed(error.response?.data.message));
    }
  }
}

function* deleteExperience(data: PayloadAction<DeleteExperienceRequest>) {
  try {
    const {experienceId, forceDeleteExperience} = data.payload;
    yield call(experiencesApi.deleteExperience, {experienceId: experienceId, forceDeleteExperience: forceDeleteExperience });
    yield put(appActions.setToast({
      open: true,
      message: 'The experience was successfuly deleted!',
      severity: 'success',
    }))
    history.push('/experiences/upcoming')
  } catch (error) {
    console.log(`Failed to delete experience`, error);
    if (axios.isAxiosError(error)) {
      yield put(experiencesActions.deleteExperienceError(error.response?.data.message));
      yield put(appActions.setToast({
        open: true,
        message: error.response?.data.message,
        severity: 'error',
      }))
    }
  }
}

export default function* usersSaga() {
  yield takeLatest(experiencesActions.getUpcomingExperiences.type, getUpcomingExperiences);
  yield takeLatest(experiencesActions.getHistoryExperiences.type, getHistoryExperiences);
  yield takeLatest(experiencesActions.getExperienceById.type, getExperienceById);
  yield takeLatest(experiencesActions.createExperience.type, createExperience);
  yield takeLatest(experiencesActions.getExperienceByTimeSlotId.type, getExperienceByTimeSlotId);
  yield takeLatest(experiencesActions.updateExperience.type, updateExperience);
  yield takeLatest(experiencesActions.deleteExperience.type, deleteExperience);
}
