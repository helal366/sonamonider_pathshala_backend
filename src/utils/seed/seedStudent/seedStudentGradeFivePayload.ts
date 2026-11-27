import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeFiveSchoolAlFattahArabi
// ===================================================
const gradeFiveSchoolAlFattahArabi = async () => {
  const full_name = "Al Fattah Arabi";
  const mobile_number = "01310850454";
  const email = "arabi@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FIVE";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.BOYS;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_PRELIMINARY";
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
// payload GradeFiveMadrashaAyanBinJamil
// ===================================================
const gradeFiveMadrashaAyanBinJamil = async () => {
  const full_name = "Ayan Bin Jamil";
  const mobile_number = "01982861818";
  const email = "ayan@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FIVE";
  const academic_year_name = "2026";
  const roll_number = 5;
  const shift_name = Shift.BOYS;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = ["HIFZ_MORNING", "QURANIC_EVENING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_TWO"];
  const arabic_period_ids = await findArabicPeriodIds(arabic_period_names);
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
// payload GradeFiveSchoolAsiyaAkterJui
// ===================================================
const gradeFiveSchoolAsiyaAkterJui = async () => {
  const full_name = "Asiya Akter Jui";
  const mobile_number = "01790186874";
  const email = "asiya@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FIVE";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.GIRLS;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_ADVANCE";
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
// payload GradeFiveMadrashaSumayaAkter
// ===================================================
const gradeFiveMadrashaSumayaAkter = async () => {
  const full_name = "Sumaya Akter";
  const mobile_number = "01735045300";
  const email = "sumaya@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FIVE";
  const academic_year_name = "2026";
  const roll_number = 3;
  const shift_name = Shift.GIRLS;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_MORNING", "QURANIC_EVENING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_TWO"];
  const arabic_period_ids = await findArabicPeriodIds(arabic_period_names);
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
    arabic_period_ids,
  };
  return payload;
};

export const gradeFiveStudent = {
  gradeFiveSchoolAlFattahArabi,
  gradeFiveMadrashaAyanBinJamil,
  gradeFiveSchoolAsiyaAkterJui,
  gradeFiveMadrashaSumayaAkter,
};