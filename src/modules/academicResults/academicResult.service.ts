import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { checkRolePositionPair } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { TCreateAcademicResultZodSchema } from "./academicResult.zod.validation";
import { prisma } from "../../lib/prisma";

const createAcademicResult = async(
    payload: TCreateAcademicResultZodSchema, 
    loggedInUser: TLoggedInUser
)=>{
    const cleanRole = payload.role_name.trim().toUpperCase();
    const cleanPosition = payload.position_name.trim().toUpperCase();

     //  1. Validate role
    const existingRole = await findRoleExistence(cleanRole);
    
     // 2. Validate role-position relationship
      const positionExists = await checkRolePositionPair({
        role_name: cleanRole,
        position_name: cleanPosition,
      });

    //   3. Prevent unexpected role
      if(cleanRole === "STUDENT" ){
        throw new AppError(`The provided role ${cleanRole} has no Academic Result record.`, StatusCodes.CONFLICT)
      }
    // 4. Check role name to find the entity name 
    let targetTableName;
    if(cleanRole === "MANAGEMENT" || cleanRole === "ADMIN" || cleanRole === "TEACHER_ADMIN" || cleanRole === "SUPER_ADMIN"){
        targetTableName = "managementStaff"
    }else if (cleanRole === "ACADEMIC"){
        targetTableName = "academicStaff"
    }else if(cleanRole === "GOVERNING_BODY"){
        targetTableName = "governingBody"
    };

    
    // 5. create Academic Result
    const academicResult = await prisma.academicResult.create({

    })
};

export const academicResultServices = {
    createAcademicResult
}