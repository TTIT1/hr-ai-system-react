import type { Status } from './common.type';

export interface OvertimeRequest {
  id: number;
  employee?: {
    id: string;
    fullName?: string;
    idEmployee?: string;
    email?: string;
    status?: string;
  } | null;
  workDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status?: Status;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OvertimeCreateRequest {
  employeeId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface OvertimeReviewRequest {
  approved: boolean;
  reviewerNote?: string;
}
