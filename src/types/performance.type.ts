export interface KpiCreateRequest {
  employeeId: string;
  weekStart: string;
  kpiScore?: number;
  tasksDone?: number;
  tasksTotal?: number;
  workHours?: number;
  lateDays?: number;
}

export interface KpiRecord extends KpiCreateRequest {
  id: string;
  inputBy?: string;
  createdAt?: string;
}

export interface PerformanceAnalysis {
  id: string;
  employee?: {
    id: string;
    fullName?: string;
    email?: string;
  };
  analyzedAt?: string;
  periodWeeks?: number;
  trend?: string;
  kpiChangePct?: number;
  alert?: boolean;
  alertLevel?: string | null;
  alertMessage?: string | null;
  aiAnalysisJson?: string;
  notified?: boolean;
  notifiedAt?: string | null;
}

export interface AnalyzeAllResult {
  analyzed: number;
  skippedOrFailed: number;
}
