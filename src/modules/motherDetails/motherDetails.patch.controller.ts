import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { TMotherDetailsPatchService } from "./motherDetails.interface.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { motherDetailsPatchServices } from "./motherDetails.patch.service.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";

const createPatchController = (
  service: TMotherDetailsPatchService,
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
// UPDATE MOTHER NAME
// ============================================================
const updateMotherName = createPatchController(
  motherDetailsPatchServices.updateMotherName as TMotherDetailsPatchService,
  "Mother name updated successfully.",
);

// ============================================================
// UPDATE MOTHER NID
// ============================================================
const updateMotherNid = createPatchController(
  motherDetailsPatchServices.updateMotherNid as TMotherDetailsPatchService,
  "Mother NID updated successfully",
);

// ============================================================
// UPDATE MOTHER OCCUPATION
// ============================================================
const updateMotherOccupation = createPatchController(
  motherDetailsPatchServices.updateMotherOccupation as TMotherDetailsPatchService,
  "Mother occupation updated successfully.",
);

// ============================================================
// UPDATE MOTHER JOB TITLE
// ============================================================
const updateMotherJobTitle = createPatchController(
  motherDetailsPatchServices.updateMotherJobTitle as TMotherDetailsPatchService,
  "Mother job title updated successfully.",
);

// ============================================================
// UPDATE MOTHER EDUCATIONAL QUALIFICATION
// ============================================================
const updateMotherEducationalQualification = createPatchController(
  motherDetailsPatchServices.updateMotherEducationalQualification as TMotherDetailsPatchService,
  "Mother educational qualification updated successfully.",
);

// ============================================================
// UPDATE MOTHER MONTHLY INCOME
// ============================================================
const updateMotherMonthlyIncome = createPatchController(
  motherDetailsPatchServices.updateMotherMonthlyIncome as TMotherDetailsPatchService,
  "Mother monthly income updated successfully.",
);

// ============================================================
// UPDATE MOTHER MOBILE NO 1
// ============================================================
const updateMotherMobileNo1 = createPatchController(
  motherDetailsPatchServices.updateMotherMobileNo1 as TMotherDetailsPatchService,
  "Mother mobile number 1 updated successfully.",
);

// ============================================================
// UPDATE MOTHER MOBILE NO 2
// ============================================================
const updateMotherMobileNo2 = createPatchController(
  motherDetailsPatchServices.updateMotherMobileNo2 as TMotherDetailsPatchService,
  "Mother mobile number 2 updated successfully.",
);

// ============================================================
// UPDATE MOTHER MOBILE NO 3
// ============================================================
const updateMotherMobileNo3 = createPatchController(
  motherDetailsPatchServices.updateMotherMobileNo3 as TMotherDetailsPatchService,
  "Mother mobile number 3 updated successfully.",
);
export const motherDetailsPatchController = {
  updateMotherName,
  updateMotherNid,
  updateMotherOccupation,
  updateMotherJobTitle,
  updateMotherEducationalQualification,
  updateMotherMonthlyIncome,
  updateMotherMobileNo1,
  updateMotherMobileNo2,
  updateMotherMobileNo3
};
