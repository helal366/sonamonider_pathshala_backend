import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreatePeriodPayload,
  toMinutes,
  TUpdatePeriodPayload,
  TUpdatePeriodSingleFieldPayload,
} from "./generalPeriod.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;

const ensureNoRoutineScheduleConflict = async (
  tx: Prisma.TransactionClient,
  periodId: string,
  startTime: string,
  endTime: string,
) => {
  const affectedRoutines = await tx.classRoutine.findMany({
    where: { general_period_id: periodId },
    select: {
      id: true,
      shift_id: true,
      class: { select: { id: true } },
      teachers: { select: { id: true } },
    },
  });
  if (affectedRoutines.length === 0) return;

  const teacherIds = [
    ...new Set(
      affectedRoutines.flatMap((routine) =>
        routine.teachers.map(({ id }) => id),
      ),
    ),
  ];
  const classIds = [
    ...new Set(
      affectedRoutines.flatMap((routine) => routine.class.map(({ id }) => id)),
    ),
  ];
  const shiftIds = [
    ...new Set(
      affectedRoutines
        .map((routine) => routine.shift_id)
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
  const teacherRoutines = await tx.classRoutine.findMany({
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
      general_period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
    },
  });
  const nextStart = toMinutes(startTime);
  const nextEnd = toMinutes(endTime);

  for (const assignedRoutine of affectedRoutines) {
    for (const otherRoutine of teacherRoutines) {
      if (assignedRoutine.id === otherRoutine.id) {
        continue;
      }

      const conflicts =
        assignedRoutine.teachers.some(({ id }) =>
          otherRoutine.teachers.some((teacher) => teacher.id === id),
        ) ||
        ((assignedRoutine.shift_id === null ||
          otherRoutine.shift_id === null ||
          assignedRoutine.shift_id === otherRoutine.shift_id) &&
          assignedRoutine.class.some(({ id }) =>
            otherRoutine.class.some((classRecord) => classRecord.id === id),
          ));
      if (!conflicts) continue;

      const otherStart =
        otherRoutine.general_period?.start_time ??
        otherRoutine.quranic_period?.start_time;
      const otherEnd =
        otherRoutine.general_period?.end_time ?? otherRoutine.quranic_period?.end_time;
      if (
        otherStart &&
        otherEnd &&
        nextStart < toMinutes(otherEnd) &&
        toMinutes(otherStart) < nextEnd
      ) {
        throw new AppError(
          "This time change would overlap another class routine for a teacher or class in the same shift.",
          StatusCodes.CONFLICT,
        );
      }
    }
  }
};

const createPeriod = async (
  payload: TCreatePeriodPayload,
  user: LoggedInUser,
) => {
  const periodName = payload.general_period_name.trim().toUpperCase();
  const startTime = payload.start_time.trim().toUpperCase();
  const endTime = payload.end_time.trim().toUpperCase();
  const existing = await prisma.generalPeriod.findUnique({
    where: { general_period_name: periodName },
    select: { id: true },
  });
  if (existing) {
    throw new AppError(
      `Period "${periodName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const period = await tx.generalPeriod.create({
      data: {
        general_period_name: periodName,
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
          general_period_name: periodName,
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
  const periodName = payload.general_period_name.trim().toUpperCase();
  const startTime = payload.start_time.trim().toUpperCase();
  const endTime = payload.end_time.trim().toUpperCase();
  const current = await prisma.generalPeriod.findUnique({ where: { id } });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);

  const nameConflict = await prisma.generalPeriod.findFirst({
    where: { general_period_name: periodName, id: { not: id } },
    select: { id: true },
  });
  if (nameConflict) {
    throw new AppError(
      `Period "${periodName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(
    async (tx) => {
      if (current.start_time !== startTime || current.end_time !== endTime) {
        await ensureNoRoutineScheduleConflict(tx, id, startTime, endTime);
      }
      const updated = await tx.generalPeriod.update({
        where: { id },
        data: {
          general_period_name: periodName,
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
            general_period_name: current.general_period_name,
            start_time: current.start_time,
            end_time: current.end_time,
          },
          new_value: {
            general_period_name: periodName,
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
  const current = await prisma.generalPeriod.findUnique({ where: { id } });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);

  const oldValue = current[payload.field];
  if (oldValue === value) {
    throw new AppError(
      `The provided value for '${payload.field.replace(/_/g, " ")}' is identical to the current record.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  if (payload.field === "general_period_name") {
    const nameConflict = await prisma.generalPeriod.findFirst({
      where: { general_period_name: value, id: { not: id } },
      select: { id: true },
    });
    if (nameConflict) {
      throw new AppError(
        `Period "${value}" already exists.`,
        StatusCodes.CONFLICT,
      );
    }
  } else {
    const startTime =
      payload.field === "start_time" ? value : current.start_time;
    const endTime = payload.field === "end_time" ? value : current.end_time;
    if (toMinutes(endTime) <= toMinutes(startTime)) {
      throw new AppError(
        "End time must be after start time.",
        StatusCodes.BAD_REQUEST,
      );
    }
  }

  return prisma.$transaction(
    async (tx) => {
      if (payload.field !== "general_period_name") {
        await ensureNoRoutineScheduleConflict(
          tx,
          id,
          payload.field === "start_time" ? value : current.start_time,
          payload.field === "end_time" ? value : current.end_time,
        );
      }
      const updated = await tx.generalPeriod.update({
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
  const current = await prisma.generalPeriod.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!current) throw new AppError("Period not found.", StatusCodes.NOT_FOUND);
  if (current._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete period "${current.general_period_name}". It is used by ${current._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.generalPeriod.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "period",
        action: "DELETE",
        changed_by_id: user.user_id,
        old_value: {
          general_period_name: current.general_period_name,
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
  prisma.generalPeriod.findMany({
    orderBy: { start_time: "asc" },
    include: { _count: { select: { class_routines: true } } },
  });

const getSinglePeriod = async (id: string) => {
  const period = await prisma.generalPeriod.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!period)
    throw new AppError(
      "Requested period does not exist.",
      StatusCodes.NOT_FOUND,
    );
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
