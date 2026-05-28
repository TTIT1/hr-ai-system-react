import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { departmentApi, employeeApi } from '../api/employee.api';
import type { DepartmentCreateRequest, EmployeeCreateRequest, EmployeeFilters, EmployeeUpdateRequest } from '../types/employee.type';
import { getErrorMessage } from '../utils/errors';

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.list(filters),
  });
}

export function useEmployeeActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['employees'] });

  return {
    create: useMutation({
      mutationFn: (payload: EmployeeCreateRequest) => employeeApi.create(payload),
      onSuccess: () => {
        toast.success('Employee created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: EmployeeUpdateRequest }) => employeeApi.update(id, payload),
      onSuccess: () => {
        toast.success('Employee updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    resign: useMutation({
      mutationFn: (id: string) => employeeApi.resign(id),
      onSuccess: () => {
        toast.success('Employee resigned');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}

export function useDepartments() {
  return useQuery({ queryKey: ['departments'], queryFn: departmentApi.list });
}

export function useDepartmentActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['departments'] });
  return {
    create: useMutation({
      mutationFn: (payload: DepartmentCreateRequest) => departmentApi.create(payload),
      onSuccess: () => {
        toast.success('Department created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: DepartmentCreateRequest }) => departmentApi.update(id, payload),
      onSuccess: () => {
        toast.success('Department updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: (id: string) => departmentApi.remove(id),
      onSuccess: () => {
        toast.success('Department deleted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
