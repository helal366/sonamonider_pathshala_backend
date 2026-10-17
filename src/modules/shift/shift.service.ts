import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TCreateShiftZodSchema,
  TUpdateShiftFieldZodSchema,
} from "./shift.zodValidation";
import { Prisma } from "#db-client";
import { notFound } from "../../middlewares/notFound";

// =============================================
// CREATE SHIFT SERVICE LAYER
// =============================================
const createShift = async (
  payload: TCreateShiftZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { shift_name } = payload;
  const cleanShiftName = shift_name.trim().toUpperCase();
  return prisma.$transaction(async (tx) => {
    const existingShift = await tx.shift.findUnique({
      where: { shift_name: cleanShiftName },
    });
    if (existingShift) {
      throw new AppError(
        `The provided shift name ${cleanShiftName} already exists.`,
        StatusCodes.CONFLICT,
      );
    }

    const created = await tx.shift.create({
      data: {
        shift_name: cleanShiftName,
        created_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "shift",
        action: "CREATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: Prisma.JsonNull,
        new_value: created as unknown as Prisma.InputJsonValue,
      },
    });
    return created;
  });
};

// =============================================
// DELETE SHIFT SERVICE LAYER
// =============================================
const deleteShift = async (shift_id: string, loggedInUser: TLoggedInUser) => {
  return prisma.$transaction(async (tx) => {
    const existingShift = await tx.shift.findUnique({
      where: { id: shift_id },
    });
    if (!existingShift) {
      throw new AppError(`Shift not found`, StatusCodes.NOT_FOUND);
    }

    const routineCount = await tx.classRoutine.count({
      where: { shift_id },
    });
    if (routineCount > 0) {
      throw new AppError(
        "Cannot delete a shift that is assigned to class routines.",
        StatusCodes.CONFLICT,
      );
    }

    const deleted = await tx.shift.delete({
      where: { id: shift_id },
    });

    await tx.auditLog.create({
      data: {
        entity_id: existingShift.id,
        entity_name: "shift",
        action: "DELETE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: existingShift as unknown as Prisma.InputJsonValue,
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

// =============================================
// UPDATE SHIFT FIELD SERVICE LAYER
// =============================================
const updateShiftField = async (
  payload: TUpdateShiftFieldZodSchema,
  loggedInUser: TLoggedInUser,
  shift_id: string,
) => {
  const { field, value } = payload;
  const cleanValue = value.trim().toUpperCase();
  return await prisma.$transaction(async (tx) => {
    // CHECK DUPLICATE
    if (field === "shift_name") {
      const duplicateShift = await tx.shift.findUnique({
        where: { shift_name: cleanValue },
      });

      if (duplicateShift && duplicateShift.id !== shift_id) {
        throw new AppError(
          `The shift name ${cleanValue} already exists.`,
          StatusCodes.CONFLICT,
        );
      }
    }

    // CHECK EXISTING
    const existingShift = await tx.shift.findUnique({
      where: { id: shift_id },
    });
    // REJECT FOR NOT FOUND
    if (!existingShift) {
      throw new AppError(`Shift not found`, StatusCodes.NOT_FOUND);
    }

    // REJECT FOR SAME VALUE PROVIDED
    if (existingShift.shift_name === cleanValue) {
      throw new AppError(
        "The provided shift name is the same as the existing shift name.",
        StatusCodes.BAD_REQUEST,
      );
    }

    // UPDATE
    const updated = await tx.shift.update({
      where: { id: shift_id },
      data: {
        [field]: cleanValue,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CHECK AUDIT LOG
    await tx.auditLog.create({
      data: {
        entity_id: existingShift.id,
        entity_name: "shift",
        action: "UPDATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: {
          [field]: existingShift[field as keyof typeof existingShift],
        },
        new_value: {
          [field]: cleanValue,
        },
      },
    });
    return updated;
  });
};

// =============================================
// GET SHIFT NAMES SERVICE LAYER
// =============================================
const getShiftNames = async () => {
  const shiftNames = await prisma.shift.findMany({
    select: { id: true, shift_name: true },
    orderBy: { shift_name: "asc" },
  });
  return shiftNames;
};

// =============================================
// GET SINGLE SHIFT SERVICE LAYER
// =============================================
const getSingleShift = async(shift_id:string)=>{
  // CHECK EXISTANCE
  const shiftExistance = await prisma.shift.findUnique({
    where: {id: shift_id},
    include: {
      class_history: {
        include: {
          academic_year: {
            select: {academic_year_name: true}
          },
          quranic_subject: {
            select: { quranic_subject_name: true }
          },
          class: {
            select: {
              class_name: true,
              is_active_class: true
            }
          },
          class_history_quranic_periods: {
            select: {
              quranic_period: {
                select: {
                  quranic_period_name: true,
                  start_time: true,
                  end_time: true
                }
              }
            }
          }
        }
      }
    }
  });
  if(!shiftExistance){
    throw new AppError(`Provided shift not found.`, StatusCodes.NOT_FOUND)
  };
  return shiftExistance
};


export const shiftServices = {
  createShift,
  deleteShift,
  updateShiftField,
  getShiftNames,
  getSingleShift
};
