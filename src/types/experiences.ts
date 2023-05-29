import { ExperienceDto, ExperienceDetailedType, ExperienceByTimeSlotIdDto } from 'models/experiences';
import { Moment } from 'moment';

export type CreateExperienceRequest = ExperienceDetailedType;

export type UpdateExperienceRequest = {
  id: string;
  data: UpdateExperienceDetailedType;
};

export type UpdateExperienceDetailedType = ExperienceDetailedType & {
  forceUpdateTimeSlots?: boolean;
}

export type UpdateExperienceResponse = {};

export type GetExperiencesResponse = {
  total: number;
  data: ExperienceDto[];
};

export type GetExperiencesRequest = {
  query?: string;
  limit?: string;
  offset?: number;
  startDateTime?: string;
  endDateTime?: string;
};

export type GetExperienceByIdResponse = ExperienceDetailedType;
export type GetExperienceByIdRequest = {
  id: string;
};

export type DeleteExperienceRequest = {
  experienceId: string;
  forceDeleteExperience: boolean;
}

export type DateType = Moment | null;

export type DateRange = {
  startDate?: string;
  endDate?: string;
} | null;

export type DateFilterOption = {
  key: 'today' | 'yesterday' | 'tomorrow' | 'week' | 'all' | 'other';
  label: string;
};

export type GetExperienceByTimeSlotIdRequest = {
  experienceId: string;
  timeSlotId: string;
};

export type GetExperienceByTimeSlotIdResponse = ExperienceByTimeSlotIdDto;

export type MultiDateType = {
  id: string;
  startDate: Moment | null;
  endDate: Moment | null;
  timeSlotId?: string;
  disabled?: boolean;
};

export type TimeSlotType = {
  id: string;
  startTime: Moment | null;
  endTime: Moment | null;
  timeSlotId?: string;
  disabled?: boolean;
};

export type StandardDateType = {
  id: string;
  date: Moment | null;
  times: TimeSlotType[];
  disabled?: boolean;
};