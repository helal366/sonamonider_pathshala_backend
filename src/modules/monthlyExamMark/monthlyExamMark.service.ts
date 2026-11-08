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

const ensureClassHistoryAvailable = async (
  transaction: Prisma.TransactionClient,
  classHistoryId: string,
  markId?: string,
) => {
  const history = await transaction.classHistory.findUnique({
    where: { id: classHistoryId },
    select: { id: true, monthly_exam_marks: { select: { id: true } } },
  });
  if (!history) {
    throw new AppError("Class history not found.", StatusCodes.NOT_FOUND);
  }
  if (history.monthly_exam_marks && history.monthly_exam_marks.id !== markId) {
    throw new AppError(
      "A monthly exam mark is already assigned to this class history.",
      StatusCodes.CONFLICT,
    );
  }
};

const createMonthlyExamMark = async (
  payload: TCreateMonthlyExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureClassHistoryAvailable(transaction, payload.class_history_id);
    const { class_history_id, ...markData } = payload;
    const created = await transaction.monthlyExamMark.create({
      data: {
        ...markData,
        class_history_id,
        created_by_id: loggedInUser.user_id,
      },
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
      include: { class_history: true },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const deleted = await transaction.monthlyExamMark.delete({ where: { id } });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          ...auditValues(existing),
          class_history_id: existing.class_history?.id ?? null,
        },
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
      include: { class_history: true },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    await ensureClassHistoryAvailable(
      transaction,
      payload.class_history_id,
      id,
    );
    const { class_history_id, ...markData } = payload;
    const updated = await transaction.monthlyExamMark.update({
      where: { id },
      data: {
        ...markData,
        class_history_id,
        updated_by_id: loggedInUser.user_id,
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          ...auditValues(existing),
          class_history_id: existing.class_history?.id ?? null,
        },
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
      include: { class_history: true },
    });
    if (!existing) {
      throw new AppError("Monthly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const currentValue =
      payload.field === "class_history_id"
        ? existing.class_history?.id ?? ""
        : existing[payload.field].toNumber();
    if (currentValue === payload.value) {
      throw new AppError("Field value already exists.", StatusCodes.CONFLICT);
    }
    if (payload.field === "class_history_id") {
      await ensureClassHistoryAvailable(transaction, payload.value, id);
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
        old_value: { [payload.field]: currentValue },
        new_value: { [payload.field]: payload.value },
      },
    });
    return updated;
  });

const getAllMonthlyExamMarks = () =>
  prisma.monthlyExamMark.findMany({
    include: { class_history: true },
    orderBy: { created_at: "desc" },
  });

const getMonthlyExamMarkById = async (id: string) => {
  const mark = await prisma.monthlyExamMark.findUnique({
    where: { id },
    include: { class_history: true },
  });
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
