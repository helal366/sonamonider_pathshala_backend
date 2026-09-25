import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { motherDetailsDeleteServices } from "./motherDetails.delete.service";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";

type LoggedInUser = NonNullable<Express.Request["user"]>;

type TMotherDetailsDeleteService = (
  payload: never,
  loggedInUser: LoggedInUser,
) => Promise<unknown>;

const createDeleteController = (
  service: TMotherDetailsDeleteService,
  message: string,
) =>
  catchAsync(async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const payload = req.body as never;

    const result = await service(payload, loggedInUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message,
      data: result,
    });
  });

// ============================================================
// DELETE MOTHER NID
// ============================================================

const deleteMotherNid = createDeleteController(
  motherDetailsDeleteServices.deleteMotherNid as TMotherDetailsDeleteService,
  "Mother NID deleted successfully.",
);

// ============================================================
// DELETE MOTHER OCCUPATION
// ============================================================

const deleteMotherOccupation = createDeleteController(
  motherDetailsDeleteServices.deleteMotherOccupation as TMotherDetailsDeleteService,
  "Mother occupation deleted successfully.",
);

// ============================================================
// DELETE MOTHER JOB TITLE
// ============================================================

const deleteMotherJobTitle = createDeleteController(
  motherDetailsDeleteServices.deleteMotherJobTitle as TMotherDetailsDeleteService,
  "Mother job title deleted successfully.",
);

// ============================================================
// DELETE MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

const deleteMotherEducationalQualification = createDeleteController(
  motherDetailsDeleteServices
    .deleteMotherEducationalQualification as TMotherDetailsDeleteService,
  "Mother educational qualification deleted successfully.",
);

// ============================================================
// DELETE MOTHER MONTHLY INCOME
// ============================================================

const deleteMotherMonthlyIncome = createDeleteController(
  motherDetailsDeleteServices.deleteMotherMonthlyIncome as TMotherDetailsDeleteService,
  "Mother monthly income deleted successfully.",
);

// ============================================================
// DELETE MOTHER MOBILE NO 1
// ============================================================

const deleteMotherMobileNo1 = createDeleteController(
  motherDetailsDeleteServices.deleteMotherMobileNo1 as TMotherDetailsDeleteService,
  "Mother mobile number 1 deleted successfully.",
);

// ============================================================
// DELETE MOTHER MOBILE NO 2
// ============================================================

const deleteMotherMobileNo2 = createDeleteController(
  motherDetailsDeleteServices.deleteMotherMobileNo2 as TMotherDetailsDeleteService,
  "Mother mobile number 2 deleted successfully.",
);

// ============================================================
// DELETE MOTHER MOBILE NO 3
// ============================================================

const deleteMotherMobileNo3 = createDeleteController(
  motherDetailsDeleteServices.deleteMotherMobileNo3 as TMotherDetailsDeleteService,
  "Mother mobile number 3 deleted successfully.",
);

export const motherDetailsDeleteController = {
  deleteMotherNid,
  deleteMotherOccupation,
  deleteMotherJobTitle,
  deleteMotherEducationalQualification,
  deleteMotherMonthlyIncome,
  deleteMotherMobileNo1,
  deleteMotherMobileNo2,
  deleteMotherMobileNo3,
};