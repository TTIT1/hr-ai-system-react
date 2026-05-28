import type { PageResponse, Role, Status } from './common.type';

export interface Employee {
  id: string;
  idemployee: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  position?: string;
  level?: string;
  hire_date: string;
  birth_date?: string;
  gender?: string;
  id_number?: string;
  avatar_url?: string;
  status: Status;
  created_at?: string;
  updated_at?: string;

  // Additional Fields from API Docs
  manager_level_1?: string;
  manager_level_2?: string;
  contract_type?: string;
  contract_effective_date?: string;
  contract_expiry_date?: string;
  review_due_date?: string;
  resignation_date?: string | null;
  seniority?: string;
  permanent_address?: string;
  personal_email?: string;
  id_issue_date?: string;
  id_issue_place?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  programming_language?: string;
  major?: string;
  education_institution?: string;
  education_level?: string;
  degree_year?: number | string; // degree_year can be number or string in forms
  other_it_certificate?: string;
}

export interface EmployeeCreateRequest {
  idemployee: string;
  fullname: string;
  email: string;
  phone?: string;
  department_id: string;
  position?: string;
  level?: string;
  hire_date: string;
  birth_date?: string;
  gender?: string;
  id_number?: string;

  // Additional Fields from API Docs
  manager_level_1?: string;
  manager_level_2?: string;
  contract_type?: string;
  contract_effective_date?: string;
  contract_expiry_date?: string;
  review_due_date?: string;
  resignation_date?: string | null;
  seniority?: string;
  permanent_address?: string;
  personal_email?: string;
  id_issue_date?: string;
  id_issue_place?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  programming_language?: string;
  major?: string;
  education_institution?: string;
  education_level?: string;
  degree_year?: number | string;
  other_it_certificate?: string;
  role?: Role;
}

export interface EmployeeUpdateRequest {
  idemployee?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  department_id?: string;
  position?: string;
  level?: string;
  birth_date?: string;
  gender?: string;
  id_number?: string;
  status?: Status;

  // Additional Fields from API Docs
  manager_level_1?: string;
  manager_level_2?: string;
  contract_type?: string;
  contract_effective_date?: string;
  contract_expiry_date?: string;
  review_due_date?: string;
  resignation_date?: string | null;
  seniority?: string;
  permanent_address?: string;
  personal_email?: string;
  id_issue_date?: string;
  id_issue_place?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  programming_language?: string;
  major?: string;
  education_institution?: string;
  education_level?: string;
  degree_year?: number | string;
  other_it_certificate?: string;
  role?: Role;
}

export interface EmployeeFilters {
  status?: string;
  search?: string;
  department?: string;
  level?: string;
  page?: number;
  size?: number;
}

export type EmployeePageResponse = PageResponse<Employee>;

export interface Department {
  id: string;
  name: string;
  parent_id?: string | null;
  manager_id?: string | null;
  created_at?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  parent_id?: string | null;
  manager_id?: string | null;
}
