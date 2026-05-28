import type { Status } from './common.type';

export interface AttendanceExplanation {
  id: number;
  employeeId?: string;
  employeeName?: string;
  workDate?: string;
  date?: string;
  reason?: string;
  status?: Status;
  reviewerNote?: string;
}

export interface AttendanceExplanationCreateRequest {
  workDate: string;
  reason: string;
}

export interface AttendanceExplanationReviewRequest {
  approved: boolean;
  reviewerNote?: string;
}
