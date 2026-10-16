import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateStaffPaymentZodSchema,
  TCreateStaffSalaryRateZodSchema,
  TDeleteStaffPaymentZodSchema,
  TDeleteStaffSalaryRateZodSchema,
  TUpdateStaffPaymentFieldZodSchema,
  TUpdateStaffSalaryRateFieldZodSchema,
} from "./staffPayment.zodValidation.js";

const toAuditValue = (
  value: unknown,
): string | number | boolean | null => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
};

const getStaffRateAuditValue = (
  record: {
    id: string;
    academic_staff_id: string | null;
    management_staff_id: string | null;
    monthly_salary: Prisma.Decimal;
    eid_bonus: Prisma.Decimal;
    change_type: string;
    effective_from: Date;
    note: string | null;
  },
): Prisma.InputJsonObject => ({
  id: record.id,
  academic_staff_id: record.academic_staff_id,
  management_staff_id: record.management_staff_id,
  monthly_salary: record.monthly_salary.toString(),
  eid_bonus: record.eid_bonus.toString(),
  change_type: record.change_type,
  effective_from: record.effective_from.toISOString(),
  note: record.note,
});

const getStaffPaymentAuditValue = (
  record: {
    id: string;
    academic_staff_id: string | null;
    management_staff_id: string | null;
    payment_type: string;
    payment_period_key: string;
    amount: Prisma.Decimal;
    paid_at: Date;
    receipt_number: string | null;
  },
): Prisma.InputJsonObject => ({
  id: record.id,
  academic_staff_id: record.academic_staff_id,
  management_staff_id: record.management_staff_id,
  payment_type: record.payment_type,
  payment_period_key: record.payment_period_key,
  amount: record.amount.toString(),
  paid_at: record.paid_at.toISOString(),
  receipt_number: record.receipt_number,
});

// ======================================================
// CREATE STAFF SALARY RATE SERVICE LAYER
// ======================================================
const createStaffSalaryRate = async (
  payload: TCreateStaffSalaryRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (tx) => {
    if (payload.academic_staff_id) {
      const academicStaff = await tx.academicStaff.findUnique({
        where: { id: payload.academic_staff_id },
        select: { id: true },
      });
      if (!academicStaff) {
        throw new AppError("Academic staff not found.", StatusCodes.NOT_FOUND);
      }
    }

    if (payload.management_staff_id) {
      const managementStaff = await tx.managementStaff.findUnique({
        where: { id: payload.management_staff_id },
        select: { id: true },
      });
      if (!managementStaff) {
        throw new AppError(
          "Management staff not found.",
          StatusCodes.NOT_FOUND,
        );
      }
    }

    const created = await tx.staffSalaryRate.create({
      data: {
        ...payload,
        created_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "staffSalaryRate",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: getStaffRateAuditValue(created),
      },
    });

    return created;
  });
};

// ======================================================
// UPDATE A SINGLE STAFF SALARY RATE FIELD SERVICE LAYER
// ======================================================
const updateStaffSalaryRateField = async (
  payload: TUpdateStaffSalaryRateFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id, field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.staffSalaryRate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Staff salary rate not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.staffSalaryRate.update({
      where: { id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StaffSalaryRateUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "staffSalaryRate",
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
// DELETE STAFF SALARY RATE SERVICE LAYER
// ======================================================
const deleteStaffSalaryRate = async (
  payload: TDeleteStaffSalaryRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.staffSalaryRate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Staff salary rate not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.staffSalaryRate.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "staffSalaryRate",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: getStaffRateAuditValue(existing),
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

// ======================================================
// CREATE STAFF PAYMENT SERVICE LAYER
// ======================================================
const createStaffPayment = async (
  payload: TCreateStaffPaymentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (tx) => {
    if (payload.academic_staff_id) {
      const academicStaff = await tx.academicStaff.findUnique({
        where: { id: payload.academic_staff_id },
        select: { id: true },
      });
      if (!academicStaff) {
        throw new AppError("Academic staff not found.", StatusCodes.NOT_FOUND);
      }
    }

    if (payload.management_staff_id) {
      const managementStaff = await tx.managementStaff.findUnique({
        where: { id: payload.management_staff_id },
        select: { id: true },
      });
      if (!managementStaff) {
        throw new AppError(
          "Management staff not found.",
          StatusCodes.NOT_FOUND,
        );
      }
    }

    const created = await tx.staffPayment.create({
      data: {
        ...payload,
        created_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "staffPayment",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: getStaffPaymentAuditValue(created),
      },
    });

    return created;
  });
};

// ======================================================
// UPDATE A SINGLE STAFF PAYMENT FIELD SERVICE LAYER
// ======================================================
const updateStaffPaymentField = async (
  payload: TUpdateStaffPaymentFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id, field, value } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.staffPayment.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Staff payment not found.", StatusCodes.NOT_FOUND);
    }

    const updated = await tx.staffPayment.update({
      where: { id },
      data: {
        [field]: value,
        updated_by_id: loggedInUser.user_id,
      } as Prisma.StaffPaymentUpdateInput,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "staffPayment",
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
// DELETE STAFF PAYMENT SERVICE LAYER
// ======================================================
const deleteStaffPayment = async (
  payload: TDeleteStaffPaymentZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { id } = payload;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.staffPayment.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Staff payment not found.", StatusCodes.NOT_FOUND);
    }

    const deleted = await tx.staffPayment.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "staffPayment",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: getStaffPaymentAuditValue(existing),
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

export const staffPaymentServices = {
  createStaffSalaryRate,
  updateStaffSalaryRateField,
  deleteStaffSalaryRate,
  createStaffPayment,
  updateStaffPaymentField,
  deleteStaffPayment,
};
