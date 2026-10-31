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
    const bothEmailsSent =
      result.student_email_sent && result.teacher_email_sent;
    const neitherEmailSent =
      !result.student_email_sent && !result.teacher_email_sent;
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: bothEmailsSent
        ? "Responsible teacher added successfully. Both notification emails were sent."
        : neitherEmailSent
          ? "Responsible teacher added successfully, but neither notification email could be sent."
          : `Responsible teacher added successfully, but the ${
              result.student_email_sent ? "teacher" : "student"
            } notification email could not be sent.`,
      data: result,
    });
  },
);

// =============================================
// DISCONNECT RESPONSIBLE TEACHER CONTROLLER
// =============================================
const disconnectResponsibleTeacher = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await studentServices.disconnectResponsibleTeacher(
      req.body,
      loggedInUser,
    );
    const bothEmailsSent =
      result.student_email_sent && result.teacher_email_sent;
    const neitherEmailSent =
      !result.student_email_sent && !result.teacher_email_sent;

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: bothEmailsSent
        ? "Responsible teacher disconnected successfully. Both notification emails were sent."
        : neitherEmailSent
          ? "Responsible teacher disconnected successfully, but neither notification email could be sent."
          : `Responsible teacher disconnected successfully, but the ${
              result.student_email_sent ? "teacher" : "student"
            } notification email could not be sent.`,
      data: result,
    });
  },
);

export const studentController = {
  studentReadmission,
  addResponsibleTeacher,
  disconnectResponsibleTeacher,
};
