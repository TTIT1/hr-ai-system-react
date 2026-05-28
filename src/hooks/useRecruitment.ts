import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { recruitmentApi } from '../api/recruitment.api';
import type { CreateJobRequest, Job, UploadCvParams } from '../types/recruitment.type';
import { getErrorMessage } from '../utils/errors';

export function useRecruitment(jobId?: string | null) {
  return {
    jobs: useQuery({ queryKey: ['recruitment', 'jobs'], queryFn: recruitmentApi.jobs }),
    pipeline: useQuery({
      queryKey: ['recruitment', 'pipeline', jobId],
      queryFn: () => recruitmentApi.pipeline(jobId as string),
      enabled: Boolean(jobId),
    }),
  };
}

export function useRecruitmentActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['recruitment'] });
  return {
    createJob: useMutation({
      mutationFn: (payload: CreateJobRequest) => recruitmentApi.createJob(payload),
      onSuccess: () => {
        toast.success('Job created');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    updateJob: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Job> }) => recruitmentApi.updateJob(id, payload),
      onSuccess: () => {
        toast.success('Job updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    closeJob: useMutation({
      mutationFn: (id: string) => recruitmentApi.closeJob(id),
      onSuccess: () => {
        toast.success('Job closed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    uploadCv: useMutation({
      mutationFn: ({ file, params }: { file: File; params: UploadCvParams }) => recruitmentApi.uploadCv(file, params),
      onSuccess: () => {
        toast.success('CV uploaded and analyzed');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    updateStage: useMutation({
      mutationFn: ({ id, stage }: { id: number; stage: string }) => recruitmentApi.updateStage(id, stage),
      onSuccess: () => {
        toast.success('Pipeline stage updated');
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}
