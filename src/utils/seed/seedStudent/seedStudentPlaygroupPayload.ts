import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import {
  checkClassExisting,
  findQuranicPeriodIds,
} from "./seedStudentHelperFunction";

// ===================================================
// payload PlaygroupSchoolMuhsinaHasanMahima
// ===================================================
export const playgroupSchoolMuhsinaHasanMahima = async () => {
  const full_name = "Muhsina Hasan Mahima";
  const mobile_number = "01715261642";
  const email = "muhsina@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "PLAYGROUP"; //
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PLAYGROUP";
  const quranic_period_names = ["NURANI_PLAY_DAY"];
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
// payload PlaygroupSchoolKurratulAyinBarakah
// ===================================================

export const playgroupSchoolKurratulAyinBarakah = async () => {
  const full_name = "Kurratul Ayin Barakah";
  const mobile_number = "01796191300";
  const email = "kurratul@gmail.com";
  const gender = Gender.FEMALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "PLAYGROUP";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.DAY;
  const section = Section.SCHOOL;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PLAYGROUP";
  const quranic_period_names = ["NURANI_PLAY_DAY"];
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
// payload PlaygroupMadrashaMohammadMostofa
// ===================================================
export const playgroupMadrashaMohammadMostofa = async () => {
  const full_name = "Mohammad Mostofa";
  const mobile_number = "01915365750";
  const email = "mohammadmostofa@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "PLAYGROUP";
  const academic_year_name = "2026";
  const roll_number = 1;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PLAYGROUP";
  const quranic_period_names = ["NURANI_PLAY_MORNING"];
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
// payload PlaygroupMadrashaTahmidHossainBayejid
// ===================================================
export const playgroupMadrashaTahmidHossainBayejid = async () => {
  const full_name = "Tahmid Hossain Bayejid";
  const mobile_number = "01722190808";
  const email = "tahmidhossain@gmail.com";
  const gender = Gender.MALE;
  const password = "123456";
  const role_name = Role.STUDENT;
  const position_name = "STUDENT";
  const class_name = "PLAYGROUP";
  const academic_year_name = "2026";
  const roll_number = 2;
  const shift_name = Shift.MORNING;
  const section = Section.MADRASHA;
  const version = Version.ENGLISH;
  const department = Department.GENERAL;
  const quranic_subject_name = "NURANI_PLAYGROUP";
  const quranic_period_names = ["NURANI_PLAY_MORNING"];
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

export const playgroupStudent = {
  playgroupSchoolMuhsinaHasanMahima,
  playgroupSchoolKurratulAyinBarakah,
  playgroupMadrashaMohammadMostofa,
  playgroupMadrashaTahmidHossainBayejid,
};
