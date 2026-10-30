import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateStudentFeePaymentZodSchema,
  TCreateStudentFeeRateZodSchema,
  TUpdateStudentFeePaymentFieldZodSchema,
  TUpdateStudentFeeRateFieldZodSchema,
} from "./studentFee.zodValidation.js";

const assertManagementAccountant = (loggedInUser: TLoggedInUser) => {
  if (
    loggedInUser.role_name === "MANAGEMENT" &&
    loggedInUser.position_name !== "ACCOUNTANT"
  ) {
    throw new AppError(
      "Only management users with the ACCOUNTANT position can manage student fees.",
      StatusCodes.FORBIDDEN,
    );
  }
};

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
  assertManagementAccountant(loggedInUser);
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
  student_fee_rate_id: string,
) => {
  assertManagementAccountant(loggedInUser);
  const { field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeRate.findUnique({ where: { id: student_fee_rate_id } });
    if (!existing) {
      throw new AppError("Student fee rate not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.studentFeeRate.update({
      where: { id: student_fee_rate_id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StudentFeeRateUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_rate_id,
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
  student_fee_rate_id: string,  //student_fee_rate_id
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeRate.findUnique({ where: { id : student_fee_rate_id} });
    if (!existing) {
      throw new AppError("Student fee rate not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.studentFeeRate.delete({ where: { id : student_fee_rate_id} });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_rate_id,
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
// GET ALL STUDENT FEE RATE SERVICE LAYER
// ======================================================
const getAllStudentFeeRates= async(
   loggedInUser: TLoggedInUser,
)=>{
  assertManagementAccountant(loggedInUser);
  return prisma.studentFeeRate.findMany({
    orderBy: [{ effective_from: "desc" }, { id: "asc" }],
  });
};

// ======================================================
// GET STUDENT FEE RATE BY STUDENT ID SERVICE LAYER
// ======================================================
const getStudentFeeRateByStudentId = async (
  loggedInUser: TLoggedInUser,
  student_id: string,
) => {
  assertManagementAccountant(loggedInUser);

  const student = await prisma.student.findUnique({
    where: { id: student_id },
    select: {
      fee_rates: {
        orderBy: [{ effective_from: "desc" }, { id: "asc" }],
      },
    },
  });
  if (!student) {
    throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
  }

  return student.fee_rates;
};

// ======================================================
// GET ALL STUDENT FEE PAYMENT SERVICE LAYER
// ======================================================
const getAllStudentFeePayments = async (loggedInUser: TLoggedInUser) => {
  assertManagementAccountant(loggedInUser);
  return prisma.studentFeePayment.findMany({
    orderBy: [{ paid_at: "desc" }, { id: "asc" }],
  });
};

// ======================================================
// GET STUDENT FEE PAYMENTS BY STUDENT ID SERVICE LAYER
// ======================================================
const getStudentFeePaymentsByStudentId = async (
  loggedInUser: TLoggedInUser,
  student_id: string,
) => {
  assertManagementAccountant(loggedInUser);

  const student = await prisma.student.findUnique({
    where: { id: student_id },
    select: {
      fee_payments: {
        orderBy: [{ paid_at: "desc" }, { id: "asc" }],
      },
    },
  });
  if (!student) {
    throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
  }

  return student.fee_payments;
};

// ======================================================
// CREATE STUDENT FEE PAYMENT SERVICE LAYER
// ======================================================
const createStudentFeePayment = async (
  payload: TCreateStudentFeePaymentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);
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
  id: string,
) => {
  assertManagementAccountant(loggedInUser);
  const { field, value } = payload;

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
  id: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

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
  getAllStudentFeeRates,
  getStudentFeeRateByStudentId,
  getAllStudentFeePayments,
  getStudentFeePaymentsByStudentId,
  createStudentFeePayment,
  updateStudentFeePaymentField,
  deleteStudentFeePayment,
};
