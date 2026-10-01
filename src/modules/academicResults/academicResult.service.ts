import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { checkRolePositionPair } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { TCreateAcademicResultZodSchema } from "./academicResult.zod.validation";
import { prisma } from "../../lib/prisma";
import { academicResultHelper } from "./academicResult.helperFunction";
import { Prisma } from "#db-client";

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
  return await prisma.$transaction(async(tx)=>{
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
     return academicResult
 })
};

export const academicResultServices = {
  createAcademicResult,
};
