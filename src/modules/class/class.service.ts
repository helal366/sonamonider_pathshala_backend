import { Prisma } from "#db-client";
import { TLoggedInUser } from "../../commonInterfaces/interfaces"
import { prisma } from "../../lib/prisma";
import { TCreateClassZodSchema } from "./class.zod.validation"


// =============================================
// CREATE CLASS NAME SERVICE LAYER
// =============================================
const createClass = async(
    payload:TCreateClassZodSchema,
    loggedInUser: TLoggedInUser
)=>{
    const {class_name} = payload;
    return await prisma.$transaction(async(tx)=>{
        const createdNewClass = await tx.class.create({
            data: {
                class_name,
                created_by: {
                    connect: {id: loggedInUser.user_id}
                }
            },
        });
    
        await tx.auditLog.create({
            data: {
                entity_id: createdNewClass.id,
                entity_name: "Class",
                action: "CREATE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: Prisma.JsonNull,
                new_value: createdNewClass as unknown as Prisma.InputJsonValue
            }
        })
        return createdNewClass
    })
}

export const classServices = {
    createClass,
}