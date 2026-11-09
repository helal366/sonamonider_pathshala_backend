import { ExamType, Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import type { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import {
  TCreateCoCurricularActivitiesMark,
  TUpdateCoCurricularActivitiesMark,
  TUpdateCoCurricularActivitiesMarkField,
} from "./coCurricularActivitiesMark.zodValidation.js";
import { toAuditJson } from "../../helperFunctions/helpers/helperFunctions.js";

const entityName = "coCurricularActivitiesMark";

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
  const duplicate = await transaction.coCurricularActivitiesMark.findFirst({
    where: {
      class_history_id: classHistoryId,
      exam_type: examType,
      ...(markId && { id: { not: markId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "A co-curricular activities mark already exists for this class history and exam type.",
      StatusCodes.CONFLICT,
    );
  }
};

const createCoCurricularActivitiesMark = async (
  payload: TCreateCoCurricularActivitiesMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureClassHistoryAvailable(
      transaction,
      payload.class_history_id,
      payload.exam_type,
    );

    const { class_history_id, ...markData } = payload;
    const created = await transaction.coCurricularActivitiesMark.create({
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
        new_value: toAuditJson(payload),
      },
    });
    return created;
  });

const deleteCoCurricularActivitiesMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.coCurricularActivitiesMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Co-curricular activities mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }
    const deleted = await transaction.coCurricularActivitiesMark.delete({
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

const updateCoCurricularActivitiesMark = async (
  id: string,
  payload: TUpdateCoCurricularActivitiesMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.coCurricularActivitiesMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Co-curricular activities mark not found.",
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
    const data: Prisma.CoCurricularActivitiesMarkUncheckedUpdateInput = {
      ...markData,
      class_history_id,
      updated_by_id: loggedInUser.user_id,
    };
    const updated = await transaction.coCurricularActivitiesMark.update({
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
        new_value: toAuditJson(payload),
      },
    });
    return updated;
  });

const updateCoCurricularActivitiesMarkField = async (
  id: string,
  payload: TUpdateCoCurricularActivitiesMarkField,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.coCurricularActivitiesMark.findUnique({
        where: { id },
        include: { class_history: true },
      });
    if (!existing) {
      throw new AppError(
        "Co-curricular activities mark not found.",
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
      case "al_quran_grade":
        currentValue = existing.al_quran_grade;
        break;
      case "conversation":
        currentValue = existing.conversation;
        break;
      case "akhlake_hasanah":
        currentValue = existing.akhlake_hasanah;
        break;
      case "cultural_activities":
        currentValue = existing.cultural_activities;
        break;
      case "sports_scouts":
        currentValue = existing.sports_scouts;
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
        "Co-curricular activities mark is not linked to a class history.",
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

    let data: Prisma.CoCurricularActivitiesMarkUncheckedUpdateInput;
    switch (payload.field) {
      case "al_quran_grade":
        data = { al_quran_grade: payload.value };
        break;
      case "conversation":
        data = { conversation: payload.value };
        break;
      case "akhlake_hasanah":
        data = { akhlake_hasanah: payload.value };
        break;
      case "cultural_activities":
        data = { cultural_activities: payload.value };
        break;
      case "sports_scouts":
        data = { sports_scouts: payload.value };
        break;
      case "exam_type":
        data = { exam_type: payload.value };
        break;
      case "class_history_id":
        data = { class_history_id: payload.value };
        break;
    }
    const updated = await transaction.coCurricularActivitiesMark.update({
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

const getAllCoCurricularActivitiesMarks = () =>
  prisma.coCurricularActivitiesMark.findMany({
    orderBy: { created_at: "desc" },
  });

const getCoCurricularActivitiesMarkById = async (id: string) => {
  const mark = await prisma.coCurricularActivitiesMark.findUnique({
    where: { id },
  });
  if (!mark) {
    throw new AppError(
      "Co-curricular activities mark not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  return mark;
};

export const coCurricularActivitiesMarkServices = {
  createCoCurricularActivitiesMark,
  deleteCoCurricularActivitiesMark,
  updateCoCurricularActivitiesMark,
  updateCoCurricularActivitiesMarkField,
  getAllCoCurricularActivitiesMarks,
  getCoCurricularActivitiesMarkById,
};
