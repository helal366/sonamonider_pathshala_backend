import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";

const promotionHistoryInclude = {
  management_staff: {
    include: {
      user_primary_data: {
        select: { id: true, full_name: true, mobile_number: true, email: true },
      },
    },
  },
  academic_staff: {
    include: {
      user_primary_data: {
        select: { id: true, full_name: true, mobile_number: true, email: true },
      },
    },
  },
  student: {
    include: {
      user_primary_data: {
        select: { id: true, full_name: true, mobile_number: true, email: true },
      },
    },
  },
  governing_body: {
    include: {
      user_primary_data: {
        select: { id: true, full_name: true, mobile_number: true, email: true },
      },
    },
  },
  previous_position: { select: { id: true, position_name: true } },
  current_position: { select: { id: true, position_name: true } },
  created_by: { select: { id: true, full_name: true } },
  updated_by: { select: { id: true, full_name: true } },
};

const getAllPromotionHistories = async () =>
  prisma.promotionHistory.findMany({
    include: promotionHistoryInclude,
    orderBy: [{ start_date: "desc" }, { id: "asc" }],
  });

const getPromotionHistoryById = async (id: string) => {
  const history = await prisma.promotionHistory.findUnique({
    where: { id },
    include: promotionHistoryInclude,
  });

  if (!history) {
    throw new AppError("Promotion history not found.", StatusCodes.NOT_FOUND);
  }

  return history;
};

const getPromotionHistoryByEntity = async (
  entity:
    | "management_staff"
    | "academic_staff"
    | "student"
    | "governing_body",
  entityId: string,
) => {
  let profileExists: boolean;
  const where: Prisma.PromotionHistoryWhereInput = {};

  switch (entity) {
    case "management_staff":
      profileExists = Boolean(
        await prisma.managementStaff.findUnique({
          where: { id: entityId },
          select: { id: true },
        }),
      );
      where.management_staff_id = entityId;
      break;
    case "academic_staff":
      profileExists = Boolean(
        await prisma.academicStaff.findUnique({
          where: { id: entityId },
          select: { id: true },
        }),
      );
      where.academic_staff_id = entityId;
      break;
    case "student":
      profileExists = Boolean(
        await prisma.student.findUnique({
          where: { id: entityId },
          select: { id: true },
        }),
      );
      where.student_id = entityId;
      break;
    case "governing_body":
      profileExists = Boolean(
        await prisma.governingBody.findUnique({
          where: { id: entityId },
          select: { id: true },
        }),
      );
      where.governing_body_id = entityId;
      break;
  }

  if (!profileExists) {
    throw new AppError("Profile not found.", StatusCodes.NOT_FOUND);
  }

  return prisma.promotionHistory.findMany({
    where,
    include: promotionHistoryInclude,
    orderBy: [{ start_date: "desc" }, { id: "asc" }],
  });
};

export const promotionHistoryServices = {
  getAllPromotionHistories,
  getPromotionHistoryById,
  getPromotionHistoryByEntity,
};
