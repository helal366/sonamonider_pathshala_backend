import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import type { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import {
  TCreateAnnualExamMark,
  TUpdateAnnualExamMark,
  TUpdateAnnualExamMarkField,
} from "./annualExamMark.zodValidation.js";

const entityName = "annualExamMark";
const auditValues = (record: {
  full_mark: Prisma.Decimal;
  highest_mark: Prisma.Decimal;
  obtained_mark: Prisma.Decimal;
  student_result_id: string;
  book_list_id: string;
}) => ({
  full_mark: record.full_mark.toNumber(),
  highest_mark: record.highest_mark.toNumber(),
  obtained_mark: record.obtained_mark.toNumber(),
  student_result_id: record.student_result_id,
  book_list_id: record.book_list_id,
});

const ensureRelationsAndUnique = async (
  transaction: Prisma.TransactionClient,
  studentResultId: string,
  bookListId: string,
  excludedId?: string,
) => {
  const [studentResult, bookList] = await Promise.all([
    transaction.studentResult.findUnique({
      where: { id: studentResultId },
      select: { id: true },
    }),
    transaction.booklist.findUnique({
      where: { id: bookListId },
      select: { id: true },
    }),
  ]);
  if (!studentResult) {
    throw new AppError("Student result not found.", StatusCodes.NOT_FOUND);
  }
  if (!bookList) {
    throw new AppError("Book list not found.", StatusCodes.NOT_FOUND);
  }
  const duplicate = await transaction.annualExamMark.findFirst({
    where: {
      student_result_id: studentResultId,
      book_list_id: bookListId,
      ...(excludedId && { id: { not: excludedId } }),
    },
    select: { id: true },
  });
  if (duplicate) {
    throw new AppError(
      "An annual mark already exists for this student result and book.",
      StatusCodes.CONFLICT,
    );
  }
};

const createAnnualExamMark = async (
  payload: TCreateAnnualExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    await ensureRelationsAndUnique(
      transaction,
      payload.student_result_id,
      payload.book_list_id,
    );
    const created = await transaction.annualExamMark.create({
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

const deleteAnnualExamMark = async (
  id: string,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.annualExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Annual exam mark not found.", StatusCodes.NOT_FOUND);
    }
    const deleted = await transaction.annualExamMark.delete({ where: { id } });
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

const updateAnnualExamMark = async (
  id: string,
  payload: TUpdateAnnualExamMark,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.annualExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Annual exam mark not found.", StatusCodes.NOT_FOUND);
    }
    await ensureRelationsAndUnique(
      transaction,
      payload.student_result_id,
      payload.book_list_id,
      id,
    );
    const updated = await transaction.annualExamMark.update({
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

const updateAnnualExamMarkField = async (
  id: string,
  payload: TUpdateAnnualExamMarkField,
  loggedInUser: TLoggedInUser,
) =>
  prisma.$transaction(async (transaction) => {
    const existing = await transaction.annualExamMark.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Annual exam mark not found.", StatusCodes.NOT_FOUND);
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
    const bookListId =
      payload.field === "book_list_id" ? payload.value : existing.book_list_id;
    await ensureRelationsAndUnique(transaction, studentResultId, bookListId, id);

    let data: Prisma.AnnualExamMarkUncheckedUpdateInput;
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
      case "book_list_id":
        data = { book_list_id: payload.value };
        break;
    }
    const updated = await transaction.annualExamMark.update({
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

const getAllAnnualExamMarks = () =>
  prisma.annualExamMark.findMany({
    include: { student_result: true, book_list: true },
    orderBy: { created_at: "desc" },
  });

const getAnnualExamMarkById = async (id: string) => {
  const mark = await prisma.annualExamMark.findUnique({
    where: { id },
    include: { student_result: true, book_list: true },
  });
  if (!mark) {
    throw new AppError("Annual exam mark not found.", StatusCodes.NOT_FOUND);
  }
  return mark;
};

export const annualExamMarkServices = {
  createAnnualExamMark,
  deleteAnnualExamMark,
  updateAnnualExamMark,
  updateAnnualExamMarkField,
  getAllAnnualExamMarks,
  getAnnualExamMarkById,
};
