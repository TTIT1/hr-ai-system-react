import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type {
  AttendanceCheckRequest,
  AttendanceLog,
  MonthlyAttendanceSummary,
  CalculateResponse,
  ExcelAttendanceSummary,
  DepartmentAttendanceSummary,
} from '../types/attendance.type';

export const attendanceApi = {
  async checkIn(payload: AttendanceCheckRequest) {
    return responseData<AttendanceLog>(await apiClient.post<ApiResponse<AttendanceLog>>('/attendance/checkin', payload));
  },
  async checkOut(payload: AttendanceCheckRequest) {
    return responseData<AttendanceLog>(await apiClient.post<ApiResponse<AttendanceLog>>('/attendance/checkout', payload));
  },
  async today(employeeId: string) {
    return responseData<AttendanceLog>(await apiClient.get<ApiResponse<AttendanceLog>>('/attendance/today', { params: { employee_id: employeeId } }));
  },
  async month(employeeId: string, year: number, month: number) {
    return responseData<AttendanceLog[]>(await apiClient.get<ApiResponse<AttendanceLog[]>>(`/attendance/${employeeId}/month`, { params: { year, month } }));
  },
  async summary(employeeId: string, year: number, month: number) {
    return responseData<MonthlyAttendanceSummary>(await apiClient.get<ApiResponse<MonthlyAttendanceSummary>>(`/attendance/${employeeId}/summary`, { params: { year, month } }));
  },

  // Excel-based attendance operations (For HR/ADMIN) - Returns RAW data directly, NOT wrapped in ApiResponse
  async calculate(file: File, year: number, month: number) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<CalculateResponse>('/attendance/calculate', formData, {
      params: { year, month },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  async calculateExport(file: File, year: number, month: number) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Blob>('/attendance/calculate/export', formData, {
      params: { year, month },
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
    return response.data;
  },
  async getSummary(year: number, month: number) {
    const response = await apiClient.get<ExcelAttendanceSummary[]>('/attendance/summary', {
      params: { year, month },
    });
    return response.data;
  },
  async getSummaryByDepartment(department: string, year: number, month: number) {
    const response = await apiClient.get<DepartmentAttendanceSummary[]>('/attendance/summary/department', {
      params: { department, year, month },
    });
    return response.data;
  },
  async getSummaryByEmployee(employeeId: string, year: number, month: number) {
    const response = await apiClient.get<ExcelAttendanceSummary>(`/attendance/summary/employee/${employeeId}`, {
      params: { year, month },
    });
    return response.data;
  },
};
