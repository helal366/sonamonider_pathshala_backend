import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { userAddressServices } from "./address.service.js";
import { TDeleteAddressZodSchema } from "./address.zodValidation.js";

// ============================================================
// UPDATE ADDRESS CONTROLLER
// ============================================================
const createAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;

    const result = await userAddressServices.createAddress(
      loggedInUser,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Address created successfully.`,
      data: result,
    });
  },
);

// ============================================================
// DELETE ADDRESS CONTROLLER
// ============================================================
const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload: TDeleteAddressZodSchema = req.body;

    const result = await userAddressServices.deleteAddress(
      loggedInUser,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Address deleted successfully.`,
      data: result,
    });
  },
);
// ============================================================
// UPDATE ADDRESS FIELD CONTROLLER
// ============================================================
const updateUserAddressField = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;

    const result = await userAddressServices.updateUserAddressFiled(
      loggedInUser,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `House no updated successfully`,
      data: result,
    });
  },
);
export const userAddressController = {
  createAddress,
  deleteAddress,
  updateUserAddressField,
};
