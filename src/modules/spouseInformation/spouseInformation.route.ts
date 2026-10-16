import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { spouseInformationZodSchema } from "./spouseInformation.zodValidation.js";
import { spouseInformationController } from "./spouseInformation.controller.js";

const router = Router();

// ============================================================
// CREATE SPOUSE INFORMATION ROUTE
// ============================================================
router.post(
  "/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
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
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
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
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodParams(
    spouseInformationZodSchema.spouseInformationUserIdParamsZodSchema,
  ),
  validateZodSchema(
    spouseInformationZodSchema.updateSpouseInformationFieldZodSchema,
  ),
  spouseInformationController.updateSpouseInformationField,
);

export const spouseInformationRouter: Router = router;
