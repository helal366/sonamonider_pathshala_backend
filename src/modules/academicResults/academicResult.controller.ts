import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicResultServices } from "./academicResult.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TGetSingleAcademicResultZodSchema } from "./academicResult.zod.validation";

// ==========================================
// CREATE ACADEMIC RESULT CONTROLLER
// ==========================================
const createAcademicResult = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await academicResultServices.createAcademicResult(
    payload,
    loggedInUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: `Academic result created successfully.`,
    data: result,
  });
});

// ==========================================
// DELETE ACADEMIC RESULT CONTROLLER
// ==========================================
const deleteAcademicResult = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await academicResultServices.deleteAcademicResult(
    payload,
    loggedInUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: `Academic result deleted successfully.`,
    data: result,
  });
});

// ==========================================
// UPDATE ACADEMIC RESULT FIELD CONTROLLER
// ==========================================
const updateAcademicResultField = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await academicResultServices.deleteAcademicResult(
      payload,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Academic result deleted successfully.`,
      data: result,
    });
  },
);

// ==========================================
// GET ALL ACADEMIC RESULTS CONTROLLER
// ==========================================
const getAllAcademicResults = catchAsync(
   async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await academicResultServices.getAllAcademicResults()
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Academic results retrieved successfully.`,
      data: result,
    });
   } 
);

// ==========================================
// GET SINGLE ACADEMIC RESULT BY ID ROUTE
// ==========================================
const getSingleAcademicResult = catchAsync(
   async (req: Request, res: Response) => {

    helperFunctions.requiredUser(req);

    const payload:TGetSingleAcademicResultZodSchema= {
        params: req.params as TGetSingleAcademicResultZodSchema["params"]
    }
    
    const { academic_result_id } = payload.params;

    const result = await academicResultServices.getSingleAcademicResult(academic_result_id)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Academic result retrieved successfully.`,
      data: result,
    });
   } 
);

export const academicResultController = {
  createAcademicResult,
  deleteAcademicResult,
  updateAcademicResultField,
  getAllAcademicResults,
  getSingleAcademicResult
};
