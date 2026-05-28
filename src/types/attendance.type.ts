export interface AttendanceCheckRequest {
  employee_id: string;
  note?: string;
}

export interface AttendanceLog {
  id: string;
  employee_id: string;
  work_date: string;
  check_in?: string | null;
  check_out?: string | null;
  ot_hours?: number | null;
  status?: string;
  note?: string | null;
  approved_by?: string | null;
}

export interface MonthlyAttendanceSummary {
  employeeId: string;
  year: number;
  month: number;
  workingDays: number;
  actualDays: number;
  totalOtHours: number;
}

// New Excel-based Attendance Summary Types
export interface ExcelAttendanceSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  totalScore: number;
  dailyScores: Record<string, number>;
}

export interface DepartmentAttendanceSummary {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  month: number;
  year: number;
  dailyScores: string; // JSON string
  totalScore: number;
}

export interface CalculateResponse {
  message: string;
  savedRecords: number;
  savedSummaries: number;
  totalEmployees: number;
}
