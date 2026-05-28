import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { ChangePasswordRequest, LoginRequest } from '../types/auth.type';
import { getErrorMessage } from '../utils/errors';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser, setTokens, logout: clearAuth, isAuthenticated, refreshToken } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: async (data) => {
      setTokens(data.accessToken, data.refreshToken);
      const me = await queryClient.fetchQuery({ queryKey: ['auth', 'me'], queryFn: authApi.me });
      setUser(me);
      toast.success('Signed in');
      navigate('/');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const logoutMutation = useMutation({
    mutationFn: () => (refreshToken ? authApi.logout(refreshToken) : Promise.resolve(null)),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload: ChangePasswordRequest) => authApi.changePassword(payload),
    onSuccess: () => toast.success('Password updated'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    user: user || meQuery.data || null,
    isAuthenticated,
    meQuery,
    login: loginMutation,
    logout: logoutMutation,
    changePassword: changePasswordMutation,
  };
}
