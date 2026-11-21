import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeOneSchoolShefaAkter
// ===================================================
export const gradeOneSchoolShefaAkter = async () => {
  const full_name = "Shefa Akter";
  const mobile_number = "01876455058";
  const email = "shefa@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_ONE ";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_MORNING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const joining_date = `${academic_year_name}-01-01`;

  const active_class_id = await checkClassExisting(class_name);

  const payload = {
    full_name,
    mobile_number,
    email,
    gender,
    password,
    role_name,
    position_name,
    active_class_id,
    joining_date,
    academic_year_name,
    roll_number,
    shift_name,
    section,
    version,
    department,
    quranic_subject_name,
    quranic_period_ids,
  };
  return payload;
};
export const gradeOneStudent = {

}