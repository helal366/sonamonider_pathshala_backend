import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateStudentFeePaymentZodSchema,
  TCreateStudentFeeRateZodSchema,
  TDeleteStudentFeePaymentZodSchema,
  TDeleteStudentFeeRateZodSchema,
  TUpdateStudentFeePaymentFieldZodSchema,
  TUpdateStudentFeeRateFieldZodSchema,
} from "./studentFee.zodValidation.js";

const toAuditValue = (value: unknown): string | number | boolean | null => {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
};

// ======================================================
// CREATE STUDENT FEE RATE SERVICE LAYER
// ======================================================
const createStudentFeeRate = async (
  payload: TCreateStudentFeeRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: payload.student_id },
      select: { id: true },
    });
    if (!student) {
      throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
    }

    const created = await tx.studentFeeRate.create({
      data: {
        ...payload,
        created_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "studentFeeRate",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          id: created.id,
          student_id: created.student_id,
          fee_type: created.fee_type,
          billing_frequency: created.billing_frequency,
          amount: created.amount.toString(),
          effective_from: created.effective_from.toISOString(),
          effective_to: created.effective_to?.toISOString() ?? null,
        },
      },
    });

    return created;
  });
};

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD SERVICE LAYER
// ======================================================
const updateStudentFeeRateField = async (
  payload: TUpdateStudentFeeRateFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id, field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeRate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Student fee rate not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.studentFeeRate.update({
      where: { id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StudentFeeRateUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "studentFeeRate",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { [field]: toAuditValue(existing[field]) },
        new_value: { [field]: toAuditValue(value) },
      },
    });

    return updated;
  });
};

// ======================================================
// DELETE STUDENT FEE RATE SERVICE LAYER
// ======================================================
const deleteStudentFeeRate = async (
  payload: TDeleteStudentFeeRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeRate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Student fee rate not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.studentFeeRate.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "studentFeeRate",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          id: existing.id,
          student_id: existing.student_id,
          fee_type: existing.fee_type,
          billing_frequency: existing.billing_frequency,
          amount: existing.amount.toString(),
          effective_from: existing.effective_from.toISOString(),
          effective_to: existing.effective_to?.toISOString() ?? null,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

// ======================================================
// CREATE STUDENT FEE PAYMENT SERVICE LAYER
// ======================================================
const createStudentFeePayment = async (
  payload: TCreateStudentFeePaymentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (tx) => {
    const [student, academicYear] = await Promise.all([
      tx.student.findUnique({
        where: { id: payload.student_id },
        select: { id: true },
      }),
      tx.academicYear.findUnique({
        where: { id: payload.academic_year_id },
        select: { id: true },
      }),
    ]);

    if (!student) {
      throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
    }
    if (!academicYear) {
      throw new AppError("Academic year not found.", StatusCodes.NOT_FOUND);
    }

    const created = await tx.studentFeePayment.create({
      data: {
        ...payload,
        created_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "studentFeePayment",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          id: created.id,
          student_id: created.student_id,
          academic_year_id: created.academic_year_id,
          fee_type: created.fee_type,
          billing_frequency: created.billing_frequency,
          billing_period_key: created.billing_period_key,
          amount: created.amount.toString(),
          paid_at: created.paid_at.toISOString(),
          receipt_number: created.receipt_number,
        },
      },
    });

    return created;
  });
};

// ======================================================
// UPDATE A SINGLE STUDENT FEE PAYMENT FIELD SERVICE LAYER
// ======================================================
const updateStudentFeePaymentField = async (
  payload: TUpdateStudentFeePaymentFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id, field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeePayment.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Student fee payment not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.studentFeePayment.update({
      where: { id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StudentFeePaymentUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "studentFeePayment",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { [field]: toAuditValue(existing[field]) },
        new_value: { [field]: toAuditValue(value) },
      },
    });

    return updated;
  });
};

// ======================================================
// DELETE STUDENT FEE PAYMENT SERVICE LAYER
// ======================================================
const deleteStudentFeePayment = async (
  payload: TDeleteStudentFeePaymentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeePayment.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Student fee payment not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.studentFeePayment.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "studentFeePayment",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          id: existing.id,
          student_id: existing.student_id,
          academic_year_id: existing.academic_year_id,
          fee_type: existing.fee_type,
          billing_frequency: existing.billing_frequency,
          billing_period_key: existing.billing_period_key,
          amount: existing.amount.toString(),
          paid_at: existing.paid_at.toISOString(),
          receipt_number: existing.receipt_number,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

export const studentFeeServices = {
  createStudentFeeRate,
  updateStudentFeeRateField,
  deleteStudentFeeRate,
  createStudentFeePayment,
  updateStudentFeePaymentField,
  deleteStudentFeePayment,
};
