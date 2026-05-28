import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { OvertimeCreateRequest, OvertimeRequest, OvertimeReviewRequest } from '../types/overtime.type';

export const overtimeApi = {
  async mine(employeeId: string) {
    return responseData<OvertimeRequest[]>(await apiClient.get<ApiResponse<OvertimeRequest[]>>('/overtime/requests/mine', { params: { employeeId } }));
  },
  async all() {
    return responseData<OvertimeRequest[]>(await apiClient.get<ApiResponse<OvertimeRequest[]>>('/overtime/requests/all'));
  },
  async request(payload: OvertimeCreateRequest) {
    return responseData<OvertimeRequest>(await apiClient.post<ApiResponse<OvertimeRequest>>('/overtime/request', payload));
  },
  async review(id: number, payload: OvertimeReviewRequest) {
    return responseData<OvertimeRequest>(
      await apiClient.put<ApiResponse<OvertimeRequest>>(`/overtime/requests/${id}/review`, null, {
        params: { approved: payload.approved, note: payload.reviewerNote },
      }),
    );
  },
};
