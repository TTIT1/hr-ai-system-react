import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { LeaveBalance, LeaveRequest, LeaveRequestCreate } from '../types/leave.type';

export const leaveApi = {
  async balance(employeeId: string, year: number) {
    return responseData<LeaveBalance>(await apiClient.get<ApiResponse<LeaveBalance>>('/leave/balance', { params: { employeeId, year } }));
  },
  async request(employeeId: string, payload: LeaveRequestCreate) {
    return responseData<LeaveRequest>(await apiClient.post<ApiResponse<LeaveRequest>>('/leave/request', payload, { params: { employeeId } }));
  },
  async mine(employeeId: string) {
    return responseData<LeaveRequest[]>(await apiClient.get<ApiResponse<LeaveRequest[]>>('/leave/requests/mine', { params: { employeeId } }));
  },
  async all() {
    return responseData<LeaveRequest[]>(await apiClient.get<ApiResponse<LeaveRequest[]>>('/leave/requests/all'));
  },
  async approve(id: number, ok: boolean) {
    return responseData<LeaveRequest>(await apiClient.put<ApiResponse<LeaveRequest>>(`/leave/requests/${id}/approve`, null, { params: { ok } }));
  },
};
