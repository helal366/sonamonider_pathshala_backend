import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateAssignedStudentFeeRateZodSchema,
  TUpdateAssignedStudentFeeRateFieldZodSchema,
} from "./assignedStudentFeeRate.zodValidation.js";

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

const findClassOrThrow = async (
  classId: string,
  tx: Prisma.TransactionClient,
) => {
  const foundClass = await tx.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });

  if (!foundClass) {
    throw new AppError("Class not found.", StatusCodes.NOT_FOUND);
  }
};

const createAssignedStudentFeeRate = async (
  payload: TCreateAssignedStudentFeeRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    await findClassOrThrow(payload.class_id, tx);

    const created = await tx.assignedStudentFeeRate.create({
      data: {
        ...payload,
        created_by_id: loggedInUser.user_id,
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "assignedStudentFeeRate",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          id: created.id,
          fee_type: created.fee_type,
          billing_frequency: created.billing_frequency,
          amount: created.amount.toString(),
          class_id: created.class_id,
          section: created.section,
          version: created.version,
        },
      },
    });

    return created;
  });
};

const updateAssignedStudentFeeRateField = async (
  id: string,
  payload: TUpdateAssignedStudentFeeRateFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.assignedStudentFeeRate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError(
        "Assigned student fee rate not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const { field, value } = payload;
    if (field === "class_id") {
      await findClassOrThrow(value, tx);
    }

    const data: Prisma.AssignedStudentFeeRateUpdateInput = {
      updated_by: { connect: { id: loggedInUser.user_id } },
    };
    switch (field) {
      case "fee_type":
        data.fee_type = value;
        break;
      case "billing_frequency":
        data.billing_frequency = value;
        break;
      case "amount":
        data.amount = value;
        break;
      case "class_id":
        data.class = { connect: { id: value } };
        break;
      case "section":
        data.section = value;
        break;
      case "version":
        data.version = value;
        break;
    }

    const updated = await tx.assignedStudentFeeRate.update({
      where: { id },
      data,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "assignedStudentFeeRate",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { [field]: String(existing[field]) },
        new_value: { [field]: String(value) },
      },
    });

    return updated;
  });
};

const deleteAssignedStudentFeeRate = async (
  id: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.assignedStudentFeeRate.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError(
        "Assigned student fee rate not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const deleted = await tx.assignedStudentFeeRate.delete({ where: { id } });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "assignedStudentFeeRate",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          id: existing.id,
          fee_type: existing.fee_type,
          billing_frequency: existing.billing_frequency,
          amount: existing.amount.toString(),
          class_id: existing.class_id,
          section: existing.section,
          version: existing.version,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

const getAllAssignedStudentFeeRates = async (
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.assignedStudentFeeRate.findMany({
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  });
};

const getAssignedStudentFeeRatesByClassId = async (
  classId: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);
  const foundClass = await prisma.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });
  if (!foundClass) {
    throw new AppError("Class not found.", StatusCodes.NOT_FOUND);
  }

  return prisma.assignedStudentFeeRate.findMany({
    where: { class_id: classId },
    orderBy: [
      { section: "asc" },
      { version: "asc" },
      { fee_type: "asc" },
      { billing_frequency: "asc" },
    ],
  });
};

export const assignedStudentFeeRateServices = {
  createAssignedStudentFeeRate,
  updateAssignedStudentFeeRateField,
  deleteAssignedStudentFeeRate,
  getAllAssignedStudentFeeRates,
  getAssignedStudentFeeRatesByClassId,
};
