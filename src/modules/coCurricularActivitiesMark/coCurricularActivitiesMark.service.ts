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

const entityName = "coCurricularActivitiesMark";

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
  const duplicate = await transaction.coCurricularActivitiesMark.findFirst({
    where: {
      student_result_id: studentResultId,
      exam_type: examType,
      ...(excludedId && { id: { not: excludedId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "A co-curricular activities mark already exists for this student result and exam type.",
      StatusCodes.CONFLICT,
    );
  }
};

const createCoCurricularActivitiesMark = async (
  payload: TCreateCoCurricularActivitiesMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureStudentResultExists(transaction, payload.student_result_id);
    await ensureUniqueResultExam(
      transaction,
      payload.student_result_id,
      payload.exam_type,
    );

    const created = await transaction.coCurricularActivitiesMark.create({
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

const deleteCoCurricularActivitiesMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing =
      await transaction.coCurricularActivitiesMark.findUnique({
        where: { id },
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
        old_value: existing,
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
      });
    if (!existing) {
      throw new AppError(
        "Co-curricular activities mark not found.",
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

    const data: Prisma.CoCurricularActivitiesMarkUncheckedUpdateInput = {
      ...payload,
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
        old_value: existing,
        new_value: payload,
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
      });
    if (!existing) {
      throw new AppError(
        "Co-curricular activities mark not found.",
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
      case "student_result_id":
        data = { student_result_id: payload.value };
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
