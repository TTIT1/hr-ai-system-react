import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectApi } from '../api/project.api';
import type { ProjectRequest } from '../types/project.type';
import { getErrorMessage } from '../utils/errors';

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: projectApi.list });
}

export function useProjectActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] });

  return {
    create: useMutation({
      mutationFn: (payload: ProjectRequest) => projectApi.create(payload),
      onSuccess: () => {
        toast.success('Project created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: ProjectRequest }) => projectApi.update(id, payload),
      onSuccess: () => {
        toast.success('Project updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: (id: string) => projectApi.remove(id),
      onSuccess: () => {
        toast.success('Project deleted');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
