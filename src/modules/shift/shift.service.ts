import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateShiftZodSchema } from "./shift.zod.validation";
import { Prisma } from "#db-client";
import { notFound } from '../../middlewares/notFound';

// =============================================
// CREATE SHIFT SERVICE LAYER
// =============================================
const createShift = async(
    payload: TCreateShiftZodSchema,
    loggedInUser: TLoggedInUser,
) =>{
    const {shift_name} = payload;
    const cleanShiftName = shift_name.trim().toUpperCase();
    return prisma.$transaction(async(tx)=>{
        const existingShift = await tx.shift.findUnique({
            where: {shift_name:cleanShiftName}
        });
        if(existingShift){
            throw new AppError(`The provided shift name ${cleanShiftName} already exists.`, StatusCodes.CONFLICT)
        };

        const created = await tx.shift.create({
            data: {
                shift_name: cleanShiftName,
                created_by: {connect: {id: loggedInUser.user_id}}
            }
        });

        await tx.auditLog.create({
            data: {
                entity_id: created.id,
                entity_name: "Shift",
                action: "CREATE",
                changed_by: {connect: {id:loggedInUser.user_id,}},
                old_value: Prisma.JsonNull,
                new_value: created as unknown as Prisma.InputJsonValue
            }
        })
        return created;
    })
};

// =============================================
// DELETE SHIFT SERVICE LAYER
// =============================================
const deleteShift = async(
    shift_id: string, 
    loggedInUser: TLoggedInUser
)=>{
    return prisma.$transaction(async(tx)=>{
        const existingShift = await tx.shift.findUnique({
            where: {id: shift_id}
        });
        if(!existingShift){
            throw new AppError(`Shift not found`, StatusCodes.NOT_FOUND)
        };

        const deleted =await tx.shift.delete({
            where: {id: shift_id}
        });

        await tx.auditLog.create({
            data: {
                entity_id: existingShift.id,
                entity_name: "Shift",
                action: "DELETE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: existingShift as unknown as Prisma.InputJsonValue,
                new_value: Prisma.JsonNull
            }
        })
        return deleted;
    })
};

// =============================================
// UPDATE SHIFT FIELD SERVICE LAYER
// =============================================
const updateShiftField = async()=>{

}
export const shiftServices = {
    createShift,
    deleteShift,
    updateShiftField
}