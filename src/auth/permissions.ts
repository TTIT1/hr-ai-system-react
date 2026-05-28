export type { Role } from '../types/common.type';
import type { Role } from '../types/common.type';

export const PERMISSIONS = {
  authProfile: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  profileView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  profileSelfUpdate: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],

  employeeView: ['ADMIN', 'HR', 'MANAGER'],
  employeeManage: ['ADMIN', 'HR'],
  employeeCreate: ['ADMIN', 'HR'],
  employeeUpdate: ['ADMIN', 'HR'],
  employeeDelete: ['ADMIN', 'HR'],
  employeeSelfUpdate: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],

  departmentView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  departmentManage: ['ADMIN'],
  companyConfigView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  companyStructureManage: ['ADMIN'],
  userRoleManage: ['ADMIN'],

  projectView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  projectManage: ['ADMIN', 'HR', 'MANAGER'],

  attendancePersonal: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  attendanceImportExcel: ['ADMIN', 'HR'],
  attendanceCalculate: ['ADMIN', 'HR'],
  attendanceSummary: ['ADMIN', 'HR', 'MANAGER'],
  attendanceExplanationSubmit: ['EMPLOYEE'],
  attendanceExplanationMine: ['EMPLOYEE'],
  attendanceExplanationManage: ['ADMIN', 'HR', 'MANAGER'],

  leavePersonal: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  leaveManage: ['ADMIN', 'HR'],

  overtimePersonal: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  overtimeManage: ['ADMIN', 'HR', 'MANAGER'],

  holidayView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  holidayManage: ['ADMIN', 'HR'],

  notificationMine: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  notificationManage: ['ADMIN', 'HR'],

  payrollManage: ['ADMIN', 'HR'],
  payroll: ['ADMIN', 'HR'],
  salaryConfig: ['ADMIN', 'HR'],

  jobView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  jobManage: ['ADMIN', 'HR'],
  cvUpload: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  cvPipelineManage: ['ADMIN', 'HR'],

  kpiView: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  kpiCreate: ['ADMIN', 'HR', 'MANAGER'],
  performanceTeam: ['ADMIN', 'HR', 'MANAGER'],
  performanceAllAnalyze: ['ADMIN', 'HR'],

  chatbotUse: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  chatbotDocumentManage: ['ADMIN', 'HR'],
  chatbot: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  chatbotDocumentUpload: ['ADMIN', 'HR'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function canAccess(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function canAccessAny(role: Role | undefined | null, permissions: readonly Permission[]): boolean {
  return permissions.some((permission) => canAccess(role, permission));
}
