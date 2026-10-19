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
  general_period: true,
  quranic_period: true,
  arabic_period: true,
  teachers: true,
  general_subjects: true,
  quranic_subjects: true,
  arabic_subject: true,
  created_by: true,
  updated_by: true,
} satisfies Prisma.ClassRoutineInclude;

const routineAuditInclude = {
  class: { select: { id: true } },
  teachers: { select: { id: true } },
  general_subjects: { select: { id: true } },
  quranic_subjects: { select: { id: true } },
  arabic_subject: { select: { id: true } },
} satisfies Prisma.ClassRoutineInclude;

type TimeRange = { startMinutes: number; endMinutes: number };

const routineTimes = async (
  tx: DbTransaction,
  generalPeriodId?: string,
  quranicPeriodId?: string,
  arabicPeriodId?: string,
) => {
  if (Boolean(generalPeriodId) === Boolean(quranicPeriodId)) {
    throw new AppError(
      "Provide exactly one general period or Quranic period.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const [period, arabicPeriod] = await Promise.all([
    generalPeriodId
      ? tx.generalPeriod.findUnique({
          where: { id: generalPeriodId },
          select: { id: true, start_time: true, end_time: true },
        })
      : tx.quranicPeriod.findUnique({
          where: { id: quranicPeriodId },
          select: { id: true, start_time: true, end_time: true },
        }),
    arabicPeriodId
      ? tx.arabicPeriod.findUnique({
          where: { id: arabicPeriodId },
          select: { id: true, start_time: true, end_time: true },
        })
      : Promise.resolve(null),
  ]);

  if (!period) {
    throw new AppError("Selected period was not found.", StatusCodes.NOT_FOUND);
  }

  if (arabicPeriodId && !arabicPeriod) {
    throw new AppError(
      "Selected Arabic period was not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  const ranges = [period, ...(arabicPeriod ? [arabicPeriod] : [])].map(
    ({ start_time, end_time }): TimeRange => {
      const startMinutes = toMinutes(start_time);
      const endMinutes = toMinutes(end_time);
      if (endMinutes <= startMinutes) {
        throw new AppError(
          "The selected period must end after it starts.",
          StatusCodes.BAD_REQUEST,
        );
      }
      return { startMinutes, endMinutes };
    },
  );

  if (
    ranges.length === 2 &&
    ranges[0]!.startMinutes < ranges[1]!.endMinutes &&
    ranges[1]!.startMinutes < ranges[0]!.endMinutes
  ) {
    throw new AppError(
      "The selected Arabic period overlaps the main routine period.",
      StatusCodes.BAD_REQUEST,
    );
  }

  return ranges;
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
    arabicSubject,
    times,
  ] = await Promise.all([
    tx.class.count({ where: { id: { in: payload.class_ids } } }),
    tx.shift.findUnique({
      where: { id: payload.shift_id },
      select: { id: true },
    }),
    tx.academicStaff.count({ where: { id: { in: payload.teacher_ids } } }),
    payload.general_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.generalSubject.count({ where: { id: { in: payload.general_subject_ids } } }),
    payload.quranic_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.quranicSubject.count({
          where: { id: { in: payload.quranic_subject_ids } },
        }),
    payload.arabic_subject_id
      ? tx.arabicSubject.findUnique({
          where: { id: payload.arabic_subject_id },
          select: { id: true },
        })
      : Promise.resolve(null),
    routineTimes(
      tx,
      payload.general_period_id,
      payload.quranic_period_id,
      payload.arabic_period_id,
    ),
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
  if (subjectCount !== payload.general_subject_ids.length) {
    throw new AppError("One or more selected subjects were not found.", StatusCodes.NOT_FOUND);
  }
  if (quranicSubjectCount !== payload.quranic_subject_ids.length) {
    throw new AppError(
      "One or more selected Quranic subjects were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (payload.arabic_subject_id && !arabicSubject) {
    throw new AppError(
      "Selected Arabic subject was not found.",
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
  times: TimeRange[],
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
      general_period_id: true,
      quranic_period_id: true,
      general_period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
      arabic_period: { select: { start_time: true, end_time: true } },
    },
  });

  const classIdSet = new Set(classIds);
  const teacherIdSet = new Set(teacherIds);

  for (const routine of existingRoutines) {
    if (
      Boolean(routine.general_period_id) === Boolean(routine.quranic_period_id)
    ) {
      throw new AppError(
        "An existing routine must reference exactly one period.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const primaryPeriod = routine.general_period ?? routine.quranic_period;
    if (!primaryPeriod) {
      throw new AppError(
        "An existing routine has no period assigned.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
    const periodRanges = [
      primaryPeriod,
      ...(routine.arabic_period ? [routine.arabic_period] : []),
    ];

    const existingTimes = periodRanges.map(({ start_time, end_time }) => {
      const startMinutes = toMinutes(start_time);
      const endMinutes = toMinutes(end_time);
      if (endMinutes <= startMinutes) {
        throw new AppError(
          "An existing routine has an invalid period configuration.",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      return { startMinutes, endMinutes };
    });
    const hasTeacherConflict = routine.teachers.some((teacher) =>
      teacherIdSet.has(teacher.id),
    );
    const hasClassConflict =
      (routine.shift_id === shiftId || routine.shift_id === null) &&
      routine.class.some((classRecord) => classIdSet.has(classRecord.id));

    if (
      (hasTeacherConflict || hasClassConflict) &&
      times.some((time) =>
        existingTimes.some(
          (existingTime) =>
            time.startMinutes < existingTime.endMinutes &&
            existingTime.startMinutes < time.endMinutes,
        ),
      )
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

type RoutineAuditRecord = Prisma.ClassRoutineGetPayload<{
  include: typeof routineAuditInclude;
}>;

const routineAuditValue = (routine: RoutineAuditRecord) => ({
  id: routine.id,
  class_ids: routine.class.map(({ id }) => id),
  shift_id: routine.shift_id,
  general_period_id: routine.general_period_id,
  quranic_period_id: routine.quranic_period_id,
  arabic_period_id: routine.arabic_period_id,
  teacher_ids: routine.teachers.map(({ id }) => id),
  general_subject_ids: routine.general_subjects.map(({ id }) => id),
  quranic_subject_ids: routine.quranic_subjects.map(({ id }) => id),
  arabic_subject_id: routine.arabic_subject?.id ?? null,
});

type CurrentRoutine = RoutineAuditRecord;

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
      ...(payload.general_period_id
        ? {
            general_period: { connect: { id: payload.general_period_id } },
            quranic_period: { disconnect: true },
          }
        : {
            general_period: { disconnect: true },
            quranic_period: { connect: { id: payload.quranic_period_id! } },
          }),
      general_subjects: { set: payload.general_subject_ids.map((subjectId) => ({ id: subjectId })) },
      quranic_subjects: {
        set: payload.quranic_subject_ids.map((subjectId) => ({ id: subjectId })),
      },
      arabic_period: payload.arabic_period_id
        ? { connect: { id: payload.arabic_period_id } }
        : { disconnect: true },
      arabic_subject: payload.arabic_subject_id
        ? { connect: { id: payload.arabic_subject_id } }
        : { disconnect: true },
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
          ...(payload.general_period_id
            ? { general_period: { connect: { id: payload.general_period_id } } }
            : { quranic_period: { connect: { id: payload.quranic_period_id! } } }),
          general_subjects: {
            connect: payload.general_subject_ids.map((id) => ({ id })),
          },
          quranic_subjects: {
            connect: payload.quranic_subject_ids.map((id) => ({ id })),
          },
          ...(payload.arabic_period_id
            ? { arabic_period: { connect: { id: payload.arabic_period_id } } }
            : {}),
          ...(payload.arabic_subject_id
            ? { arabic_subject: { connect: { id: payload.arabic_subject_id } } }
            : {}),
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
        general_period_id: current.general_period_id ?? undefined,
        quranic_period_id: current.quranic_period_id ?? undefined,
        teacher_ids: current.teachers.map(({ id: teacherId }) => teacherId),
        general_subject_ids: current.general_subjects.map(({ id: subjectId }) => subjectId),
        quranic_subject_ids: current.quranic_subjects.map(
          ({ id: subjectId }) => subjectId,
        ),
        arabic_period_id: current.arabic_period_id ?? undefined,
        arabic_subject_id: current.arabic_subject_id ?? undefined,
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
        case "general_period_id":
          next.general_period_id = payload.value;
          next.quranic_period_id = undefined;
          break;
        case "quranic_period_id":
          next.general_period_id = undefined;
          next.quranic_period_id = payload.value;
          break;
        case "subject_ids":
          next.general_subject_ids = payload.value;
          break;
        case "quranic_subject_ids":
          next.quranic_subject_ids = payload.value;
          break;
        case "arabic_period_id":
          next.arabic_period_id = payload.value;
          break;
        case "arabic_subject_id":
          next.arabic_subject_id = payload.value;
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
