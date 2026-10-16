import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { motherDetailsController } from "./motherDetails.controller.js";
import { motherDetailsZodSchema } from "./motherDetails.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

// ============================================================
// CREATE MOTHER DETAILS
// ============================================================
router.post(
  "/create_mother_details",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(motherDetailsZodSchema.createMotherDetailsZodSchema),
  motherDetailsController.createMotherDetails,
);

// ============================================================
// CONNECT MOTHER DETAILS
// ============================================================
router.post(
  "/connect_mother_details",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(motherDetailsZodSchema.connectMotherDetailsZodSchema),
  motherDetailsController.connectMotherDetails,
);

// UPDATE A MOTHER DETAILS FIELD
router.patch(
  "/update_mother_details_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(motherDetailsZodSchema.motherDetailsUserIdParamsZodSchema),
  validateZodSchema(motherDetailsZodSchema.updateMotherDetailsFieldZodSchema),
  motherDetailsController.updateMotherDetailsField,
);

// DISCONNECT THE USER FROM MOTHER DETAILS
router.patch(
  "/disconnect_mother_details/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(motherDetailsZodSchema.motherDetailsUserIdParamsZodSchema),
  motherDetailsController.disconnectMotherDetails,
);

export const motherDetailsRouter: Router = router;
