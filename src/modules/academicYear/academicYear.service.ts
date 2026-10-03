import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateAcademicYearZodSchema, TdeleteAcademicYearZodSchema, TUpdateAcademicYearFieldZodSchema } from "./academicYear.zod.validation";
import { academicYearCache } from "../../helperFunctions/cachedData/cache_academic_year";

// ==========================================
// CREATE ACADEMIC YEAR SERVICE LAYER
// ==========================================
const createAcademicYear=async(
    payload:TCreateAcademicYearZodSchema,
    loggedInUser:TLoggedInUser
)=>{
    const {academic_year_name} = payload;
    await academicYearCache.checkAcademicYearAvailability(academic_year_name);
    return await prisma.$transaction(async(tx)=>{
        const academicYear = await tx.academicYear.create({
            data: {
                academic_year_name,
                created_by: {connect: {id: loggedInUser.user_id}}
            },
            select: {id: true, academic_year_name: true}
        });
        await tx.auditLog.create({
            data:{
                entity_id: academicYear.id,
                entity_name: "AcademicYear",
                action: "CREATE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: Prisma.JsonNull,
                new_value: academicYear as unknown as Prisma.InputJsonValue
            }
        });
        return academicYear;
    })
};


// ==========================================
// DELETE ACADEMIC YEAR SERVICE LAYER
// ==========================================
const deleteAcademicYear=async(
    payload:TdeleteAcademicYearZodSchema,
    loggedInUser:TLoggedInUser
)=>{
    const {academic_year_id} = payload;
    return await prisma.$transaction(async(tx)=>{
        const academicYearExistance = await tx.academicYear.findUnique({
            where: {id: academic_year_id},
            select: {id: true, academic_year_name: true}
        });
        if(!academicYearExistance){
            throw new AppError(`Academic year not found.`, StatusCodes.NOT_FOUND)
        };

        const deleted = await tx.academicYear.delete({where: {id:academic_year_id}});
        await tx.auditLog.create({
            data: {
                entity_id: academic_year_id,
                entity_name: "AcademicYear",
                action: "DELETE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: academicYearExistance as unknown as Prisma.InputJsonValue,
                new_value: Prisma.JsonNull 
            }
        })
        return deleted
    })
};

// ==========================================
// UPDATE ACADEMIC YEAR FIELD SERVICE LAYER
// ==========================================
const updateAcademicYearField=async(
    payload:TUpdateAcademicYearFieldZodSchema,
    loggedInUser:TLoggedInUser
)=>{
    const {academic_year_id, field, value} = payload;
    await academicYearCache.checkAcademicYearAvailability(value);
    return prisma.$transaction(async(tx)=>{
        const academicYearExistance = await tx.academicYear.findUnique({
            where: {id: academic_year_id},
            select: {id: true, academic_year_name: true}
        });
        if(!academicYearExistance){
            throw new AppError(`Academic year not found.`, StatusCodes.NOT_FOUND)
        };
        
        const updated = await tx.academicYear.update({
            where: {id: academic_year_id},
            data: {
                [field]:value
            }
        });

        await tx.auditLog.create({
            data:{
                entity_id: academic_year_id,
                entity_name: "AcademicYear",
                action: "UPDATE",
                changed_by: {connect: {id: loggedInUser.user_id}},
                old_value: {
                    [field] : academicYearExistance[field as keyof typeof academicYearExistance],
                } as Prisma.InputJsonValue,
                new_value: {
                    [field]: value
                } as Prisma.InputJsonValue    
            }
        })

        return updated
    })
};

// ==========================================
// GET ALL ACADEMIC YEAR SERVICE LAYER
// ==========================================
const getAllAcademicYearName=async()=>{
    return await prisma.academicYear.findMany({
        select: {id: true, academic_year_name: true},
        orderBy: {academic_year_name: "desc"}
    })
};

const getSingleAcademicYearWithHistory=async(academic_year_id:string)=>{
    const academicYear = await prisma.academicYear.findUnique({
        where: {id: academic_year_id},
        select: {
            id: true,
            academic_year_name: true,
            _count: {
                select: {class_history: true}
            }
        }
    });

    if(!academicYear){
        throw new AppError(`Academic year not found.`, StatusCodes.NOT_FOUND)
    };

    const activeClassesInYear = await prisma.classHistory.findMany({
        where: { academic_year_id },
        distinct: ['class_id'],
        select: {
            student: {
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                    mobile_number: true,
                    // Includes their current structural active class context
                    active_class: {
                        select: {
                            id: true,
                            class_name: true
                        }
                    }
                }
            }
        }
    });

    return {
        ...academicYear,
        total_student_allocations: academicYear._count.class_history,
        students: activeClassesInYear.map(item => item.student)
    }
}
export const academicYearServices = {
    createAcademicYear,
    deleteAcademicYear,
    updateAcademicYearField,
    getAllAcademicYearName,
    getSingleAcademicYearWithHistory
}