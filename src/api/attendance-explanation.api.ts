import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type {
  AttendanceExplanation,
  AttendanceExplanationCreateRequest,
  AttendanceExplanationReviewRequest,
} from '../types/attendance-explanation.type';

export const attendanceExplanationApi = {
  // EMPLOYEE only — backend requires ?employeeId=... as query param
  async mine(employeeId: string) {
    return responseData<AttendanceExplanation[]>(
      await apiClient.get<ApiResponse<AttendanceExplanation[]>>('/attendance/explanations/mine', {
        params: { employeeId },
      }),
    );
  },
  // HR / ADMIN / MANAGER only
  async all() {
    return responseData<AttendanceExplanation[]>(
      await apiClient.get<ApiResponse<AttendanceExplanation[]>>('/attendance/explanations'),
    );
  },
  // EMPLOYEE only
  async create(payload: AttendanceExplanationCreateRequest) {
    return responseData<AttendanceExplanation>(
      await apiClient.post<ApiResponse<AttendanceExplanation>>('/attendance/explanations', payload),
    );
  },
  // HR / ADMIN / MANAGER only — backend uses @RequestParam (query string), not body
  async review(id: number, payload: AttendanceExplanationReviewRequest) {
    return responseData<AttendanceExplanation>(
      await apiClient.put<ApiResponse<AttendanceExplanation>>(
        `/attendance/explanations/${id}/review`,
        null,
        {
          params: {
            approved: payload.approved,
            ...(payload.reviewerNote ? { note: payload.reviewerNote } : {}),
          },
        },
      ),
    );
  },
};
