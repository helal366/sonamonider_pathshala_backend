import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateQuranicClassZodSchema,
  TDeleteQuranicClassZodSchema,
  TUpdateQuranicClassZodSchema,
} from "./quranicClass.zodValidation.js";

// CREATE QURANIC CLASS SERVICE
const createQuranicClass = async (
  payload: TCreateQuranicClassZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_name } = payload;
  const cleanClassName = quranic_class_name.trim();

  // 1. Prevent duplicate class names (case-insensitive check)
  const existingClass = await prisma.quranicClass.findFirst({
    where: {
      quranic_class_name: {
        equals: cleanClassName,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (existingClass) {
    throw new AppError(
      `Quranic Class '${cleanClassName}' already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Atomic transaction execution
  const result = await prisma.$transaction(async (tx) => {
    const newClass = await tx.quranicClass.create({
      data: {
        quranic_class_name: cleanClassName,
        created_by_id: loggedInUser.user_id,
      },
    });

    // Write audit log trail
    await tx.auditLog.create({
      data: {
        entity_id: newClass.id,
        entity_name: "quranicClass",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          quranic_class_name: cleanClassName,
          created_by_id: loggedInUser.user_id,
        },
      },
    });

    return newClass;
  });

  return result;
};

// UPDATE QURANIC CLASS SERVICE
const updateQuranicClass = async (
  payload: TUpdateQuranicClassZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_id, quranic_class_name } = payload;
  const cleanClassName = quranic_class_name.trim();

  // 1. Verify target record exists
  const currentClass = await prisma.quranicClass.findUnique({
    where: { id: quranic_class_id },
    select: { id: true, quranic_class_name: true },
  });

  if (!currentClass) {
    throw new AppError("Quranic Class not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Prevent naming conflicts with other classes
  const nameConflict = await prisma.quranicClass.findFirst({
    where: {
      quranic_class_name: {
        equals: cleanClassName,
        mode: "insensitive",
      },
      id: { not: quranic_class_id },
    },
    select: { id: true },
  });

  if (nameConflict) {
    throw new AppError(
      `Another Quranic Class with the name '${cleanClassName}' already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Commit mutations and audit trails atomically
  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.quranicClass.update({
      where: { id: quranic_class_id },
      data: {
        quranic_class_name: cleanClassName,
        updated_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_class_id,
        entity_name: "quranicClass",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { quranic_class_name: currentClass.quranic_class_name },
        new_value: { quranic_class_name: cleanClassName, updated_by_id: loggedInUser.user_id },
      },
    });

    return updated;
  });

  return result;
};

// DELETE QURANIC CLASS SERVICE
const deleteQuranicClass = async (
  payload: TDeleteQuranicClassZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { quranic_class_id } = payload;

  // 1. Verify existence and count references in student class histories
  const targetClass = await prisma.quranicClass.findUnique({
    where: { id: quranic_class_id },
    include: {
      _count: {
        select: {
          class_history: true, // Counts how many students are/were attached to this Quranic class
        },
      },
    },
  });

  if (!targetClass) {
    throw new AppError("Quranic Class not found.", StatusCodes.NOT_FOUND);
  }

  // 2. Enforce constraint checks to prevent cascade dependency breaks
  if (targetClass._count.class_history > 0) {
    throw new AppError(
      `Cannot delete Quranic Class '${targetClass.quranic_class_name}'. There are active or historical student timelines linked to it.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Atomically execute removal
  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.quranicClass.delete({
      where: { id: quranic_class_id },
    });

    await tx.auditLog.create({
      data: {
        entity_id: quranic_class_id,
        entity_name: "quranicClass",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: { quranic_class_name: targetClass.quranic_class_name },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });

  return result;
};

// GET ALL QURANIC CLASSES SERVICE
const getAllQuranicClasses = async () => {
  const quranicClasses = await prisma.quranicClass.findMany({
    orderBy: { quranic_class_name: "asc" },
    include: {
      _count: {
        select: { class_history: true },
      },
    },
  });

  return quranicClasses;
};

// GET SINGLE QURANIC CLASS BY ID SERVICE
const getSingleQuranicClass = async (id: string) => {
  const quranicClass = await prisma.quranicClass.findUnique({
    where: { id },
    include: {
      _count: {
        select: { class_history: true },
      },
    },
  });

  if (!quranicClass) {
    throw new AppError("Requested Quranic Class does not exist.", StatusCodes.NOT_FOUND);
  }

  return quranicClass;
};

export const quranicClassServices = {
  createQuranicClass,
  updateQuranicClass,
  deleteQuranicClass,
  getAllQuranicClasses,
  getSingleQuranicClass,
};
