import { Router } from "express";

import {
  createAddressZodSchema,
  deleteAddressFieldZodSchema,
  deleteAddressZodSchema,
  updateAddressFieldZodSchema,
} from "../address.zod.validation";

import {
  createSpouseInformationPresentAddress,
  deleteSpouseInformationPresentAddress,
  updateSpouseInformationPresentAddressHouseNo,
  updateSpouseInformationPresentAddressHouseName,
  updateSpouseInformationPresentAddressPlotNo,
  updateSpouseInformationPresentAddressRoadNo,
  updateSpouseInformationPresentAddressNeighbourhood,
  updateSpouseInformationPresentAddressRegion,
  updateSpouseInformationPresentAddressVillage,
  updateSpouseInformationPresentAddressPostCode,
  updateSpouseInformationPresentAddressPostOffice,
  updateSpouseInformationPresentAddressThana,
  updateSpouseInformationPresentAddressDistrict,
  updateSpouseInformationPresentAddressCountry,
  deleteSpouseInformationPresentAddressHouseNo,
  deleteSpouseInformationPresentAddressHouseName,
  deleteSpouseInformationPresentAddressPlotNo,
  deleteSpouseInformationPresentAddressRoadNo,
  deleteSpouseInformationPresentAddressNeighbourhood,
  deleteSpouseInformationPresentAddressRegion,
  deleteSpouseInformationPresentAddressVillage,
  deleteSpouseInformationPresentAddressPostCode,
  deleteSpouseInformationPresentAddressPostOffice,

  createSpouseInformationPermanentAddress,
  deleteSpouseInformationPermanentAddress,
  updateSpouseInformationPermanentAddressHouseNo,
  updateSpouseInformationPermanentAddressHouseName,
  updateSpouseInformationPermanentAddressPlotNo,
  updateSpouseInformationPermanentAddressRoadNo,
  updateSpouseInformationPermanentAddressNeighbourhood,
  updateSpouseInformationPermanentAddressRegion,
  updateSpouseInformationPermanentAddressVillage,
  updateSpouseInformationPermanentAddressPostCode,
  updateSpouseInformationPermanentAddressPostOffice,
  updateSpouseInformationPermanentAddressThana,
  updateSpouseInformationPermanentAddressDistrict,
  updateSpouseInformationPermanentAddressCountry,
  deleteSpouseInformationPermanentAddressHouseNo,
  deleteSpouseInformationPermanentAddressHouseName,
  deleteSpouseInformationPermanentAddressPlotNo,
  deleteSpouseInformationPermanentAddressRoadNo,
  deleteSpouseInformationPermanentAddressNeighbourhood,
  deleteSpouseInformationPermanentAddressRegion,
  deleteSpouseInformationPermanentAddressVillage,
  deleteSpouseInformationPermanentAddressPostCode,
  deleteSpouseInformationPermanentAddressPostOffice,
} from "./spouseInformation.address.controller";

import { userAuth } from "../../../middlewares/userAuth";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema";

const router = Router();

// ============================================================
// SPOUSE INFORMATION PRESENT ADDRESS
// ============================================================

// Create
router.post(
  "/present_address/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createAddressZodSchema),
  createSpouseInformationPresentAddress,
);

// Delete complete address
router.delete(
  "/present_address/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressZodSchema),
  deleteSpouseInformationPresentAddress,
);

// Update single field
router.patch(
  "/present_address/update_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressHouseNo,
);

router.patch(
  "/present_address/update_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressHouseName,
);

router.patch(
  "/present_address/update_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressPlotNo,
);

router.patch(
  "/present_address/update_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressRoadNo,
);

router.patch(
  "/present_address/update_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressNeighbourhood,
);

router.patch(
  "/present_address/update_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressRegion,
);

router.patch(
  "/present_address/update_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressVillage,
);

router.patch(
  "/present_address/update_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressPostCode,
);

router.patch(
  "/present_address/update_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressPostOffice,
);

router.patch(
  "/present_address/update_thana",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressThana,
);

router.patch(
  "/present_address/update_district",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressDistrict,
);

router.patch(
  "/present_address/update_country",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPresentAddressCountry,
);

// Delete single field
router.delete(
  "/present_address/delete_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressHouseNo,
);

router.delete(
  "/present_address/delete_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressHouseName,
);

router.delete(
  "/present_address/delete_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressPlotNo,
);

router.delete(
  "/present_address/delete_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressRoadNo,
);

router.delete(
  "/present_address/delete_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressNeighbourhood,
);

router.delete(
  "/present_address/delete_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressRegion,
);

router.delete(
  "/present_address/delete_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressVillage,
);

router.delete(
  "/present_address/delete_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressPostCode,
);

router.delete(
  "/present_address/delete_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPresentAddressPostOffice,
);

// ============================================================
// SPOUSE INFORMATION PERMANENT ADDRESS
// ============================================================

// Create
router.post(
  "/permanent_address/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createAddressZodSchema),
  createSpouseInformationPermanentAddress,
);

// Delete complete address
router.delete(
  "/permanent_address/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressZodSchema),
  deleteSpouseInformationPermanentAddress,
);

// Update single field
router.patch(
  "/permanent_address/update_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressHouseNo,
);

router.patch(
  "/permanent_address/update_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressHouseName,
);

router.patch(
  "/permanent_address/update_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressPlotNo,
);

router.patch(
  "/permanent_address/update_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressRoadNo,
);

router.patch(
  "/permanent_address/update_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressNeighbourhood,
);

router.patch(
  "/permanent_address/update_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressRegion,
);

router.patch(
  "/permanent_address/update_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressVillage,
);

router.patch(
  "/permanent_address/update_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressPostCode,
);

router.patch(
  "/permanent_address/update_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressPostOffice,
);

router.patch(
  "/permanent_address/update_thana",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressThana,
);

router.patch(
  "/permanent_address/update_district",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressDistrict,
);

router.patch(
  "/permanent_address/update_country",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateAddressFieldZodSchema),
  updateSpouseInformationPermanentAddressCountry,
);

// Delete single field
router.delete(
  "/permanent_address/delete_house_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressHouseNo,
);

router.delete(
  "/permanent_address/delete_house_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressHouseName,
);

router.delete(
  "/permanent_address/delete_plot_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressPlotNo,
);

router.delete(
  "/permanent_address/delete_road_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressRoadNo,
);

router.delete(
  "/permanent_address/delete_neighbourhood",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressNeighbourhood,
);

router.delete(
  "/permanent_address/delete_region",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressRegion,
);

router.delete(
  "/permanent_address/delete_village",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressVillage,
);

router.delete(
  "/permanent_address/delete_post_code",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressPostCode,
);

router.delete(
  "/permanent_address/delete_post_office",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteAddressFieldZodSchema),
  deleteSpouseInformationPermanentAddressPostOffice,
);

export const spouseInformationAddressRouter:Router = router;