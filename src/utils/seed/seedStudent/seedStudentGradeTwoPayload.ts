import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeTwoSchoolMdAbdullahAlJamil
// ===================================================
const gradeTwoSchoolMdAbdullahAlJamil = async () => {
  const full_name = "Md. Abdullah Al-Jamil";
  const mobile_number = "01927091694";
  const email = "aljamil@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_TWO";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_PRELIMINARY";
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
// payload GradeTwoSchoolKaziRokeyaRaisa
// ===================================================
const gradeTwoSchoolKaziRokeyaRaisa = async () => {
  const full_name = "Kazi Rokeya Raisa";
  const mobile_number = "01712688110";
  const email = "rokeya@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_TWO";
  const academic_year_name = "2026";
  const roll_number = 3;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = ["NURANI_NAZERA_GIRLS"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_ONE"];
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
// payload GradeTwoMadrashaSafwanMabrur
// ===================================================
const gradeTwoMadrashaSafwanMabrur = async () => {
  const full_name = "Safwan Mabrur";
  const mobile_number = "01711649420";
  const email = "safwan@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_TWO";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = ["NURANI_MORNING", "ASSEMBLY"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_ONE"];
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
// payload GradeTwoMadrashaHaseenShadab
// ===================================================
const gradeTwoMadrashaHaseenShadab = async () => {
  const full_name = "Haseen Shadab";
  const mobile_number = "01716586600";
  const email = "haseen@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_TWO";
  const academic_year_name = "2026";
  const roll_number = 3;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = ["NURANI_MORNING", "ASSEMBLY"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
  const arabic_period_names = ["ARABIC_ONE"];
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


export const gradeTwoStudent = {
  gradeTwoSchoolMdAbdullahAlJamil,
  gradeTwoSchoolKaziRokeyaRaisa,
  gradeTwoMadrashaSafwanMabrur,
  gradeTwoMadrashaHaseenShadab
};
