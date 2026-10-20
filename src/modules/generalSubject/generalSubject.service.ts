import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateSubjectPayload,
  TUpdateSubjectPayload,
  TUpdateSubjectSingleFieldPayload,
} from "./generalSubject.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;

const findNameConflict = async (name: string, id?: string) =>
  prisma.generalSubject.findFirst({
    where: { general_subject_name: name, ...(id ? { id: { not: id } } : {}) },
    select: { id: true },
  });

const createSubject = async (
  payload: TCreateSubjectPayload,
  user: LoggedInUser,
) => {
  const subjectName = payload.general_subject_name.trim().toUpperCase();
  if (await findNameConflict(subjectName)) {
    throw new AppError(
      `Subject "${subjectName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const subject = await tx.generalSubject.create({
      data: { general_subject_name: subjectName, created_by_id: user.user_id },
    });
    await tx.auditLog.create({
      data: {
        entity_id: subject.id,
        entity_name: "subject",
        action: "CREATE",
        changed_by_id: user.user_id,
        old_value: Prisma.JsonNull,
        new_value: { general_subject_name: subjectName, created_by_id: user.user_id },
      },
    });
    return subject;
  });
};

const updateSubject = async (
  payload: TUpdateSubjectPayload,
  user: LoggedInUser,
  id: string,
) => {
  const subjectName = payload.general_subject_name.trim().toUpperCase();
  const current = await prisma.generalSubject.findUnique({ where: { id } });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (await findNameConflict(subjectName, id)) {
    throw new AppError(
      `Subject "${subjectName}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.generalSubject.update({
      where: { id },
      data: { general_subject_name: subjectName, updated_by_id: user.user_id },
    });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "subject",
        action: "UPDATE",
        changed_by_id: user.user_id,
        old_value: { general_subject_name: current.general_subject_name },
        new_value: { general_subject_name: subjectName },
      },
    });
    return updated;
  });
};

const updateSubjectSingleField = async (
  payload: TUpdateSubjectSingleFieldPayload,
  user: LoggedInUser,
  id: string,
) => {
  const subjectName = payload.value.trim().toUpperCase();
  const current = await prisma.generalSubject.findUnique({ where: { id } });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (current.general_subject_name === subjectName) {
    throw new AppError(
      "The provided subject name is identical to the current record.",
      StatusCodes.BAD_REQUEST,
    );
  }
  return updateSubject({ general_subject_name: subjectName }, user, id);
};

const deleteSubject = async (id: string, user: LoggedInUser) => {
  const current = await prisma.generalSubject.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (current._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete subject "${current.general_subject_name}". It is used by ${current._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.generalSubject.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "subject",
        action: "DELETE",
        changed_by_id: user.user_id,
        old_value: { general_subject_name: current.general_subject_name },
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

const getAllSubjects = () =>
  prisma.generalSubject.findMany({
    orderBy: { general_subject_name: "asc" },
    include: { _count: { select: { class_routines: true } } },
  });

const getSingleSubject = async (id: string) => {
  const subject = await prisma.generalSubject.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!subject)
    throw new AppError(
      "Requested subject does not exist.",
      StatusCodes.NOT_FOUND,
    );
  return subject;
};

export const subjectServices = {
  createSubject,
  updateSubject,
  updateSubjectSingleField,
  deleteSubject,
  getAllSubjects,
  getSingleSubject,
};
