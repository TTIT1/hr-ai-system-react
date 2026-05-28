import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { Holiday, HolidayRequest } from '../types/holiday.type';

export const holidayApi = {
  async list() {
    return responseData<Holiday[]>(await apiClient.get<ApiResponse<Holiday[]>>('/holidays'));
  },
  async get(id: string | number) {
    return responseData<Holiday>(await apiClient.get<ApiResponse<Holiday>>(`/holidays/${id}`));
  },
  async create(payload: HolidayRequest) {
    return responseData<Holiday>(await apiClient.post<ApiResponse<Holiday>>('/holidays', payload));
  },
  async update(id: string | number, payload: HolidayRequest) {
    return responseData<Holiday>(await apiClient.put<ApiResponse<Holiday>>(`/holidays/${id}`, payload));
  },
  async remove(id: string | number) {
    return responseData<null>(await apiClient.delete<ApiResponse<null>>(`/holidays/${id}`));
  },
};
