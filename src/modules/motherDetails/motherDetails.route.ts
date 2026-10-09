import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { motherDetailsController } from "./motherDetails.controller.js";
import { motherDetailsZodSchema } from "./motherDetails.zodValidation.js";

const router = Router();

// ============================================================
// CREATE MOTHER DETAILS
// ============================================================
router.post(
  "/create_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(motherDetailsZodSchema.createMotherDetailsZodSchema),
  motherDetailsController.createMotherDetails,
);

// ============================================================
// CONNECT MOTHER DETAILS
// ============================================================
router.post(
  "/connect_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(motherDetailsZodSchema.connectMotherDetailsZodSchema),
  motherDetailsController.connectMotherDetails,
);

// UPDATE A MOTHER DETAILS FIELD
router.patch(
  "/update_mother_details_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(motherDetailsZodSchema.updateMotherDetailsFieldZodSchema),
  motherDetailsController.updateMotherDetailsField,
);

// DISCONNECT THE USER FROM MOTHER DETAILS
router.patch(
  "/disconnect_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(motherDetailsZodSchema.disconnectMotherDetailsZodSchema),
  motherDetailsController.disconnectMotherDetails,
);

export const motherDetailsRouter: Router = router;
