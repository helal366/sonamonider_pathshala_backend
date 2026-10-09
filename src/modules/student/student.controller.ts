import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { studentServices } from "./student.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TStudentReadmissionZodSchema } from "./student.zodValidation";

// =============================================
// STUDENT READMISSION CONTROLLER
// =============================================
const studentReadmission = catchAsync(async (req: Request, res: Response) => {
  const payload: TStudentReadmissionZodSchema = req.body;
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await studentServices.studentReadmission(
    payload,
    loggedInUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      "Student readmitted and promoted successfully for the new academic year.",
    data: result,
  });
});

// =============================================
// ADD RESPONSIBLE TEACHER CONTROLLER
// =============================================
const addResponsibleTeacher = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await studentServices.addResponsibleTeacher(
      payload,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Responsible teacher added successfully.`,
      data: result,
    });
  },
);
export const studentController = {
  studentReadmission,
  addResponsibleTeacher,
};
