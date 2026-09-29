import { Router } from "express";
import { fatherDetailsController } from "./fatherDetails.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { fatherDetailsZodSchema } from "./fatherDetails.zod.validation.js";

const router = Router();

// CREATE FATHER DETAILS
router.post(
  "/create_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(fatherDetailsZodSchema.createFatherDetailsZodSchema),
  fatherDetailsController.createFatherDetails,
);

// CONNECT FATHER DETAILS
router.post(
  "/connect_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(fatherDetailsZodSchema.connectFatherDetailsZodSchema),
  fatherDetailsController.connectFatherDetails,
);

// DISCONNECT FATHER DETAILS
router.patch(
  "/disconnect_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(fatherDetailsZodSchema.disconnectFatherDetailsZodSchema),
  fatherDetailsController.disconnectFatherDetails,
);

// UPDATE A SINGLE FATHER DETAILS FIELD
router.patch(
  "/update_father_details_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(fatherDetailsZodSchema.updateFatherDetailsFieldZodSchema),
  fatherDetailsController.updateFatherDetailsField,
);

export const fatherDetailsRouter: Router = router;
