// ============================================================
// IMPORTS
// ============================================================
import { StatusCodes } from "http-status-codes";
import { Prisma } from "#db-client";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma";
import { SpouseInformationDeleteField, SpouseInformationDeleteValue } from "./spouseInformation.interface.js";
import {
  TDeleteSpouseInformationFieldZodSchema,
} from "./spouseInformation.zod.validation";


// ============================================================
// DELETE SPOUSE INFORMATION FIELD
// ============================================================
const deleteSpouseInformationField = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  field: SpouseInformationDeleteField,
  loggedInUser: TLoggedInUser,
) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: payload.user_id,
    },
    select: {
      id: true,
      full_name: true,
      spouse_information: {
        select: {
          id: true,
          full_name: true,
          contact_no: true,
          father_name: true,
          father_contact_no: true,
          mother_name: true,
          mother_contact_no: true,
          occupation: true,
          job_title: true,
          monthly_income: true,
        },
      },
    },
  });

  // CHECK TARGET USER
  if (!targetUser) {
    throw new AppError(
      "The provided user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

// CHECK SPOUSE INFORMATION
  const spouseInformation = targetUser.spouse_information;

  if (!spouseInformation) {
    throw new AppError(
      "Spouse information not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  const spouseInformationId = spouseInformation.id;

  // GET OLD VALUE
  const oldValue =
    spouseInformation[field as keyof typeof spouseInformation] ?? null;

 // DELETE SPOUSE INFORMATION FIELD
  return prisma.$transaction(async (transaction) => {
    const updatedSpouseInformation =
      await transaction.spouseInformation.update({
        where: {
          id: spouseInformationId,
        },
        data: {
          [field]: null as SpouseInformationDeleteValue,
          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        } as Prisma.SpouseInformationUpdateInput,
      });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: spouseInformationId,
        entity_name: "SpouseInformation",
        old_value: {
          user_id: payload.user_id,
          [field]: oldValue,
        },
        new_value: {
          user_id: payload.user_id,
          [field]: null,
        },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updatedSpouseInformation;
  });
};

// ============================================================
// DELETE SPOUSE CONTACT NO
// ============================================================
const deleteSpouseContactNo = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "contact_no",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE FATHER NAME
// ============================================================
const deleteSpouseFatherName = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "father_name",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE FATHER CONTACT NO
// ============================================================
const deleteSpouseFatherContactNo = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "father_contact_no",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE MOTHER NAME
// ============================================================
const deleteSpouseMotherName = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "mother_name",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE MOTHER CONTACT NO
// ============================================================
const deleteSpouseMotherContactNo = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "mother_contact_no",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE OCCUPATION
// ============================================================
const deleteSpouseOccupation = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "occupation",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE JOB TITLE
// ============================================================
const deleteSpouseJobTitle = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "job_title",
    loggedInUser,
  );

// ============================================================
// DELETE SPOUSE MONTHLY INCOME
// ============================================================
const deleteSpouseMonthlyIncome = async (
  payload: TDeleteSpouseInformationFieldZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  deleteSpouseInformationField(
    payload,
    "monthly_income",
    loggedInUser,
  );

// ============================================================
// EXPORT SPOUSE INFORMATION DELETE SERVICES
// ============================================================
export const spouseInformationDeleteServices = {
  deleteSpouseContactNo,
  deleteSpouseFatherName,
  deleteSpouseFatherContactNo,
  deleteSpouseMotherName,
  deleteSpouseMotherContactNo,
  deleteSpouseOccupation,
  deleteSpouseJobTitle,
  deleteSpouseMonthlyIncome,
};
