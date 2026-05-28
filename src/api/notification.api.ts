import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { NotificationItem, NotificationRequest } from '../types/notification.type';

export const notificationApi = {
  async mine() {
    return responseData<NotificationItem[]>(await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications/mine'));
  },
  async all() {
    return responseData<NotificationItem[]>(await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications'));
  },
  async create(payload: NotificationRequest) {
    return responseData<NotificationItem>(await apiClient.post<ApiResponse<NotificationItem>>('/notifications', payload));
  },
  async remove(id: string | number) {
    return responseData<null>(await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`));
  },
};
