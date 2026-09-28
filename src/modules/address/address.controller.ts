import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { userAddressService } from "./address.service";

// ============================================================
// UPDATE ADDRESS CONTROLLER
// ============================================================
const createAddress= catchAsync(
  async (req: Request, res: Response, next: NextFunction)=>{
      const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;

    const result = await userAddressService.createAddress(
      loggedInUser,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Address created successfully.`,
      data: result,
    });
  }
)

// ============================================================
// DELETE ADDRESS CONTROLLER
// ============================================================
const deleteAddress= catchAsync(
  async (req: Request, res: Response, next: NextFunction)=>{
      const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;

    const result = await userAddressService.deleteAddress(
      loggedInUser,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Address deleted successfully.`,
      data: result,
    });
  }
)
// ============================================================
// UPDATE ADDRESS FIELD CONTROLLER
// ============================================================
const updateUserAddressField = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;

    const result = await userAddressService.updateUserAddressFiled(
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
export const userAddressPatchController = {
  createAddress,
  deleteAddress,
  updateUserAddressField,
};
