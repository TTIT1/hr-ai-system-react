import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { attendanceExplanationApi } from '../api/attendance-explanation.api';
import type { AttendanceExplanationCreateRequest, AttendanceExplanationReviewRequest } from '../types/attendance-explanation.type';
import { getErrorMessage } from '../utils/errors';

// employeeId required — backend /mine needs it as query param (EMPLOYEE only)
// canManage — enables fetching all records (HR/ADMIN/MANAGER only)
export function useAttendanceExplanations(employeeId: string | null | undefined, canManage = false) {
  return {
    mine: useQuery({
      queryKey: ['attendance-explanations', 'mine', employeeId],
      queryFn: () => attendanceExplanationApi.mine(employeeId!),
      enabled: !!employeeId && !canManage, // only fetch mine if EMPLOYEE
    }),
    all: useQuery({
      queryKey: ['attendance-explanations', 'all'],
      queryFn: attendanceExplanationApi.all,
      enabled: canManage,
    }),
  };
}

export function useAttendanceExplanationActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['attendance-explanations'] });

  return {
    create: useMutation({
      mutationFn: (payload: AttendanceExplanationCreateRequest) => attendanceExplanationApi.create(payload),
      onSuccess: () => {
        toast.success('Đã gửi giải trình chấm công');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    review: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: AttendanceExplanationReviewRequest }) =>
        attendanceExplanationApi.review(id, payload),
      onSuccess: () => {
        toast.success('Đã xử lý giải trình');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
