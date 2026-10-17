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
  shift: true,
  period: true,
  quranic_period: true,
  teachers: true,
  subjects: true,
  quranic_subjects: true,
  created_by: true,
  updated_by: true,
} satisfies Prisma.ClassRoutineInclude;

const routineAuditInclude = {
  class: { select: { id: true } },
  teachers: { select: { id: true } },
  subjects: { select: { id: true } },
  quranic_subjects: { select: { id: true } },
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
  payload: TCreateClassRoutinePayload | TUpdateClassRoutinePayload,
) => {
  const [
    classCount,
    shift,
    teacherCount,
    subjectCount,
    quranicSubjectCount,
    times,
  ] = await Promise.all([
    tx.class.count({ where: { id: { in: payload.class_ids } } }),
    tx.shift.findUnique({
      where: { id: payload.shift_id },
      select: { id: true },
    }),
    tx.academicStaff.count({ where: { id: { in: payload.teacher_ids } } }),
    payload.subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.subject.count({ where: { id: { in: payload.subject_ids } } }),
    payload.quranic_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.quranicSubject.count({
          where: { id: { in: payload.quranic_subject_ids } },
        }),
    routineTimes(tx, payload.period_id, payload.quranic_period_id),
  ]);

  if (classCount !== payload.class_ids.length) {
    throw new AppError("One or more selected classes were not found.", StatusCodes.NOT_FOUND);
  }
  if (!shift) {
    throw new AppError("Selected shift was not found.", StatusCodes.NOT_FOUND);
  }
  if (teacherCount !== payload.teacher_ids.length) {
    throw new AppError("One or more selected teachers were not found.", StatusCodes.NOT_FOUND);
  }
  if (subjectCount !== payload.subject_ids.length) {
    throw new AppError("One or more selected subjects were not found.", StatusCodes.NOT_FOUND);
  }
  if (quranicSubjectCount !== payload.quranic_subject_ids.length) {
    throw new AppError(
      "One or more selected Quranic subjects were not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  return times;
};

const assertNoScheduleOverlap = async (
  tx: DbTransaction,
  classIds: string[],
  shiftId: string,
  teacherIds: string[],
  times: Awaited<ReturnType<typeof routineTimes>>,
  excludeRoutineId?: string,
) => {
  const existingRoutines = await tx.classRoutine.findMany({
    where: {
      ...(excludeRoutineId ? { id: { not: excludeRoutineId } } : {}),
      OR: [
        { teachers: { some: { id: { in: teacherIds } } } },
        {
          class: { some: { id: { in: classIds } } },
          OR: [{ shift_id: shiftId }, { shift_id: null }],
        },
      ],
    },
    select: {
      id: true,
      shift_id: true,
      class: { select: { id: true } },
      teachers: { select: { id: true } },
      period_id: true,
      quranic_period_id: true,
      period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
    },
  });

  const classIdSet = new Set(classIds);
  const teacherIdSet = new Set(teacherIds);

  for (const routine of existingRoutines) {
    if (Boolean(routine.period_id) === Boolean(routine.quranic_period_id)) {
      throw new AppError(
        "An existing routine must reference exactly one period.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const startTime =
      routine.period?.start_time ?? routine.quranic_period?.start_time;
    const endTime =
      routine.period?.end_time ?? routine.quranic_period?.end_time;
    if (!startTime || !endTime) {
      throw new AppError(
        "An existing routine has no period assigned.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const existingStart = toMinutes(startTime);
    const existingEnd = toMinutes(endTime);
    const hasTeacherConflict = routine.teachers.some((teacher) =>
      teacherIdSet.has(teacher.id),
    );
    const hasClassConflict =
      (routine.shift_id === shiftId || routine.shift_id === null) &&
      routine.class.some((classRecord) => classIdSet.has(classRecord.id));

    if (
      (hasTeacherConflict || hasClassConflict) &&
      times.startMinutes < existingEnd &&
      existingStart < times.endMinutes
    ) {
      throw new AppError(
        hasTeacherConflict
          ? "A selected teacher is already assigned to another routine during this period."
          : "A selected class already has another routine during this period and shift.",
        StatusCodes.CONFLICT,
      );
    }
  }
};

const routineAuditValue = (routine: {
  id: string;
  shift_id: string | null;
  period_id: string | null;
  quranic_period_id: string | null;
  class: { id: string }[];
  teachers: { id: string }[];
  subjects: { id: string }[];
  quranic_subjects: { id: string }[];
}) => ({
  id: routine.id,
  class_ids: routine.class.map(({ id }) => id),
  shift_id: routine.shift_id,
  period_id: routine.period_id,
  quranic_period_id: routine.quranic_period_id,
  teacher_ids: routine.teachers.map(({ id }) => id),
  subject_ids: routine.subjects.map(({ id }) => id),
  quranic_subject_ids: routine.quranic_subjects.map(({ id }) => id),
});

type CurrentRoutine = Prisma.ClassRoutineGetPayload<{
  include: typeof routineAuditInclude;
}>;

const persistRoutineUpdate = async (
  tx: DbTransaction,
  current: CurrentRoutine,
  payload: TUpdateClassRoutinePayload,
  user: LoggedInUser,
  id: string,
) => {
  const times = await validateRoutineReferences(tx, payload);
  await assertNoScheduleOverlap(
    tx,
    payload.class_ids,
    payload.shift_id,
    payload.teacher_ids,
    times,
    id,
  );

  const updated = await tx.classRoutine.update({
    where: { id },
    data: {
      class: { set: payload.class_ids.map((classId) => ({ id: classId })) },
      shift: { connect: { id: payload.shift_id } },
      teachers: { set: payload.teacher_ids.map((teacherId) => ({ id: teacherId })) },
      ...(payload.period_id
        ? {
            period: { connect: { id: payload.period_id } },
            quranic_period: { disconnect: true },
          }
        : {
            period: { disconnect: true },
            quranic_period: { connect: { id: payload.quranic_period_id! } },
          }),
      subjects: { set: payload.subject_ids.map((subjectId) => ({ id: subjectId })) },
      quranic_subjects: {
        set: payload.quranic_subject_ids.map((subjectId) => ({ id: subjectId })),
      },
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
      await assertNoScheduleOverlap(
        tx,
        payload.class_ids,
        payload.shift_id,
        payload.teacher_ids,
        times,
      );

      const routine = await tx.classRoutine.create({
        data: {
          class: { connect: payload.class_ids.map((id) => ({ id })) },
          shift: { connect: { id: payload.shift_id } },
          teachers: { connect: payload.teacher_ids.map((id) => ({ id })) },
          ...(payload.period_id
            ? { period: { connect: { id: payload.period_id } } }
            : { quranic_period: { connect: { id: payload.quranic_period_id! } } }),
          subjects: { connect: payload.subject_ids.map((id) => ({ id })) },
          quranic_subjects: {
            connect: payload.quranic_subject_ids.map((id) => ({ id })),
          },
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
        include: routineAuditInclude,
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
        include: routineAuditInclude,
      });
      if (!current) {
        throw new AppError("Class routine not found.", StatusCodes.NOT_FOUND);
      }

      const next: TUpdateClassRoutinePayload = {
        class_ids: current.class.map(({ id: classId }) => classId),
        shift_id: current.shift_id ?? "",
        period_id: current.period_id ?? undefined,
        quranic_period_id: current.quranic_period_id ?? undefined,
        teacher_ids: current.teachers.map(({ id: teacherId }) => teacherId),
        subject_ids: current.subjects.map(({ id: subjectId }) => subjectId),
        quranic_subject_ids: current.quranic_subjects.map(({ id: subjectId }) => subjectId),
      };

      switch (payload.field) {
        case "class_ids":
          next.class_ids = payload.value;
          break;
        case "shift_id":
          next.shift_id = payload.value;
          break;
        case "teacher_ids":
          next.teacher_ids = payload.value;
          break;
        case "period_id":
          next.period_id = payload.value;
          next.quranic_period_id = undefined;
          break;
        case "quranic_period_id":
          next.period_id = undefined;
          next.quranic_period_id = payload.value;
          break;
        case "subject_ids":
          next.subject_ids = payload.value;
          break;
        case "quranic_subject_ids":
          next.quranic_subject_ids = payload.value;
          break;
      }

      if (!next.shift_id) {
        throw new AppError(
          "Assign a shift to this existing routine before updating it.",
          StatusCodes.BAD_REQUEST,
        );
      }

      return persistRoutineUpdate(tx, current, next, user, id);
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

const deleteClassRoutine = async (id: string, user: LoggedInUser) =>
  prisma.$transaction(async (tx) => {
    const current = await tx.classRoutine.findUnique({
      where: { id },
      include: routineAuditInclude,
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
