import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import {
  createAddress,
  deleteAddress,
  updateAddressField,
  deleteAddressField,
} from "../address.service";

import { sendResponse } from "../../../utils/sendResponse";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions";
import { AddressOwnerType, AddressType } from "../address.interface";

// ============================================================
// SPOUSE INFORMATION PRESENT ADDRESS
// ============================================================

// ============================================================
// CREATE PRESENT ADDRESS
// ============================================================

export const createSpouseInformationPresentAddress = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await createAddress(
    req.body.required_id,
    req.body,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Spouse information present address created successfully.",
    data: result,
  });
};

// ============================================================
// DELETE COMPLETE PRESENT ADDRESS
// ============================================================

export const deleteSpouseInformationPresentAddress = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddress(
    req.body.required_id,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address deleted successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - HOUSE NO
// ============================================================

export const updateSpouseInformationPresentAddressHouseNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "house_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address house no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - HOUSE NAME
// ============================================================

export const updateSpouseInformationPresentAddressHouseName = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "house_name",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address house name updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - PLOT NO
// ============================================================

export const updateSpouseInformationPresentAddressPlotNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "plot_no",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address plot no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - ROAD NO
// ============================================================

export const updateSpouseInformationPresentAddressRoadNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "road_no",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address road no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - NEIGHBOURHOOD
// ============================================================

export const updateSpouseInformationPresentAddressNeighbourhood = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "neighbourhood",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address neighbourhood updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - REGION
// ============================================================

export const updateSpouseInformationPresentAddressRegion = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "region",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address region updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - VILLAGE
// ============================================================

export const updateSpouseInformationPresentAddressVillage = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "village",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address village updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - POST CODE
// ============================================================

export const updateSpouseInformationPresentAddressPostCode = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "post_code",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address post code updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - POST OFFICE
// ============================================================

export const updateSpouseInformationPresentAddressPostOffice = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "post_office",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address post office updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - THANA
// ============================================================

export const updateSpouseInformationPresentAddressThana = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "thana",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address thana updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - DISTRICT
// ============================================================

export const updateSpouseInformationPresentAddressDistrict = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "district",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address district updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PRESENT ADDRESS - COUNTRY
// ============================================================

export const updateSpouseInformationPresentAddressCountry = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "country",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address country updated successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - HOUSE NO
// ============================================================

export const deleteSpouseInformationPresentAddressHouseNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "house_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address house no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - HOUSE NAME
// ============================================================

export const deleteSpouseInformationPresentAddressHouseName = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "house_name",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address house name deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - PLOT NO
// ============================================================

export const deleteSpouseInformationPresentAddressPlotNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "plot_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address plot no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - ROAD NO
// ============================================================

export const deleteSpouseInformationPresentAddressRoadNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "road_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address road no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - NEIGHBOURHOOD
// ============================================================

export const deleteSpouseInformationPresentAddressNeighbourhood = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "neighbourhood",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address neighbourhood deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - REGION
// ============================================================

export const deleteSpouseInformationPresentAddressRegion = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "region",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address region deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - VILLAGE
// ============================================================

export const deleteSpouseInformationPresentAddressVillage = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "village",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address village deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - POST CODE
// ============================================================

export const deleteSpouseInformationPresentAddressPostCode = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "post_code",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information present address post code deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PRESENT ADDRESS - POST OFFICE
// ============================================================

export const deleteSpouseInformationPresentAddressPostOffice = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "post_office",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PRESENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information present address post office deleted successfully.",
    data: result,
  });
};

// ============================================================
// SPOUSE INFORMATION PERMANENT ADDRESS
// ============================================================

// ============================================================
// CREATE PERMANENT ADDRESS
// ============================================================

export const createSpouseInformationPermanentAddress = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await createAddress(
      req.body.required_id,
      req.body,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Spouse information permanent address created successfully.",
    data: result,
  });
};

// ============================================================
// DELETE COMPLETE PERMANENT ADDRESS
// ============================================================

export const deleteSpouseInformationPermanentAddress = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddress(
      req.body.required_id,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spouse information permanent address deleted successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - HOUSE NO
// ============================================================

export const updateSpouseInformationPermanentAddressHouseNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "house_no",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address house no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - HOUSE NAME
// ============================================================

export const updateSpouseInformationPermanentAddressHouseName = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "house_name",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address house name updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - PLOT NO
// ============================================================

export const updateSpouseInformationPermanentAddressPlotNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "plot_no",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address plot no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - ROAD NO
// ============================================================

export const updateSpouseInformationPermanentAddressRoadNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "road_no",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address road no updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - NEIGHBOURHOOD
// ============================================================

export const updateSpouseInformationPermanentAddressNeighbourhood = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "neighbourhood",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address neighbourhood updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - REGION
// ============================================================

export const updateSpouseInformationPermanentAddressRegion = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "region",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address region updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - VILLAGE
// ============================================================

export const updateSpouseInformationPermanentAddressVillage = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "village",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address village updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - POST CODE
// ============================================================

export const updateSpouseInformationPermanentAddressPostCode = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "post_code",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address post code updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - POST OFFICE
// ============================================================

export const updateSpouseInformationPermanentAddressPostOffice = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "post_office",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address post office updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - THANA
// ============================================================

export const updateSpouseInformationPermanentAddressThana = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "thana",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address thana updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - DISTRICT
// ============================================================

export const updateSpouseInformationPermanentAddressDistrict = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "district",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address district updated successfully.",
    data: result,
  });
};

// ============================================================
// UPDATE PERMANENT ADDRESS - COUNTRY
// ============================================================

export const updateSpouseInformationPermanentAddressCountry = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
      req.body.required_id,
      "country",
      req.body.value,
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address country updated successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - HOUSE NO
// ============================================================

export const deleteSpouseInformationPermanentAddressHouseNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "house_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address house no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - HOUSE NAME
// ============================================================

export const deleteSpouseInformationPermanentAddressHouseName = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "house_name",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address house name deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - PLOT NO
// ============================================================

export const deleteSpouseInformationPermanentAddressPlotNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "plot_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address plot no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - ROAD NO
// ============================================================

export const deleteSpouseInformationPermanentAddressRoadNo = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "road_no",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address road no deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - NEIGHBOURHOOD
// ============================================================

export const deleteSpouseInformationPermanentAddressNeighbourhood = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "neighbourhood",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address neighbourhood deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - REGION
// ============================================================

export const deleteSpouseInformationPermanentAddressRegion = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "region",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address region deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - VILLAGE
// ============================================================

export const deleteSpouseInformationPermanentAddressVillage = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "village",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address village deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - POST CODE
// ============================================================

export const deleteSpouseInformationPermanentAddressPostCode = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "post_code",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address post code deleted successfully.",
    data: result,
  });
};

// ============================================================
// DELETE PERMANENT ADDRESS - POST OFFICE
// ============================================================

export const deleteSpouseInformationPermanentAddressPostOffice = async (
  req: Request,
  res: Response,
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
      req.body.required_id,
      "post_office",
    AddressOwnerType.SPOUSE_INFORMATION,
    AddressType.PERMANENT,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      "Spouse information permanent address post office deleted successfully.",
    data: result,
  });
};
