import { createSelector } from 'reselect';
import { RootState } from 'app/store';
import { ExperienceState } from 'redux/reducers/experiences';

export const experiencesSelector = (state: RootState): ExperienceState => state.experiences;

export const upcomingSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.upcoming
);

export const selectedExperienceSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.selectedExperience,
);

export const totalUpcomingSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.totalUpcoming,
);

export const historyExperiencesSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.historyExperiences,
);

export const totalHistorySelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.totalHistory,
);

export const selectedTimeSlotDataSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.selectedExperienceTimeSlotData,
);

export const experiencesLoadingSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.loading
);

export const experiencesErrorSelector = createSelector(
  experiencesSelector,
  (experiences) => experiences.error
);
