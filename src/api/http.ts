import axios from 'axios';
import type { ApiResponse } from '../types/common.type';
import type { TokenResponse } from '../types/auth.type';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken || sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken || localStorage.getItem('refreshToken');

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<ApiResponse<TokenResponse>>('/api/auth/refresh', { refreshToken });
        const accessToken = response.data.data?.accessToken;
        if (!accessToken) throw new Error('Refresh response did not include an access token');
        useAuthStore.getState().setTokens(accessToken, refreshToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export function responseData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data as T;
}
