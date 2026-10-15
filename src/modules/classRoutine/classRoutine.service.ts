import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateClassRoutinePayload,
  TUpdateClassRoutineSingleFieldPayload,
  TUpdateClassRoutinePayload,
} from "./classRoutine.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;
type DbTransaction = Prisma.TransactionClient;

const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;

const toMinutes = (value: string) => {
  if (!timePattern.test(value)) {
    throw new AppError(
      "A scheduled period has an invalid time configuration.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
  const [clock, meridiem] = value.trim().toUpperCase().split(/\s+/);
  const [hours, minutes] = clock!.split(":").map(Number);
  return (hours! % 12) * 60 + minutes! + (meridiem === "PM" ? 720 : 0);
};

const routineInclude = {
  class: true,
  period: true,
  quranic_period: true,
  teacher: true,
  subjects: true,
  created_by: true,
  updated_by: true,
} satisfies Prisma.ClassRoutineInclude;

const routineTimes = async (
  tx: DbTransaction,
  periodId?: string,
  quranicPeriodId?: string,
) => {
  if (Boolean(periodId) === Boolean(quranicPeriodId)) {
    throw new AppError(
      "Provide exactly one regular period or Quranic period.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const period = periodId
    ? await tx.period.findUnique({
        where: { id: periodId },
        select: { id: true, start_time: true, end_time: true },
      })
    : await tx.quranicPeriod.findUnique({
        where: { id: quranicPeriodId },
        select: { id: true, start_time: true, end_time: true },
      });

  if (!period) {
    throw new AppError("Selected period was not found.", StatusCodes.NOT_FOUND);
  }

  if (!timePattern.test(period.start_time) || !timePattern.test(period.end_time)) {
    throw new AppError(
      "The selected period has an invalid time configuration.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const startMinutes = toMinutes(period.start_time);
  const endMinutes = toMinutes(period.end_time);
  if (endMinutes <= startMinutes) {
    throw new AppError(
      "The selected period must end after it starts.",
      StatusCodes.BAD_REQUEST,
    );
  }

  return {
    start_time: period.start_time,
    end_time: period.end_time,
    startMinutes,
    endMinutes,
  };
};

const validateRoutineReferences = async (
  tx: DbTransaction,
  payload: TCreateClassRoutinePayload,
) => {
  const [classRecord, teacher, times, subjectCount] = await Promise.all([
    tx.class.findUnique({
      where: { id: payload.class_id },
      select: { id: true },
    }),
    tx.academicStaff.findUnique({
      where: { id: payload.teacher_id },
      select: { id: true },
    }),
    routineTimes(tx, payload.period_id, payload.quranic_period_id),
    payload.subjects.length === 0
      ? Promise.resolve(0)
      : tx.subject.count({ where: { id: { in: payload.subjects } } }),
  ]);

  if (!classRecord) {
    throw new AppError("Selected class was not found.", StatusCodes.NOT_FOUND);
  }
  if (!teacher) {
    throw new AppError("Selected teacher/academic staff was not found.", StatusCodes.NOT_FOUND);
  }
  if (subjectCount !== payload.subjects.length) {
    throw new AppError(
      "One or more selected subjects were not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  return times;
};

const assertNoTeacherOverlap = async (
  tx: DbTransaction,
  teacherId: string,
  times: Awaited<ReturnType<typeof routineTimes>>,
  excludeRoutineId?: string,
) => {
  const existingRoutines = await tx.classRoutine.findMany({
    where: {
      teacher_id: teacherId,
      ...(excludeRoutineId ? { id: { not: excludeRoutineId } } : {}),
    },
    select: {
      id: true,
      period_id: true,
      quranic_period_id: true,
      period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
    },
  });

  for (const routine of existingRoutines) {
    if (Boolean(routine.period_id) === Boolean(routine.quranic_period_id)) {
      throw new AppError(
        "An existing routine for this teacher must reference exactly one period.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    const startTime =
      routine.period?.start_time ?? routine.quranic_period?.start_time;
    const endTime =
      routine.period?.end_time ?? routine.quranic_period?.end_time;
    if (!startTime || !endTime) {
      throw new AppError(
        "An existing routine for this teacher has no period assigned.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const existingStart = toMinutes(startTime);
    const existingEnd = toMinutes(endTime);
    if (
      times.startMinutes < existingEnd &&
      existingStart < times.endMinutes
    ) {
      throw new AppError(
        "This teacher is already assigned to another routine during this period.",
        StatusCodes.CONFLICT,
      );
    }
  }
};

const routineAuditValue = (routine: {
  id: string;
  class_id: string;
  period_id: string | null;
  quranic_period_id: string | null;
  teacher_id: string;
  subjects: { id: string }[];
}) => ({
  id: routine.id,
  class_id: routine.class_id,
  period_id: routine.period_id,
  quranic_period_id: routine.quranic_period_id,
  teacher_id: routine.teacher_id,
  subjects: routine.subjects.map((subject) => subject.id),
});

type CurrentRoutine = Prisma.ClassRoutineGetPayload<{
  include: { subjects: { select: { id: true } } };
}>;

const persistRoutineUpdate = async (
  tx: DbTransaction,
  current: CurrentRoutine,
  payload: TUpdateClassRoutinePayload,
  user: LoggedInUser,
  id: string,
) => {
  const times = await validateRoutineReferences(tx, payload);
  await assertNoTeacherOverlap(tx, payload.teacher_id, times, id);

  const updated = await tx.classRoutine.update({
    where: { id },
    data: {
      class: { connect: { id: payload.class_id } },
      teacher: { connect: { id: payload.teacher_id } },
      ...(payload.period_id
        ? {
            period: { connect: { id: payload.period_id } },
            quranic_period: { disconnect: true },
          }
        : {
            period: { disconnect: true },
            quranic_period: { connect: { id: payload.quranic_period_id! } },
          }),
      subjects: { set: payload.subjects.map((subjectId) => ({ id: subjectId })) },
      updated_by: { connect: { id: user.user_id } },
    },
    include: routineInclude,
  });

  await tx.auditLog.create({
    data: {
      entity_id: id,
      entity_name: "classRoutine",
      action: "UPDATE",
      changed_by_id: user.user_id,
      old_value: routineAuditValue(current),
      new_value: routineAuditValue(updated),
    },
  });
  return updated;
};

const createClassRoutine = async (
  payload: TCreateClassRoutinePayload,
  user: LoggedInUser,
) =>
  prisma.$transaction(
    async (tx) => {
      const times = await validateRoutineReferences(tx, payload);
      await assertNoTeacherOverlap(tx, payload.teacher_id, times);

      const routine = await tx.classRoutine.create({
        data: {
          class: { connect: { id: payload.class_id } },
          teacher: { connect: { id: payload.teacher_id } },
          ...(payload.period_id
            ? { period: { connect: { id: payload.period_id } } }
            : { quranic_period: { connect: { id: payload.quranic_period_id! } } }),
          subjects: { connect: payload.subjects.map((id) => ({ id })) },
          created_by: { connect: { id: user.user_id } },
        },
        include: routineInclude,
      });

      await tx.auditLog.create({
        data: {
          entity_id: routine.id,
          entity_name: "classRoutine",
          action: "CREATE",
          changed_by_id: user.user_id,
          old_value: Prisma.JsonNull,
          new_value: routineAuditValue(routine),
        },
      });
      return routine;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

const updateClassRoutine = async (
  payload: TUpdateClassRoutinePayload,
  user: LoggedInUser,
  id: string,
) =>
  prisma.$transaction(
    async (tx) => {
      const current = await tx.classRoutine.findUnique({
        where: { id },
        include: { subjects: { select: { id: true } } },
      });
      if (!current) {
        throw new AppError("Class routine not found.", StatusCodes.NOT_FOUND);
      }

      return persistRoutineUpdate(tx, current, payload, user, id);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

const updateClassRoutineSingleField = async (
  payload: TUpdateClassRoutineSingleFieldPayload,
  user: LoggedInUser,
  id: string,
) =>
  prisma.$transaction(
    async (tx) => {
      const current = await tx.classRoutine.findUnique({
        where: { id },
        include: { subjects: { select: { id: true } } },
      });
      if (!current) {
        throw new AppError("Class routine not found.", StatusCodes.NOT_FOUND);
      }

      const next: TUpdateClassRoutinePayload = {
        class_id: current.class_id,
        period_id: current.period_id ?? undefined,
        quranic_period_id: current.quranic_period_id ?? undefined,
        teacher_id: current.teacher_id,
        subjects: current.subjects.map((subject) => subject.id),
      };

      switch (payload.field) {
        case "class_id":
          next.class_id = payload.value;
          break;
        case "teacher_id":
          next.teacher_id = payload.value;
          break;
        case "period_id":
          next.period_id = payload.value;
          next.quranic_period_id = undefined;
          break;
        case "quranic_period_id":
          next.period_id = undefined;
          next.quranic_period_id = payload.value;
          break;
        case "subjects":
          next.subjects = payload.value;
          break;
      }

      return persistRoutineUpdate(tx, current, next, user, id);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

const deleteClassRoutine = async (id: string, user: LoggedInUser) =>
  prisma.$transaction(async (tx) => {
    const current = await tx.classRoutine.findUnique({
      where: { id },
      include: { subjects: { select: { id: true } } },
    });
    if (!current) {
      throw new AppError("Class routine not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.classRoutine.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "classRoutine",
        action: "DELETE",
        changed_by_id: user.user_id,
        old_value: routineAuditValue(current),
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });

const getAllClassRoutines = () =>
  prisma.classRoutine.findMany({
    orderBy: { created_at: "desc" },
    include: routineInclude,
  });

const getSingleClassRoutine = async (id: string) => {
  const routine = await prisma.classRoutine.findUnique({
    where: { id },
    include: routineInclude,
  });
  if (!routine) {
    throw new AppError("Class routine not found.", StatusCodes.NOT_FOUND);
  }
  return routine;
};

export const classRoutineServices = {
  createClassRoutine,
  updateClassRoutine,
  updateClassRoutineSingleField,
  deleteClassRoutine,
  getAllClassRoutines,
  getSingleClassRoutine,
};
