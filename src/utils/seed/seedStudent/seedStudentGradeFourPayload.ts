import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeFourSchoolAdnanSamiRizwan
// ===================================================
const gradeFourSchoolAdnanSamiRizwan = async () => {
  const full_name = "Adnan Sami Rizwan";
  const mobile_number = "01721127169";
  const email = "adnan@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FOUR";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PRELIMINARY";
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
// payload GradeFourSchoolMufidulIslam
// ===================================================
const gradeFourSchoolMufidulIslam = async () => {
  const full_name = "Mufidul Islam";
  const mobile_number = "01836164923";
  const email = "mufidul@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FOUR";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PRELIMINARY";
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
// payload GradeFourMadrashaRuheeSiddique
// ===================================================
const gradeFourMadrashaRuheeSiddique = async () => {
  const full_name = "Ruhee Siddique";
  const mobile_number = "01317462223";
  const email = "ruhee@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FOUR";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_MORNING", "QURANIC_EVENING"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
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
    arabic_period_ids
  };
  return payload;
};

// ===================================================
// payload GradeFourMadrashaAtaurRahman
// ===================================================
const gradeFourMadrashaAtaurRahman = async () => {
  const full_name = "Ataur Rahman";
  const mobile_number = "01768989912";
  const email = "ataur@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_FOUR";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_MORNING", "QURANIC_EVENING", "HIFZ_NIGHT"];
  const quranic_period_ids = await findQuranicPeriodIds(quranic_period_names);
  const arabic_subject_names = ["ARABIC"];
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
    arabic_period_ids
  };
  return payload;
};

export const gradeFourStudent = {
    gradeFourSchoolAdnanSamiRizwan,
    gradeFourSchoolMufidulIslam,
    gradeFourMadrashaRuheeSiddique,
    gradeFourMadrashaAtaurRahman
}