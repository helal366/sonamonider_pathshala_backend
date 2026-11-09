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
import { toAuditJson } from "../../helperFunctions/helpers/helperFunctions.js";

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
    const classHistory = await tx.classHistory.findUnique({
      where: { id: payload.class_history_id },
      select: { id: true },
    });
    if (!classHistory) {
      throw new AppError("Class history not found.", StatusCodes.NOT_FOUND);
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
        new_value: JSON.parse(JSON.stringify(created)) as Prisma.InputJsonValue
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
          class_history_id: existing.class_history_id,
          fee_type: existing.fee_type,
          billing_frequency: existing.billing_frequency,
          amount: existing.amount.toString(),
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
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  });
};

// ======================================================
// GET STUDENT FEE RATE BY STUDENT ID SERVICE LAYER
// ======================================================
const getStudentFeeRateByStudentId = async (
  loggedInUser: TLoggedInUser,
  student_id: string,
  academic_year_name: string
) => {
  assertManagementAccountant(loggedInUser);

  const student = await prisma.student.findUnique({
    where: { id: student_id },
    select: {
      id: true,
      class_history: {
        where: {
          academic_year: {
            academic_year_name
          },
        },
        include: {
          student_class_fee_rates: true
        }
      },
      
    },
  });
  if (!student) {
    throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
  }

  if (student.class_history.length === 0) {
    throw new AppError(
      "Student class history not found for this academic year.",
      StatusCodes.NOT_FOUND,
    );
  }

  return student.class_history.flatMap(
    (history) => history.student_class_fee_rates,
  );
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
  academic_year_name: string
) => {
  assertManagementAccountant(loggedInUser);

  const student = await prisma.student.findUnique({
    where: { id: student_id },
    select: {
      class_history: {
        where: {
          academic_year :{
            academic_year_name
          }
        },
        include: {
          student_class_fee_payments: true
        }
      }
    },
  });
  if (!student) {
    throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
  }

   if (student.class_history.length === 0) {
    throw new AppError(
      "Student class history not found for this academic year.",
      StatusCodes.NOT_FOUND,
    );
  }
  return student.class_history.flatMap((history)=>history.student_class_fee_payments);
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
    const academicYear =await tx.academicYear.findUnique({
        where: { id: payload.academic_year_id },
        select: { id: true, academic_year_name: true },
      });

    if (!academicYear) {
      throw new AppError("Academic year not found.", StatusCodes.NOT_FOUND);
    }
    
    const classHistory = await tx.classHistory.findFirst({
      where: {
        student_id: payload.student_id,
        academic_year_id: payload.academic_year_id
      },
      select: {id: true}
    });
    if (!classHistory) {
      throw new AppError(
        "No class history found for this academic year.",
        StatusCodes.NOT_FOUND,
      );
    }
    const class_history_id = classHistory.id
    const created = await tx.studentFeePayment.create({
      data: {
        ...payload,
        class_history_id,
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
        new_value: toAuditJson(created)
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
  student_fee_payment_id: string,
) => {
  assertManagementAccountant(loggedInUser);
  const { field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeePayment.findUnique({ where: { id:student_fee_payment_id } });
    if (!existing) {
      throw new AppError("Student fee payment not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.studentFeePayment.update({
      where: { id: student_fee_payment_id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StudentFeePaymentUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_payment_id,
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
  student_fee_payment_id: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeePayment.findUnique({ where: { id: student_fee_payment_id } });
    if (!existing) {
      throw new AppError("Student fee payment not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.studentFeePayment.delete({ where: { id: student_fee_payment_id } });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_payment_id,
        entity_name: "studentFeePayment",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: toAuditJson(existing),
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
