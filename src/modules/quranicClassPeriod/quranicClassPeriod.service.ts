import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateQuranicClassPeriodZodSchema,
  TDeleteQuranicClassPeriodZodSchema,
  TUpdateQuranicClassPeriodSingleFieldPayload,
  TUpdateQuranicClassPeriodZodSchema,
} from "./quranicClassPeriod.zodValidation.js";

// CREATE QURANIC CLASS PERIOD SERVICE
const createQuranicClassPeriod = async (
  payload: TCreateQuranicClassPeriodZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_period_name, start_time, end_time } = payload;
  const cleanPeriodName = quranic_class_period_name.trim();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // 1. Prevent duplicate period slot configurations to ensure clean schedules
  const existingPeriod = await prisma.quranicClassPeriod.findFirst({
    where: {
      quranic_class_period_name: { equals: cleanPeriodName, mode: "insensitive" },
      start_time: cleanStartTime,
      end_time: cleanEndTime,
    },
    select: { id: true },
  });

  if (existingPeriod) {
    throw new AppError(
      `Quranic Class Period '${cleanPeriodName}' with this exact time slot already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Commit record creation and audit trails atomically
  const result = await prisma.$transaction(async (tx) => {
    const newPeriod = await tx.quranicClassPeriod.create({
      data: {
        quranic_class_period_name: cleanPeriodName,
        start_time: cleanStartTime,
        end_time: cleanEndTime,
        created_by_id: loggedInUser.user_id,
      },
    });

    // Write camelCase audit log tracking row
    await tx.auditLog.create({
      data: {
        entity_id: newPeriod.id,
        entity_name: "quranicClassPeriod",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          quranic_class_period_name: cleanPeriodName,
          start_time: cleanStartTime,
          end_time: cleanEndTime,
          created_by_id: loggedInUser.user_id,
        },
      },
    });

    return newPeriod;
  });

  return result;
};

// UPDATE QURANIC CLASS PERIOD SERVICE
const updateQuranicClassPeriod = async (
  payload: TUpdateQuranicClassPeriodZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_period_id, quranic_class_period_name, start_time, end_time } = payload;
  const cleanPeriodName = quranic_class_period_name.trim().toUpperCase();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // 1. Verify target record exists inside the master table
  const currentPeriod = await prisma.quranicClassPeriod.findUnique({
    where: { id: quranic_class_period_id },
    select: { id: true, quranic_class_period_name: true, start_time: true, end_time: true },
  });

  if (!currentPeriod) {
    throw new AppError("Quranic Class Period not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Prevent scheduling name/time slot clashes across other items
  const scheduleConflict = await prisma.quranicClassPeriod.findFirst({
    where: {
      quranic_class_period_name: cleanPeriodName,
      start_time: cleanStartTime,
      end_time: cleanEndTime,
      id: { not: quranic_class_period_id },
    },
    select: { id: true },
  });

  if (scheduleConflict) {
    throw new AppError(
      `Another Quranic Class Period configuration clashes with this specific time schedule.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Execute updates inside transaction block
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.quranicClassPeriod.update({
      where: { id: quranic_class_period_id },
      data: {
        quranic_class_period_name: cleanPeriodName,
        start_time: cleanStartTime,
        end_time: cleanEndTime,
        updated_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_class_period_id,
        entity_name: "quranicClassPeriod",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          quranic_class_period_name: currentPeriod.quranic_class_period_name,
          start_time: currentPeriod.start_time,
          end_time: currentPeriod.end_time,
        },
        new_value: {
          quranic_class_period_name: cleanPeriodName,
          start_time: cleanStartTime,
          end_time: cleanEndTime,
          updated_by_id: loggedInUser.user_id,
        },
      },
    });

    return updated;
  });

  return result;
};

// =========================================================
// UPDATE QURANIC CLASS SINGLE FIELD CONTROLLER
// =========================================================
const updateQuranicClassPeriodSingleField = async (
  payload: TUpdateQuranicClassPeriodSingleFieldPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_period_id, field, value } = payload;

  // 1. Fetch the targeted period instance alongside explicit column values
  const currentPeriod = await prisma.quranicClassPeriod.findUnique({
    where: { id: quranic_class_period_id },
    select: {
      id: true,
      quranic_class_period_name: true,
      start_time: true,
      end_time: true,
    },
  });

  if (!currentPeriod) {
    throw new AppError(
      "The provided Quranic class period does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  // 2. Prevent unneeded database execution updates if incoming parameter matches database state
  if (currentPeriod[field] === value) {
    throw new AppError(
      `The provided value for '${field.replace(/_/g, " ")}' is identical to the current record.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // 3. Build a dynamic configuration check to ensure the new value doesn't cause a schedule conflict
  const conflictFilter: Record<string, any> = {
    quranic_class_period_name: currentPeriod.quranic_class_period_name,
    start_time: currentPeriod.start_time,
    end_time: currentPeriod.end_time,
  };
  
  // Overwrite the specific target parameter being evaluated with the new value input
  conflictFilter[field] = value;

  const scheduleConflict = await prisma.quranicClassPeriod.findFirst({
    where: {
      quranic_class_period_name: { equals: conflictFilter.quranic_class_period_name, mode: "insensitive" },
      start_time: conflictFilter.start_time,
      end_time: conflictFilter.end_time,
      id: { not: quranic_class_period_id }, // Ignore self instance row
    },
    select: { id: true },
  });

  if (scheduleConflict) {
    throw new AppError(
      "Cannot update field. This change introduces a duplicate schedule configuration clash with another period.",
      StatusCodes.CONFLICT,
    );
  }

  // 4. Atomically commit individual field updates and write structural audit log tracking records
  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.quranicClassPeriod.update({
      where: { id: quranic_class_period_id },
      data: {
        [field]: value,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: quranic_class_period_id,
        entity_name: "quranicClassPeriod",
        old_value: { [field]: currentPeriod[field] },
        new_value: { [field]: value },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updated;
  });
};

// =========================================================
// DELETE QURANIC CLASS PERIOD SERVICE
// =========================================================
const deleteQuranicClassPeriod = async (
  payload: TDeleteQuranicClassPeriodZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_period_id } = payload;

  // 1. Verify existence and track cross-dependencies
  const targetPeriod = await prisma.quranicClassPeriod.findUnique({
    where: { id: quranic_class_period_id },
    include: {
      _count: {
        select: { class_history_quranic_periods: true }, // Checks dependency links in active student histories
      },
    },
  });

  if (!targetPeriod) {
    throw new AppError("Quranic Class Period not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Reject deletion if active or historical data points depend on this record
  if (targetPeriod._count.class_history_quranic_periods > 0) {
    throw new AppError(
      `Cannot delete Period '${targetPeriod.quranic_class_period_name}'. There are student academic timelines linked to it.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Atomically delete record
  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.quranicClassPeriod.delete({
      where: { id: quranic_class_period_id },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_class_period_id,
        entity_name: "quranicClassPeriod",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          quranic_class_period_name: targetPeriod.quranic_class_period_name,
          start_time: targetPeriod.start_time,
          end_time: targetPeriod.end_time,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });

  return result;
};

// =========================================================
// GET ALL QURANIC CLASS PERIODS SERVICE
// =========================================================
const getAllQuranicClassPeriods = async () => {
  const periods = await prisma.quranicClassPeriod.findMany({
    orderBy: { start_time: "asc" },
    include: {
      _count: { select: { class_history_quranic_periods: true } },
    },
  });

  return periods;
};

// =========================================================
// GET SINGLE QURANIC CLASS PERIOD SERVICE
// =========================================================
const getSingleQuranicClassPeriod = async (id: string) => {
  const period = await prisma.quranicClassPeriod.findUnique({
    where: { id },
    include: {
      _count: { select: { class_history_quranic_periods: true } },
    },
  });

  if (!period) {
    throw new AppError("Requested Quranic Class Period does not exist.", StatusCodes.NOT_FOUND);
  }

  return period;
};

export const quranicClassPeriodServices = {
  createQuranicClassPeriod,
  updateQuranicClassPeriod,
  deleteQuranicClassPeriod,
  getAllQuranicClassPeriods,
  getSingleQuranicClassPeriod,
  updateQuranicClassPeriodSingleField
};
