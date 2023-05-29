import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN } from 'utils/storageKeys';

const basicConfig: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_URL + '/api/admin/',
};

const axiosApi = axios.create(basicConfig);
const publicAxiosApi = axios.create(basicConfig);

// Interceptors
axiosApi.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    } as InternalAxiosRequestConfig;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosApi.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// Add response interceptor
publicAxiosApi.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
const S3_URL = process.env.REACT_APP_S3_URL;

export default axiosApi;

export { publicAxiosApi, S3_URL };