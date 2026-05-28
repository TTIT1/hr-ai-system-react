import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { getEmployeeCodeFromAuth, getEmployeeRecordIdFromAuth } from '../auth/employeeId';
import { useAuthStore } from '../store/authStore';
import type { ChangePasswordRequest, LoginRequest } from '../types/auth.type';
import { getErrorMessage } from '../utils/errors';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser, setTokens, logout: clearAuth, isAuthenticated, accessToken, refreshToken } = useAuthStore();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

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

  const currentUser = user || meQuery.data || null;
  const employeeCode = getEmployeeCodeFromAuth(currentUser, accessToken);
  const employeeRecordId = getEmployeeRecordIdFromAuth(currentUser, accessToken);

  return {
    user: currentUser,
    employeeId: employeeCode,
    employeeCode,
    employeeRecordId,
    isAuthenticated,
    meQuery,
    login: loginMutation,
    logout: logoutMutation,
    changePassword: changePasswordMutation,
  };
}
