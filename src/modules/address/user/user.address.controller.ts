import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import {
  AddressOwnerType,
  AddressType,
} from "../address.interface.js";

import {
  createAddress,
  deleteAddress,
  updateAddressField,
  deleteAddressField,
} from "../address.service.js";

import { sendResponse } from "../../../utils/sendResponse.js";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions.js";


// ============================================================
// PRESENT ADDRESS
// ============================================================

// ------------------------------------------------------------
// CREATE PRESENT ADDRESS
// ------------------------------------------------------------

export const createUserPresentAddress = async (
  req: Request,
  res: Response
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
    message: "User present address created successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE COMPLETE PRESENT ADDRESS
// ------------------------------------------------------------

export const deleteUserPresentAddress = async (
  req: Request,
  res: Response
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
    message: "User present address deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - HOUSE NO
// ------------------------------------------------------------

export const updateUserPresentAddressHouseNo = async (
  req: Request,
  res: Response
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
    message: "User present address house number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - HOUSE NAME
// ------------------------------------------------------------

export const updateUserPresentAddressHouseName = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "house_name",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address house name updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - PLOT NO
// ------------------------------------------------------------

export const updateUserPresentAddressPlotNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "plot_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address plot number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - ROAD NO
// ------------------------------------------------------------

export const updateUserPresentAddressRoadNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "road_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address road number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - NEIGHBOURHOOD
// ------------------------------------------------------------

export const updateUserPresentAddressNeighbourhood = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "neighbourhood",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address neighbourhood updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - REGION
// ------------------------------------------------------------

export const updateUserPresentAddressRegion = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "region",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address region updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - VILLAGE
// ------------------------------------------------------------

export const updateUserPresentAddressVillage = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "village",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address village updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - POST CODE
// ------------------------------------------------------------

export const updateUserPresentAddressPostCode = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "post_code",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address post code updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - POST OFFICE
// ------------------------------------------------------------

export const updateUserPresentAddressPostOffice = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "post_office",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address post office updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - THANA
// ------------------------------------------------------------

export const updateUserPresentAddressThana = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "thana",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address thana updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - DISTRICT
// ------------------------------------------------------------

export const updateUserPresentAddressDistrict = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "district",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address district updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - COUNTRY
// ------------------------------------------------------------

export const updateUserPresentAddressCountry = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "country",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address country updated successfully.",
    data: result,
  });
};


// ============================================================
// DELETE PRESENT ADDRESS - SINGLE FIELD
// ============================================================

// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - HOUSE NO
// ------------------------------------------------------------

export const deleteUserPresentAddressHouseNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "house_no",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address house number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - HOUSE NAME
// ------------------------------------------------------------

export const deleteUserPresentAddressHouseName = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "house_name",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address house name deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - PLOT NO
// ------------------------------------------------------------

export const deleteUserPresentAddressPlotNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "plot_no",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address plot number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - ROAD NO
// ------------------------------------------------------------

export const deleteUserPresentAddressRoadNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "road_no",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address road number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - NEIGHBOURHOOD
// ------------------------------------------------------------

export const deleteUserPresentAddressNeighbourhood = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "neighbourhood",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address neighbourhood deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - REGION
// ------------------------------------------------------------

export const deleteUserPresentAddressRegion = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "region",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address region deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - VILLAGE
// ------------------------------------------------------------

export const deleteUserPresentAddressVillage = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "village",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address village deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - POST CODE
// ------------------------------------------------------------

export const deleteUserPresentAddressPostCode = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "post_code",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address post code deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - POST OFFICE
// ------------------------------------------------------------

export const deleteUserPresentAddressPostOffice = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "post_office",
    AddressOwnerType.USER,
    AddressType.PRESENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User present address post office deleted successfully.",
    data: result,
  });
};


// ============================================================
// PERMANENT ADDRESS
// ============================================================

// ------------------------------------------------------------
// CREATE PERMANENT ADDRESS
// ------------------------------------------------------------

export const createUserPermanentAddress = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await createAddress(
    req.body.required_id,
    req.body,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User permanent address created successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE COMPLETE PERMANENT ADDRESS
// ------------------------------------------------------------

export const deleteUserPermanentAddress = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddress(
    req.body.required_id,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address deleted successfully.",
    data: result,
  });
};


// ============================================================
// UPDATE PERMANENT ADDRESS - SINGLE FIELD
// ============================================================

// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - HOUSE NO
// ------------------------------------------------------------

export const updateUserPermanentAddressHouseNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "house_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address house number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - HOUSE NAME
// ------------------------------------------------------------

export const updateUserPermanentAddressHouseName = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "house_name",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address house name updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - PLOT NO
// ------------------------------------------------------------

export const updateUserPermanentAddressPlotNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "plot_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address plot number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - ROAD NO
// ------------------------------------------------------------

export const updateUserPermanentAddressRoadNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "road_no",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address road number updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - NEIGHBOURHOOD
// ------------------------------------------------------------

export const updateUserPermanentAddressNeighbourhood = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "neighbourhood",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address neighbourhood updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - REGION
// ------------------------------------------------------------

export const updateUserPermanentAddressRegion = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "region",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address region updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - VILLAGE
// ------------------------------------------------------------

export const updateUserPermanentAddressVillage = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "village",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address village updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - POST CODE
// ------------------------------------------------------------

export const updateUserPermanentAddressPostCode = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "post_code",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address post code updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - POST OFFICE
// ------------------------------------------------------------

export const updateUserPermanentAddressPostOffice = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "post_office",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address post office updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - THANA
// ------------------------------------------------------------

export const updateUserPermanentAddressThana = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "thana",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address thana updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - DISTRICT
// ------------------------------------------------------------

export const updateUserPermanentAddressDistrict = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "district",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address district updated successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - COUNTRY
// ------------------------------------------------------------

export const updateUserPermanentAddressCountry = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await updateAddressField(
    req.body.required_id,
    "country",
    req.body.value,
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address country updated successfully.",
    data: result,
  });
};


// ============================================================
// DELETE PERMANENT ADDRESS - SINGLE FIELD
// ============================================================

// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - HOUSE NO
// ------------------------------------------------------------

export const deleteUserPermanentAddressHouseNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "house_no",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address house number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - HOUSE NAME
// ------------------------------------------------------------

export const deleteUserPermanentAddressHouseName = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "house_name",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address house name deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - PLOT NO
// ------------------------------------------------------------

export const deleteUserPermanentAddressPlotNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "plot_no",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address plot number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - ROAD NO
// ------------------------------------------------------------

export const deleteUserPermanentAddressRoadNo = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "road_no",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address road number deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - NEIGHBOURHOOD
// ------------------------------------------------------------

export const deleteUserPermanentAddressNeighbourhood = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "neighbourhood",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address neighbourhood deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - REGION
// ------------------------------------------------------------

export const deleteUserPermanentAddressRegion = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "region",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address region deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - VILLAGE
// ------------------------------------------------------------

export const deleteUserPermanentAddressVillage = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "village",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address village deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - POST CODE
// ------------------------------------------------------------

export const deleteUserPermanentAddressPostCode = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "post_code",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address post code deleted successfully.",
    data: result,
  });
};


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - POST OFFICE
// ------------------------------------------------------------

export const deleteUserPermanentAddressPostOffice = async (
  req: Request,
  res: Response
) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const result = await deleteAddressField(
    req.body.required_id,
    "post_office",
    AddressOwnerType.USER,
    AddressType.PERMANENT,
    loggedInUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User permanent address post office deleted successfully.",
    data: result,
  });
};