import { CitiesResponse, EnableCityRequest, DisableCityRequest, ChangeCityResponse } from 'types/cities';
import axiosApi from './config';

const CitiesApi = {
  getEnabledCities(): Promise<CitiesResponse> {
    const url = 'cities';
    return axiosApi.get(url);
  },
  getAllCities(): Promise<CitiesResponse> {
    const url = 'cities';
    return axiosApi.get(url, { baseURL: process.env.REACT_APP_API_URL + '/api/dictionary' });
  },
  enableCity(data: EnableCityRequest): Promise<ChangeCityResponse> {
    const url = `cities/enable/${data.id}`;
    return axiosApi.patch(url, data.data);
  },
  disableCity(data: DisableCityRequest): Promise<ChangeCityResponse> {
    const url = `cities/disable/${data.id}`;
    return axiosApi.patch(url);
  },
};

export default CitiesApi;
