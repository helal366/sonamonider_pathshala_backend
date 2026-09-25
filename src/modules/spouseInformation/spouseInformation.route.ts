import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { createSpouseInformationZodSchema, deleteSpouseInformationZodSchema, updateSpouseNameZodSchema } from "./spouseInformation.zod.validation";
import { spouseInformationController } from "./spouseInformation.controller";
import { spouseInformationPatchController } from "./spouseInformation.patch.controller";

const router = Router();

// ============================================================
// CREATE SPOUSE INFORMATION ROUTE
// ============================================================
router.post(
  "/create",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createSpouseInformationZodSchema),
  spouseInformationController.createSpouseInformation,
);


// ============================================================
// DELETE SPOUSE INFORMATION ROUTE
// ============================================================
router.delete(
  "/delete",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationZodSchema),
  spouseInformationController.deleteSpouseInformation,
);
export const spouseInformationRouter: Router = router;

// ============================================================
// PATCH SPOUSE FULL NAME ROUTE
// ============================================================
router.patch(
    "/update_full_name",
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(updateSpouseNameZodSchema),
    spouseInformationPatchController.updateSpouseName
)
