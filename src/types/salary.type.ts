export interface SalaryConfig {
  id: string;
  baseSalary: number;
  bhxhSalary?: number;
  allowances?: string;
  taxDependents?: number;
  effectiveDate: string;
  createdBy?: string;
  createdAt?: string;
}

export interface SalaryConfigRequest {
  employeeId: string;
  baseSalary: number;
  bhxhSalary?: number;
  allowancesJson?: string;
  taxDependents?: number;
  effectiveDate: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  workingDays?: number;
  actualDays?: number;
  otHours?: number;
  baseSalary?: number;
  allowances?: number;
  otPay?: number;
  bonus?: number;
  grossSalary?: number;
  bhxhEmployee?: number;
  bhytEmployee?: number;
  bhtnEmployee?: number;
  taxableIncome?: number;
  incomeTax?: number;
  advance?: number;
  netSalary?: number;
  status: 'DRAFT' | 'CONFIRMED' | 'PAID' | string;
  calculationDetailJson?: Record<string, unknown>;
}

export interface PayrollCalculateParams {
  month: number;
  year: number;
  bonus?: number;
  advance?: number;
}
