import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { notificationApi } from '../api/notification.api';
import type { NotificationRequest } from '../types/notification.type';
import { getErrorMessage } from '../utils/errors';

export function useNotifications(canManage = false) {
  return {
    mine: useQuery({ queryKey: ['notifications', 'mine'], queryFn: notificationApi.mine }),
    all: useQuery({ queryKey: ['notifications', 'all'], queryFn: notificationApi.all, enabled: canManage }),
  };
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] });

  return {
    create: useMutation({
      mutationFn: (payload: NotificationRequest) => notificationApi.create(payload),
      onSuccess: () => {
        toast.success('Notification created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: (id: string | number) => notificationApi.remove(id),
      onSuccess: () => {
        toast.success('Notification deleted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
