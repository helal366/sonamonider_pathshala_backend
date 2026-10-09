import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validateZodSchema.js";
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
  "/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(
    spouseInformationZodSchema.deleteSpouseInformationZodSchema,
  ),
  spouseInformationController.deleteSpouseInformation,
);

// ============================================================
// UPDATE SPOUSE INFORMATION FIELD ROUTE
// ============================================================
router.patch(
  "/update_spouse_information_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(
    spouseInformationZodSchema.updateSpouseInformationFieldZodSchema,
  ),
  spouseInformationController.updateSpouseInformationField,
);

export const spouseInformationRouter: Router = router;
