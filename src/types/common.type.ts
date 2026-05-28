export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  listdata?: T[];
  message?: string;
  errorCode?: number;
  httpStatusCode?: string;
}

export interface ApiErrorBody {
  success?: boolean;
  message?: string;
  errorCode?: number;
  httpStatusCode?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export type Status = 'ACTIVE' | 'RESIGNED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'OPEN' | 'CLOSED' | 'DRAFT' | 'CONFIRMED' | 'PAID' | string;
