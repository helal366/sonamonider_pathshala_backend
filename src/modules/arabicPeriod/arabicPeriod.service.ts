import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateArabicPeriodZodSchema } from "./arabicPeriod.zodValidation";
import { Prisma } from "#db-client";

// ==========================================================
// CREATE ARABIC PERIOD SERVICE LAYER
// ==========================================================
const createArabicPeriod = async (
  payload: TCreateArabicPeriodZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { arabic_period_name, start_time, end_time } = payload;
  const cleanArabicPeriodName = arabic_period_name.trim().toUpperCase();
  const cleanStartTime = start_time.trim().toUpperCase();
  const cleanEndTime = end_time.trim().toUpperCase();

  // Existing arabic period 
  const arabicPeriod = await prisma.arabicPeriod.findUnique({
    where: { arabic_period_name: cleanArabicPeriodName },
    select: {id: true}
  });
  if (arabicPeriod) {
    throw new AppError(`Arabic period already exists.`, StatusCodes.CONFLICT);
  };

  return prisma.$transaction(async(transaction)=>{
    const newPeriod = await transaction.arabicPeriod.create({
        data: {
            arabic_period_name: cleanArabicPeriodName,
            start_time: cleanStartTime,
            end_time: cleanEndTime
        }
    });
    await transaction.auditLog.create({
        data: {
            entity_id: newPeriod.id,
            entity_name: "arabicPeriod",
            changed_by_id: loggedInUser.user_id,
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: newPeriod
        }
    })
    return newPeriod;
  })
};

// ==========================================================
// DELETE ARABIC PERIOD SERVICE LAYER
// ==========================================================
const deleteArabicPeriod = async(
    arabic_period_id: string,
    loggedInUser: TLoggedInUser
)=>{
    return prisma.$transaction(async(transaction)=>{
        const arabicPeriod = await transaction.arabicPeriod.findUnique({
            where: {id: arabic_period_id}
        });
        if(!arabicPeriod){
            throw new AppError(`Arabic period not found.`, StatusCodes.NOT_FOUND)
        };

        const deleted = await transaction.arabicPeriod.delete({
            where: {id: arabic_period_id}
        });

        await transaction.auditLog.create({
            data: {
                entity_id: arabic_period_id,
                entity_name: "arabicPeriod",
                changed_by_id: loggedInUser.user_id,
                action: "DELETE",
                old_value: arabicPeriod,
                new_value: Prisma.JsonNull
            }
        })
        return deleted;
    })
}

export const arabicPeriodServices = {
  createArabicPeriod,
  deleteArabicPeriod
};
