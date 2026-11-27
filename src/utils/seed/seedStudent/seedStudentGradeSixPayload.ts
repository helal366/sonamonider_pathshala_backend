import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeSixSchoolArnobHossain
// ===================================================
const gradeSixSchoolArnobHossain = async () => {
  const full_name = "Arnob Hossain";
  const mobile_number = "01707770124";
  const email = "arnob@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_SIX";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.BOYS;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_PRELIMINARY";
  const quranic_period_names = ["HIFZ_MORNING"];
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
// payload GradeSixSchoolMdNadimKhan
// ===================================================
const gradeSixSchoolMdNadimKhan = async () => {
  const full_name = "Md Nadim Khan";
  const mobile_number = "01405696516";
  const email = "nadim@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_SIX";
  const academic_year_name = "2026";
  const roll_number = 4;
  const shift_name = Shift.BOYS;
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

// ===================================================
// payload GradeSixSchoolSaymaRahmanAmirah
// ===================================================
const gradeSixSchoolSaymaRahmanAmirah = async () => {
  const full_name = "Sayma Rahman Amirah";
  const mobile_number = "01716167994";
  const email = "sayma@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_SIX";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.GIRLS;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_PRELIMINARY";
  const quranic_period_names = ["HIFZ_MORNING"];
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
// payload GradeSixMadrashaSarminAkterSanjeda
// ===================================================
const gradeSixMadrashaSarminAkterSanjeda = async () => {
  const full_name = "Sarmin Akter Sanjeda";
  const mobile_number = "01758093225";
  const email = "sarmin@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_SIX";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.GIRLS;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_GIRLS", "NURANI_NAZERA_GIRLS"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC_1ST", "ARABIC_2ND"];
  const arabic_period_names = ["ARABIC_ONE_GIRLS"];
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

export const gradeSixStudent = {
  gradeSixSchoolArnobHossain,
  gradeSixSchoolMdNadimKhan,
  gradeSixSchoolSaymaRahmanAmirah,
  gradeSixMadrashaSarminAkterSanjeda,
};