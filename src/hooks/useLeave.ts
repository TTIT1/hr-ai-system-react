import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leaveApi } from '../api/leave.api';
import type { LeaveRequestCreate } from '../types/leave.type';
import { getErrorMessage } from '../utils/errors';

export function useLeave(employeeId?: string | null, year = new Date().getFullYear(), canManage = false) {
  return {
    balance: useQuery({
      queryKey: ['leave', 'balance', employeeId, year],
      queryFn: () => leaveApi.balance(employeeId as string, year),
      enabled: Boolean(employeeId),
    }),
    mine: useQuery({
      queryKey: ['leave', 'mine', employeeId],
      queryFn: () => leaveApi.mine(employeeId as string),
      enabled: Boolean(employeeId),
    }),
    all: useQuery({
      queryKey: ['leave', 'all'],
      queryFn: leaveApi.all,
      enabled: canManage,
    }),
  };
}

export function useLeaveActions(employeeId?: string | null) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['leave'] });
  return {
    request: useMutation({
      mutationFn: (payload: LeaveRequestCreate) => leaveApi.request(employeeId as string, payload),
      onSuccess: () => {
        toast.success('Leave request submitted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    approve: useMutation({
      mutationFn: ({ id, ok }: { id: number; ok: boolean }) => leaveApi.approve(id, ok),
      onSuccess: () => {
        toast.success('Leave request updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
