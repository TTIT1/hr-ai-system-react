import { apiClient, responseData } from './http';
import type { ApiResponse } from '../types/common.type';
import type { CreateJobRequest, CvSubmission, Job, UploadCvParams } from '../types/recruitment.type';

export const recruitmentApi = {
  async jobs() {
    return responseData<Job[]>(await apiClient.get<ApiResponse<Job[]>>('/jobs'));
  },
  async getJob(id: string) {
    return responseData<Job>(await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`));
  },
  async createJob(payload: CreateJobRequest) {
    return responseData<Job>(await apiClient.post<ApiResponse<Job>>('/jobs', payload));
  },
  async updateJob(id: string, payload: Partial<Job>) {
    return responseData<Job>(await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, payload));
  },
  async closeJob(id: string) {
    return responseData<Job>(await apiClient.put<ApiResponse<Job>>(`/jobs/${id}/close`));
  },
  async uploadCv(file: File, params: UploadCvParams) {
    const form = new FormData();
    form.append('file', file);
    return responseData<CvSubmission>(
      await apiClient.post<ApiResponse<CvSubmission>>('/recruitment/cv/upload', form, {
        params,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
  },
  async getCv(id: number) {
    return responseData<CvSubmission>(await apiClient.get<ApiResponse<CvSubmission>>(`/recruitment/cv/${id}`));
  },
  async pipeline(jobId: string) {
    return responseData<CvSubmission[]>(await apiClient.get<ApiResponse<CvSubmission[]>>(`/recruitment/pipeline/${jobId}`));
  },
  async updateStage(id: number, stage: string) {
    return responseData<CvSubmission>(await apiClient.put<ApiResponse<CvSubmission>>(`/recruitment/cv/${id}/stage`, null, { params: { stage } }));
  },
};
