import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { overtimeApi } from '../api/overtime.api';
import type { OvertimeCreateRequest, OvertimeReviewRequest } from '../types/overtime.type';
import { getErrorMessage } from '../utils/errors';

export function useOvertime(employeeId?: string | null, canManage = false) {
  return {
    mine: useQuery({
      queryKey: ['overtime', 'mine', employeeId],
      queryFn: () => overtimeApi.mine(employeeId as string),
      enabled: Boolean(employeeId),
    }),
    all: useQuery({ queryKey: ['overtime', 'all'], queryFn: overtimeApi.all, enabled: canManage }),
  };
}

export function useOvertimeActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['overtime'] });

  return {
    request: useMutation({
      mutationFn: (payload: OvertimeCreateRequest) => overtimeApi.request(payload),
      onSuccess: () => {
        toast.success('Overtime request submitted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    review: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: OvertimeReviewRequest }) => overtimeApi.review(id, payload),
      onSuccess: () => {
        toast.success('Overtime request reviewed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
