import { Department, Prisma, Section, Version } from "#db-client";
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

type TStandardStudentFeeRateForAssessmentSync =
  Prisma.StandardStudentFeeRateGetPayload<{
    include: { assigned_classes: { select: { class_id: true } } };
  }>;

const syncActiveStudentFeeAssessments = async (
  tx: Prisma.TransactionClient,
  rate: TStandardStudentFeeRateForAssessmentSync,
  changedById: string,
  previousRate?: TStandardStudentFeeRateForAssessmentSync,
) => {
  const activeAcademicYear = new Date().getFullYear().toString();
  const classIds = rate.assigned_classes.map(({ class_id }) => class_id);
  const classHistories = await tx.classHistory.findMany({
    where: {
      class_id: { in: classIds },
      section: rate.section,
      version: rate.version,
      department: rate.department,
      academic_year: { academic_year_name: activeAcademicYear },
    },
    select: {
      id: true,
      student_fee_assessments: {
        select: {
          id: true,
          fee_type: true,
          billing_frequency: true,
          amount: true,
          discount_amount: true,
          amount_to_pay: true,
        },
      },
    },
  });

  const auditRecords: Prisma.AuditLogCreateManyInput[] = [];
  const amount = new Prisma.Decimal(rate.amount);

  for (const classHistory of classHistories) {
    const targetAssessment = classHistory.student_fee_assessments.find(
      (assessment) =>
        assessment.fee_type === rate.fee_type &&
        assessment.billing_frequency === rate.billing_frequency,
    );
    const previousAssessment = previousRate
      ? classHistory.student_fee_assessments.find(
          (assessment) =>
            assessment.fee_type === previousRate.fee_type &&
            assessment.billing_frequency === previousRate.billing_frequency,
        )
      : undefined;

    if (
      targetAssessment &&
      previousAssessment &&
      targetAssessment.id !== previousAssessment.id
    ) {
      throw new AppError(
        "Cannot update the fee type or billing frequency because an assessment with the new fee already exists for an active student.",
        StatusCodes.CONFLICT,
      );
    }

    const existingAssessment = targetAssessment ?? previousAssessment;
    if (existingAssessment) {
      if (existingAssessment.discount_amount.greaterThan(amount)) {
        throw new AppError(
          "Cannot update the standard fee amount because it is less than an active student's discount.",
          StatusCodes.BAD_REQUEST,
        );
      }

      const amountToPay = amount.minus(existingAssessment.discount_amount);
      const assessmentChanged =
        existingAssessment.fee_type !== rate.fee_type ||
        existingAssessment.billing_frequency !== rate.billing_frequency ||
        !existingAssessment.amount.equals(amount) ||
        !existingAssessment.amount_to_pay.equals(amountToPay);

      if (!assessmentChanged) {
        continue;
      }

      const updatedAssessment = await tx.studentFeeAssessment.update({
        where: { id: existingAssessment.id },
        data: {
          fee_type: rate.fee_type,
          billing_frequency: rate.billing_frequency,
          amount,
          amount_to_pay: amountToPay,
          updated_by: { connect: { id: changedById } },
        },
      });

      auditRecords.push({
        entity_id: updatedAssessment.id,
        entity_name: "studentFeeAssessment",
        action: "UPDATE",
        changed_by_id: changedById,
        old_value: {
          class_history_id: classHistory.id,
          fee_type: existingAssessment.fee_type,
          billing_frequency: existingAssessment.billing_frequency,
          amount: existingAssessment.amount.toString(),
          discount_amount: existingAssessment.discount_amount.toString(),
          amount_to_pay: existingAssessment.amount_to_pay.toString(),
        },
        new_value: {
          class_history_id: classHistory.id,
          fee_type: updatedAssessment.fee_type,
          billing_frequency: updatedAssessment.billing_frequency,
          amount: updatedAssessment.amount.toString(),
          discount_amount: updatedAssessment.discount_amount.toString(),
          amount_to_pay: updatedAssessment.amount_to_pay.toString(),
        },
      });
      continue;
    }

    const createdAssessment = await tx.studentFeeAssessment.create({
      data: {
        class_history_id: classHistory.id,
        fee_type: rate.fee_type,
        billing_frequency: rate.billing_frequency,
        amount,
        discount_amount: 0,
        amount_to_pay: amount,
        created_by_id: changedById,
      },
    });

    auditRecords.push({
      entity_id: createdAssessment.id,
      entity_name: "studentFeeAssessment",
      action: "CREATE",
      changed_by_id: changedById,
      old_value: Prisma.JsonNull,
      new_value: {
        class_history_id: classHistory.id,
        fee_type: createdAssessment.fee_type,
        billing_frequency: createdAssessment.billing_frequency,
        amount: createdAssessment.amount.toString(),
        discount_amount: createdAssessment.discount_amount.toString(),
        amount_to_pay: createdAssessment.amount_to_pay.toString(),
      },
    });
  }

  if (auditRecords.length > 0) {
    await tx.auditLog.createMany({ data: auditRecords });
  }
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

    await syncActiveStudentFeeAssessments(tx, created, loggedInUser.user_id);

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
  }, {
    timeout: 25000,
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

    if (field !== "ic_duration_hrs" && field !== "qc_duration_hrs") {
      await syncActiveStudentFeeAssessments(
        tx,
        updated,
        loggedInUser.user_id,
        existing,
      );
    }

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
  }, {
    timeout: 25000,
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
select: {
  id: true,
  fee_type: true,
  billing_frequency: true, 
  amount: true,
  ic_registration_fee : true,
  ic_duration_hrs: true,
  qc_duration_hrs : true,
  assigned_classes: {
  select: {
    class: {
      select: {
        id: true,
        class_name: true
      }
    }
  }
  },
  section: true,
  version: true,
  department: true

}
  });
};

const getStandardStudentFeeRatesByClassIdSectionVersionDepartment = async (
  classId: string,
  section:Section,
  version:Version,
  department: Department,
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
    where: { assigned_classes: { some: { class_id: classId } }, section, version, department},
    orderBy: [
      { section: "asc" },
      { version: "asc" },
      { fee_type: "asc" },
      { billing_frequency: "asc" },
    ],
select: {
  id: true,
  fee_type: true,
  billing_frequency: true, 
  amount: true,
  ic_registration_fee : true,
  ic_duration_hrs: true,
  qc_duration_hrs : true,
  assigned_classes: {
  select: {
    class: {
      select: {
        id: true,
        class_name: true
      }
    }
  }
  },
  section: true,
  version: true,
  department: true

}
  });
};

export const standardStudentFeeRateServices = {
  createStandardStudentFeeRate,
  updateStandardStudentFeeRateField,
  deleteStandardStudentFeeRate,
  getAllStandardStudentFeeRates,
  getStandardStudentFeeRatesByClassId,
  getStandardStudentFeeRatesByClassIdSectionVersionDepartment
};
