import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma"
interface IStudentPaymentDataPayload {
    student_id:string;
    academic_year_name: string
}
export const findData=async({student_id, academic_year_name}:IStudentPaymentDataPayload)=>{
    const student = await prisma.student.findUnique({
        where: {id:student_id},
        include: {
            user_primary_data: {
                include: {
                    present_address: true
                }
            },
            class_history: {
                where: {
                    academic_year: {
                        academic_year_name
                    }
                },
                include: {
                    class: {
                        select:{class_name : true,}
                    }
                }
            }
        }
    });
    if(!student){
        throw new AppError(`Student not found.`, StatusCodes.NOT_FOUND)
    }
    if(student.class_history.length === 0){
        throw new AppError(`Student class history for academic year ${academic_year_name} not found.`, StatusCodes.NOT_FOUND)
    }
    const studentClassHistory = student?.class_history[0]
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
    return {studentClassHistory,studentName, studentEmail, studentMobileNmber, postCode, address, thana, district, country}
}