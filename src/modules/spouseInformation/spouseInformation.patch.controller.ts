import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { spouseInformationPatchServices } from "./spouseInformation.patch.seervice";

// ============================================================
// UPDATE SPOUSE FULL NAME CONTROLLER
// ============================================================
const updateSpouseName=  catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await spouseInformationPatchServices.updateSpouseName(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information deleted successfully.",
      data: result,
    });
  },
);

export const spouseInformationPatchController = {
    updateSpouseName
}