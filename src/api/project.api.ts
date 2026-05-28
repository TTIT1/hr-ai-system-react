import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { Project, ProjectRequest } from '../types/project.type';

export const projectApi = {
  async list() {
    return responseData<Project[]>(await apiClient.get<ApiResponse<Project[]>>('/projects'));
  },
  async get(id: string) {
    return responseData<Project>(await apiClient.get<ApiResponse<Project>>(`/projects/${id}`));
  },
  async create(payload: ProjectRequest) {
    return responseData<Project>(await apiClient.post<ApiResponse<Project>>('/projects', payload));
  },
  async update(id: string, payload: ProjectRequest) {
    return responseData<Project>(await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, payload));
  },
  async remove(id: string) {
    return responseData<null>(await apiClient.delete<ApiResponse<null>>(`/projects/${id}`));
  },
};
