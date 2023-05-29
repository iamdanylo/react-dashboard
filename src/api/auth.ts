import { AxiosResponse } from 'axios';
import { CurrentUserResponse, LoginRequest, LoginResponse } from 'types/auth';
import axiosApi, { publicAxiosApi } from './config';

const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    const url = 'auth/login';
    return publicAxiosApi.post(url, data);
  },
  getCurrentUser(): Promise<CurrentUserResponse> {
    const url = 'auth/me';
    return axiosApi.get(url);
  },
};

export default authApi;
