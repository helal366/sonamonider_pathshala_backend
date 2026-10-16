import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { spouseInformationZodSchema } from "./spouseInformation.zodValidation.js";
import { spouseInformationController } from "./spouseInformation.controller.js";
import { Role } from "#db-client";

const router = Router();

// ============================================================
// CREATE SPOUSE INFORMATION ROUTE
// ============================================================
router.post(
  "/create",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(
    spouseInformationZodSchema.createSpouseInformationZodSchema,
  ),
  spouseInformationController.createSpouseInformation,
);

// ============================================================
// DELETE SPOUSE INFORMATION ROUTE
// ============================================================
router.delete(
  "/delete/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(
    spouseInformationZodSchema.spouseInformationUserIdParamsZodSchema,
  ),
  spouseInformationController.deleteSpouseInformation,
);

// ============================================================
// UPDATE SPOUSE INFORMATION FIELD ROUTE
// ============================================================
router.patch(
  "/update_spouse_information_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(
    spouseInformationZodSchema.spouseInformationUserIdParamsZodSchema,
  ),
  validateZodSchema(
    spouseInformationZodSchema.updateSpouseInformationFieldZodSchema,
  ),
  spouseInformationController.updateSpouseInformationField,
);

export const spouseInformationRouter: Router = router;
