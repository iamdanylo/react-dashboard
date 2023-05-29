import { Member, MemberProfile, UserType } from "./member";
import { Place } from "./place";

export type CheckinDto = {
  _id: string;
  invitedBy: Member;
  userType: UserType;
  place: Place;
  profile: MemberProfile;
  stayForLunch: StayForLunchEnum;
  createdAt: Date;
};

export enum StayForLunchEnum {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe',
};

export type Checkin = {
  createdAt: string;
  invitedBy: Member;
  place: Place;
  stayForLunch: StayForLunchEnum;
  user: Member;
  _id: string;
};