import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeEightMadrashaSazzadHossain
// ===================================================
const gradeEightMadrashaSazzadHossain = async () => {
  const full_name = "Sazzad Hossain";
  const mobile_number = "01799900129";
  const email = "sazzad@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_EIGHT";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.BOYS;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = [
    "HIFZ_MORNING",
    "QURANIC_EVENING",
    "HIFZ_NIGHT",
  ];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC_1ST", "ARABIC_2ND"];
  const arabic_period_names = ["ARABIC_THREE"];
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

// ===================================================
// payload GradeEightMadrashaAbdullahAlFahmi
// ===================================================
const gradeEightMadrashaAbdullahAlFahmi = async () => {
  const full_name = "Abdullah Al Fahmi";
  const mobile_number = "01920223033";
  const email = "abdullah.alfahmi@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_EIGHT";
  const academic_year_name = "2026";
  const roll_number = 3;
  const shift_name = Shift.BOYS;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
  const quranic_period_names = [
    "HIFZ_MORNING",
    "QURANIC_EVENING",
    "HIFZ_NIGHT",
  ];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC_1ST", "ARABIC_2ND"];
  const arabic_period_names = ["ARABIC_THREE"];
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

// ===================================================
// payload GradeEightSchoolJannatulFerdous
// ===================================================
const gradeEightSchoolJannatulFerdous = async () => {
  const full_name = "Jannatul Ferdous";
  const mobile_number = "01713488577";
  const email = "jannatul.ferdous@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_EIGHT";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.GIRLS;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NAZERA_ADVANCE";
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

export const gradeEightStudent = {
  gradeEightMadrashaSazzadHossain,
  gradeEightMadrashaAbdullahAlFahmi,
  gradeEightSchoolJannatulFerdous,
};