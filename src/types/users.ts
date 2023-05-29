import { CheckinDto } from 'models/checkin';
import { Member, Status } from 'models/member';
import { ReferralDto } from 'models/referral';

export type GetUsersResponse = {
  data: Member[];
  total: number;
};

export type GetUserByIdRequest = {
  id: string;
};

export type GetUsersRequest = {
  query?: string;
  status?: Status | '';
  limit?: string;
  offset?: number;
  sort?: string | null;
};

export type GetUserByIdResponse = Member;
export type GetUserReferralsResponse = ReferralDto[];
export type GetUserCheckinsResponse = CheckinDto[];

export type ApproveUserRequest = {
  id: string;
};

export type SetUserPromoRequest = {
  id: string;
  expediteCode: string | null;
  promoCode: string | null;
}

export type MembershipSortBy =
  | 'email'
  | 'profile.firstName'
  | 'successfulReferrals'
  | 'profile.countryOfResidence'
  | 'createdAt'
  | 'status';
