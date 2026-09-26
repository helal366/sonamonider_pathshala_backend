import { StatusCodes } from "http-status-codes";
import { EducationDegree, Prisma } from "#db-client";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";

import { motherDetailsHelperFunctions } from "./motherDetails.helperFunction";

import {
  TUpdateMotherEducationalQualificationZodSchema,
  TUpdateMotherJobTitleZodSchema,
  TUpdateMotherMonthlyIncomeZodSchema,
  TUpdateMotherMobileNo1ZodSchema,
  TUpdateMotherMobileNo2ZodSchema,
  TUpdateMotherMobileNo3ZodSchema,
  TUpdateMotherNameZodSchema,
  TUpdateMotherNidZodSchema,
  TUpdateMotherOccupationZodSchema,
} from "./motherDetails.zod.validation";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { MotherDetailsField, MotherDetailsValue } from "./motherDetails.interface";

// ============================================================
// UPDATE MOTHER DETAILS FIELD
// ============================================================

const updateMotherField = async (
  user_id: string,
  field: MotherDetailsField,
  value: MotherDetailsValue,
  loggedInUser: TLoggedInUser,
) => {
  const targetUser = await motherDetailsHelperFunctions.getTargetUser(user_id);

  const motherDetailsId = targetUser.mother_details_id;

  if (!motherDetailsId) {
    throw new AppError(
      "Mother details are not connected to this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingMotherDetails = targetUser.mother_details;

  if (!existingMotherDetails) {
    throw new AppError(
      "Mother details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.motherDetails.update({
      where: {
        id: motherDetailsId,
      },
      data: {
        [field]: value,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      } as Prisma.MotherDetailsUpdateInput,
    });

    await transaction.auditLog.create({
      data: {
        entity_id: motherDetailsId,
        entity_name: "MotherDetails",
        old_value: {
          user_id,
          [field]:
            existingMotherDetails[
              field as keyof typeof existingMotherDetails
            ],
        },
        new_value: {
          user_id,
          [field]: value,
        },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updated;
  });
};

// ============================================================
// UPDATE MOTHER NAME
// ============================================================

const updateMotherName = (
  payload: TUpdateMotherNameZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "mother_name",
    payload.mother_name,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER NID
// ============================================================

const updateMotherNid = (
  payload: TUpdateMotherNidZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "nid_no",
    payload.nid_no,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER OCCUPATION
// ============================================================

const updateMotherOccupation = (
  payload: TUpdateMotherOccupationZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "occupation",
    payload.occupation,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER JOB TITLE
// ============================================================

const updateMotherJobTitle = (
  payload: TUpdateMotherJobTitleZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "job_title",
    payload.job_title,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

const updateMotherEducationalQualification = (
  payload: TUpdateMotherEducationalQualificationZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "educational_qualification",
    payload.educational_qualification,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER MONTHLY INCOME
// ============================================================

const updateMotherMonthlyIncome = (
  payload: TUpdateMotherMonthlyIncomeZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "monthly_income",
    payload.monthly_income,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER MOBILE NO 1
// ============================================================

const updateMotherMobileNo1 = (
  payload: TUpdateMotherMobileNo1ZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "mobile_no_1",
    payload.mobile_no_1,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER MOBILE NO 2
// ============================================================

const updateMotherMobileNo2 = (
  payload: TUpdateMotherMobileNo2ZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "mobile_no_2",
    payload.mobile_no_2,
    loggedInUser,
  );

// ============================================================
// UPDATE MOTHER MOBILE NO 3
// ============================================================

const updateMotherMobileNo3 = (
  payload: TUpdateMotherMobileNo3ZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateMotherField(
    payload.user_id,
    "mobile_no_3",
    payload.mobile_no_3,
    loggedInUser,
  );

export const motherDetailsPatchServices = {
  updateMotherName,
  updateMotherNid,
  updateMotherOccupation,
  updateMotherJobTitle,
  updateMotherEducationalQualification,
  updateMotherMonthlyIncome,
  updateMotherMobileNo1,
  updateMotherMobileNo2,
  updateMotherMobileNo3,
};