import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeOneSchoolShefaAkter
// ===================================================
const gradeOneSchoolShefaAkter = async () => {
  const full_name = "Shefa Akter";
  const mobile_number = "01876455058";
  const email = "shefa@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_ONE";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_NAZERA_GIRLS"];
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

// ===================================================
// payload GradeOneSchoolMinhaHasanSafa
// ===================================================
const gradeOneSchoolMinhaHasanSafa = async () => {
  const full_name = "Minha Hasan Safa";
  const mobile_number = "01771408771";
  const email = "minha@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_ONE ";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_NAZERA_GIRLS"];
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

// ===================================================
// payload GradeOneMadrashaMdRayhan
// ===================================================
const gradeOneMadrashaMdRayhan = async () => {
  const full_name = "Md. Rayhan";
  const mobile_number = "01712549461";
  const email = "rayhan@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_ONE ";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_MORNING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_ONE"];
  const arabic_period_ids = await findArabicPeriodIds(arabic_period_names)
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
    arabic_subject_names,
    arabic_period_ids
  };
  return payload;
};

// ===================================================
// payload GradeOneMadrashaTasnimIslamPori
// ===================================================
const gradeOneMadrashaTasnimIslamPori = async () => {
  const full_name = "Tasnim Islam Pori";
  const mobile_number = "01340473273";
  const email = "tasnim@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_ONE";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_MORNING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_ONE"];
  const arabic_period_ids = await findArabicPeriodIds(arabic_period_names)
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
    arabic_subject_names,
    arabic_period_ids
  };
  return payload;
};

export const gradeOneStudent = {
  gradeOneSchoolShefaAkter,
  gradeOneSchoolMinhaHasanSafa,
  gradeOneMadrashaMdRayhan,
  gradeOneMadrashaTasnimIslamPori
}