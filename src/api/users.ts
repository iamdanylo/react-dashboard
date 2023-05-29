import {
  GetUsersResponse,
  GetUserByIdResponse,
  GetUserByIdRequest,
  GetUsersRequest,
  GetUserReferralsResponse,
  GetUserCheckinsResponse,
  ApproveUserRequest,
  SetUserPromoRequest,
} from 'types/users';
import axiosApi from './config';

const usersApi = {
  getUsers({
    query = '',
    status = '',
    limit = '10',
    offset = 0,
    sort = null,
  }: GetUsersRequest): Promise<GetUsersResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });

    const url = `/members?${params.toString()}${sort ? sort : ''}${
      status ? `&filter[status]=${status}` : ''
    }`;
    return axiosApi.get(url);
  },
  getUserById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const url = `members/${data.id}`;
    return axiosApi.get(url);
  },
  getUserReferrals(
    data: GetUserByIdRequest
  ): Promise<GetUserReferralsResponse> {
    const url = `members/${data.id}/referrals`;
    return axiosApi.get(url);
  },
  getUserCheckins(data: GetUserByIdRequest): Promise<GetUserCheckinsResponse> {
    const url = `members/${data.id}/checkins`;
    return axiosApi.get(url);
  },
  approveUser(data: ApproveUserRequest): Promise<void> {
    const url = `members/${data.id}/approve`;
    return axiosApi.patch(url);
  },
  setUserPromoCodes(data: Partial<SetUserPromoRequest>): Promise<void> {
    const url = `members/${data.id}/set-onboarding-settings`;
    return axiosApi.patch(url, {
      expediteCode: data.expediteCode,
      promoCode: data.promoCode,
    });
  },
};

export default usersApi;
