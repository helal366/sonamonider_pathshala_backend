import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  SpouseInformationField,
  SpouseInformationValue,
} from "./spouseInformation.interface";
import {
  TUpdateSpouseNameZodSchema,
  TUpdateSpouseContactNoZodSchema,
  TUpdateSpouseFatherNameZodSchema,
  TUpdateSpouseFatherContactNoZodSchema,
  TUpdateSpouseMotherNameZodSchema,
  TUpdateSpouseMotherContactNoZodSchema,
  TUpdateSpouseOccupationZodSchema,
  TUpdateSpouseJobTitleZodSchema,
  TUpdateSpouseMonthlyIncomeZodSchema,
} from "./spouseInformation.zod.validation";
import { Prisma } from "#db-client";

// ============================================================
// UPDATE SPOUSE INFORMATION FIELD
// ============================================================
const updateSpouseInformationField = async (
  user_id: string,
  field: SpouseInformationField,
  value: SpouseInformationValue,
  loggedInUser: TLoggedInUser,
) => {
  // CHECK TARGET USER
  const targetUser = await prisma.user.findUnique({
    where: { id: user_id },
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

  // CHECK SPOUSE INFORMATION
  const spouseInfo = targetUser?.spouse_information;
  const spouseInfoId = targetUser?.spouse_information?.id;

  if (!spouseInfo || !spouseInfoId) {
    throw new AppError("Spouse information not found.", StatusCodes.NOT_FOUND);
  };


  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.spouseInformation.update({
      where: { id: spouseInfoId },
      data: {
        [field]: value,
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
      } as Prisma.SpouseInformationUpdateInput,
    });

    await transaction.auditLog.create({
      data: {
        entity_id: spouseInfoId,
        entity_name: "SpouseInformation",
        old_value: {
          user_id,
          [field]: spouseInfo[field as keyof typeof spouseInfo],
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
// UPDATE SPOUSE FULL NAME SERVICE
// ============================================================
const updateSpouseName = async (
  payload: TUpdateSpouseNameZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "full_name",
    payload.full_name,
    loggedInUser,
  );


// ============================================================
// UPDATE SPOUSE CONTACT NO SERVICE
// ============================================================

const updateSpouseContactNo = async (
  payload: TUpdateSpouseContactNoZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "contact_no",
    payload.contact_no,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE FATHER NAME SERVICE
// ============================================================

const updateSpouseFatherName = async (
  payload: TUpdateSpouseFatherNameZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "father_name",
    payload.father_name,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE FATHER CONTACT NO SERVICE
// ============================================================

const updateSpouseFatherContactNo = async (
  payload: TUpdateSpouseFatherContactNoZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "father_contact_no",
    payload.father_contact_no,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE MOTHER NAME SERVICE
// ============================================================

const updateSpouseMotherName = async (
  payload: TUpdateSpouseMotherNameZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "mother_name",
    payload.mother_name,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE MOTHER CONTACT NO SERVICE
// ============================================================

const updateSpouseMotherContactNo = async (
  payload: TUpdateSpouseMotherContactNoZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "mother_contact_no",
    payload.mother_contact_no,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE OCCUPATION SERVICE
// ============================================================

const updateSpouseOccupation = async (
  payload: TUpdateSpouseOccupationZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "occupation",
    payload.occupation,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE JOB TITLE SERVICE
// ============================================================

const updateSpouseJobTitle = async (
  payload: TUpdateSpouseJobTitleZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "job_title",
    payload.job_title,
    loggedInUser,
  );

// ============================================================
// UPDATE SPOUSE MONTHLY INCOME SERVICE
// ============================================================

const updateSpouseMonthlyIncome = async (
  payload: TUpdateSpouseMonthlyIncomeZodSchema,
  loggedInUser: TLoggedInUser,
) =>
  updateSpouseInformationField(
    payload.user_id,
    "monthly_income",
    payload.monthly_income,
    loggedInUser,
  );

// ============================================================
// EXPORT SPOUSE INFORMATION PATCH SERVICES
// ============================================================

export const spouseInformationPatchServices = {
  updateSpouseName,
  updateSpouseContactNo,
  updateSpouseFatherName,
  updateSpouseFatherContactNo,
  updateSpouseMotherName,
  updateSpouseMotherContactNo,
  updateSpouseOccupation,
  updateSpouseJobTitle,
  updateSpouseMonthlyIncome,
};
