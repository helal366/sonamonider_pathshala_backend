import { Department, Gender, Role, Section, Shift, Version } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { envVars } from "../../config";

interface ICreateSeedStudentPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  password: string;
  role_name: Role;
  position_name: string;
  active_class_id: string;
  joining_date: string;
  year_name: string;
  roll_number: number;
  shift_name: Shift;
  section: Section;
  version: Version;
  department: Department;
  quranic_subject_name: string;
  quranic_class_period_ids: string[];
  arabic_subject_names?: string[];
  arabic_period_ids?: string[];
}
interface StudentDataPayload {
  role_name: Role;
  position_name: string;
  active_class_id: string;
  year_name: string;
  quranic_subject_name: string;
  quranic_class_period_ids: string[];
  arabic_subject_names?: string[];
  arabic_period_ids?: string[];
}
interface CreateUserPayload {
  full_name: string;
  mobile_number: string;
}
const createStudent = async (payload: ICreateSeedStudentPayload) => {
  const {
    full_name,
    mobile_number,
    email,
    gender,
    password,
    role_name,
    position_name,
    active_class_id,
    joining_date,
    year_name,
    roll_number,
    shift_name,
    section,
    version,
    department,
    quranic_subject_name,
    quranic_class_period_ids,
    arabic_subject_names,
    arabic_period_ids,
  } = payload;
  // validate payload
  const validatePayload = {
    role_name,
    position_name,
    active_class_id,
    year_name,
    quranic_subject_name,
    quranic_class_period_ids,
    arabic_subject_names,
    arabic_period_ids,
  };
  // user validation and create user name
  const user_name = await createUserName({full_name, mobile_number})
  // validate data
  await validateStudentData(validatePayload);
  // hashed password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  // clean year name
  const cleanYearName = year_name.trim();
  if (!/^\d{4}$/.test(cleanYearName)) {
    throw new AppError(
      "Academic year must be a four-digit year.",
      StatusCodes.BAD_REQUEST,
    );
  }
  // create start and end date and effective joining date
  const academicStartDate = new Date(`${cleanYearName}-01-01T00:00:00.000Z`);
  const academicEndDate = new Date(`${cleanYearName}-12-31T23:59:59.999Z`);
  const effectiveJoiningDate = new Date(`${joining_date}T00:00:00.000Z`);
  // create user and student and class history
  await prisma.$transaction(async (transaction) => {
    const created = await transaction.user.create({
      data: {
        full_name,
        mobile_number,
        email,
        gender,
        user_name,
        user_password: hashedPassword,
        joining_date: effectiveJoiningDate,
        current_role: role_name,
        is_email_verified: true,

        current_position: {
          connect: {
            position_name,
          },
        },
        student_profile: {
          create: {
            active_class: {
              connect: {
                id: active_class_id,
              },
            },
            class_history: {
              create: {
                class: { connect: { id: active_class_id } },
                academic_year: { connect: { academic_year_name: year_name } },
                shift: shift_name,
                roll_number,
                section,
                version,
                department,
                start_date: academicStartDate,
                end_date: academicEndDate,
                quranic_subject: { connect: { quranic_subject_name } },
                class_history_quranic_periods: {
                  create: quranic_class_period_ids.map((id: string) => ({
                    quranic_period: { connect: { id } },
                  })),
                },
                ...(arabic_subject_names?.length
                  ? {
                      class_history_arabic_subjects: {
                        create: arabic_subject_names.map((subject) => ({
                          arabic_subject: {
                            connect: { arabic_subject_name: subject },
                          },
                        })),
                      },
                    }
                  : {}),
                ...(arabic_period_ids?.length
                  ? {
                      class_history_arabic_period_ids: {
                        create: arabic_period_ids.map((id) => ({
                          arabic_period: { connect: { id } },
                        })),
                      },
                    }
                  : {}),
              },
            },
          },
        },
      },
      include: {
        student_profile: {select: {id: true}}
      }
    });

  });
};

// create PlaygroupSchoolMuhsinaHasanMahima
const playgroupSchoolMuhsinaHasanMahima = async()=>{

}
export const seedInitialStudents = async () => {
  createStudent;
};

async function validateStudentData(payload: StudentDataPayload) {
  const {
    role_name,
    position_name,
    active_class_id,
    year_name,
    quranic_subject_name,
    quranic_class_period_ids,
    arabic_subject_names,
    arabic_period_ids,
  } = payload;
  const position = await prisma.userPosition.findUnique({
    where: { position_name },
  });
  if (!position) {
    throw new AppError(`Provided position not found.`, StatusCodes.NOT_FOUND);
  }
  if (role_name !== "STUDENT") {
    throw new AppError(
      `Only Student role is required.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  const activeClass = await prisma.class.findUnique({
    where: {
      id: active_class_id,
    },
    select: {
      id: true,
      class_name: true,
    },
  });
  if (!activeClass) {
    throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
  }
  const yearName = await prisma.academicYear.findUnique({
    where: {
      academic_year_name: year_name,
    },
  });
  if (!yearName) {
    throw new AppError(`Academic year not found.`, StatusCodes.NOT_FOUND);
  }

  const quranicSubjectName = await prisma.quranicSubject.findUnique({
    where: {
      quranic_subject_name,
    },
  });
  if (!quranicSubjectName) {
    throw new AppError(
      `Provided quranic subject not found.`,
      StatusCodes.NOT_FOUND,
    );
  }

  if (!quranic_class_period_ids || quranic_class_period_ids.length === 0) {
    throw new AppError(
      `Minimum one quranic class period id required.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  await Promise.all(
    quranic_class_period_ids.map(async (id) => {
      const checkExisting = await prisma.quranicPeriod.findUnique({
        where: { id },
        select: { id: true, quranic_period_name: true },
      });
      if (!checkExisting) {
        throw new AppError(
          `Invalid quranic period ID: ${id}`,
          StatusCodes.NOT_FOUND,
        );
      }
    }),
  );

  if (arabic_subject_names && arabic_subject_names.length > 0) {
    await Promise.all(
      arabic_subject_names.map(async (asn) => {
        const singleArabicSubject = await prisma.arabicSubject.findUnique({
          where: { arabic_subject_name: asn },
        });
        if (!singleArabicSubject) {
          throw new AppError(
            `Arabic subject: ${asn} not found.`,
            StatusCodes.NOT_FOUND,
          );
        }
      }),
    );
  }

  if (arabic_period_ids && arabic_period_ids.length > 0) {
    await Promise.all(
      arabic_period_ids.map(async (id) => {
        const singleId = await prisma.arabicPeriod.findUnique({
          where: { id },
        });
        if (!singleId) {
          throw new AppError(
            `Arabic period ID: ${id} not found.`,
            StatusCodes.NOT_FOUND,
          );
        }
      }),
    );
  }
}

async function createUserName(payload: CreateUserPayload){
  const {full_name, mobile_number} = payload;
  const user = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number
      }
    },
    select: {
      current_role: true
    }
  });
  if(user){
    throw new AppError(`User already exists with the provided name: ${full_name} and mobile number: ${mobile_number} and the role is: ${user.current_role}.`, StatusCodes.CONFLICT)
  }
  const userCount = await prisma.student.count({
      where: { user_primary_data: { mobile_number } },
    });
  const userName = userCount === 0 ? mobile_number : `${mobile_number}-${userCount}`
  return userName
}
