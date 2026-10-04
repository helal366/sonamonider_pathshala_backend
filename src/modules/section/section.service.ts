
// =============================================
// CREATE SECTION SERVICE LAYER

import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces"
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { Prisma } from "#db-client";

// =============================================
const createSection = async(
    payload:{section_name: string},
    loggedInUser: TLoggedInUser
)=>{
    const {section_name} = payload;
    const cleanSectionName = section_name.trim().toUpperCase();
    return prisma.$transaction(async(tx)=>{
        const existingSection = await tx.section.findUnique({
            where:{section_name:cleanSectionName},
            select: {id: true}
        });
        if(existingSection){
            throw new AppError(`Section name ${cleanSectionName} already exists.`, StatusCodes.CREATED)
        };
        const created = await tx.section.create({
            data: {
                section_name: cleanSectionName,
            }
        });

        await tx.auditLog.create({
            data: {
                entity_id: created.id,
                entity_name: "Section",
                action: "CREATE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: Prisma.JsonNull,
                new_value: created as unknown as Prisma.InputJsonValue
            }
        });
        return created;
    })
}
// =============================================
// DELETE SECTION SERVICE LAYER
// =============================================
const deleteSectionName = async(
    id: string,
    loggedInUser: TLoggedInUser
)=>{
    return await prisma.$transaction(async(tx)=>{
        const existingSection = await tx.section.findUnique({
            where:{id},
        });
        if(!existingSection){
            throw new AppError(`Section name not found.`, StatusCodes.NOT_FOUND)
        };

        const deleted = await tx.section.delete({
            where: {id}
        });

        await tx.auditLog.create({
            data:{
                entity_id: existingSection.id,
                entity_name: "Section",
                action: "DELETE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: existingSection as unknown as Prisma.InputJsonValue,
                new_value: Prisma.JsonNull,
            }
        })
        return deleted

    })
}
// =============================================
// UPDATE SECTION FIELD SERVICE LAYER
// =============================================
// =============================================
// GET SECTION NAMES SERVICE LAYER
// =============================================

export const sectionServices = {
    createSection,
    deleteSectionName
}