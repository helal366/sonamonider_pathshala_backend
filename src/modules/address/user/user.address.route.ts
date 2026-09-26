import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import {
  createAddressZodSchema,
  deleteAddressFieldZodSchema,
  deleteAddressZodSchema,
  updateAddressFieldZodSchema,
} from "../address.zod.validation.js";

import {
  createUserPresentAddress,
  deleteUserPresentAddress,
  updateUserPresentAddressHouseNo,
  updateUserPresentAddressHouseName,
  updateUserPresentAddressPlotNo,
  updateUserPresentAddressRoadNo,
  updateUserPresentAddressNeighbourhood,
  updateUserPresentAddressRegion,
  updateUserPresentAddressVillage,
  updateUserPresentAddressPostCode,
  updateUserPresentAddressPostOffice,
  updateUserPresentAddressThana,
  updateUserPresentAddressDistrict,
  updateUserPresentAddressCountry,
  deleteUserPresentAddressHouseNo,
  deleteUserPresentAddressHouseName,
  deleteUserPresentAddressPlotNo,
  deleteUserPresentAddressNeighbourhood,
  deleteUserPresentAddressRegion,
  deleteUserPresentAddressVillage,
  deleteUserPresentAddressPostCode,
  deleteUserPresentAddressPostOffice,
  createUserPermanentAddress,
  deleteUserPermanentAddress,
  updateUserPermanentAddressHouseNo,
  updateUserPermanentAddressHouseName,
  updateUserPermanentAddressPlotNo,
  updateUserPermanentAddressRoadNo,
  updateUserPermanentAddressNeighbourhood,
  updateUserPermanentAddressRegion,
  updateUserPermanentAddressVillage,
  updateUserPermanentAddressPostCode,
  updateUserPermanentAddressPostOffice,
  updateUserPermanentAddressThana,
  updateUserPermanentAddressDistrict,
  updateUserPermanentAddressCountry,
  deleteUserPermanentAddressHouseNo,
  deleteUserPermanentAddressHouseName,
  deleteUserPermanentAddressPlotNo,
  deleteUserPermanentAddressRoadNo,
  deleteUserPermanentAddressNeighbourhood,
  deleteUserPermanentAddressRegion,
  deleteUserPermanentAddressVillage,
  deleteUserPermanentAddressPostCode,
  deleteUserPermanentAddressPostOffice,
} from "./user.address.controller.js";



const router = Router();


// ============================================================
// PRESENT ADDRESS
// ============================================================

// ------------------------------------------------------------
// CREATE PRESENT ADDRESS
// ------------------------------------------------------------

router.post(
  "/present_address/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createAddressZodSchema),
  createUserPresentAddress
);


// ------------------------------------------------------------
// DELETE COMPLETE PRESENT ADDRESS
// ------------------------------------------------------------

router.delete(
  "/present_address/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressZodSchema),
  deleteUserPresentAddress
);


// ------------------------------------------------------------
// UPDATE PRESENT ADDRESS - SINGLE FIELD
// ------------------------------------------------------------

router.patch(
  "/present_address/update_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressHouseNo
);

router.patch(
  "/present_address/update_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressHouseName
);

router.patch(
  "/present_address/update_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressPlotNo
);

router.patch(
  "/present_address/update_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressRoadNo
);

router.patch(
  "/present_address/update_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressNeighbourhood
);

router.patch(
  "/present_address/update_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressRegion
);

router.patch(
  "/present_address/update_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressVillage
);

router.patch(
  "/present_address/update_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressPostCode
);

router.patch(
  "/present_address/update_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressPostOffice
);

router.patch(
  "/present_address/update_thana",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressThana
);

router.patch(
  "/present_address/update_district",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressDistrict
);

router.patch(
  "/present_address/update_country",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPresentAddressCountry
);


// ------------------------------------------------------------
// DELETE PRESENT ADDRESS - SINGLE FIELD
// ------------------------------------------------------------

router.delete(
  "/present_address/delete_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressHouseNo
);

router.delete(
  "/present_address/delete_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressHouseName
);

router.delete(
  "/present_address/delete_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressPlotNo
);

router.delete(
  "/present_address/delete_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressNeighbourhood
);

router.delete(
  "/present_address/delete_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressNeighbourhood
);

router.delete(
  "/present_address/delete_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressRegion
);

router.delete(
  "/present_address/delete_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressVillage
);

router.delete(
  "/present_address/delete_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressPostCode
);

router.delete(
  "/present_address/delete_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPresentAddressPostOffice
);


// ============================================================
// PERMANENT ADDRESS
// ============================================================

// ------------------------------------------------------------
// CREATE PERMANENT ADDRESS
// ------------------------------------------------------------

router.post(
  "/permanent_address/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createAddressZodSchema),
  createUserPermanentAddress
);


// ------------------------------------------------------------
// DELETE COMPLETE PERMANENT ADDRESS
// ------------------------------------------------------------

router.delete(
  "/permanent_address/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressZodSchema),
  deleteUserPermanentAddress
);


// ------------------------------------------------------------
// UPDATE PERMANENT ADDRESS - SINGLE FIELD
// ------------------------------------------------------------

router.patch(
  "/permanent_address/update_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressHouseNo
);

router.patch(
  "/permanent_address/update_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressHouseName
);

router.patch(
  "/permanent_address/update_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressPlotNo
);

router.patch(
  "/permanent_address/update_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressRoadNo
);

router.patch(
  "/permanent_address/update_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressNeighbourhood
);

router.patch(
  "/permanent_address/update_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressRegion
);

router.patch(
  "/permanent_address/update_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressVillage
);

router.patch(
  "/permanent_address/update_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressPostCode
);

router.patch(
  "/permanent_address/update_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressPostOffice
);

router.patch(
  "/permanent_address/update_thana",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressThana
);

router.patch(
  "/permanent_address/update_district",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressDistrict
);

router.patch(
  "/permanent_address/update_country",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateUserPermanentAddressCountry
);


// ------------------------------------------------------------
// DELETE PERMANENT ADDRESS - SINGLE FIELD
// ------------------------------------------------------------

router.delete(
  "/permanent_address/delete_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressHouseNo
);

router.delete(
  "/permanent_address/delete_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressHouseName
);

router.delete(
  "/permanent_address/delete_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressPlotNo
);

router.delete(
  "/permanent_address/delete_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressRoadNo
);

router.delete(
  "/permanent_address/delete_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressNeighbourhood
);

router.delete(
  "/permanent_address/delete_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressRegion
);

router.delete(
  "/permanent_address/delete_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressVillage
);

router.delete(
  "/permanent_address/delete_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressPostCode
);

router.delete(
  "/permanent_address/delete_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteUserPermanentAddressPostOffice
);


export const userAddressRouter:Router = router;