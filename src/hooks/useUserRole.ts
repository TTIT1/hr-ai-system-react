import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import type { Role } from '../types/common.type';
import { getErrorMessage } from '../utils/errors';

export function useUserRoleByEmployee(employeeId?: string | null) {
  return useQuery({
    queryKey: ['user-role-by-employee', employeeId],
    queryFn: () => authApi.getUserByEmployeeId(employeeId!),
    enabled: !!employeeId,
    retry: false, // Don't keep retrying if user doesn't exist
  });
}

export function useUserRoleActions() {
  const queryClient = useQueryClient();

  return {
    update: useMutation({
      mutationFn: ({ userId, role }: { userId: string; role: Role }) => authApi.updateUserRole(userId, role),
      onSuccess: () => {
        toast.success('Đã cập nhật phân quyền người dùng');
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    updateByEmployeeId: useMutation({
      mutationFn: ({ employeeId, role }: { employeeId: string; role: Role }) =>
        authApi.updateUserRoleByEmployeeId(employeeId, role),
      onSuccess: (_, variables) => {
        toast.success('Đã cập nhật phân quyền tài khoản');
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        queryClient.invalidateQueries({ queryKey: ['user-role-by-employee', variables.employeeId] });
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
