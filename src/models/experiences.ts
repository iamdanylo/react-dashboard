import { UserType } from './member';
import { Place } from './place';

export enum AccessTypeEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum AccessibilityTypeEnum {
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid',
  VIRTUAL = 'virtual',
  TRIP = 'trip',
}

export enum RecurringTypeEnum {
  SINGLE = 'standard',
  MULTI_DAY = 'multi_day',
}

export type DaySlotsType = StandardDaySlot[] | MultiDaySlot;

export type TimeSlotType = {
  _id?: string;
  startTime: string;
  endTime: string;
  bookingsAmount?: number;
};

export type StandardDaySlot = {
  date: Date;
  timeSlots: TimeSlotType[];
};

export type MultiDaySlot = {
  _id?: string;
  startDate: Date;
  endDate: Date;
  bookingsAmount?: number;
};

export type Who = {
  capacityLimit: number;
  accessType: AccessTypeEnum;
  guestsPerMember: number;
  operator: OperatorEnum;
};

export type Where = {
  place: string;
  accessibilityType: AccessibilityTypeEnum;
  addressDetails: string;
  streamingLink?: string;
};

export type What = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
};

export type When = {
  recurringType: RecurringTypeEnum;
  daySlots: DaySlotsType;
};

export type ExperiencePricing = {
  type: PricingTypeEnum;
  private?: number;
  public?: number;
};

export enum PricingTypeEnum {
  STANDARD = 'standard',
}

export enum ExperienceStatusEnum {
  DRAFT = 'draft',
  PUBLISH = 'publish',
}

export enum OperatorEnum {
  COMPANY = 'company',
  PARTNER = 'partner',
};

export type ExperienceDetailedType = {
  who: Who;
  where: Where;
  what: What;
  when: When;
  pricing: ExperiencePricing[] | [];
  status: ExperienceStatusEnum;
  isFree: boolean;
};

export type ExperienceTimeSlotType = {
  startDateTime: Date;
  endDateTime: Date;
};

export type ExperienceDto = {
  _id: string;
  title: string;
  bookingsAmount: number;
  isSingle: boolean;
  place: Place;
  recurringType: RecurringTypeEnum;
  status: ExperienceStatusEnum;
  timeSlot: ExperienceTimeSlotType;
};

export type ExperienceByTimeSlotIdDto = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  place: Place;
  timeSlots: ExperiencePricing[];
  pricing: ExperiencePricing[];
  status: ExperienceStatusEnum;
  recurringType: RecurringTypeEnum;
  isFree: boolean;
  bookingDetails: Bookings;
};

export type Bookings = {
  timeSlotId: string;
  participants: BookingItem[];
}

export type BookingItem = {
  userType: UserType;
  fullName: string;
};
