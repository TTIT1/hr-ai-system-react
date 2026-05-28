import type { Role } from './common.type';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserInfo {
  id: string;
  employeeId: string | null;
  email: string;
  fullName: string | null;
  role: Role;
  avatar: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user?: LoginUserInfo | null;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface UserInfoResponse {
  id: string;
  employeeId: string | null;
  email: string;
  fullName: string | null;
  role: Role;
  avatar: string | null;
  isActive: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
