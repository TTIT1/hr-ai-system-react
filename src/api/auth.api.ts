import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { ChangePasswordRequest, LoginRequest, LoginResponse, TokenResponse, UserInfoResponse } from '../types/auth.type';

export const authApi = {
  async login(payload: LoginRequest) {
    return responseData<LoginResponse>(await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload));
  },
  async refresh(refreshToken: string) {
    return responseData<TokenResponse>(await apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh', { refreshToken }));
  },
  async logout(refreshToken: string) {
    return responseData<null>(await apiClient.post<ApiResponse<null>>('/auth/logout', { refreshToken }));
  },
  async changePassword(payload: ChangePasswordRequest) {
    return responseData<null>(await apiClient.post<ApiResponse<null>>('/auth/change-password', payload));
  },
  async me() {
    return responseData<UserInfoResponse>(await apiClient.get<ApiResponse<UserInfoResponse>>('/auth/me'));
  },
  async logoutAll() {
    return responseData<null>(await apiClient.post<ApiResponse<null>>('/auth/logout-all'));
  },
};
