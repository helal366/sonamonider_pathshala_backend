import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findArabicPeriodIds,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload GradeThreeSchoolMaimunaAkterTuba
// ===================================================
const gradeThreeSchoolMaimunaAkterTuba = async () => {
  const full_name = "Maimuna Akter Tuba";
  const mobile_number = "01927091694";
  const email = "maimuna@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_THREE";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PRELIMINARY";
  const quranic_period_names = ["NURANI_MORNING", "ASSEMBLY"];
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
// payload GradeThreeSchoolRaiyanSarker
// ===================================================
const gradeThreeSchoolRaiyanSarker = async () => {
  const full_name = "Raiyan Sarker";
  const mobile_number = "01710179196";
  const email = "raiyan@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_THREE";
  const academic_year_name = "2026";
  const roll_number = 7;
  const shift_name = Shift.MORNING;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_AMMAPARA";
  const quranic_period_names = ["NURANI_MORNING", "ASSEMBLY"];
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
// payload GradeThreeMadrashaMiftahulJannat
// ===================================================
const gradeThreeMadrashaMiftahulJannat = async () => {
  const full_name = "Miftahul Jannat";
  const mobile_number = "01710179196";
  const email = "miftahul@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_THREE";
  const academic_year_name = "2026";
  const roll_number = 7;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_MORNING", "ASSEMBLY", "QURANIC_EVENING", "HIFZ_NIGHT"];
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
// payload GradeThreeMadrashaMohammadAlifHossain
// ===================================================
const gradeThreeMadrashaMohammadAlifHossain = async () => {
  const full_name = "Mohammad Alif Hossain";
  const mobile_number = "01712207933";
  const email = "alif@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "GRADE_THREE";
  const academic_year_name = "2026";
  const roll_number = 4;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ARABIC;
  const department = Department.GENERAL;
  const quranic_subject_name = "HIFZ";
  const quranic_period_names = ["HIFZ_MORNING", "ASSEMBLY", "QURANIC_EVENING", "HIFZ_NIGHT"];
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

export const gradeThreeStudent = {
    gradeThreeSchoolMaimunaAkterTuba,
    gradeThreeSchoolRaiyanSarker,
    gradeThreeMadrashaMiftahulJannat,
    gradeThreeMadrashaMohammadAlifHossain
}