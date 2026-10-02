import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { checkRolePositionPair } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import {
  TCreateAcademicResultZodSchema,
  TDeleteAcademicResultZodSchema,
  TGetSingleAcademicResultZodSchema,
  TUpdateAcademicResultField,
} from "./academicResult.zod.validation";
import { prisma } from "../../lib/prisma";
import { academicResultHelper } from "./academicResult.helperFunction";
import { Prisma } from "#db-client";

// =============================================
// CREATE ACADEMIC RESULT SERVICE LAYER
// =============================================
const createAcademicResult = async (
  payload: TCreateAcademicResultZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const cleanRole = payload.role_name.trim().toUpperCase();
  const cleanPosition = payload.position_name.trim().toUpperCase();

  //  1. Validate role
  await findRoleExistence(cleanRole);

  // 2. Validate role-position relationship
  await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  //   3. Prevent unexpected role
  if (cleanRole === "STUDENT") {
    throw new AppError(
      `The provided role ${cleanRole} has no Academic Result record.`,
      StatusCodes.CONFLICT,
    );
  }
  // 4. Check role name to find the target field name
  let targetPrismaModel:
    | "managementStaff"
    | "academicStaff"
    | "governingBody"
    | undefined;
  let targetFieldName:
    | "management_staff"
    | "academic_staff"
    | "governing_body"
    | undefined;
  let auditEntityName:
    | "ManagementStaff"
    | "AcademicStaff"
    | "GoverningBody"
    | undefined;
  if (
    cleanRole === "MANAGEMENT" ||
    cleanRole === "ADMIN" ||
    cleanRole === "TEACHER_ADMIN" ||
    cleanRole === "SUPER_ADMIN"
  ) {
    targetPrismaModel = "managementStaff";
    targetFieldName = "management_staff";
    auditEntityName = "ManagementStaff";
  } else if (cleanRole === "ACADEMIC") {
    targetPrismaModel = "academicStaff";
    targetFieldName = "academic_staff";
    auditEntityName = "AcademicStaff";
  } else if (cleanRole === "GOVERNING_BODY") {
    targetPrismaModel = "governingBody";
    targetFieldName = "governing_body";
    auditEntityName = "GoverningBody";
  }

  if (!targetFieldName || !targetPrismaModel || !auditEntityName) {
    throw new AppError(`Invalid role.`, StatusCodes.BAD_REQUEST);
  }
  // 5. create payloadData for create academicResult
  const createPayloadData = academicResultHelper.createPayload(payload);

  // 6. dynamic existance check of the record
  const profileModelDelegate = prisma[targetPrismaModel] as any;
  const existingProfile = await profileModelDelegate.findUnique({
    where: { id: payload.required_id },
  });
  if (!existingProfile) {
    throw new AppError(
      `Profile record not found in ${auditEntityName} for ID: ${payload.required_id}`,
      StatusCodes.NOT_FOUND,
    );
  }
  return await prisma.$transaction(async (tx) => {
    // 7. create Academic Result
    const academicResult = await tx.academicResult.create({
      data: {
        ...createPayloadData,
        created_by: { connect: { id: loggedInUser.user_id } },
        [targetFieldName]: { connect: { id: payload.required_id } },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: academicResult.id,
        entity_name: auditEntityName,
        action: "CREATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: Prisma.JsonNull,
        new_value: academicResult as unknown as Prisma.InputJsonValue,
      },
    });
    return academicResult;
  });
};

// =============================================
// DELETE ACADEMIC RESULT SERVICE LAYER
// =============================================
const deleteAcademicResult = async (
  payload: TDeleteAcademicResultZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { academic_result_id } = payload;

  const academicResult = await prisma.academicResult.findUnique({
    where: { id: academic_result_id },
  });
  if (!academicResult) {
    throw new AppError(
      `Academic result record not found.`,
      StatusCodes.NOT_FOUND,
    );
  }
  return await prisma.$transaction(async (tx) => {
    const deleteAcademicResult = await tx.academicResult.delete({
      where: { id: academic_result_id },
    });
    await tx.auditLog.create({
      data: {
        entity_id: academic_result_id,
        entity_name: "AcademicResult",
        action: "DELETE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: academicResult as unknown as Prisma.InputJsonValue,
        new_value: Prisma.JsonNull,
      },
    });
    return deleteAcademicResult;
  });
};

// =============================================
// UPDATE ACADEMIC RESULT FIELD SERVICE LAYER
// =============================================
const updateAcademicResultField = async (
  payload: TUpdateAcademicResultField,
  loggedInUser: TLoggedInUser,
) => {
  // 1. Destructure payload
  const { academic_result_id, field, value } = payload;

  // 2. Check the existancce of the academic result id
  const existingAcademicResult = await prisma.academicResult.findUnique({
    where: { id: academic_result_id },
  });
  if (!existingAcademicResult) {
    throw new AppError(``, StatusCodes.NOT_FOUND);
  }

  // 3. update the field and create audit log with transaction
  return await prisma.$transaction(async (tx) => {
    // update field with value
    const updated = await tx.academicResult.update({
      where: { id: academic_result_id },
      data: {
        [field]: value,
      },
    });
    // create audit log
    await tx.auditLog.create({
      data: {
        entity_id: academic_result_id,
        entity_name: "AcademicResult",
        action: "UPDATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: {
          [field]:
            existingAcademicResult[
              field as keyof typeof existingAcademicResult
            ],
        },
        new_value: { [field]: updated[field as keyof typeof updated] },
      },
    });
    return updated;
  });
};

// ==========================================
// GET ALL ACADEMIC RESULTS SERVICE LAYER
// ==========================================
const getAllAcademicResults = async () => {
  // 1. get all academic results with person's basic info.
  const academicResults = await prisma.academicResult.findMany({
    include: {
      management_staff: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          current_role: { select: { role_name: true } },
          current_position: { select: { position_name: true } },
        },
      },
      academic_staff: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          current_role: { select: { role_name: true } },
          current_position: { select: { position_name: true } },
        },
      },
      governing_body: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          user_primary_data: {
            select: { current_role: true, current_position: true },
          },
        },
      },
    },
  });
  return academicResults;
};

// ================================================
// GET SINGLE ACADEMIC RESULT BY ID SERVICE LAYER
// ================================================
const getSingleAcademicResult = async (academic_result_id: string) => {
  // 1. get the single academic result
  const singleAcademicResult = await prisma.academicResult.findUnique({
    where: { id: academic_result_id },
    include: {
      management_staff: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          current_role: { select: { role_name: true } },
          current_position: { select: { position_name: true } },
        },
      },
      academic_staff: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          current_role: { select: { role_name: true } },
          current_position: { select: { position_name: true } },
        },
      },
      governing_body: {
        select: {
          full_name: true,
          mobile_number: true,
          email: true,
          user_primary_data: {
            select: { current_role: true, current_position: true },
          },
        },
      },
    },
  });

  // 2. Throw a strict 404 error if the record is missing
  if (!singleAcademicResult) {
    throw new AppError(
      "Academic result record not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  return singleAcademicResult;
};

// ==================================================
// GET ACADEMIC RESULT BY STAFF ID SERVICE LAYER
// ==================================================
const getAcademicResultByStaffId = async (
  staff_id: string,
  staff_role_name: string,
) => {
  const prismaTableName = academicResultHelper.findStaffTable(staff_role_name);
  const staffModel = (prisma as any)[prismaTableName];
  const staffData = await staffModel.findUnique({
    where: { id: staff_id },
    include: {
      academic_result: true,
    },
  });
  if (!staffData) {
    throw new AppError(
      `Staff or Governing Body data not found`,
      StatusCodes.NOT_FOUND,
    );
  };
  return staffData
};
export const academicResultServices = {
  createAcademicResult,
  deleteAcademicResult,
  updateAcademicResultField,
  getAllAcademicResults,
  getSingleAcademicResult,
  getAcademicResultByStaffId,
};
