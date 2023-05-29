import { ExperienceStatusEnum, MultiDaySlot, StandardDaySlot, TimeSlotType as TimeSlotTypeModel } from "models/experiences";
import moment, { Moment } from "moment";
import { MultiDateType, StandardDateType, TimeSlotType } from "types/experiences";
import { convertDateToTime } from "./dateHelper";

export const getRandomId = () => (Math.random() + 1).toString(36).substring(2);

export const createMultiDate = (): MultiDateType => ({
  id: getRandomId(),
  startDate: null,
  endDate: null,
});

export const createTimeSlot = (d?: Moment | null ): TimeSlotType => ({
  id: getRandomId(),
  startTime: d ? d : null,
  endTime: d ? d : null,
  disabled: false,
});

export const createStandartDate = (): StandardDateType => ({
  id: getRandomId(),
  date: null,
  times: [createTimeSlot()],
});

export const convertStandartDate = (stardardDates: StandardDateType[]): StandardDaySlot[] => {
  let result: StandardDaySlot[] = [];
  stardardDates.forEach((d) => {
    if (!d.date) return;
    let standard: StandardDaySlot = {
      date: moment(d.date).utc(true).toDate(),
      timeSlots: d.times.map((t) => {
        const slot: TimeSlotTypeModel = {
          _id: t.timeSlotId,
          startTime: convertDateToTime(t.startTime as Moment),
          endTime: convertDateToTime(t.endTime as Moment),
        };
        return slot;
      }),
    };

    result.push(standard);
  });

  return result;
};

export const convertMultiDate = (multiDates: MultiDateType): MultiDaySlot => {
  let result: MultiDaySlot = {
    _id: multiDates.timeSlotId,
    startDate: moment(multiDates.startDate).utc(true).toDate() as Date,
    endDate: moment(multiDates.endDate).utc(true).toDate() as Date,
  };

  return result;
};

export const getExperienceStatusLabel = (status: ExperienceStatusEnum) => {
  switch(status) {
    case ExperienceStatusEnum.PUBLISH:
      return 'Published';
    case ExperienceStatusEnum.DRAFT:
      return 'Draft';
    default:
      return '';
  }
};