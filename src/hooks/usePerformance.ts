import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { performanceApi } from '../api/performance.api';
import type { KpiCreateRequest } from '../types/performance.type';
import { getErrorMessage } from '../utils/errors';

export function usePerformance(employeeId?: string | null, canViewTeam = false) {
  return {
    kpis: useQuery({
      queryKey: ['performance', 'kpis', employeeId],
      queryFn: () => performanceApi.kpis(employeeId as string),
      enabled: Boolean(employeeId),
    }),
    history: useQuery({
      queryKey: ['performance', 'history', employeeId],
      queryFn: () => performanceApi.history(employeeId as string),
      enabled: Boolean(employeeId),
    }),
    dashboard: useQuery({
      queryKey: ['performance', 'dashboard'],
      queryFn: performanceApi.dashboard,
      enabled: canViewTeam,
    }),
  };
}

export function usePerformanceActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['performance'] });
  return {
    createKpi: useMutation({
      mutationFn: (payload: KpiCreateRequest) => performanceApi.createKpi(payload),
      onSuccess: () => {
        toast.success('KPI saved');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    analyze: useMutation({
      mutationFn: (employeeId: string) => performanceApi.analyze(employeeId),
      onSuccess: () => {
        toast.success('Performance analyzed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    analyzeAll: useMutation({
      mutationFn: performanceApi.analyzeAll,
      onSuccess: () => {
        toast.success('Bulk analysis completed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
