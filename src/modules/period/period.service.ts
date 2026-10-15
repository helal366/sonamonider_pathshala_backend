import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreatePeriodPayload,
  toMinutes,
  TUpdatePeriodPayload,
  TUpdatePeriodSingleFieldPayload,
} from "./period.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;

const ensureNoTeacherScheduleConflict = async (
  tx: Prisma.TransactionClient,
  periodId: string,
  startTime: string,
  endTime: string,
) => {
  const affectedRoutines = await tx.classRoutine.findMany({
    where: { period_id: periodId },
    select: { id: true, teacher_id: true },
  });
  if (affectedRoutines.length === 0) return;

  const teacherIds = [
    ...new Set(affectedRoutines.map((routine) => routine.teacher_id)),
  ];
  const teacherRoutines = await tx.classRoutine.findMany({
    where: { teacher_id: { in: teacherIds } },
    select: {
      id: true,
      teacher_id: true,
      period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
    },
  });
  const nextStart = toMinutes(startTime);
  const nextEnd = toMinutes(endTime);

  for (const assignedRoutine of affectedRoutines) {
    for (const otherRoutine of teacherRoutines) {
      if (
        assignedRoutine.id === otherRoutine.id ||
        assignedRoutine.teacher_id !== otherRoutine.teacher_id
      ) {
        continue;
      }

      const otherStart =
        otherRoutine.period?.start_time ??
        otherRoutine.quranic_period?.start_time;
      const otherEnd =
        otherRoutine.period?.end_time ??
        otherRoutine.quranic_period?.end_time;
      if (
        otherStart &&
        otherEnd &&
        nextStart < toMinutes(otherEnd) &&
        toMinutes(otherStart) < nextEnd
      ) {
        throw new AppError(
          "This time change would overlap another class routine assigned to the same teacher.",
          StatusCodes.CONFLICT,
        );
      }
    }
  }
};

const createPeriod = async (payload: TCreatePeriodPayload, user: LoggedInUser) => {
  const periodName = payload.period_name.trim().toUpperCase();
  const startTime = payload.start_time.trim().toUpperCase();
  const endTime = payload.end_time.trim().toUpperCase();
  const existing = await prisma.period.findUnique({
    where: { period_name: periodName },
    select: { id: true },
  });
  if (existing) {
    throw new AppError(`Period "${periodName}" already exists.`, StatusCodes.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    const period = await tx.period.create({
      data: {
        period_name: periodName,
        start_time: startTime,
        end_time: endTime,
        created_by_id: user.user_id,
      },
    });
    await tx.auditLog.create({
      data: {
        entity_id: period.id,
        entity_name: "period",
        action: "CREATE",
        changed_by_id: user.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          period_name: periodName,
          start_time: startTime,
          end_time: endTime,
          created_by_id: user.user_id,
        },
      },
    });
    return period;
  });
};

const updatePeriod = async (
  payload: TUpdatePeriodPayload,
  user: LoggedInUser,
  id: string,
) => {
  const periodName = payload.period_name.trim().toUpperCase();
  const startTime = payload.start_time.trim().toUpperCase();
  const endTime = payload.end_time.trim().toUpperCase();
  const current = await prisma.period.findUnique({ where: { id } });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);

  const nameConflict = await prisma.period.findFirst({
    where: { period_name: periodName, id: { not: id } },
    select: { id: true },
  });
  if (nameConflict) {
    throw new AppError(`Period "${periodName}" already exists.`, StatusCodes.CONFLICT);
  }

  return prisma.$transaction(
    async (tx) => {
      if (current.start_time !== startTime || current.end_time !== endTime) {
        await ensureNoTeacherScheduleConflict(tx, id, startTime, endTime);
      }
      const updated = await tx.period.update({
        where: { id },
        data: {
          period_name: periodName,
          start_time: startTime,
          end_time: endTime,
          updated_by_id: user.user_id,
        },
      });
      await tx.auditLog.create({
        data: {
          entity_id: id,
          entity_name: "period",
          action: "UPDATE",
          changed_by_id: user.user_id,
          old_value: {
            period_name: current.period_name,
            start_time: current.start_time,
            end_time: current.end_time,
          },
          new_value: {
            period_name: periodName,
            start_time: startTime,
            end_time: endTime,
          },
        },
      });
      return updated;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
};

const updatePeriodSingleField = async (
  payload: TUpdatePeriodSingleFieldPayload,
  user: LoggedInUser,
  id: string,
) => {
  const value = payload.value.trim().toUpperCase();
  const current = await prisma.period.findUnique({ where: { id } });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);

  const oldValue = current[payload.field];
  if (oldValue === value) {
    throw new AppError(
      `The provided value for '${payload.field.replace(/_/g, " ")}' is identical to the current record.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  if (payload.field === "period_name") {
    const nameConflict = await prisma.period.findFirst({
      where: { period_name: value, id: { not: id } },
      select: { id: true },
    });
    if (nameConflict) {
      throw new AppError(`Period "${value}" already exists.`, StatusCodes.CONFLICT);
    }
  } else {
    const startTime = payload.field === "start_time" ? value : current.start_time;
    const endTime = payload.field === "end_time" ? value : current.end_time;
    if (toMinutes(endTime) <= toMinutes(startTime)) {
      throw new AppError("End time must be after start time.", StatusCodes.BAD_REQUEST);
    }
  }

  return prisma.$transaction(
    async (tx) => {
      if (payload.field !== "period_name") {
        await ensureNoTeacherScheduleConflict(
          tx,
          id,
          payload.field === "start_time" ? value : current.start_time,
          payload.field === "end_time" ? value : current.end_time,
        );
      }
      const updated = await tx.period.update({
        where: { id },
        data: {
          [payload.field]: value,
          updated_by_id: user.user_id,
        },
      });
      await tx.auditLog.create({
        data: {
          entity_id: id,
          entity_name: "period",
          action: "UPDATE",
          changed_by_id: user.user_id,
          old_value: { [payload.field]: oldValue },
          new_value: { [payload.field]: value },
        },
      });
      return updated;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
};

const deletePeriod = async (id: string, user: LoggedInUser) => {
  const current = await prisma.period.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);
  if (current._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete period "${current.period_name}". It is used by ${current._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.period.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "period",
        action: "DELETE",
        changed_by_id: user.user_id,
        old_value: {
          period_name: current.period_name,
          start_time: current.start_time,
          end_time: current.end_time,
        },
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

const getAllPeriods = () =>
  prisma.period.findMany({
    orderBy: { start_time: "asc" },
    include: { _count: { select: { class_routines: true } } },
  });

const getSinglePeriod = async (id: string) => {
  const period = await prisma.period.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!period) throw new AppError("Requested period does not exist.", StatusCodes.NOT_FOUND);
  return period;
};

export const periodServices = {
  createPeriod,
  updatePeriod,
  updatePeriodSingleField,
  deletePeriod,
  getAllPeriods,
  getSinglePeriod,
};
