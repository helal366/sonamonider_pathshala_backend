import { EducationDegree, Prisma } from "#db-client";

import { prisma } from "../../lib/prisma";

import { motherDetailsHelperFunctions } from "./motherDetails.helperFunction";
import { LoggedInUser } from "./motherDetails.interface";

type MotherDetailsDeleteField =
  | "nid_no"
  | "occupation"
  | "job_title"
  | "educational_qualification"
  | "monthly_income"
  | "mobile_no_1"
  | "mobile_no_2"
  | "mobile_no_3";

type MotherDetailsDeleteValue = string | EducationDegree | null;

const deleteMotherField = async (
  user_id: string,
  field: MotherDetailsDeleteField,
  loggedInUser: LoggedInUser,
) => {
  const targetUser =
    await motherDetailsHelperFunctions.getTargetUser(user_id);

  const motherDetailsId = targetUser.mother_details_id as string;
  const motherDetails = targetUser.mother_details;

  const oldValue =
    motherDetails?.[field as keyof typeof motherDetails] ?? null;

  return prisma.$transaction(async (transaction) => {
    const updatedMotherDetails = await transaction.motherDetails.update({
      where: {
        id: motherDetailsId,
      },
      data: {
        [field]: null as MotherDetailsDeleteValue,
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
          [field]: oldValue,
        },
        new_value: {
          user_id,
          [field]: null,
        },
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updatedMotherDetails;
  });
};

// ============================================================
// DELETE MOTHER NID
// ============================================================

const deleteMotherNid = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "nid_no",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER OCCUPATION
// ============================================================

const deleteMotherOccupation = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "occupation",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER JOB TITLE
// ============================================================

const deleteMotherJobTitle = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "job_title",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

const deleteMotherEducationalQualification = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "educational_qualification",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER MONTHLY INCOME
// ============================================================

const deleteMotherMonthlyIncome = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "monthly_income",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER MOBILE NO 1
// ============================================================

const deleteMotherMobileNo1 = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "mobile_no_1",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER MOBILE NO 2
// ============================================================

const deleteMotherMobileNo2 = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "mobile_no_2",
    loggedInUser,
  );
};

// ============================================================
// DELETE MOTHER MOBILE NO 3
// ============================================================

const deleteMotherMobileNo3 = async (
  payload: { user_id: string },
  loggedInUser: LoggedInUser,
) => {
  return deleteMotherField(
    payload.user_id,
    "mobile_no_3",
    loggedInUser,
  );
};

export const motherDetailsDeleteServices = {
  deleteMotherNid,
  deleteMotherOccupation,
  deleteMotherJobTitle,
  deleteMotherEducationalQualification,
  deleteMotherMonthlyIncome,
  deleteMotherMobileNo1,
  deleteMotherMobileNo2,
  deleteMotherMobileNo3,
};

