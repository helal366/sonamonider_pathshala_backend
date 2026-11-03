import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateStandardStudentFeeRateZodSchema,
  TUpdateStandardStudentFeeRateFieldZodSchema,
} from "./standardStudentFeeRate.zodValidation.js";

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
  classIds: string[],
  tx: Prisma.TransactionClient,
) => {
  const foundClassCount = await tx.class.count({
    where: { id: { in: classIds } },
  });

  if (foundClassCount !== classIds.length) {
    throw new AppError(
      "One or more selected classes were not found.",
      StatusCodes.NOT_FOUND,
    );
  }
};

const standardStudentFeeRateInclude = {
  assigned_classes: {
    include: {
      class: {
        select: { id: true, class_name: true },
      },
    },
  },
} satisfies Prisma.StandardStudentFeeRateInclude;

const auditValue = (
  value: string | number | Prisma.Decimal | null | string[],
): Prisma.InputJsonValue | null => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value instanceof Prisma.Decimal) {
    return value.toString();
  }
  return value;
};

const createStandardStudentFeeRate = async (
  payload: TCreateStandardStudentFeeRateZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const { class_ids, ...feeRateData } = payload;
    await findClassOrThrow(class_ids, tx);

    const created = await tx.standardStudentFeeRate.create({
      data: {
        ...feeRateData,
        assigned_classes: {
          create: class_ids.map((class_id) => ({
            class: { connect: { id: class_id } },
          })),
        },
        created_by_id: loggedInUser.user_id,
      },
      include: standardStudentFeeRateInclude,
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "standardStudentFeeRate",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: {
          id: created.id,
          fee_type: created.fee_type,
          billing_frequency: created.billing_frequency,
          amount: created.amount.toString(),
          ic_duration_hrs: created.ic_duration_hrs?.toString() ?? null,
          qc_duration_hrs: created.qc_duration_hrs?.toString() ?? null,
          department: created.department,
          class_ids: class_ids,
          section: created.section,
          version: created.version,
        },
      },
    });

    return created;
  });
};

const updateStandardStudentFeeRateField = async (
  id: string,
  payload: TUpdateStandardStudentFeeRateFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.standardStudentFeeRate.findUnique({
      where: { id },
      include: {
        assigned_classes: { select: { class_id: true } },
      },
    });
    if (!existing) {
      throw new AppError(
        "Standard student fee rate not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const { field, value } = payload;
    if (field === "class_ids") {
      await findClassOrThrow(value, tx);
      await tx.classStandardStudentFeeRate.deleteMany({
        where: { standard_student_fee_rate_id: id },
      });
      await tx.classStandardStudentFeeRate.createMany({
        data: value.map((class_id) => ({
          class_id,
          standard_student_fee_rate_id: id,
        })),
      });
    }

    const data: Prisma.StandardStudentFeeRateUpdateInput = {
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
      case "ic_duration_hrs":
        data.ic_duration_hrs = value;
        break;
      case "qc_duration_hrs":
        data.qc_duration_hrs = value;
        break;
      case "department":
        data.department = value;
        break;
      case "section":
        data.section = value;
        break;
      case "version":
        data.version = value;
        break;
    }

    const updated = await tx.standardStudentFeeRate.update({
      where: { id },
      data,
      include: standardStudentFeeRateInclude,
    });

    const oldFieldValue =
      field === "class_ids"
        ? existing.assigned_classes.map(({ class_id }) => class_id)
        : existing[field];
    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "standardStudentFeeRate",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { [field]: auditValue(oldFieldValue) },
        new_value: { [field]: auditValue(value) },
      },
    });

    return updated;
  });
};

const deleteStandardStudentFeeRate = async (
  id: string,
  loggedInUser: TLoggedInUser,
) => {
  assertManagementAccountant(loggedInUser);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.standardStudentFeeRate.findUnique({
      where: { id },
      include: {
        assigned_classes: { select: { class_id: true } },
      },
    });
    if (!existing) {
      throw new AppError(
        "Standard student fee rate not found.",
        StatusCodes.NOT_FOUND,
      );
    }

    const deleted = await tx.standardStudentFeeRate.delete({
      where: { id },
      include: standardStudentFeeRateInclude,
    });

    await tx.auditLog.create({
      data: {
        entity_id: id,
        entity_name: "standardStudentFeeRate",
        action: "DELETE",
        changed_by_id: loggedInUser.user_id,
        old_value: {
          id: existing.id,
          fee_type: existing.fee_type,
          billing_frequency: existing.billing_frequency,
          amount: existing.amount.toString(),
          ic_duration_hrs: existing.ic_duration_hrs?.toString() ?? null,
          qc_duration_hrs: existing.qc_duration_hrs?.toString() ?? null,
          department: existing.department,
          class_ids: existing.assigned_classes.map(({ class_id }) => class_id),
          section: existing.section,
          version: existing.version,
        },
        new_value: Prisma.JsonNull,
      },
    });

    return deleted;
  });
};

const getAllStandardStudentFeeRates = async (loggedInUser: TLoggedInUser) => {
  assertManagementAccountant(loggedInUser);

  return prisma.standardStudentFeeRate.findMany({
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
    include: standardStudentFeeRateInclude,
  });
};

const getStandardStudentFeeRatesByClassId = async (
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

  return prisma.standardStudentFeeRate.findMany({
    where: { assigned_classes: { some: { class_id: classId } } },
    orderBy: [
      { section: "asc" },
      { version: "asc" },
      { fee_type: "asc" },
      { billing_frequency: "asc" },
    ],
    include: standardStudentFeeRateInclude,
  });
};

export const standardStudentFeeRateServices = {
  createStandardStudentFeeRate,
  updateStandardStudentFeeRateField,
  deleteStandardStudentFeeRate,
  getAllStandardStudentFeeRates,
  getStandardStudentFeeRatesByClassId,
};
