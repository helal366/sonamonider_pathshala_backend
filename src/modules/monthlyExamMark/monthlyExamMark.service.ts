import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import type { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import {
  TCreateMonthlyExamMark,
  TUpdateMonthlyExamMark,
  TUpdateMonthlyExamMarkField,
} from "./monthlyExamMark.zodValidation.js";

const entityName = "monthlyExamMark";
const fields = [
  "january_mark",
  "february_mark",
  "march_mark",
  "april_mark",
  "july_mark",
  "august_mark",
  "september_mark",
  "october_mark",
] as const;

const auditValues = (record: Record<(typeof fields)[number], Prisma.Decimal>) =>
  Object.fromEntries(fields.map((field) => [field, record[field].toNumber()]));

const createMonthlyExamMark = async (
  payload: TCreateMonthlyExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const created = await transaction.monthlyExamMark.create({
      data: { ...payload, created_by_id: loggedInUser.user_id },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: entityName,
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: payload,
      },
    });
    return created;
  });

const deleteMonthlyExamMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.monthlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const linkedResults = await transaction.studentResult.count({
      where: { monthly_exam_mark_id: id },
    });
    if (linkedResults > 0) {
      throw new AppError(
        "Cannot delete a monthly exam mark assigned to student results.",
        StatusCodes.CONFLICT,
      );
    }
    const deleted = await transaction.monthlyExamMark.delete({ where: { id } });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: auditValues(existing),
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });

const updateMonthlyExamMark = async (
  id: string,
  payload: TUpdateMonthlyExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.monthlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const updated = await transaction.monthlyExamMark.update({
      where: { id },
      data: {
        ...payload,
        updated_by_id: loggedInUser.user_id,
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: auditValues(existing),
        new_value: payload,
      },
    });
    return updated;
  });

const updateMonthlyExamMarkField = async (
  id: string,
  payload: TUpdateMonthlyExamMarkField,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.monthlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    if (existing[payload.field].toNumber() === payload.value) {
      throw new AppError("Field value already exists.", StatusCodes.CONFLICT);
    }
    const updated = await transaction.monthlyExamMark.update({
      where: { id },
      data: {
        [payload.field]: payload.value,
        updated_by_id: loggedInUser.user_id,
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { [payload.field]: existing[payload.field].toNumber() },
        new_value: { [payload.field]: payload.value },
      },
    });
    return updated;
  });

const getAllMonthlyExamMarks = () =>
  prisma.monthlyExamMark.findMany({ orderBy: { created_at: "desc" } });

const getMonthlyExamMarkById = async (id: string) => {
  const mark = await prisma.monthlyExamMark.findUnique({ where: { id } });
  if (!mark) {
    throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
  }
  return mark;
};

export const monthlyExamMarkServices = {
  createMonthlyExamMark,
  deleteMonthlyExamMark,
  updateMonthlyExamMark,
  updateMonthlyExamMarkField,
  getAllMonthlyExamMarks,
  getMonthlyExamMarkById,
};
