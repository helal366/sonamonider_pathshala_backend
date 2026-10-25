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

const ensureStudentResultExists = async (
  transaction: Prisma.TransactionClient,
  studentResultId: string,
) => {
  const result = await transaction.studentResult.findUnique({
    where: { id: studentResultId },
    select: { id: true },
  });
  if (!result) {
    throw new AppError("Student result not found.", StatusCodes.NOT_FOUND);
  }
};

const ensureUniqueResultExam = async (
  transaction: Prisma.TransactionClient,
  studentResultId: string,
  examType: ExamType,
  excludedId?: string,
) => {
  const duplicate = await transaction.moralMannersEvaluationMark.findFirst({
    where: {
      student_result_id: studentResultId,
      exam_type: examType,
      ...(excludedId && { id: { not: excludedId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "A moral manners evaluation mark already exists for this student result and exam type.",
      StatusCodes.CONFLICT,
    );
  }
};

const createMoralMannersEvaluationMark = async (
  payload: TCreateMoralMannersEvaluationMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureStudentResultExists(transaction, payload.student_result_id);
    await ensureUniqueResultExam(
      transaction,
      payload.student_result_id,
      payload.exam_type,
    );

    const created = await transaction.moralMannersEvaluationMark.create({
      data: {
        ...payload,
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
        old_value: existing,
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
      });
    if (!existing) {
      throw new AppError(
        "Moral manners evaluation mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }
    await ensureStudentResultExists(transaction, payload.student_result_id);
    await ensureUniqueResultExam(
      transaction,
      payload.student_result_id,
      payload.exam_type,
      id,
    );

    const data: Prisma.MoralMannersEvaluationMarkUncheckedUpdateInput = {
      ...payload,
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
        old_value: existing,
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
      });
    if (!existing) {
      throw new AppError(
        "Moral manners evaluation mark not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const currentValue = existing[payload.field];
    if (currentValue === payload.value) {
      throw new AppError("Field value already exists.", StatusCodes.CONFLICT);
    }

    const studentResultId =
      payload.field === "student_result_id"
        ? payload.value
        : existing.student_result_id;
    const examType =
      payload.field === "exam_type" ? payload.value : existing.exam_type;
    await ensureStudentResultExists(transaction, studentResultId);
    await ensureUniqueResultExam(transaction, studentResultId, examType, id);

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
      case "student_result_id":
        data = { student_result_id: payload.value };
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
