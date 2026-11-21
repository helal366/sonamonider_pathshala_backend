import { Department, Gender, Role, Section, Shift, Version } from "#db-client";

export interface ICreateSeedStudentPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  password: string;
  role_name: Role;
  position_name: string;
  active_class_id: string;
  joining_date: string;
  academic_year_name: string;
  roll_number: number;
  shift_name: Shift;
  section: Section;
  version: Version;
  department: Department;
  quranic_subject_name: string;
  quranic_period_ids: string[];
  arabic_subject_names?: string[];
  arabic_period_ids?: string[];
}

export interface StudentDataPayload {
  role_name: Role;
  position_name: string;
  active_class_id: string;
  academic_year_name: string;
  quranic_subject_name: string;
  quranic_period_ids: string[];
  arabic_subject_names?: string[];
  arabic_period_ids?: string[];
}
export interface CreateUserPayload {
  full_name: string;
  mobile_number: string;
}