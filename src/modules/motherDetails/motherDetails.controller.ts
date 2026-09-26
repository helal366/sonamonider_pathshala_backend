import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { motherDetailsServices } from "./motherDetails.service.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import {
  TConnectMotherDetailsZodSchema,
  TCreateMotherDetailsZodSchema,
  TDisconnectMotherDetailsZodSchema,
} from "./motherDetails.zod.validation.js";


// ============================================================
// CREATE MOTHER DETAILS CONTROLLER
// ============================================================
const createMotherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateMotherDetailsZodSchema;

    const result = await motherDetailsServices.createMotherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Mother details created successfully.",
      data: result,
    });
  },
);

// ============================================================
// CONNECT MOTHER DETAILS CONTROLLER
// ============================================================
const connectMotherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TConnectMotherDetailsZodSchema;

    const result = await motherDetailsServices.connectMotherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mother details connected successfully.",
      data: result,
    });
  },
);

// ============================================================
// DISCONNECT MOTHER DETAILS CONTROLLER
// ============================================================
const disconnectMotherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TDisconnectMotherDetailsZodSchema;

    const result = await motherDetailsServices.disconnectMotherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mother details disconnected successfully.",
      data: result,
    });
  },
);

export const motherDetailsController = {
  createMotherDetails,
  connectMotherDetails,
  disconnectMotherDetails,
};


// import { StatusCodes } from "http-status-codes";
// import { Request, Response } from "express";

// import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import { motherDetailsServices } from "./motherDetails.service";
// import {
//   TConnectMotherDetailsZodSchema,
//   TCreateMotherDetailsZodSchema,
// } from "./motherDetails.zod.validation";

// type LoggedInUser = NonNullable<Express.Request["user"]>;
// type MotherService = (payload: never, user: LoggedInUser) => Promise<unknown>;

// const requireUser = (req: Request) => {
//   if (!req.user) {
//     throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
//   }
//   return req.user;
// };

// const createMotherDetails = catchAsync(async (req, res) => {
//   const result = await motherDetailsServices.createMotherDetails(
//     req.body as TCreateMotherDetailsZodSchema,
//     requireUser(req),
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "Mother details created successfully.",
//     data: result,
//   });
// });

// const connectMotherDetails = catchAsync(async (req, res) => {
//   const result = await motherDetailsServices.connectMotherDetails(
//     req.body as TConnectMotherDetailsZodSchema,
//     requireUser(req),
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Mother details connected successfully.",
//     data: result,
//   });
// });

// const createUpdateController = (service: MotherService, message: string) =>
//   catchAsync(async (req, res) => {
//     const result = await service(req.body as never, requireUser(req));
//     sendResponse(res, {
//       success: true,
//       statusCode: StatusCodes.OK,
//       message,
//       data: result,
//     });
//   });

// export const motherDetailsController = {
//   createMotherDetails,
//   connectMotherDetails,
//   updateMotherName: createUpdateController(
//     motherDetailsServices.updateMotherName as MotherService,
//     "Mother name updated successfully.",
//   ),
//   updateMotherNid: createUpdateController(
//     motherDetailsServices.updateMotherNid as MotherService,
//     "Mother NID updated successfully.",
//   ),
//   updateMotherOccupation: createUpdateController(
//     motherDetailsServices.updateMotherOccupation as MotherService,
//     "Mother occupation updated successfully.",
//   ),
//   updateMotherJobTitle: createUpdateController(
//     motherDetailsServices.updateMotherJobTitle as MotherService,
//     "Mother job title updated successfully.",
//   ),
//   updateMotherEducationalQualification: createUpdateController(
//     motherDetailsServices.updateMotherEducationalQualification as MotherService,
//     "Mother educational qualification updated successfully.",
//   ),
//   updateMotherMonthlyIncome: createUpdateController(
//     motherDetailsServices.updateMotherMonthlyIncome as MotherService,
//     "Mother monthly income updated successfully.",
//   ),
//   updateMotherMobileNo1: createUpdateController(
//     motherDetailsServices.updateMotherMobileNo1 as MotherService,
//     "Mother mobile number 1 updated successfully.",
//   ),
//   updateMotherMobileNo2: createUpdateController(
//     motherDetailsServices.updateMotherMobileNo2 as MotherService,
//     "Mother mobile number 2 updated successfully.",
//   ),
//   updateMotherMobileNo3: createUpdateController(
//     motherDetailsServices.updateMotherMobileNo3 as MotherService,
//     "Mother mobile number 3 updated successfully.",
//   ),
// };
