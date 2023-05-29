import { GetPartnersRequest, GetPartnersResponse } from 'types/partners';
import axiosApi from './config';

const partnersApi = {
  getPartners({
    limit = '50',
  }: GetPartnersRequest): Promise<GetPartnersResponse> {
    const url = `admin/partner/?limit=${limit}`;
    return axiosApi.get(url, { baseURL: process.env.REACT_APP_API_URL + '/api/v1/' });
  },
};

export default partnersApi;
