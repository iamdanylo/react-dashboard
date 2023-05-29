import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { AppState } from 'redux/reducers/app';

export const appSelector = (state: RootState): AppState => state.app;

export const toastSelector = createSelector(appSelector, (app) => app.toast);
