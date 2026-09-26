import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createSpouseInformationZodSchema, deleteSpouseInformationFieldZodSchema, deleteSpouseInformationZodSchema, updateSpouseContactNoZodSchema, updateSpouseFatherContactNoZodSchema, updateSpouseFatherNameZodSchema, updateSpouseJobTitleZodSchema, updateSpouseMonthlyIncomeZodSchema, updateSpouseMotherContactNoZodSchema, updateSpouseMotherNameZodSchema, updateSpouseNameZodSchema, updateSpouseOccupationZodSchema } from "./spouseInformation.zod.validation.js";
import { spouseInformationController } from "./spouseInformation.controller.js";
import { spouseInformationPatchController } from "./spouseInformation.patch.controller.js";
import { spouseInformationDeleteController } from "./spouseInformation.delete.controller.js";

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

// ============================================================
// PATCH SPOUSE CONTACT NO ROUTE
// ============================================================

router.patch(
  "/update_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseContactNoZodSchema),
  spouseInformationPatchController.updateSpouseContactNo,
);

// ============================================================
// PATCH SPOUSE FATHER NAME ROUTE
// ============================================================

router.patch(
  "/update_father_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseFatherNameZodSchema),
  spouseInformationPatchController.updateSpouseFatherName,
);

// ============================================================
// PATCH SPOUSE FATHER CONTACT NO ROUTE
// ============================================================

router.patch(
  "/update_father_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseFatherContactNoZodSchema),
  spouseInformationPatchController.updateSpouseFatherContactNo,
);

// ============================================================
// PATCH SPOUSE MOTHER NAME ROUTE
// ============================================================

router.patch(
  "/update_mother_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseMotherNameZodSchema),
  spouseInformationPatchController.updateSpouseMotherName,
);

// ============================================================
// PATCH SPOUSE MOTHER CONTACT NO ROUTE
// ============================================================

router.patch(
  "/update_mother_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseMotherContactNoZodSchema),
  spouseInformationPatchController.updateSpouseMotherContactNo,
);

// ============================================================
// PATCH SPOUSE OCCUPATION ROUTE
// ============================================================

router.patch(
  "/update_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseOccupationZodSchema),
  spouseInformationPatchController.updateSpouseOccupation,
);

// ============================================================
// PATCH SPOUSE JOB TITLE ROUTE
// ============================================================

router.patch(
  "/update_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseJobTitleZodSchema),
  spouseInformationPatchController.updateSpouseJobTitle,
);

// ============================================================
// PATCH SPOUSE MONTHLY INCOME ROUTE
// ============================================================

router.patch(
  "/update_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateSpouseMonthlyIncomeZodSchema),
  spouseInformationPatchController.updateSpouseMonthlyIncome,
);


// ============================================================
// DELETE SPOUSE CONTACT NO ROUTE
// ============================================================

router.delete(
  "/delete_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseContactNo,
);

// ============================================================
// DELETE SPOUSE FATHER NAME ROUTE
// ============================================================

router.delete(
  "/delete_father_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseFatherName,
);

// ============================================================
// DELETE SPOUSE FATHER CONTACT NO ROUTE
// ============================================================

router.delete(
  "/delete_father_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseFatherContactNo,
);

// ============================================================
// DELETE SPOUSE MOTHER NAME ROUTE
// ============================================================

router.delete(
  "/delete_mother_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseMotherName,
);

// ============================================================
// DELETE SPOUSE MOTHER CONTACT NO ROUTE
// ============================================================

router.delete(
  "/delete_mother_contact_no",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseMotherContactNo,
);

// ============================================================
// DELETE SPOUSE OCCUPATION ROUTE
// ============================================================

router.delete(
  "/delete_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseOccupation,
);

// ============================================================
// DELETE SPOUSE JOB TITLE ROUTE
// ============================================================

router.delete(
  "/delete_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseJobTitle,
);

// ============================================================
// DELETE SPOUSE MONTHLY INCOME ROUTE
// ============================================================

router.delete(
  "/delete_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteSpouseInformationFieldZodSchema),
  spouseInformationDeleteController.deleteSpouseMonthlyIncome,
);


