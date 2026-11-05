import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import type { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import {
  TCreateHalfYearlyExamMark,
  TUpdateHalfYearlyExamMark,
  TUpdateHalfYearlyExamMarkField,
} from "./halfYearlyExamMark.zodValidation.js";

const entityName = "halfYearlyExamMark";
const auditValues = (record: {
  full_mark: Prisma.Decimal;
  highest_mark: Prisma.Decimal;
  obtained_mark: Prisma.Decimal;
  student_result_id: string;
  exam_subject_id: string;
}) => ({
  full_mark: record.full_mark.toNumber(),
  highest_mark: record.highest_mark.toNumber(),
  obtained_mark: record.obtained_mark.toNumber(),
  student_result_id: record.student_result_id,
  exam_subject_id: record.exam_subject_id,
});

const ensureRelationsAndUnique = async (
  transaction: Prisma.TransactionClient,
  studentResultId: string,
  examSubjectId: string,
  excludedId?: string,
) => {
  const [studentResult, examSubject] = await Promise.all([
    transaction.studentResult.findUnique({
      where: { id: studentResultId },
      select: { id: true },
    }),
    transaction.examSubject.findUnique({
      where: { id: examSubjectId },
      select: { id: true },
    }),
  ]);
  if (!studentResult) {
    throw new AppError("Student result not found.", StatusCodes.NOT_FOUND);
  }
  if (!examSubject) {
    throw new AppError("Exam subject not found.", StatusCodes.NOT_FOUND);
  }
  const duplicate = await transaction.halfYearlyExamMark.findFirst({
    where: {
      student_result_id: studentResultId,
      exam_subject_id: examSubjectId,
      ...(excludedId && { id: { not: excludedId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "A half-yearly mark already exists for this student result and exam subject.",
      StatusCodes.CONFLICT,
    );
  }
};

const createHalfYearlyExamMark = async (
  payload: TCreateHalfYearlyExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureRelationsAndUnique(
      transaction,
      payload.student_result_id,
      payload.exam_subject_id,
    );
    const created = await transaction.halfYearlyExamMark.create({
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

const deleteHalfYearlyExamMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.halfYearlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Half-yearly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const deleted = await transaction.halfYearlyExamMark.delete({ where: { id } });
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

const updateHalfYearlyExamMark = async (
  id: string,
  payload: TUpdateHalfYearlyExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.halfYearlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Half-yearly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    await ensureRelationsAndUnique(
      transaction,
      payload.student_result_id,
      payload.exam_subject_id,
      id,
    );
    const updated = await transaction.halfYearlyExamMark.update({
      where: { id },
      data: { ...payload, updated_by_id: loggedInUser.user_id },
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

const updateHalfYearlyExamMarkField = async (
  id: string,
  payload: TUpdateHalfYearlyExamMarkField,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.halfYearlyExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Half-yearly exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const currentValue = existing[payload.field];
    if (
      currentValue instanceof Prisma.Decimal
        ? currentValue.toNumber() === payload.value
        : currentValue === payload.value
    ) {
      throw new AppError("Field value already exists.", StatusCodes.CONFLICT);
    }

    const studentResultId =
      payload.field === "student_result_id"
        ? payload.value
        : existing.student_result_id;
    const examSubjectId =
      payload.field === "exam_subject_id"
        ? payload.value
        : existing.exam_subject_id;
    await ensureRelationsAndUnique(transaction, studentResultId, examSubjectId, id);

    if (
      payload.field === "full_mark" ||
      payload.field === "highest_mark" ||
      payload.field === "obtained_mark"
    ) {
      const fullMark =
        payload.field === "full_mark"
          ? payload.value
          : existing.full_mark.toNumber();
      const highestMark =
        payload.field === "highest_mark"
          ? payload.value
          : existing.highest_mark.toNumber();
      const obtainedMark =
        payload.field === "obtained_mark"
          ? payload.value
          : existing.obtained_mark.toNumber();

      if (highestMark > fullMark) {
        throw new AppError(
          `Highest mark cannot exceed the full mark (${fullMark}).`,
          StatusCodes.BAD_REQUEST,
        );
      }
      if (obtainedMark > fullMark) {
        throw new AppError(
          `Obtained mark cannot exceed the full mark (${fullMark}).`,
          StatusCodes.BAD_REQUEST,
        );
      }
      if (obtainedMark > highestMark) {
        throw new AppError(
          `Obtained mark cannot exceed the highest mark (${highestMark}).`,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    let data: Prisma.HalfYearlyExamMarkUncheckedUpdateInput;
    switch (payload.field) {
      case "full_mark":
        data = { full_mark: payload.value };
        break;
      case "highest_mark":
        data = { highest_mark: payload.value };
        break;
      case "obtained_mark":
        data = { obtained_mark: payload.value };
        break;
      case "student_result_id":
        data = { student_result_id: payload.value };
        break;
      case "exam_subject_id":
        data = { exam_subject_id: payload.value };
        break;
    }
    const updated = await transaction.halfYearlyExamMark.update({
      where: { id },
      data: { ...data, updated_by_id: loggedInUser.user_id },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: id,
        entity_name: entityName,
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          [payload.field]:
            currentValue instanceof Prisma.Decimal
              ? currentValue.toNumber()
              : currentValue,
        },
        new_value: { [payload.field]: payload.value },
      },
    });
    return updated;
  });

const getAllHalfYearlyExamMarks = () =>
  prisma.halfYearlyExamMark.findMany({
    include: { student_result: true, exam_subject: true },
    orderBy: { created_at: "desc" },
  });

const getHalfYearlyExamMarkById = async (id: string) => {
  const mark = await prisma.halfYearlyExamMark.findUnique({
    where: { id },
    include: { student_result: true, exam_subject: true },
  });
  if (!mark) {
    throw new AppError("Half-yearly exam mark not found.", StatusCodes.NOT_FOUND);
  }
  return mark;
};

export const halfYearlyExamMarkServices = {
  createHalfYearlyExamMark,
  deleteHalfYearlyExamMark,
  updateHalfYearlyExamMark,
  updateHalfYearlyExamMarkField,
  getAllHalfYearlyExamMarks,
  getHalfYearlyExamMarkById,
};
