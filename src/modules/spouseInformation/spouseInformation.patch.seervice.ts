import { TLoggedInUser } from "../../commonInterfaces/interfaces"
import { TUpdateSpouseNameZodSchema } from "./spouseInformation.zod.validation"

const updateSpouseName = async(
    payload: TUpdateSpouseNameZodSchema,
    loggedInUser: TLoggedInUser
)=>{

}

export const spouseInformationPatchServices = {
    updateSpouseName
}