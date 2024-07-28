import axios from 'axios';
import { ACCESS_TOKEN } from '@/context/constants.ts';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    if (access_token) {
      config.headers['Authorization'] = 'Bearer ' + access_token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
