import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type {
  Department,
  DepartmentCreateRequest,
  Employee,
  EmployeeCreateRequest,
  EmployeeFilters,
  EmployeePageResponse,
  EmployeeUpdateRequest,
} from '../types/employee.type';

export const employeeApi = {
  async list(params: EmployeeFilters) {
    return responseData<EmployeePageResponse>(await apiClient.get<ApiResponse<EmployeePageResponse>>('/employees', { params }));
  },
  async get(id: string) {
    return responseData<Employee>(await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`));
  },
  async create(payload: EmployeeCreateRequest) {
    return responseData<Employee>(await apiClient.post<ApiResponse<Employee>>('/employees', payload));
  },
  async update(id: string, payload: EmployeeUpdateRequest) {
    return responseData<Employee>(await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, payload));
  },
  async resign(id: string) {
    return responseData<null>(await apiClient.delete<ApiResponse<null>>(`/employees/${id}`));
  },
};

export const departmentApi = {
  async list() {
    return responseData<Department[]>(await apiClient.get<ApiResponse<Department[]>>('/departments'));
  },
  async root() {
    return responseData<Department[]>(await apiClient.get<ApiResponse<Department[]>>('/departments/root'));
  },
  async get(id: string) {
    return responseData<Department>(await apiClient.get<ApiResponse<Department>>(`/departments/${id}`));
  },
  async children(id: string) {
    return responseData<Department[]>(await apiClient.get<ApiResponse<Department[]>>(`/departments/${id}/children`));
  },
  async create(payload: DepartmentCreateRequest) {
    return responseData<Department>(await apiClient.post<ApiResponse<Department>>('/departments', payload));
  },
  async update(id: string, payload: DepartmentCreateRequest) {
    return responseData<Department>(await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, payload));
  },
  async remove(id: string) {
    return responseData<null>(await apiClient.delete<ApiResponse<null>>(`/departments/${id}`));
  },
};
