// ========================================================
// GET PROMOTION REQUESTS LIST SERVICE LAYER

import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TGetPromotionRequestsZodSchema } from "./promotionRequest.zodValidation";

// ========================================================
const getPromotionRequests = async (query: TGetPromotionRequestsZodSchema) => {
  const { page, limit, status, full_name, mobile_number } = query;
  const skip = (page - 1) * limit;

  // Initialise base filter map
  const whereConditions: Prisma.PromotionRequestWhereInput = {};

  // Attach status filter if passed
  if (status) {
    whereConditions.promotion_request_status = status;
  }

  // 🌟 Dynamic Conditional Object Builder for the Root User relation
  const userConditions: Prisma.UserWhereInput = {};

  if (full_name) {
    userConditions.full_name = { contains: full_name, mode: "insensitive" };
  }

  if (mobile_number) {
    userConditions.mobile_number = { contains: mobile_number };
  }

  // If either name or mobile filters were passed, tie them to the request where condition
  if (full_name || mobile_number) {
    whereConditions.user = userConditions;
  }

  // Execute transaction to pull count and records together
  const [totalRecords, requests] = await prisma.$transaction([
    prisma.promotionRequest.count({ where: whereConditions }),
    prisma.promotionRequest.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            full_name: true,
            mobile_number: true,
            photo_url: true,
            email: true,
          },
        },
        old_role: { select: { role_name: true } },
        new_role: { select: { role_name: true } },
        old_position: { select: { position_name: true } },
        new_position: { select: { position_name: true } },
        created_by: { select: { full_name: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);

  return {
    meta: {
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
    },
    data: requests,
  };
};

// ========================================================
// GET SINGLE PROMOTION REQUEST BY ID SERVICE
// ========================================================
const getPromotionRequestById = async (promotion_request_id: string) => {
  const request = await prisma.promotionRequest.findUnique({
    where: { id: promotion_request_id },
    include: {
      user: {
        select: {
          id: true,
          full_name: true,
          mobile_number: true,
          email: true,
          photo_url: true,
          gender: true,
          blood_group: true,
        },
      },
      old_role: { select: { id: true, role_name: true } },
      new_role: { select: { id: true, role_name: true } },
      old_position: { select: { id: true, position_name: true } },
      new_position: { select: { id: true, position_name: true } },
      created_by: { select: { id: true, full_name: true } },
      updated_by: { select: { id: true, full_name: true } }, // Shows who resolved it (if approved/rejected)
    },
  });

  if (!request) {
    throw new AppError(
      "The requested promotion request was not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  return request;
};

export const promotionRequestGetServices = {
  getPromotionRequests, // Your existing list service
  getPromotionRequestById, // Added single lookup handler
};
