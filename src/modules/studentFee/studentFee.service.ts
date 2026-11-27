import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateStudentFeePaymentZodSchema,
  TCreateStudentFeeAssessmentZodSchema,
  TUpdateStudentFeePaymentFieldZodSchema,
  TUpdateStudentFeeAssessmentFieldZodSchema,
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
// CREATE STUDENT FEE ASSESSMENT SERVICE LAYER
// ======================================================
const createStudentFeeAssessment = async (
  payload: TCreateStudentFeeAssessmentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);
  return prisma.$transaction(async (transaction) => {
    const classHistory = await transaction.classHistory.findUnique({
      where: { id: payload.class_history_id },
      select: {
        id: true,
        section: true,
        version: true,
        department: true,
        class_id: true,
      },
    });
    if (!classHistory) {
      throw new AppError("Class history not found.", StatusCodes.NOT_FOUND);
    }

    const standardStudentFeeRates = await transaction.standardStudentFeeRate.findMany({
      where: {
        fee_type: payload.fee_type,
        billing_frequency: payload.billing_frequency,
        section: classHistory.section,
        version: classHistory.version,
        department: classHistory.department,
        assigned_classes: {
          some: {
            class_id: classHistory.class_id
          }
        }
      },
    });
    if (standardStudentFeeRates.length === 0) {
      throw new AppError(
        "Standard student fee rate not found for the student.",
        StatusCodes.NOT_FOUND,
      );
    };
    if (standardStudentFeeRates.length > 1) {
      throw new AppError(
        "Multiple standard student fee rates match this class history and fee type.",
        StatusCodes.CONFLICT,
      );
    };
    const standardStudentFeeRate = standardStudentFeeRates[0];
    if (!standardStudentFeeRate) {
      throw new AppError(
        "Standard student fee rate not found for the student.",
        StatusCodes.NOT_FOUND,
      );
    }
    const discountAmount = new Prisma.Decimal(payload.discount_amount);
    if (discountAmount.greaterThan(standardStudentFeeRate.amount)) {
      throw new AppError(
        "Discount amount cannot be greater than actual amount.",
        StatusCodes.BAD_REQUEST,
      );
    }
    const amountToPay = standardStudentFeeRate.amount.minus(discountAmount);
    const created = await transaction.studentFeeAssessment.create({
      data: {
        class_history_id: payload.class_history_id,
        fee_type: payload.fee_type,
        billing_frequency: payload.billing_frequency,
        amount: standardStudentFeeRate.amount,
        discount_amount: discountAmount,
        amount_to_pay: amountToPay,
        created_by_id: loggedInUser.user_id,
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "studentFeeAssessment",
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
// UPDATE A SINGLE STUDENT FEE ASSESSMENT FIELD SERVICE LAYER
// ======================================================
const updateStudentFeeAssessmentField = async (
  payload: TUpdateStudentFeeAssessmentFieldZodSchema,
  loggedInUser: TLoggedInUser,
  student_fee_assessment_id: string,
) => {
  assertManagementAccountant(loggedInUser);
  const { field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeAssessment.findUnique({
      where: { id: student_fee_assessment_id },
    });
    if (!existing) {
      throw new AppError(
        "Student fee assessment not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const data: Prisma.StudentFeeAssessmentUpdateInput = {
      updated_by: { connect: { id: loggedInUser.user_id } },
    };
    const oldValue: Record<string, string | number> = {
      [field]: toAuditValue(existing[field]) as string | number,
    };
    const newValue: Record<string, string | number> = {
      [field]: value,
    };

    switch (field) {
      case "fee_type":
        data.fee_type = value;
        break;
      case "billing_frequency":
        data.billing_frequency = value;
        break;
      case "amount": {
        const amount = new Prisma.Decimal(value);
        if (existing.discount_amount.greaterThan(amount)) {
          throw new AppError(
            "Amount cannot be less than the existing discount.",
            StatusCodes.BAD_REQUEST,
          );
        }
        data.amount = amount;
        data.amount_to_pay = amount.minus(existing.discount_amount);
        oldValue.amount_to_pay = existing.amount_to_pay.toString();
        newValue.amount_to_pay = data.amount_to_pay.toString();
        break;
      }
      case "discount_amount": {
        const discountAmount = new Prisma.Decimal(value);
        if (discountAmount.greaterThan(existing.amount)) {
          throw new AppError(
            "Discount amount cannot be greater than the fee amount.",
            StatusCodes.BAD_REQUEST,
          );
        }
        data.discount_amount = discountAmount;
        data.amount_to_pay = existing.amount.minus(discountAmount);
        oldValue.amount_to_pay = existing.amount_to_pay.toString();
        newValue.amount_to_pay = data.amount_to_pay.toString();
        break;
      }
    }

    const updated = await tx.studentFeeAssessment.update({
      where: { id: student_fee_assessment_id },
      data,
    });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_assessment_id,
        entity_name: "studentFeeAssessment",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: oldValue,
        new_value: newValue,
      },
    });

    return updated;
  });
};

// ======================================================
// DELETE STUDENT FEE ASSESSMENT SERVICE LAYER
// ======================================================
const deleteStudentFeeAssessment = async (
  student_fee_assessment_id: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.studentFeeAssessment.findUnique({
      where: { id: student_fee_assessment_id },
    });
    if (!existing) {
      throw new AppError(
        "Student fee assessment not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const deleted = await tx.studentFeeAssessment.delete({
      where: { id: student_fee_assessment_id },
    });

    await tx.auditLog.create({
      data: {
        entity_id: student_fee_assessment_id,
        entity_name: "studentFeeAssessment",
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
// GET ALL STUDENT FEE ASSESSMENT SERVICE LAYER
// ======================================================
const getAllStudentFeeAssessments= async(
   loggedInUser: TLoggedInUser,
)=>{
  assertManagementAccountant(loggedInUser);
  return prisma.studentFeeAssessment.findMany({
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  });
};

// ======================================================
// GET STUDENT FEE ASSESSMENT BY STUDENT ID SERVICE LAYER
// ======================================================
const getStudentFeeAssessmentByStudentId = async (
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
          student_fee_assessments: true
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
    (history) => history.student_fee_assessments,
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
          student_fee_payments: true
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
  return student.class_history.flatMap((history)=>history.student_fee_payments);
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
  createStudentFeeAssessment,
  updateStudentFeeAssessmentField,
  deleteStudentFeeAssessment,
  getAllStudentFeeAssessments,
  getStudentFeeAssessmentByStudentId,
  getAllStudentFeePayments,
  getStudentFeePaymentsByStudentId,
  createStudentFeePayment,
  updateStudentFeePaymentField,
  deleteStudentFeePayment,
};
