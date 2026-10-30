import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma"

export const findData=async(student_id:string)=>{
    const student = await prisma.student.findUnique({
        where: {id:student_id},
        include: {
            user_primary_data: {
                include: {
                    present_address: true
                }
            }
        }
    });
    if(!student){
        throw new AppError(`Student not found.`, StatusCodes.NOT_FOUND)
    }
    const studentName = student?.user_primary_data.full_name;
    const studentEmail = student?.user_primary_data.email;
    const studentMobileNmber = student?.user_primary_data.mobile_number;
    const postCode = student?.user_primary_data.present_address?.post_code
    const neighbourhood = student?.user_primary_data.present_address?.neighbourhood;
    const region = student?.user_primary_data.present_address?.region;
    const village = student?.user_primary_data.present_address?.village;
    const thana = student?.user_primary_data.present_address?.thana;
    const district = student?.user_primary_data.present_address?.district;
    const country = student?.user_primary_data.present_address?.country
    const address = region ? region : neighbourhood? neighbourhood: village? village: thana;
    return {studentName, studentEmail, studentMobileNmber, postCode, address, thana, district, country}
}