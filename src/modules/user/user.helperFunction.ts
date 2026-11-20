import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  IBuildInitialAuditRecordsPayload,
  IDynamicProfilePayload,
  IExistencePayload,
  IFindSubProfilePayload,
  IStudentRequirementsPayload,
  IUserCount,
} from "./user.interface.js";
import { Department, Prisma, Role, Section, Shift, Version } from "#db-client";

const isManagement = ["MANAGEMENT"];

const userExistence = async ({
  role_name,
  full_name,
  mobile_number,
}: IExistencePayload) => {
  if (isManagement.includes(role_name)) {
    return await prisma.managementStaff.findFirst({
      where: {
        user_primary_data: {
          full_name,
          mobile_number,
        },
      },
      include: {
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            email: true,
          },
        },
      },
    });
  } else if (role_name === Role.STUDENT) {
    return await prisma.student.findFirst({
      where: {
        user_primary_data: {
          full_name,
          mobile_number,
        },
      },
      include: {
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            email: true,
          },
        },
      },
    });
  } else if (role_name === Role.ACADEMIC) {
    return await prisma.academicStaff.findFirst({
      where: {
        user_primary_data: {
          full_name,
          mobile_number,
        },
      },
      include: {
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            email: true,
          },
        },
      },
    });
  } else if (role_name === Role.GOVERNING_BODY) {
    return await prisma.governingBody.findFirst({
      where: {
        user_primary_data: {
          full_name,
          mobile_number,
        },
      },
      include: {
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            email: true,
          },
        },
      },
    });
  }
  return null;
};

const userCount = async ({ role_name: role, mobile_number }: IUserCount) => {
  if (isManagement.includes(role)) {
    return await prisma.managementStaff.count({
      where: { user_primary_data: { mobile_number } },
    });
  } else if (role === "STUDENT") {
    return await prisma.student.count({
      where: { user_primary_data: { mobile_number } },
    });
  } else if (role === "GOVERNING_BODY") {
    return await prisma.governingBody.count({
      where: { user_primary_data: { mobile_number } },
    });
  } else if (role === "ACADEMIC") {
    return await prisma.academicStaff.count({
      where: { user_primary_data: { mobile_number } },
    });
  }
  return 0;
};

const userCreationRolePostionCheck = (
  role_name: string,
  position_name: string,
) => {
  // role_name and position_name are or create user not of loggedInUser
  // CHECK THE ROLE IS PERMITTED OR NOT.
  if (
    role_name !== "MANAGEMENT" &&
    role_name !== "ACADEMIC" &&
    role_name !== "STUDENT" &&
    role_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `The user with the provided role ${role_name} is not allowed to create.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  // CHECK THE POSITION IS PERMITTED OR NOT.
  if (
    position_name !== "MANAGEMENT_STAFF" &&
    position_name !== "ACADEMIC_STAFF" &&
    position_name !== "STUDENT" &&
    position_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `The user with the provided position ${position_name} is not allowed to create.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  // CHECK ROLE AND POSITION COMBINATION TO CREATE USER
  if (role_name === "STUDENT" && position_name !== "STUDENT") {
    throw new AppError(
      `User with role STUDENT can create with position STUDENT.`,
      StatusCodes.BAD_REQUEST,
    );
  } else if (
    role_name === "GOVERNING_BODY" &&
    position_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `User with role GOVERNING_BODY can create with position GOVERNING_BODY.`,
      StatusCodes.BAD_REQUEST,
    );
  } else if (
    role_name === "MANAGEMENT" &&
    position_name !== "MANAGEMENT_STAFF"
  ) {
    throw new AppError(
      `User with role MANAGEMENT can create with position MANAGEMENT_STAFF.`,
      StatusCodes.BAD_REQUEST,
    );
  } else if (role_name === "ACADEMIC" && position_name !== "ACADEMIC_STAFF") {
    throw new AppError(
      `User with role ACADEMIC can create with position ACADEMIC_STAFF.`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

const buildDynamicProfileData = (payload: IDynamicProfilePayload) => {
  const { cleanRole, positionId, loggedInUserId, active_class_id } = payload;

  let targetEntityName = "";
  const profileData: Record<string, any> = {};

  if (isManagement.includes(cleanRole)) {
    targetEntityName = "managementStaff";
    profileData.management_staff_profile = {
      create: {
        current_position: { connect: { id: positionId } },
        current_role: cleanRole,
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  } else if (cleanRole === Role.ACADEMIC) {
    targetEntityName = "academicStaff";
    profileData.academic_staff_profile = {
      create: {
        current_position: { connect: { id: positionId } },
        current_role: cleanRole,
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  } else if (cleanRole === Role.STUDENT) {
    if (!active_class_id) {
      throw new AppError(
        "active_class_id is required to onboard a Student profile.",
        StatusCodes.BAD_REQUEST,
      );
    }
    targetEntityName = "student";
    profileData.student_profile = {
      create: {
        active_class: { connect: { id: active_class_id } },
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  } else if (cleanRole === Role.GOVERNING_BODY) {
    targetEntityName = "governingBody";
    profileData.governing_body_profile = {
      create: {
        current_position: { connect: { id: positionId } },
        current_role: cleanRole,
        created_by: { connect: { id: loggedInUserId } },
      },
    };
  }
  return { profileData, targetEntityName };
};

const findSubProfileId = (payload: IFindSubProfilePayload) => {
  const { cleanRole, createdUser, targetEntityName } = payload;
  let subProfileId = "";
  if (isManagement.includes(cleanRole))
    subProfileId = createdUser.management_staff_profile?.id || "";
  if (cleanRole === "ACADEMIC")
    subProfileId = createdUser.academic_staff_profile?.id || "";
  if (cleanRole === "STUDENT")
    subProfileId = createdUser.student_profile?.id || "";
  if (cleanRole === "GOVERNING_BODY")
    subProfileId = createdUser.governing_body_profile?.id || "";

  if (!subProfileId) {
    throw new AppError(
      `Failed to initialize associated ${targetEntityName} profile record during onboarding.`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  return subProfileId;
};

const buildInitialAuditRecords = (
  payload: IBuildInitialAuditRecordsPayload,
): Prisma.AuditLogCreateManyInput[] => {
  const {
    userId,
    subProfileId,
    targetEntityName,
    full_name,
    mobile_number,
    email,
    cleanRole,
    cleanPosition,
    positionId,
    loggedInUserId,
  } = payload;
  return [
    {
      entity_id: userId,
      entity_name: "user",
      old_value: Prisma.JsonNull,
      new_value: {
        full_name,
        mobile_number,
        email,
        current_role: cleanRole,
        current_position: cleanPosition,
      } as Prisma.InputJsonValue,
      action: "CREATE",
      changed_by_id: loggedInUserId,
    },
    {
      entity_id: subProfileId,
      entity_name:
        targetEntityName === "managementStaff"
          ? "managementStaff"
          : targetEntityName,
      old_value: Prisma.JsonNull,
      new_value: {
        full_name,
        mobile_number,
        email,
        position_id: positionId,
      } as Prisma.InputJsonValue,
      action: "CREATE",
      changed_by_id: loggedInUserId,
    },
  ];
};

const getStandardStudentFeeRatesForClass = async ({
  transaction,
  class_id,
  section,
  version,
  department,
}: {
  transaction: Prisma.TransactionClient;
  class_id: string;
  section: Section;
  version: Version;
  department: Department;
}) => {
  const standardStudentFeeRates =
    await transaction.standardStudentFeeRate.findMany({
      where: {
        section,
        version,
        department,
        // assigned_classes: {
        //   some: { class_id },
        // },
      },
      select: {
        id: true,
        fee_type: true,
        billing_frequency: true,
        amount: true,
        section: true,
        version: true,
        department: true,
        assigned_classes: {
          select: {
            class_id: true,
          },
        },
      },
    });
  console.dir(standardStudentFeeRates, { depth: null });
  if (standardStudentFeeRates.length === 0) {
    throw new AppError(
      "No standard student fee rates are configured for this class.",
      StatusCodes.NOT_FOUND,
    );
  }

  const feeRateKeys = new Set<string>();
  for (const standardFeeRate of standardStudentFeeRates) {
    const feeRateKey = `${standardFeeRate.fee_type}:${standardFeeRate.billing_frequency}`;
    if (feeRateKeys.has(feeRateKey)) {
      throw new AppError(
        `Multiple standard student fee rates are configured for ${standardFeeRate.fee_type} (${standardFeeRate.billing_frequency}).`,
        StatusCodes.CONFLICT,
      );
    }
    feeRateKeys.add(feeRateKey);
  }

  return standardStudentFeeRates;
};

const checkStudentCreationRequirements = async (
  studentsRequirementPayload: IStudentRequirementsPayload,
) => {
  const {
    transaction,
    active_class_id,
    academic_year_name,
    shift_name,
    roll_number,
    section,
    version,
    department,
    quranic_subject_name,
    quranic_period_ids,
    arabic_subject_names,
    arabic_period_ids,
  } = studentsRequirementPayload;

  // CHECK ARABIC SUBJECT NAMES
  if (arabic_subject_names && arabic_subject_names.length !== 0) {
    await Promise.all(
      arabic_subject_names.map(async (subj) => {
        const checkExisting = await transaction.arabicSubject.findUnique({
          where: { arabic_subject_name: subj },
          select: { id: true, arabic_subject_name: true },
        });
        if (!checkExisting) {
          throw new AppError(
            `Arabic subject: ${subj} not found in database.`,
            StatusCodes.NOT_FOUND,
          );
        }
      }),
    );
  }

  // CHECK ARABIC PERIOD ID
  if (
    arabic_period_ids &&
    new Set(arabic_period_ids).size !== arabic_period_ids.length
  ) {
    throw new AppError(
      "Arabic period IDs must be unique.",
      StatusCodes.BAD_REQUEST,
    );
  }
  if (arabic_period_ids && arabic_period_ids.length !== 0) {
    await Promise.all(
      arabic_period_ids.map(async (id) => {
        const existing = await transaction.arabicPeriod.findUnique({
          where: { id },
          select: {
            id: true,
            arabic_period_name: true,
          },
        });
        if (!existing) {
          throw new AppError(
            `Arabic period not found in database`,
            StatusCodes.NOT_FOUND,
          );
        }
      }),
    );
  }
  // CHECK IS ACTIVE CLASS
  if (!active_class_id) {
    throw new AppError(`Active class ID not found.`, StatusCodes.NOT_FOUND);
  }
  const classCheck = await transaction.class.findUnique({
    where: { id: active_class_id },
    select: {
      is_active_class: true,
    },
  });
  if (!classCheck) {
    throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
  }
  if (!classCheck.is_active_class) {
    throw new AppError(`The class is not active.`, StatusCodes.BAD_REQUEST);
  }
  // CHECK THE YEAR NAME
  if (!academic_year_name) {
    throw new AppError(
      `Academic year is required for student entry.`,
      StatusCodes.NOT_FOUND,
    );
  }
  const cleanAcademicYearName = academic_year_name.trim();
  if (!/^\d{4}$/.test(cleanAcademicYearName)) {
    throw new AppError(
      "Academic year must be a four-digit year.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const academicStartDate = new Date(
    `${cleanAcademicYearName}-01-01T00:00:00.000Z`,
  );
  const academicEndDate = new Date(
    `${cleanAcademicYearName}-12-31T23:59:59.999Z`,
  );

  const academicYear = await transaction.academicYear.findUnique({
    where: { academic_year_name: cleanAcademicYearName },
    select: { id: true },
  });

  if (!academicYear) {
    throw new AppError(
      `Provided Academic Year ${academic_year_name} not found`,
      StatusCodes.NOT_FOUND,
    );
  }

  // CHECK SECTION
  if (!section) {
    throw new AppError("Section is required.", StatusCodes.NOT_FOUND);
  }

  // CHECK VERSION
  if (!version) {
    throw new AppError("Version is required.", StatusCodes.NOT_FOUND);
  }

  // CHECK DEPARTMENT
  if (!department) {
    throw new AppError("Department is required.", StatusCodes.NOT_FOUND);
  }

  // CHECK THE SHIFT NAME
  const existingShift = Object.values(Shift).find(
    (shift) => shift === shift_name?.trim().toUpperCase(),
  );
  if (!existingShift) {
    throw new AppError(
      `Provided shift ${shift_name} is invalid.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  if (existingShift === Shift.MORNING && section !== Section.MADRASHA) {
    throw new AppError(
      "Morning shift only allows MADRASHA section.",
      StatusCodes.BAD_REQUEST,
    );
  } else if (existingShift === Shift.DAY && section !== Section.SCHOOL) {
    throw new AppError(
      "Day shift only allows SCHOOL section.",
      StatusCodes.BAD_REQUEST,
    );
  }

  // CHECK ROLL NUMBER
  if (!roll_number || !Number.isInteger(roll_number) || roll_number < 1) {
    throw new AppError(
      "Roll number must be a positive integer.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const rollNumberConflict = await transaction.classHistory.findFirst({
    where: {
      roll_number,
      class_id: active_class_id,
      shift: existingShift,
      academic_year_id: academicYear.id,
    },
    select: { id: true },
  });
  if (rollNumberConflict) {
    throw new AppError(
      `Roll number ${roll_number} is already occupied in this class, shift, and academic year.`,
      StatusCodes.CONFLICT,
    );
  }

  // CHECK QURANIC CLASS NAME
  if (!quranic_subject_name) {
    throw new AppError(
      `Quranic class name is required.`,
      StatusCodes.NOT_FOUND,
    );
  }
  const cleanQuranicSubjectName = quranic_subject_name.trim().toUpperCase();
  const existingQuranicSubject = await transaction.quranicSubject.findUnique({
    where: { quranic_subject_name: cleanQuranicSubjectName },
    select: { id: true },
  });
  if (!existingQuranicSubject) {
    throw new AppError(
      `Provided quranic subject name ${cleanQuranicSubjectName} not found in database.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // CHECK QURANIC CLASS PERIOD
  if (!quranic_period_ids) {
    throw new AppError(
      `Quranic class period not found.`,
      StatusCodes.NOT_FOUND,
    );
  }
  if (quranic_period_ids.length === 0) {
    throw new AppError(
      `Minimum one quranic class period ID is required.`,
      StatusCodes.NOT_FOUND,
    );
  }
  if (new Set(quranic_period_ids).size !== quranic_period_ids.length) {
    throw new AppError(
      "Quranic class period IDs must be unique.",
      StatusCodes.BAD_REQUEST,
    );
  }
  await Promise.all(
    quranic_period_ids.map(async (id) => {
      const checkExisting = await transaction.quranicPeriod.findUnique({
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

  return {
    activeClassID: active_class_id.trim(),
    academicStartDate,
    academicEndDate,
    academicYear,
    existingShift,
    rollNumber: roll_number,
    section,
    version,
    department,
    existingQuranicSubject,
    quranicPeriodIDs: quranic_period_ids,
    arabicSubjectNames: arabic_subject_names,
    arabicSubjectPeriod: arabic_period_ids,
  };
};

export const userHelperFunction = {
  userExistence,
  userCount,
  userCreationRolePostionCheck,
  buildDynamicProfileData,
  findSubProfileId,
  buildInitialAuditRecords,
  checkStudentCreationRequirements,
  getStandardStudentFeeRatesForClass,
};
