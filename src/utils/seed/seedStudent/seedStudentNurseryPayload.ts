import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload NurserySchoolMaryamBari
// ===================================================
export const nurserySchoolMaryamBari = async () => {
  const full_name = "Maryam Bari";
  const mobile_number = "01727661987";
  const email = "maryam@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "NURSERY";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_NURSERY";
  const quranic_period_names = ["NURANI_NURSERY_DAY"];
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
// payload NurserySchoolAfrahaRahman
// ===================================================
export const nurserySchoolAfrahaRahman = async () => {
  const full_name = "Afraha Rahman";
  const mobile_number = "01830094935";
  const email = "afraha@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "NURSERY";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_NURSERY";
  const quranic_period_names = ["NURANI_NURSERY_DAY"];
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
// payload NurseryMadrashaRumaisaReza
// ===================================================
export const nurseryMadrashaRumaisaReza = async () => {
  const full_name = "Rumaisa Reza";
  const mobile_number = "01830094935";
  const email = "rumaisa@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "NURSERY";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_NURSERY";
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

// ===================================================
// payload NurseryMadrashaAhnafTahmid
// ===================================================
export const nurseryMadrashaAhnafTahmid = async () => {
  const full_name = "Ahnaf Tahmid";
  const mobile_number = "01717718828";
  const email = "ahnaftahmid@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "NURSERY";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_NURSERY";
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

export const nurserStudent = {
  nurserySchoolMaryamBari,
  nurserySchoolAfrahaRahman,
  nurseryMadrashaRumaisaReza,
  nurseryMadrashaAhnafTahmid,
};
