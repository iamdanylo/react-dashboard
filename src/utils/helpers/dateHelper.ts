import { ExperienceTimeSlotType } from 'models/experiences';
import moment, { Moment } from 'moment';
import { DateRange } from 'types/experiences';

export const convertDateToTime = (date: Moment): string => {
  return moment(date).format('HH:mm');
};

export const convertDateRangeToCalendarRange = (range: DateRange) => {
  return {
    startDate: range?.startDate ? moment(range.startDate).toDate() : undefined,
    endDate: range?.endDate ? moment(range.endDate).toDate() : undefined,
    key: 'selection',
  }
};

export const isPastTimeSlot = (timeSlot: ExperienceTimeSlotType, timeZone: string) => {
  if (!timeSlot || !timeZone) return false;
  const now = moment.tz(moment(), timeZone);

  return moment(timeSlot.startDateTime)
    .utc(false)
    .isSameOrBefore(moment(now).utc(true))
};