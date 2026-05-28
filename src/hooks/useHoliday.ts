import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { holidayApi } from '../api/holiday.api';
import type { HolidayRequest } from '../types/holiday.type';
import { getErrorMessage } from '../utils/errors';

export function useHolidays() {
  return useQuery({ queryKey: ['holidays'], queryFn: holidayApi.list });
}

export function useHolidayActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['holidays'] });

  return {
    create: useMutation({
      mutationFn: (payload: HolidayRequest) => holidayApi.create(payload),
      onSuccess: () => {
        toast.success('Holiday created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string | number; payload: HolidayRequest }) => holidayApi.update(id, payload),
      onSuccess: () => {
        toast.success('Holiday updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: (id: string | number) => holidayApi.remove(id),
      onSuccess: () => {
        toast.success('Holiday deleted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
