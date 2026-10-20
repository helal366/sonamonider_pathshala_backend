import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateArabicSubjectZodSchema,
  TUpdateArabicSubjectSingleFieldPayload,
  TUpdateArabicSubjectZodSchema,
} from "./arabicSubject.zodValidation.js";

type LoggedInUser = NonNullable<Express.Request["user"]>;

// ==========================================================
// ARABIC SUBJECT SERVICE HELPERS
// ==========================================================
const cleanName = (name: string) => name.trim().toUpperCase();

const throwDuplicateNameConflict = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError(
      "An Arabic subject with this name already exists.",
      StatusCodes.CONFLICT,
    );
  }
  throw error;
};

// ==========================================================
// CREATE ARABIC SUBJECT SERVICE LAYER
// ==========================================================
const createArabicSubject = async (
  payload: TCreateArabicSubjectZodSchema,
  loggedInUser: LoggedInUser,
) => {
  const arabicSubjectName = cleanName(payload.arabic_subject_name);

  try {
    return await prisma.$transaction(async (tx) => {
      const existingSubject = await tx.arabicSubject.findUnique({
        where: { arabic_subject_name: arabicSubjectName },
        select: { id: true },
      });

      if (existingSubject) {
        throw new AppError(
          "An Arabic subject with this name already exists.",
          StatusCodes.CONFLICT,
        );
      }

      const created = await tx.arabicSubject.create({
        data: {
          arabic_subject_name: arabicSubjectName,
          created_by_id: loggedInUser.user_id,
        },
      });

      await tx.auditLog.create({
        data: {
          entity_id: created.id,
          entity_name: "arabicSubject",
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
          old_value: Prisma.JsonNull,
          new_value: { arabic_subject_name: arabicSubjectName },
        },
      });

      return created;
    });
  } catch (error) {
    throwDuplicateNameConflict(error);
  }
};

// ==========================================================
// UPDATE ARABIC SUBJECT SERVICE LAYER
// ==========================================================
const updateArabicSubject = async (
  payload: TUpdateArabicSubjectZodSchema,
  loggedInUser: LoggedInUser,
  arabicSubjectId: string,
) => {
  const arabicSubjectName = cleanName(payload.arabic_subject_name);

  try {
    return await prisma.$transaction(async (tx) => {
      const currentSubject = await tx.arabicSubject.findUnique({
        where: { id: arabicSubjectId },
      });
      if (!currentSubject) {
        throw new AppError("Arabic subject not found.", StatusCodes.NOT_FOUND);
      }

      if (currentSubject.arabic_subject_name === arabicSubjectName) {
        throw new AppError(
          "The Arabic subject name is unchanged.",
          StatusCodes.CONFLICT,
        );
      }

      const nameConflict = await tx.arabicSubject.findFirst({
        where: {
          arabic_subject_name: arabicSubjectName,
          id: { not: arabicSubjectId },
        },
        select: { id: true },
      });
      if (nameConflict) {
        throw new AppError(
          "An Arabic subject with this name already exists.",
          StatusCodes.CONFLICT,
        );
      }

      const updated = await tx.arabicSubject.update({
        where: { id: arabicSubjectId },
        data: {
          arabic_subject_name: arabicSubjectName,
          updated_by_id: loggedInUser.user_id,
        },
      });

      await tx.auditLog.create({
        data: {
          entity_id: arabicSubjectId,
          entity_name: "arabicSubject",
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
          old_value: {
            arabic_subject_name: currentSubject.arabic_subject_name,
          },
          new_value: { arabic_subject_name: arabicSubjectName },
        },
      });

      return updated;
    });
  } catch (error) {
    throwDuplicateNameConflict(error);
  }
};

// ==========================================================
// UPDATE ARABIC SUBJECT SINGLE FIELD SERVICE LAYER
// ==========================================================
const updateArabicSubjectSingleField = async (
  payload: TUpdateArabicSubjectSingleFieldPayload,
  loggedInUser: LoggedInUser,
  arabicSubjectId: string,
) => {
  return updateArabicSubject(
    { arabic_subject_name: payload.value },
    loggedInUser,
    arabicSubjectId,
  );
};

// ==========================================================
// DELETE ARABIC SUBJECT SERVICE LAYER
// ==========================================================
const deleteArabicSubject = async (
  arabicSubjectId: string,
  loggedInUser: LoggedInUser,
) => {
  return prisma.$transaction(async (tx) => {
    const arabicSubject = await tx.arabicSubject.findUnique({
      where: { id: arabicSubjectId },
      include: { _count: { select: { class_routines: true } } },
    });

    if (!arabicSubject) {
      throw new AppError("Arabic subject not found.", StatusCodes.NOT_FOUND);
    }

    if (arabicSubject._count.class_routines > 0) {
      throw new AppError(
        `Cannot delete Arabic subject "${arabicSubject.arabic_subject_name}" because it is used by ${arabicSubject._count.class_routines} class routine(s).`,
        StatusCodes.CONFLICT,
      );
    }

    const deleted = await tx.arabicSubject.delete({
      where: { id: arabicSubjectId },
    });

    await tx.auditLog.create({
      data: {
        entity_id: arabicSubjectId,
        entity_name: "arabicSubject",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          arabic_subject_name: arabicSubject.arabic_subject_name,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

// ==========================================================
// GET ALL ARABIC SUBJECTS SERVICE LAYER
// ==========================================================
const getAllArabicSubjects = async () =>
  prisma.arabicSubject.findMany({
    orderBy: { arabic_subject_name: "asc" },
    include: { _count: { select: { class_routines: true } } },
  });

// ==========================================================
// GET SINGLE ARABIC SUBJECT SERVICE LAYER
// ==========================================================
const getSingleArabicSubject = async (arabicSubjectId: string) => {
  const arabicSubject = await prisma.arabicSubject.findUnique({
    where: { id: arabicSubjectId },
    include: { _count: { select: { class_routines: true } } },
  });

  if (!arabicSubject) {
    throw new AppError("Arabic subject not found.", StatusCodes.NOT_FOUND);
  }
  return arabicSubject;
};

// ==========================================================
// EXPORT ARABIC SUBJECT SERVICES
// ==========================================================
export const arabicSubjectServices = {
  createArabicSubject,
  updateArabicSubject,
  updateArabicSubjectSingleField,
  deleteArabicSubject,
  getAllArabicSubjects,
  getSingleArabicSubject,
};