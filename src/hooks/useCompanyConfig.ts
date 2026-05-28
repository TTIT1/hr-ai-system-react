import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { companyConfigApi } from '../api/company-config.api';
import type { CompanyWorkPolicyRequest } from '../types/company-config.type';
import { getErrorMessage } from '../utils/errors';

export function useCompanyWorkPolicy() {
  return useQuery({ queryKey: ['company-configs', 'work-policy'], queryFn: companyConfigApi.workPolicy });
}

export function useCompanyConfigActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['company-configs'] });

  return {
    updateWorkPolicy: useMutation({
      mutationFn: (payload: CompanyWorkPolicyRequest) => companyConfigApi.updateWorkPolicy(payload),
      onSuccess: () => {
        toast.success('Company work policy updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
