import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateQuranicSubjectZodSchema,
  TUpdateQuranicSubjectSingleFieldPayload,
  TUpdateQuranicSubjectZodSchema,
} from "./quranicSubject.zodValidation.js";

// ============================================================
// CREATE QURANIC SUBJECT SERVICE LAYER
// ============================================================
const createQuranicSubject = async (
  payload: TCreateQuranicSubjectZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_subject_name } = payload;
  const cleanSubjectName = quranic_subject_name.trim().toUpperCase();

  // 1. Prevent duplicate subject names (case-insensitive check)
  const existingSubject = await prisma.quranicSubject.findFirst({
    where: {
      quranic_subject_name: cleanSubjectName,
    },
    select: { id: true },
  });

  if (existingSubject) {
    throw new AppError(
      `Quranic subject '${cleanSubjectName}' already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Atomic transaction execution
  const result = await prisma.$transaction(async (tx) => {
    const newSubject = await tx.quranicSubject.create({
      data: {
        quranic_subject_name: cleanSubjectName,
        created_by_id: loggedInUser.user_id,
      },
    });

    // Write audit log trail
    await tx.auditLog.create({
      data: {
        entity_id: newSubject.id,
        entity_name: "quranicSubject",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          quranic_subject_name: cleanSubjectName,
        },
      },
    });

    return newSubject;
  });

  return result;
};

// ============================================================
// UPDATE QURANIC SUBJECT SERVICE LAYER
// ============================================================
const updateQuranicSubject = async (
  payload: TUpdateQuranicSubjectZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
  quranic_subject_id: string,
) => {
  const { quranic_subject_name } = payload;
  const cleanSubjectName = quranic_subject_name.trim().toUpperCase();

  // 1. Verify target record exists
  const currentSubject = await prisma.quranicSubject.findUnique({
    where: { id: quranic_subject_id },
    select: { id: true, quranic_subject_name: true },
  });

  if (!currentSubject) {
    throw new AppError("Quranic subject not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Prevent naming conflicts with other subjects
  const nameConflict = await prisma.quranicSubject.findFirst({
    where: {
      quranic_subject_name: cleanSubjectName,
      id: { not: quranic_subject_id },
    },
    select: { id: true },
  });

  if (nameConflict) {
    throw new AppError(
      `Another quranic subject with the name '${
        cleanSubjectName
      }' already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Update quranic subject
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.quranicSubject.update({
      where: { id: quranic_subject_id },
      data: {
        quranic_subject_name: cleanSubjectName,
        updated_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_subject_id,
        entity_name: "quranicSubject",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          quranic_subject_name: currentSubject.quranic_subject_name,
        },
        new_value: { quranic_subject_name: cleanSubjectName },
      },
    });

    return updated;
  });

  return result;
};

const updateQuranicSubjectSingleField = async (
  payload: TUpdateQuranicSubjectSingleFieldPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
  quranic_subject_id: string,
) => {
  const cleanSubjectName = payload.value.trim().toUpperCase();
  const currentSubject = await prisma.quranicSubject.findUnique({
    where: { id: quranic_subject_id },
    select: { id: true, quranic_subject_name: true },
  });

  if (!currentSubject) {
    throw new AppError("Quranic subject not found.", StatusCodes.NOT_FOUND);
  }

  if (currentSubject.quranic_subject_name === cleanSubjectName) {
    throw new AppError(
      "The provided subject name is identical to the current record.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const nameConflict = await prisma.quranicSubject.findFirst({
    where: {
      quranic_subject_name: cleanSubjectName,
      id: { not: quranic_subject_id },
    },
    select: { id: true },
  });

  if (nameConflict) {
    throw new AppError(
      `Another quranic subject with the name '${cleanSubjectName}' already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.quranicSubject.update({
      where: { id: quranic_subject_id },
      data: {
        quranic_subject_name: cleanSubjectName,
        updated_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_subject_id,
        entity_name: "quranicSubject",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          quranic_subject_name: currentSubject.quranic_subject_name,
        },
        new_value: { quranic_subject_name: cleanSubjectName },
      },
    });

    return updated;
  });
};

// ============================================================
// DELETE QURANIC SUBJECT SERVICE LAYER
// ============================================================
const deleteQuranicSubject = async (
  quranic_subject_id: string,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  // 1. Verify existence and count references in student class histories
  const targetSubject = await prisma.quranicSubject.findUnique({
    where: { id: quranic_subject_id },
    include: {
      _count: {
        select: {
          class_history: true, // Counts how many students are/were attached to this Quranic subject
          class_routines: true,
        },
      },
    },
  });

  if (!targetSubject) {
    throw new AppError("Quranic subject not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Enforce constraint checks to prevent cascade dependency breaks
  if (targetSubject._count.class_history > 0) {
    throw new AppError(
      `Cannot delete quranic subject '${
        targetSubject.quranic_subject_name
      }'. There are active or historical student timelines linked to it.`,
      StatusCodes.CONFLICT,
    );
  }
  if (targetSubject._count.class_routines > 0) {
    throw new AppError(
      `Cannot delete Quranic subject "${targetSubject.quranic_subject_name}". It is used by ${targetSubject._count.class_routines} class routine(s).`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Atomically execute removal
  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.quranicSubject.delete({
      where: { id: quranic_subject_id },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_subject_id,
        entity_name: "quranicSubject",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: { quranic_subject_name: targetSubject.quranic_subject_name },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });

  return result;
};

// ============================================================
// GET ALL QURANIC SUBJECTS SERVICE LAYER
// ============================================================
const getAllQuranicSubjects = async () => {
  const quranicSubjects = await prisma.quranicSubject.findMany({
    orderBy: { quranic_subject_name: "asc" },
    include: {
      _count: {
        select: { class_history: true, class_routines: true },
      },
    },
  });

  return quranicSubjects;
};

// ============================================================
// GET SINGLE QURANIC SUBJECT BY ID SERVICE LAYER
// ============================================================
const getSingleQuranicSubject = async (id: string) => {
  const quranicSubject = await prisma.quranicSubject.findUnique({
    where: { id },
    include: {
      _count: {
        select: { class_history: true, class_routines: true },
      },
    },
  });

  if (!quranicSubject) {
    throw new AppError(
      "Requested quranic subject does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  return quranicSubject;
};

export const quranicSubjectServices = {
  createQuranicSubject,
  updateQuranicSubject,
  updateQuranicSubjectSingleField,
  deleteQuranicSubject,
  getAllQuranicSubjects,
  getSingleQuranicSubject,
};
