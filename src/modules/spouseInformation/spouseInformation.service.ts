import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateSpouseInformationZodSchema } from "./spouseInformation.zod.validation";
import { Prisma } from "#db-client";

// ============================================================
// CREATE SPOUSE INFORMATION SERVICE
// ============================================================

const createSpouseInformation = async (
  payload: TCreateSpouseInformationZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const {
    user_id,
    full_name,
    contact_no,
    father_name,
    father_contact_no,
    mother_name,
    mother_contact_no,
    occupation,
    job_title,
    monthly_income,
    present_address,
    permanent_address,
  } = payload;

  return prisma.$transaction(async (transaction) => {
    // CHECK TARGET USER
    const targetUser = await transaction.user.findUnique({
      where: { id: user_id },
      select: { id: true, full_name: true },
    });
    if (!targetUser) {
      throw new AppError(
        "The provided user does not exist.",
        StatusCodes.NOT_FOUND,
      );
    }

    // CHECK EXISTING SPOUSE INFORMATION
    const existingSpouseInformation =
      await transaction.spouseInformation.findUnique({
        where: { user_id },
        select: { id: true },
      });
    if (existingSpouseInformation) {
      throw new AppError(
        "Spouse information already exists for this user.",
        StatusCodes.CONFLICT,
      );
    }

    // CREATE SPOUSE INFORMATION
    const createdSpouseInformation = await transaction.spouseInformation.create(
      {
        data: {
          full_name,
          ...(contact_no !== undefined && { contact_no }),
          ...(father_name !== undefined && { father_name }),
          ...(father_contact_no !== undefined && { father_contact_no }),
          ...(mother_name !== undefined && { mother_name }),
          ...(mother_contact_no !== undefined && { mother_contact_no }),
          ...(occupation !== undefined && { occupation }),
          ...(job_title !== undefined && { job_title }),
          ...(monthly_income !== undefined && { monthly_income }),
          user: { connect: { id: user_id } },
          created_by: { connect: { id: loggedInUser.user_id } },
        },
      },
    );

    // CREATE PRESENT ADDRESS
    let createdPresentAddress = null;
    if (present_address) {
      createdPresentAddress = await transaction.presentAddress.create({
        data: {
          ...present_address,
          spouse: { connect: { id: createdSpouseInformation.id } },
          created_by: { connect: { id: loggedInUser.user_id } },
        },
      });
    }

    // CREATE PERMANENT ADDRESS
    let createdPermanentAddress = null;
    if (permanent_address) {
      createdPermanentAddress = await transaction.permanentAddress.create({
        data: {
          ...permanent_address,
          spouse: { connect: { id: createdSpouseInformation.id } },
          created_by: { connect: { id: loggedInUser.user_id } },
        },
      });
    }

    // CREATE SPOUSE INFORMATION AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: createdSpouseInformation.id,
        entity_name: "SpouseInformation",
        old_value: Prisma.JsonNull,
        new_value: {
          user_id,
          full_name,
          contact_no: contact_no ?? null,
          father_name: father_name ?? null,
          father_contact_no: father_contact_no ?? null,
          mother_name: mother_name ?? null,
          mother_contact_no: mother_contact_no ?? null,
          occupation: occupation ?? null,
          job_title: job_title ?? null,
          monthly_income: monthly_income ?? null,
          present_address: present_address ?? null,
          permanent_address: permanent_address ?? null,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    // CREATE PRESENT ADDRESS AUDIT LOG
    if (createdPresentAddress) {
      await transaction.auditLog.create({
        data: {
          entity_id: createdPresentAddress.id,
          entity_name: "PresentAddress",
          old_value: Prisma.JsonNull,
          new_value: {
            spouse_id: createdSpouseInformation.id,
            house_no: present_address?.house_no ?? null,
            house_name: present_address?.house_name ?? null,
            plot_no: present_address?.plot_no ?? null,
            road_no: present_address?.road_no ?? null,
            neighbourhood: present_address?.neighbourhood ?? null,
            region: present_address?.region ?? null,
            village: present_address?.village ?? null,
            post_code: present_address?.post_code ?? null,
            post_office: present_address?.post_office ?? null,
            thana: present_address?.thana,
            district: present_address?.district,
            country: present_address?.country ?? "Bangladesh",
          },
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
        },
      });
    }

    // CREATE PERMANENT ADDRESS AUDIT LOG
    if (createdPermanentAddress) {
      await transaction.auditLog.create({
        data: {
          entity_id: createdPermanentAddress.id,
          entity_name: "PermanentAddress",
          old_value: Prisma.JsonNull,
          new_value: {
            spouse_id: createdSpouseInformation.id,
            house_no: permanent_address?.house_no ?? null,
            house_name: permanent_address?.house_name ?? null,
            plot_no: permanent_address?.plot_no ?? null,
            road_no: permanent_address?.road_no ?? null,
            neighbourhood: permanent_address?.neighbourhood ?? null,
            region: permanent_address?.region ?? null,
            village: permanent_address?.village ?? null,
            post_code: permanent_address?.post_code ?? null,
            post_office: permanent_address?.post_office ?? null,
            thana: permanent_address?.thana,
            district: permanent_address?.district,
            country: permanent_address?.country ?? "Bangladesh",
          },
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
        },
      });
    }

    return {
      ...createdSpouseInformation,
      present_address: createdPresentAddress,
      permanent_address: createdPermanentAddress,
    };
  });
};
export const spouseInformationServices = {
  createSpouseInformation,
};
