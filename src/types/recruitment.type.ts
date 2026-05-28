export interface CreateJobRequest {
  title: string;
  description: string;
  requirements?: string;
  requiredSkillsJson?: string[];
  salaryRange?: string;
  headcount?: number;
  deadline?: string;
  status?: string;
  departmentId: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  requiredSkills?: string[];
  requiredSkillsJson?: string[];
  salaryRange?: string;
  headcount?: number;
  deadline?: string;
  status: 'OPEN' | 'CLOSED' | string;
  createdBy?: string;
  createdAt?: string;
  department?: {
    id: string;
    name: string;
  };
}

export interface CvSubmission {
  id: number;
  job?: Job;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  filePath?: string;
  fileType?: string;
  pipelineStage: string;
  aiMatchScore?: number;
  aiMatchedSkillsJson?: string[];
  aiMissingSkillsJson?: string[];
  aiQuestionsJson?: Array<Record<string, unknown>>;
  aiRawResponseJson?: Record<string, unknown>;
  hrNote?: string;
  hrDecision?: string;
  submittedAt?: string;
  processedAt?: string;
  status?: string;
}

export interface UploadCvParams {
  jobId: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
}
