import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces"
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateBookListZodSchema } from "./bookList.zodValidation"

const createBookList = async (
    LoggedInUser: TLoggedInUser,
    payload: TCreateBookListZodSchema
)=>{
    const {class_id, book_name, publisher} = payload;
    // Find class 
    const classExists = await prisma.class.findUnique({
        where: {id: class_id}
    });
    // Check class existance
    if(!classExists){
        throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND)
    }

    // Check duplicate entry 
    // const bookExists = await prisma.
}

export const bookListServiceLayer = {
    createBookList
}