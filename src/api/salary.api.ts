import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { PayrollCalculateParams, PayrollRecord, SalaryConfig, SalaryConfigRequest } from '../types/salary.type';

export const salaryApi = {
  async getConfig(empId: string) {
    return responseData<SalaryConfig>(await apiClient.get<ApiResponse<SalaryConfig>>(`/salary-configs/${empId}`));
  },
  async upsertConfig(payload: SalaryConfigRequest) {
    return responseData<SalaryConfig>(await apiClient.post<ApiResponse<SalaryConfig>>('/salary-configs', payload));
  },
  async calculateAll(params: PayrollCalculateParams) {
    return responseData<PayrollRecord[]>(await apiClient.post<ApiResponse<PayrollRecord[]>>('/payroll/calculate', null, { params }));
  },
  async calculateOne(empId: string, params: PayrollCalculateParams) {
    return responseData<PayrollRecord>(await apiClient.post<ApiResponse<PayrollRecord>>(`/payroll/calculate/${empId}`, null, { params }));
  },
  async latest(empId: string) {
    return responseData<PayrollRecord>(await apiClient.get<ApiResponse<PayrollRecord>>(`/payroll/${empId}/latest`));
  },
  async history(empId: string) {
    return responseData<PayrollRecord[]>(await apiClient.get<ApiResponse<PayrollRecord[]>>(`/payroll/${empId}/history`));
  },
  async confirm(id: string) {
    return responseData<PayrollRecord>(await apiClient.put<ApiResponse<PayrollRecord>>(`/payroll/${id}/confirm`));
  },
  async markPaid(id: string) {
    return responseData<PayrollRecord>(await apiClient.put<ApiResponse<PayrollRecord>>(`/payroll/${id}/mark-paid`));
  },
  async exportExcel(month: number, year: number) {
    const response = await apiClient.get<Blob>('/payroll/export/excel', { params: { month, year }, responseType: 'blob' });
    return response.data;
  },
};
