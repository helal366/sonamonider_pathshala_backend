import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateSubjectPayload,
  TUpdateSubjectPayload,
  TUpdateSubjectSingleFieldPayload,
} from "./subject.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;

const findNameConflict = async (name: string, id?: string) =>
  prisma.subject.findFirst({
    where: { subject_name: name, ...(id ? { id: { not: id } } : {}) },
    select: { id: true },
  });

const createSubject = async (payload: TCreateSubjectPayload, user: LoggedInUser) => {
  const subjectName = payload.subject_name.trim().toUpperCase();
  if (await findNameConflict(subjectName)) {
    throw new AppError(`Subject "${subjectName}" already exists.`, StatusCodes.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    const subject = await tx.subject.create({
      data: { subject_name: subjectName, created_by_id: user.user_id },
    });
    await tx.auditLog.create({
      data: {
        entity_id: subject.id,
        entity_name: "subject",
        action: "CREATE",
        changed_by_id: user.user_id,
        old_value: Prisma.JsonNull,
        new_value: { subject_name: subjectName, created_by_id: user.user_id },
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
  const subjectName = payload.subject_name.trim().toUpperCase();
  const current = await prisma.subject.findUnique({ where: { id } });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (await findNameConflict(subjectName, id)) {
    throw new AppError(`Subject "${subjectName}" already exists.`, StatusCodes.CONFLICT);
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.subject.update({
      where: { id },
      data: { subject_name: subjectName, updated_by_id: user.user_id },
    });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "subject",
        action: "UPDATE",
        changed_by_id: user.user_id,
        old_value: { subject_name: current.subject_name },
        new_value: { subject_name: subjectName },
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
  const current = await prisma.subject.findUnique({ where: { id } });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (current.subject_name === subjectName) {
    throw new AppError(
      "The provided subject name is identical to the current record.",
      StatusCodes.BAD_REQUEST,
    );
  }
  return updateSubject({ subject_name: subjectName }, user, id);
};

const deleteSubject = async (id: string, user: LoggedInUser) => {
  const current = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!current) throw new AppError("Subject not found.", StatusCodes.NOT_FOUND);
  if (current._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete subject "${current.subject_name}". It is used by ${current._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const deleted = await tx.subject.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "subject",
        action: "DELETE",
        changed_by_id: user.user_id,
        old_value: { subject_name: current.subject_name },
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

const getAllSubjects = () =>
  prisma.subject.findMany({
    orderBy: { subject_name: "asc" },
    include: { _count: { select: { class_routines: true } } },
  });

const getSingleSubject = async (id: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { class_routines: true } } },
  });
  if (!subject) throw new AppError("Requested subject does not exist.", StatusCodes.NOT_FOUND);
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
