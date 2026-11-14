import { Department, Gender, Role, Section, Shift, Version } from "#db-client";

interface ICreateSeedStudentPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  user_name: string;
  hashedPassword: string;
  role_name: Role;
  position_name: string;
  active_class_id: string;
  joining_date: string;
  class_name: string;
  year_name: string;
  roll_number: Number;
  shift_name: Shift;
  section: Section;
  version: Version;
  department: Department;
  quranic_subject_name: String;
  quranic_class_period_ids: String[];
  arabic_subject_names?: String[];
  arabic_period_ids?: String[]
};

// {
//   "full_name": "Sohana Faija",
//   "mobile_number": "01550156064",
//   "gender": "FEMALE",
//   "email": "sohana@gamil.com",
//   "position_name": "STUDENT",
//   "role_name": "STUDENT",
//   "joining_date": "2027-01-01",
//   "active_class_id": "35d83e3f-1f87-4936-8cd2-82ceeffdd426",
//   "year_name": "2027",
//   "shift_name":"DAY",
//   "section": "SCHOOL",
//   "version": "BENGALI",
//   "department": "GENERAL",
//   "roll_number": 1 ,
//   "quranic_subject_name": "NURANI_PLAYGROUP",
//   "quranic_class_period_ids": ["97c6e008-4415-456c-aa3d-301d8a7c7928"]
// }

export const seedInitialStudents = async()=>{
    
}