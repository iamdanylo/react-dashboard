import { GetCheckInsResponse, GetCheckInsRequest } from 'types/check-in';
import axiosApi from './config';

const CheckInApi = {
  getCheckIns({
    date = null,
    placeId = '',
    query = '',
    limit = '10',
    offset = 0,
    sort = null,
  }: GetCheckInsRequest): Promise<GetCheckInsResponse> {
    const params = new URLSearchParams({
      query: query,
      limit,
      offset: offset.toString(),
    });

    const url = `/check-in?${params.toString()}${'&sort[createdAt]=desc'}${
      placeId ? `&filter[placeId]=${placeId}` : ''
    }${
      date?.startDate && date?.endDate ? `&filter[startDate]=${date.startDate}&filter[endDate]=${date.endDate}` : ''
    }`;
    return axiosApi.get(url);
  },
};

export default CheckInApi;
