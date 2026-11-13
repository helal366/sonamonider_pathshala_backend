import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import { prisma } from "../../lib/prisma";



interface ICreateSeedStudentPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  user_name: string;
  hashedPassword: string;
  current_role: Role;
  position_name: string;
  class_name: string;
  academic_year_name: string;
  roll_number: Number;
  shift: Shift;
  section: Section;
  version: Version;
  department: Department;
  quranic_subject: String;
  quraing_periods: String[];
  
};

export const seedInitialStudents = async()=>{
    
}