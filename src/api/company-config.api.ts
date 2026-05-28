import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { CompanyWorkPolicy, CompanyWorkPolicyRequest } from '../types/company-config.type';

export const companyConfigApi = {
  async workPolicy() {
    return responseData<CompanyWorkPolicy>(await apiClient.get<ApiResponse<CompanyWorkPolicy>>('/company-configs/work-policy'));
  },
  async updateWorkPolicy(payload: CompanyWorkPolicyRequest) {
    return responseData<CompanyWorkPolicy>(await apiClient.put<ApiResponse<CompanyWorkPolicy>>('/company-configs/work-policy', payload));
  },
};
