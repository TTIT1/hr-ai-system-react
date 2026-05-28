import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { salaryApi } from '../api/salary.api';
import type { PayrollCalculateParams, SalaryConfigRequest } from '../types/salary.type';
import { getErrorMessage } from '../utils/errors';

export function useSalary(empId?: string | null) {
  return {
    config: useQuery({
      queryKey: ['salary', 'config', empId],
      queryFn: () => salaryApi.getConfig(empId as string),
      enabled: Boolean(empId),
      retry: false,
    }),
    latest: useQuery({
      queryKey: ['salary', 'latest', empId],
      queryFn: () => salaryApi.latest(empId as string),
      enabled: Boolean(empId),
      retry: false,
    }),
    history: useQuery({
      queryKey: ['salary', 'history', empId],
      queryFn: () => salaryApi.history(empId as string),
      enabled: Boolean(empId),
    }),
  };
}

export function useSalaryActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['salary'] });
  return {
    upsertConfig: useMutation({
      mutationFn: (payload: SalaryConfigRequest) => salaryApi.upsertConfig(payload),
      onSuccess: () => {
        toast.success('Salary config saved');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    calculateOne: useMutation({
      mutationFn: ({ empId, params }: { empId: string; params: PayrollCalculateParams }) => salaryApi.calculateOne(empId, params),
      onSuccess: () => {
        toast.success('Payroll calculated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    calculateAll: useMutation({
      mutationFn: (params: PayrollCalculateParams) => salaryApi.calculateAll(params),
      onSuccess: () => {
        toast.success('Payroll calculated for active employees');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    confirm: useMutation({
      mutationFn: (id: string) => salaryApi.confirm(id),
      onSuccess: () => {
        toast.success('Payroll confirmed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    markPaid: useMutation({
      mutationFn: (id: string) => salaryApi.markPaid(id),
      onSuccess: () => {
        toast.success('Payroll marked paid');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
