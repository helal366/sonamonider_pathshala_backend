import { ExamType, Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import type { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import {
  TCreateMoralMannersEvaluationMark,
  TUpdateMoralMannersEvaluationMark,
  TUpdateMoralMannersEvaluationMarkField,
} from "./moralMannersEvaluationMark.zodValidation.js";

const entityName = "moralMannersEvaluationMark";

const ensureClassHistoryAvailable = async (
  transaction: Prisma.TransactionClient,
  classHistoryId: string,
  examType: ExamType,
  markId?: string,
) => {
  const history = await transaction.classHistory.findUnique({
    where: { id: classHistoryId },
    select: { id: true },
  });
  if (!history) {
    throw new AppError("Class history not found.", StatusCodes.NOT_FOUND);
  }
  const duplicate = await transaction.moralMannersEvaluationMark.findFirst({
    where: {
      class_history_id: classHistoryId,
      exam_type: examType,
      ...(markId && { id: { not: markId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "A moral manners evaluation mark already exists for this class history and exam type.",
      StatusCodes.CONFLICT,
    );
  }
};

const createMoralMannersEvaluationMark = async (
  payload: TCreateMoralMannersEvaluationMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureClassHistoryAvailable(
      transaction,
      payload.class_history_id,
      payload.exam_type,
    );

    const { class_history_id, ...markData } = payload;
    const created = await transaction.moralMannersEvaluationMark.create({
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

const deleteMoralMannersEvaluationMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.moralMannersEvaluationMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Moral manners evaluation mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }
    const deleted = await transaction.moralMannersEvaluationMark.delete({
      where: { id },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          ...existing,
          class_history_id: existing.class_history?.id ?? null,
        },
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });

const updateMoralMannersEvaluationMark = async (
  id: string,
  payload: TUpdateMoralMannersEvaluationMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.moralMannersEvaluationMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Moral manners evaluation mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }
    await ensureClassHistoryAvailable(
      transaction,
      payload.class_history_id,
      payload.exam_type,
      id,
    );

    const { class_history_id, ...markData } = payload;
    const data: Prisma.MoralMannersEvaluationMarkUncheckedUpdateInput = {
      ...markData,
      class_history_id,
      updated_by_id: loggedInUser.user_id,
    };
    const updated = await transaction.moralMannersEvaluationMark.update({
      where: { id },
      data,
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          ...existing,
          class_history_id: existing.class_history?.id ?? null,
        },
        new_value: payload,
      },
    });
    return updated;
  });

const updateMoralMannersEvaluationMarkField = async (
  id: string,
  payload: TUpdateMoralMannersEvaluationMarkField,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.moralMannersEvaluationMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Moral manners evaluation mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    let currentValue: ExamType | string;
    switch (payload.field) {
      case "class_history_id":
        currentValue = existing.class_history?.id ?? "";
        break;
      case "exam_type":
        currentValue = existing.exam_type;
        break;
      case "cleanliness":
        currentValue = existing.cleanliness;
        break;
      case "class_performance":
        currentValue = existing.class_performance;
        break;
      case "speaking_the_truth":
        currentValue = existing.speaking_the_truth;
        break;
      case "speaking_the_correct":
        currentValue = existing.speaking_the_correct;
        break;
      case "salat_religious_work":
        currentValue = existing.salat_religious_work;
        break;
    }
    if (currentValue === payload.value) {
      throw new AppError("Field value already exists.", StatusCodes.CONFLICT);
    }

    const classHistoryId =
      payload.field === "class_history_id"
        ? payload.value
        : existing.class_history?.id;
    if (!classHistoryId) {
      throw new AppError(
        "Moral manners evaluation mark is not linked to a class history.",
        StatusCodes.CONFLICT,
      );
    }
    const examType =
      payload.field === "exam_type" ? payload.value : existing.exam_type;
    await ensureClassHistoryAvailable(
      transaction,
      classHistoryId,
      examType,
      id,
    );

    let data: Prisma.MoralMannersEvaluationMarkUncheckedUpdateInput;
    switch (payload.field) {
      case "cleanliness":
        data = { cleanliness: payload.value };
        break;
      case "class_performance":
        data = { class_performance: payload.value };
        break;
      case "speaking_the_truth":
        data = { speaking_the_truth: payload.value };
        break;
      case "speaking_the_correct":
        data = { speaking_the_correct: payload.value };
        break;
      case "salat_religious_work":
        data = { salat_religious_work: payload.value };
        break;
      case "exam_type":
        data = { exam_type: payload.value };
        break;
      case "class_history_id":
        data = { class_history_id: payload.value };
        break;
    }
    const updated = await transaction.moralMannersEvaluationMark.update({
      where: { id },
      data: { ...data, updated_by_id: loggedInUser.user_id },
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

const getAllMoralMannersEvaluationMarks = () =>
  prisma.moralMannersEvaluationMark.findMany({
    orderBy: { created_at: "desc" },
  });

const getMoralMannersEvaluationMarkById = async (id: string) => {
  const mark = await prisma.moralMannersEvaluationMark.findUnique({
    where: { id },
  });
  if (!mark) {
    throw new AppError(
      "Moral manners evaluation mark not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  return mark;
};

export const moralMannersEvaluationMarkServices = {
  createMoralMannersEvaluationMark,
  deleteMoralMannersEvaluationMark,
  updateMoralMannersEvaluationMark,
  updateMoralMannersEvaluationMarkField,
  getAllMoralMannersEvaluationMarks,
  getMoralMannersEvaluationMarkById,
};
