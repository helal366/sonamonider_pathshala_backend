import { Prisma, Shift } from "#db-client";
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

  // Prevent times from 09:00 PM to 05:00 AM
  const totalMinutes =
    (hours! % 12) * 60 + minutes! + (meridiem === "PM" ? 720 : 0);
  if (totalMinutes > 21 * 60 || totalMinutes < 5 * 60) {
    throw new AppError(
      "Period time must not be between 09:00 PM and 05:00 AM.",
      StatusCodes.BAD_REQUEST,
    );
  }
  return totalMinutes;
};

const routineInclude = {
  class: true,
  general_period: true,
  quranic_period: true,
  arabic_period: true,
  teachers: true,
  general_subjects: true,
  quranic_subjects: true,
  arabic_subjects: true,
  created_by: true,
  updated_by: true,
} satisfies Prisma.ClassRoutineInclude;

const routineAuditInclude = {
  class: { select: { id: true } },
  teachers: { select: { id: true } },
  general_subjects: { select: { id: true } },
  quranic_subjects: { select: { id: true } },
  arabic_subjects: { select: { id: true } },
} satisfies Prisma.ClassRoutineInclude;

type TimeRange = { startMinutes: number; endMinutes: number };

const routineTimes = async (
  tx: DbTransaction,
  generalPeriodId?: string,
  quranicPeriodId?: string,
  arabicPeriodId?: string,
) => {
  const periodIdCount = [
    Boolean(generalPeriodId),
    Boolean(quranicPeriodId),
    Boolean(arabicPeriodId),
  ].filter(Boolean).length;
  if (periodIdCount !== 1) {
    throw new AppError(
      "Provide exactly one. General period or quranic period or arabic period.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const [generalPeriod, quranicPeriod, arabicPeriod] = await Promise.all([
    generalPeriodId
      ? tx.generalPeriod.findUnique({
          where: { id: generalPeriodId },
          select: { id: true, start_time: true, end_time: true },
        })
      : Promise.resolve(null),

    quranicPeriodId
      ? tx.quranicPeriod.findUnique({
          where: { id: quranicPeriodId },
          select: { id: true, start_time: true, end_time: true },
        })
      : Promise.resolve(null),

    arabicPeriodId
      ? tx.arabicPeriod.findUnique({
          where: { id: arabicPeriodId },
          select: { id: true, start_time: true, end_time: true },
        })
      : Promise.resolve(null),
  ]);

  const periodCount = [generalPeriod, quranicPeriod, arabicPeriod].filter(
    Boolean,
  );
  if (periodCount.length !== 1) {
    throw new AppError(
      `"Provide exactly one. General period or quranic period or arabic period.",`,
      StatusCodes.BAD_REQUEST,
    );
  }
  const period = generalPeriod || quranicPeriod || arabicPeriod;
  interface IPeriodPayload {
    startTime: string;
    endTime: string;
  }
  const startTime = period!.start_time;
  const endTime = period!.end_time;
  const ranges = (({ startTime, endTime }: IPeriodPayload) => {
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
    if (endMinutes <= startMinutes) {
      throw new AppError(
        "The selected period must end after it starts.",
        StatusCodes.BAD_REQUEST,
      );
    }
    return [{ startMinutes, endMinutes }];
  })({ startTime, endTime });
  return ranges;
};

const validateRoutineReferences = async (
  tx: DbTransaction,
  payload: TCreateClassRoutinePayload | TUpdateClassRoutinePayload,
) => {
  const [
    classCount,
    teacherCount,
    generalSubjectCount,
    quranicSubjectCount,
    arabicSubjectCount,
    times,
  ] = await Promise.all([
    tx.class.count({ where: { id: { in: payload.class_ids } } }),
    tx.academicStaff.count({ where: { id: { in: payload.teacher_ids } } }),
    payload.general_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.generalSubject.count({
          where: { id: { in: payload.general_subject_ids } },
        }),
    payload.quranic_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.quranicSubject.count({
          where: { id: { in: payload.quranic_subject_ids } },
        }),
    payload.arabic_subject_ids.length === 0
      ? Promise.resolve(0)
      : tx.arabicSubject.count({
          where: { id: { in: payload.arabic_subject_ids } },
        }),
    routineTimes(
      tx,
      payload.general_period_id,
      payload.quranic_period_id,
      payload.arabic_period_id,
    ),
  ]);

  if (classCount !== payload.class_ids.length) {
    throw new AppError(
      "One or more selected classes were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (teacherCount !== payload.teacher_ids.length) {
    throw new AppError(
      "One or more selected teachers were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (generalSubjectCount !== payload.general_subject_ids.length) {
    throw new AppError(
      "One or more selected subjects were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (quranicSubjectCount !== payload.quranic_subject_ids.length) {
    throw new AppError(
      "One or more selected Quranic subjects were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (arabicSubjectCount !== payload.arabic_subject_ids.length) {
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
  shift: Shift,
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
          OR: [{ shift }, { shift: null }],
        },
      ],
    },
    select: {
      id: true,
      shift: true,
      class: { select: { id: true } },
      teachers: { select: { id: true } },
      general_period_id: true,
      quranic_period_id: true,
      arabic_period_id: true,
      general_period: { select: { start_time: true, end_time: true } },
      quranic_period: { select: { start_time: true, end_time: true } },
      arabic_period: { select: { start_time: true, end_time: true } },
    },
  });

  const classIdSet = new Set(classIds);
  const teacherIdSet = new Set(teacherIds);

  for (const routine of existingRoutines) {
    const routinePeriodCount = [
      routine.general_period_id,
      routine.quranic_period_id,
      routine.arabic_period_id,
    ].filter(Boolean);
    if (routinePeriodCount.length !== 1) {
      throw new AppError(
        "An existing routine must reference exactly one period.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const primaryPeriod =
      routine.general_period || routine.quranic_period || routine.arabic_period;
    if (!primaryPeriod) {
      throw new AppError(
        "An existing routine has no period assigned.",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const existingTimes = ((startTime: string, endTime: string) => {
      const startMinutes = toMinutes(startTime);
      const endMinutes = toMinutes(endTime);
      return [{ startMinutes, endMinutes }];
    })(primaryPeriod.start_time, primaryPeriod.end_time);

    const hasTeacherConflict = routine.teachers.some((teacher) =>
      teacherIdSet.has(teacher.id),
    );
    const hasClassConflict =
      (routine.shift === shift || routine.shift === null) &&
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
  shift: routine.shift,
  general_period_id: routine.general_period_id,
  quranic_period_id: routine.quranic_period_id,
  arabic_period_id: routine.arabic_period_id,
  teacher_ids: routine.teachers.map(({ id }) => id),
  general_subject_ids: routine.general_subjects.map(({ id }) => id),
  quranic_subject_ids: routine.quranic_subjects.map(({ id }) => id),
  arabic_subject_ids: routine.arabic_subjects.map(({ id }) => id),
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
    payload.shift,
    payload.teacher_ids,
    times,
    id,
  );

  const hasGeneralPeriodId = Boolean(payload.general_period_id);
  const hasQuranicPeriodId = Boolean(payload.quranic_period_id);
  const updated = await tx.classRoutine.update({
    where: { id },
    data: {
      class: { set: payload.class_ids.map((classId) => ({ id: classId })) },
      shift: payload.shift,
      teachers: {
        set: payload.teacher_ids.map((teacherId) => ({ id: teacherId })),
      },
      ...(payload.general_period_id
        ? {
            general_period: { connect: { id: payload.general_period_id } },
            quranic_period: { disconnect: true },
            arabic_period: { disconnect: true },
          }
        : hasQuranicPeriodId
          ? {
              general_period: { disconnect: true },
              quranic_period: { connect: { id: payload.quranic_period_id } },
              arabic_period: { disconnect: true },
            }
          : {
              general_period: { disconnect: true },
              quranic_period: { disconnect: true },
              arabic_period: { connect: { id: payload.arabic_period_id } },
            }),
      general_subjects: {
        set: payload.general_subject_ids.map((subjectId) => ({
          id: subjectId,
        })),
      },
      quranic_subjects: {
        set: payload.quranic_subject_ids.map((subjectId) => ({
          id: subjectId,
        })),
      },
      arabic_subjects: {
        set: payload.arabic_subject_ids.map((subjectId) => ({
          id: subjectId,
        })),
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
        payload.shift,
        payload.teacher_ids,
        times,
      );

      const hasQuranicPeriodId = Boolean(payload.quranic_period_id);
      const routine = await tx.classRoutine.create({
        data: {
          class: { connect: payload.class_ids.map((id) => ({ id })) },
          shift: payload.shift,
          teachers: { connect: payload.teacher_ids.map((id) => ({ id })) },
          ...(payload.general_period_id
            ? { general_period: { connect: { id: payload.general_period_id } } }
            : hasQuranicPeriodId
              ? {
                  quranic_period: {
                    connect: { id: payload.quranic_period_id! },
                  },
                }
              : {
                  arabic_period: { connect: { id: payload.arabic_period_id } },
                }),
          general_subjects: {
            connect: payload.general_subject_ids.map((id) => ({ id })),
          },
          quranic_subjects: {
            connect: payload.quranic_subject_ids.map((id) => ({ id })),
          },
          arabic_subjects: {
            connect: payload.arabic_subject_ids.map((id) => ({ id })),
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
      if (current.general_period_id) {
        if (current.quranic_period_id || current.arabic_period_id) {
          throw new AppError(
            "Class routine has an invalid period configuration.",
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (current.quranic_period_id) {
        if (current.general_period_id || current.arabic_period_id) {
          throw new AppError(
            "Class routine has an invalid period configuration.",
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
      } else if (current.arabic_period_id) {
        if (current.general_period_id || current.quranic_period_id) {
          throw new AppError(
            "Class routine has an invalid period configuration.",
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new AppError(
          "Class routine has no period configuration.",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      let currentPeriodType: "general" | "quranic" | "arabic";
      if (current.general_period_id) {
        currentPeriodType = "general";
      } else if (current.quranic_period_id) {
        currentPeriodType = "quranic";
      } else if (current.arabic_period_id) {
        currentPeriodType = "arabic";
      } else {
        throw new AppError(
          "Class routine has no period configuration.",
          StatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      const nextShift =
        current.shift ??
        (payload.field === "shift" ? payload.value : undefined);
      if (!nextShift) {
        throw new AppError(
          "Assign a shift to this existing routine before updating it.",
          StatusCodes.BAD_REQUEST,
        );
      }

      const next: TUpdateClassRoutinePayload = {
        class_ids: current.class.map(({ id: classId }) => classId),
        shift: nextShift,
        teacher_ids: current.teachers.map(({ id: teacherId }) => teacherId),
        general_period_id: current.general_period_id ?? undefined,
        quranic_period_id: current.quranic_period_id ?? undefined,
        arabic_period_id: current.arabic_period_id ?? undefined,
        general_subject_ids: current.general_subjects.map(
          ({ id: subjectId }) => subjectId,
        ),
        quranic_subject_ids: current.quranic_subjects.map(
          ({ id: subjectId }) => subjectId,
        ),
        arabic_subject_ids: current.arabic_subjects.map(
          ({ id: subjectId }) => subjectId,
        ),
      };

      switch (payload.field) {
        case "class_ids":
          next.class_ids = payload.value;
          break;
        case "shift":
          next.shift = payload.value;
          break;
        case "teacher_ids":
          next.teacher_ids = payload.value;
          break;
        case "general_period_id":
          next.general_period_id = payload.value;
          next.quranic_period_id = undefined;
          next.arabic_period_id = undefined;
          break;
        case "quranic_period_id":
          next.general_period_id = undefined;
          next.quranic_period_id = payload.value;
          next.arabic_period_id = undefined;
          break;
        case "arabic_period_id":
          next.general_period_id = undefined;
          next.quranic_period_id = undefined;
          next.arabic_period_id = payload.value;
          break;
        case "general_subject_ids":
          if (currentPeriodType !== "general") {
            throw new AppError(
              "General subjects cannot be assigned to a non-general period.",
              StatusCodes.BAD_REQUEST,
            );
          }
          next.general_subject_ids = payload.value;
          next.quranic_subject_ids = [];
          next.arabic_subject_ids = [];
          break;
        case "quranic_subject_ids":
          if (currentPeriodType !== "quranic") {
            throw new AppError(
              "Quranic subjects cannot be assigned to a non-quranic period.",
              StatusCodes.BAD_REQUEST,
            );
          }
          next.general_subject_ids = [];
          next.quranic_subject_ids = payload.value;
          next.arabic_subject_ids = [];
          break;

        case "arabic_subject_ids":
          if (currentPeriodType !== "arabic") {
            throw new AppError(
              "Arabic subjects cannot be assigned to a non-arabic period.",
              StatusCodes.BAD_REQUEST,
            );
          }
          next.general_subject_ids = [];
          next.quranic_subject_ids = [];
          next.arabic_subject_ids = payload.value;
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
