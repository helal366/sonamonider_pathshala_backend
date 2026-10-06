import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { prisma } from "../../lib/prisma";
import { TCreatePromotionRequestZodSchema } from "./promotionRequests.zod.validation";

const createPromotionRequest = async(
    payload:TCreatePromotionRequestZodSchema,
    loggedInUser: TLoggedInUser
)=>{
    const {required_id, old_role, new_role, old_position, new_position} = payload;
    return prisma.$transaction(async(tx)=>{
        
    })
}