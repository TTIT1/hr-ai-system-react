import type { Status } from './common.type';

export interface Project {
  id: string;
  name: string;
  description?: string;
  department?: {
    id: string;
    name: string;
  } | null;
  manager?: {
    id: string;
    fullName?: string;
    email?: string;
    idEmployee?: string;
  } | null;
  status?: Status;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  departmentId?: string | null;
  managerId?: string | null;
  startDate?: string;
  endDate?: string;
  status?: string;
}
