import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { AnalyzeAllResult, KpiCreateRequest, KpiRecord, PerformanceAnalysis } from '../types/performance.type';

export const performanceApi = {
  async createKpi(payload: KpiCreateRequest) {
    return responseData<KpiRecord>(await apiClient.post<ApiResponse<KpiRecord>>('/kpi', payload));
  },
  async kpis(employeeId: string) {
    return responseData<KpiRecord[]>(await apiClient.get<ApiResponse<KpiRecord[]>>(`/kpi/${employeeId}`));
  },
  async dashboard() {
    return responseData<PerformanceAnalysis[]>(await apiClient.get<ApiResponse<PerformanceAnalysis[]>>('/performance/dashboard'));
  },
  async history(employeeId: string) {
    return responseData<PerformanceAnalysis[]>(await apiClient.get<ApiResponse<PerformanceAnalysis[]>>(`/performance/${employeeId}`));
  },
  async analyze(employeeId: string) {
    return responseData<PerformanceAnalysis>(await apiClient.post<ApiResponse<PerformanceAnalysis>>(`/performance/analyze/${employeeId}`));
  },
  async analyzeAll() {
    return responseData<AnalyzeAllResult>(await apiClient.post<ApiResponse<AnalyzeAllResult>>('/performance/analyze/all'));
  },
};
