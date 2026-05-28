import { create } from 'zustand';
import type { UserInfoResponse } from '../types/auth.type';

interface AuthState {
  user: UserInfoResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserInfoResponse | null) => void;
  logout: () => void;
}

const initialAccessToken = sessionStorage.getItem('accessToken');
const initialRefreshToken = localStorage.getItem('refreshToken');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialAccessToken),
  setTokens: (accessToken, refreshToken) => {
    sessionStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  setUser: (user) => set({ user, isAuthenticated: Boolean(user || sessionStorage.getItem('accessToken')) }),
  logout: () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
