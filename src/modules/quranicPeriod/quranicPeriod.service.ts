import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateQuranicPeriodZodSchema,
  toMinutes,
  TUpdateQuranicPeriodSingleFieldPayload,
  TUpdateQuranicPeriodZodSchema,
} from "./quranicPeriod.zodValidation.js";

const ensureNoRoutineScheduleConflict = async (
  transaction: Prisma.TransactionClient,
  quranicPeriodId: string,
  startTime: string,
  endTime: string,
) => {
  const affectedRoutines = await transaction.classRoutine.findMany({
    where: { quranic_period_id: quranicPeriodId },
    select: {
      id: true,
      shift_id: true,
      class: { select: { id: true } },
      teachers: { select: { id: true } },
    },
  });

  if (affectedRoutines.length === 0) return;

  const teacherIds = [...new Set(affectedRoutines.flatMap((routine) =>
    routine.teachers.map(({ id }) => id),
  ))];
  const classIds = [...new Set(affectedRoutines.flatMap((routine) =>
    routine.class.map(({ id }) => id),
  ))];
  const shiftIds = [
    ...new Set(
      affectedRoutines
        .map(({ shift_id }) => shift_id)
        .filter((shiftId): shiftId is string => shiftId !== null),
    ),
  ];
  const classOverlapFilter = affectedRoutines.some(
    (routine) => routine.shift_id === null,
  )
    ? { class: { some: { id: { in: classIds } } } }
    : {
        class: { some: { id: { in: classIds } } },
        OR: [{ shift_id: { in: shiftIds } }, { shift_id: null }],
      };
  const otherRoutines = await transaction.classRoutine.findMany({
    where: {
      OR: [
        { teachers: { some: { id: { in: teacherIds } } } },
        classOverlapFilter,
      ],
    },
    select: {
      id: true,
      shift_id: true,
      class: { select: { id: true } },
      teachers: { select: { id: true } },
      period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
    },
  });

  const proposedStart = toMinutes(startTime);
  const proposedEnd = toMinutes(endTime);

  for (const routine of affectedRoutines) {
    for (const otherRoutine of otherRoutines) {
      if (routine.id === otherRoutine.id) {
        continue;
      }

      const conflicts =
        routine.teachers.some(({ id }) =>
          otherRoutine.teachers.some((teacher) => teacher.id === id),
        ) ||
        ((routine.shift_id === null ||
          otherRoutine.shift_id === null ||
          routine.shift_id === otherRoutine.shift_id) &&
          routine.class.some(({ id }) =>
            otherRoutine.class.some((classRecord) => classRecord.id === id),
          ));
      if (!conflicts) continue;

      const otherStart =
        otherRoutine.period?.start_time ??
        otherRoutine.quranic_period?.start_time;
      const otherEnd =
        otherRoutine.period?.end_time ??
        otherRoutine.quranic_period?.end_time;

      if (
        otherStart &&
        otherEnd &&
        proposedStart < toMinutes(otherEnd) &&
        toMinutes(otherStart) < proposedEnd
      ) {
        throw new AppError(
          "This time change would overlap another class routine for a teacher or class in the same shift.",
          StatusCodes.CONFLICT,
        );
      }
    }
  }
};

// ========================================================
// CREATE QURANIC PERIOD SERVICE LAYER
// ========================================================
const createQuranicPeriod = async (
  payload: TCreateQuranicPeriodZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_period_name, start_time, end_time } = payload;
  const cleanPeriodName = quranic_period_name.trim().toUpperCase();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // 1. Prevent duplicate period slot configurations to ensure clean schedules
  const existingPeriod = await prisma.quranicPeriod.findFirst({
    where: {
      quranic_period_name: cleanPeriodName,
    },
    select: { id: true},
  });

  if (existingPeriod) {
    throw new AppError(
      `Quranic period "${cleanPeriodName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Commit record creation and audit trails atomically
  const result = await prisma.$transaction(async (transaction) => {
    const newPeriod = await transaction.quranicPeriod.create({
      data: {
        quranic_period_name: cleanPeriodName,
        start_time: cleanStartTime,
        end_time: cleanEndTime,
        created_by_id: loggedInUser.user_id,
      },
    });

    // Write camelCase audit log tracking row
    await transaction.auditLog.create({
      data: {
        entity_id: newPeriod.id,
        entity_name: "quranicPeriod",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          quranic_period_name: cleanPeriodName,
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

// ========================================================
// UPDATE QURANIC PERIOD SERVICE LAYER
// ========================================================
const updateQuranicPeriod = async (
  payload: TUpdateQuranicPeriodZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
  quranic_period_id: string
) => {
  const { quranic_period_name, start_time, end_time } =
    payload;
  const cleanPeriodName = quranic_period_name.trim().toUpperCase();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // 1. Verify target record exists inside the master table
  const currentPeriod = await prisma.quranicPeriod.findUnique({
    where: { id: quranic_period_id },
    select: {
      id: true,
      quranic_period_name: true,
      start_time: true,
      end_time: true,
    },
  });

  if (!currentPeriod) {
    throw new AppError(
      "Quranic period not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  // 2. Prevent scheduling name/time slot clashes across other items
  const scheduleConflict = await prisma.quranicPeriod.findFirst({
    where: {
      quranic_period_name: cleanPeriodName,
      id: { not: quranic_period_id },
    },
    select: { id: true },
  });

  if (scheduleConflict) {
    throw new AppError(
      `Quranic period "${cleanPeriodName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Execute updates inside transaction block
  const result = await prisma.$transaction(
    async (transaction) => {
      if (
        currentPeriod.start_time !== cleanStartTime ||
        currentPeriod.end_time !== cleanEndTime
      ) {
        await ensureNoRoutineScheduleConflict(
          transaction,
          quranic_period_id,
          cleanStartTime,
          cleanEndTime,
        );
      }

      const updated = await transaction.quranicPeriod.update({
        where: { id: quranic_period_id },
        data: {
          quranic_period_name: cleanPeriodName,
          start_time: cleanStartTime,
          end_time: cleanEndTime,
          updated_by_id: loggedInUser.user_id,
        },
      });

      await transaction.auditLog.create({
        data: {
          entity_id: quranic_period_id,
          entity_name: "quranicPeriod",
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
          old_value: {
            quranic_period_name: currentPeriod.quranic_period_name,
            start_time: currentPeriod.start_time,
            end_time: currentPeriod.end_time,
          },
          new_value: {
            quranic_period_name: cleanPeriodName,
            start_time: cleanStartTime,
            end_time: cleanEndTime,
          },
        },
      });

      return updated;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  return result;
};

// =========================================================
// UPDATE QURANIC PERIOD SINGLE FIELD CONTROLLER
// =========================================================
const updateQuranicPeriodSingleField = async (
  payload: TUpdateQuranicPeriodSingleFieldPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
  quranic_period_id: string
) => {
  const {  field, value } = payload;
  const cleanValue = value.trim().toUpperCase();
  // 1. Fetch the targeted period instance alongside explicit column values
  const currentPeriod = await prisma.quranicPeriod.findUnique({
    where: { id: quranic_period_id },
    select: {
      id: true,
      quranic_period_name: true,
      start_time: true,
      end_time: true,
    },
  });

  if (!currentPeriod) {
    throw new AppError(
      "The provided quranic period does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  // 2. Prevent unneeded database execution updates if incoming parameter matches database state
  if (currentPeriod[field] === cleanValue) {
    throw new AppError(
      `The provided value for '${field.replace(/_/g, " ")}' is identical to the current record.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // 3. Build a dynamic configuration check to ensure the new value doesn't cause a schedule conflict
  if (field === "quranic_period_name") {
  const existingPeriod = await prisma.quranicPeriod.findFirst({
    where: {
      quranic_period_name: cleanValue,
      id: { not: quranic_period_id },
    },
    select: { id: true },
  });

  if (existingPeriod) {
    throw new AppError(
      `Quranic period "${cleanValue}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }
}

if (field === "start_time" || field === "end_time") {
  const nextStartTime =
    field === "start_time" ? cleanValue : currentPeriod.start_time;

  const nextEndTime =
    field === "end_time" ? cleanValue : currentPeriod.end_time;

  if (toMinutes(nextEndTime) <= toMinutes(nextStartTime)) {
    throw new AppError(
      "End time must be after start time.",
      StatusCodes.BAD_REQUEST,
    );
  }
}
  // 4. Atomically commit individual field updates and write structural audit log tracking records
  return prisma.$transaction(async (transaction) => {
    if (field === "start_time" || field === "end_time") {
      await ensureNoRoutineScheduleConflict(
        transaction,
        quranic_period_id,
        field === "start_time" ? cleanValue : currentPeriod.start_time,
        field === "end_time" ? cleanValue : currentPeriod.end_time,
      );
    }

    const updated = await transaction.quranicPeriod.update({
      where: { id: quranic_period_id },
      data: {
        [field]: cleanValue,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: quranic_period_id,
        entity_name: "quranicPeriod",
        old_value: { [field]: currentPeriod[field] },
        new_value: { [field]: cleanValue },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updated;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
};

// =========================================================
// DELETE QURANIC PERIOD SERVICE
// =========================================================
const deleteQuranicPeriod = async (
  quranic_period_id: string,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  // 1. Verify existence and track cross-dependencies
  const targetPeriod = await prisma.quranicPeriod.findUnique({
    where: { id: quranic_period_id },
    include: {
      _count: {
        select: {
          class_history_quranic_periods: true,
          class_routines: true,
        },
      },
    },
  });

  if (!targetPeriod) {
    throw new AppError(
      "Quranic period not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  // 2. Reject deletion if active or historical data points depend on this record
  if (targetPeriod._count.class_history_quranic_periods > 0) {
    throw new AppError(
      `Cannot delete Period '${
        targetPeriod.quranic_period_name
      }'. There are student academic timelines linked to it.`,
      StatusCodes.CONFLICT,
    );
  }

  if (targetPeriod._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete period "${targetPeriod.quranic_period_name}". It is used by ${targetPeriod._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Atomically delete record
  const result = await prisma.$transaction(async (transaction) => {
    const deleted = await transaction.quranicPeriod.delete({
      where: { id: quranic_period_id },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: quranic_period_id,
        entity_name: "quranicPeriod",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          quranic_period_name: targetPeriod.quranic_period_name,
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
// GET ALL QURANIC PERIODS SERVICE LAYER
// =========================================================
const getAllQuranicPeriods = async () => {
  const periods = await prisma.quranicPeriod.findMany({
    orderBy: { start_time: "asc" },
    include: {
      _count: { select: { class_history_quranic_periods: true } },
    },
  });

  return periods;
};

// =========================================================
// GET SINGLE QURANIC PERIOD SERVICE
// =========================================================
const getSingleQuranicPeriod = async (id: string) => {
  const period = await prisma.quranicPeriod.findUnique({
    where: { id },
    include: {
      _count: { select: { class_history_quranic_periods: true } },
    },
  });

  if (!period) {
    throw new AppError(
      "Requested Quranic Class Period does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  return period;
};

export const quranicPeriodServices = {
  createQuranicPeriod,
  updateQuranicPeriod,
  deleteQuranicPeriod,
  getAllQuranicPeriods,
  getSingleQuranicPeriod,
  updateQuranicPeriodSingleField,
};
