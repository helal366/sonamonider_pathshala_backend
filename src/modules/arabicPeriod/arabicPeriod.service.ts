import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TCreateArabicPeriodZodSchema,
  TUpdateArabicPeriodSingleFieldZodSchema,
} from "./arabicPeriod.zodValidation";
import { Prisma } from "#db-client";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";

// ==========================================================
// CREATE ARABIC PERIOD SERVICE LAYER
// ==========================================================
const createArabicPeriod = async (
  payload: TCreateArabicPeriodZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { arabic_period_name, start_time, end_time } = payload;
  const cleanArabicPeriodName = arabic_period_name.trim().toUpperCase();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // Existing arabic period
  const arabicPeriod = await prisma.arabicPeriod.findUnique({
    where: { arabic_period_name: cleanArabicPeriodName },
    select: { id: true },
  });
  if (arabicPeriod) {
    throw new AppError(`Arabic period already exists.`, StatusCodes.CONFLICT);
  }

  return prisma.$transaction(async (transaction) => {
    const newPeriod = await transaction.arabicPeriod.create({
      data: {
        arabic_period_name: cleanArabicPeriodName,
        start_time: cleanStartTime,
        end_time: cleanEndTime,
        created_by_id: loggedInUser.user_id,
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: newPeriod.id,
        entity_name: "arabicPeriod",
        changed_by_id: loggedInUser.user_id,
        action: "CREATE",
        old_value: Prisma.JsonNull,
        new_value: newPeriod,
      },
    });
    return newPeriod;
  });
};

// ==========================================================
// DELETE ARABIC PERIOD SERVICE LAYER
// ==========================================================
const deleteArabicPeriod = async (
  arabic_period_id: string,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (transaction) => {
    const arabicPeriod = await transaction.arabicPeriod.findUnique({
      where: { id: arabic_period_id },
    });
    if (!arabicPeriod) {
      throw new AppError(`Arabic period not found.`, StatusCodes.NOT_FOUND);
    }

    const deleted = await transaction.arabicPeriod.delete({
      where: { id: arabic_period_id },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: arabic_period_id,
        entity_name: "arabicPeriod",
        changed_by_id: loggedInUser.user_id,
        action: "DELETE",
        old_value: arabicPeriod,
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

// ==========================================================
// UPDATE ARABIC PERIOD SINGLE FIELD SERVICE LAYER
// ==========================================================
const updateArabicPeriodSingleField = async (
  payload: TUpdateArabicPeriodSingleFieldZodSchema,
  arabicPeriodId: string,
  loggedInUser: TLoggedInUser,
) => {
  const { field, value } = payload;
  const cleanValue = value.trim().toUpperCase();
  return prisma.$transaction(async (transaction) => {
    // Find and check existance
    const arabicPeriod = await transaction.arabicPeriod.findUnique({
      where: { id: arabicPeriodId },
    });
    if (!arabicPeriod) {
      throw new AppError(`Arabic period not found.`, StatusCodes.NOT_FOUND);
    }
    // Check duplicate value
    if (arabicPeriod[field] === cleanValue) {
      throw new AppError(
        `Provided field value is already exists.`,
        StatusCodes.CONFLICT,
      );
    }
    if (field === "arabic_period_name") {
      const existingPeriod = await transaction.arabicPeriod.findFirst({
        where: {
          arabic_period_name: cleanValue,
          id: { not: arabicPeriodId },
        },
        select: { id: true },
      });
      if (existingPeriod) {
        throw new AppError(
          "Arabic period already exists.",
          StatusCodes.CONFLICT,
        );
      }
    }
    // Check start time is earlier than end time.
    if (field === "start_time") {
      const newStartTime = helperFunctions.toMinutes(cleanValue);
      const existingEndTime = helperFunctions.toMinutes(arabicPeriod.end_time);
      if (newStartTime >= existingEndTime) {
        throw new AppError(
          `Start time must be earlier than end time.`,
          StatusCodes.BAD_REQUEST,
        );
      }
    } else if (field === "end_time") {
      const existingStartTime = helperFunctions.toMinutes(
        arabicPeriod.start_time,
      );
      const newEndTime = helperFunctions.toMinutes(cleanValue);
      if (existingStartTime >= newEndTime) {
        throw new AppError(
          `Start time must be earlier than end time.`,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    // Update field
    const updated = await transaction.arabicPeriod.update({
      where: { id: arabicPeriodId },
      data: {
        [field]: cleanValue,
        updated_by_id: loggedInUser.user_id,
      },
    });

    // Create audit log
    await transaction.auditLog.create({
      data: {
        entity_id: arabicPeriodId,
        entity_name: "arabicPeriod",
        changed_by_id: loggedInUser.user_id,
        action: "DELETE",
        old_value: {
          [field]: arabicPeriod[field],
        },
        new_value: {
          [field]: cleanValue,
        },
      },
    });
  });
};

// ==========================================================
// GET ALL ARABIC PERIOD SERVICE LAYER
// ==========================================================
const getAllArabicPeriods = async () => {
  return prisma.arabicPeriod.findMany();
};

// ==========================================================
// GET SINGLE ARABIC PERIOD SERVICE LAYER
// ==========================================================
const getSingleArabicPeriod = async (arabicPeriodId: string) => {
  // Find and check the arabic period existance
  const arabicPeriod = await prisma.arabicPeriod.findUnique({
    where: { id: arabicPeriodId },
    include: {
      class_routines: {
        include: {
          class: {
            select: {
              class_name: true,
            },
          },
          students: true,
        },
      },
    },
  });

  if (!arabicPeriod) {
    throw new AppError(`The arabic period not found.`, StatusCodes.NOT_FOUND);
  }

  return arabicPeriod;
};
export const arabicPeriodServices = {
  createArabicPeriod,
  deleteArabicPeriod,
  updateArabicPeriodSingleField,
  getAllArabicPeriods,
  getSingleArabicPeriod,
};
