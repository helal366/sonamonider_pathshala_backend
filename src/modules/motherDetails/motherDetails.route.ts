import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { motherDetailsController } from "./motherDetails.controller";
import { motherDetailsDeleteController } from "./motherDetails.delete.controller";

import {
  connectMotherDetailsZodSchema,
  createMotherDetailsZodSchema,
  disconnectMotherDetailsZodSchema,
  updateMotherEducationalQualificationZodSchema,
  updateMotherJobTitleZodSchema,
  updateMotherMonthlyIncomeZodSchema,
  updateMotherNameZodSchema,
  updateMotherNidZodSchema,
  updateMotherOccupationZodSchema,
  updateMotherMobileNo1ZodSchema,
  updateMotherMobileNo2ZodSchema,
  updateMotherMobileNo3ZodSchema,
} from "./motherDetails.zod.validation";
import { motherDetailsPatchController } from "./motherDetails.patch.controller";

const router = Router();

// ============================================================
// CREATE MOTHER DETAILS
// ============================================================
router.post(
  "/create_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createMotherDetailsZodSchema),
  motherDetailsController.createMotherDetails,
);

// ============================================================
// CONNECT MOTHER DETAILS
// ============================================================
router.post(
  "/connect_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(connectMotherDetailsZodSchema),
  motherDetailsController.connectMotherDetails,
);

// ============================================================
// PATCH MOTHER NAME
// ============================================================
router.patch(
  "/update_mother_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherNameZodSchema),
  motherDetailsPatchController.updateMotherName,
);

// ============================================================
// PATCH MOTHER NID
// ============================================================

router.patch(
  "/update_mother_nid",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherNidZodSchema),
  motherDetailsPatchController.updateMotherNid,
);

// ============================================================
// PATCH MOTHER OCCUPATION
// ============================================================

router.patch(
  "/update_mother_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherOccupationZodSchema),
  motherDetailsPatchController.updateMotherOccupation,
);

// ============================================================
// PATCH MOTHER JOB TITLE
// ============================================================

router.patch(
  "/update_mother_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherJobTitleZodSchema),
  motherDetailsPatchController.updateMotherJobTitle,
);

// ============================================================
// PATCH MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

router.patch(
  "/update_mother_educational_qualification",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherEducationalQualificationZodSchema),
  motherDetailsPatchController.updateMotherEducationalQualification,
);

// ============================================================
// PATCH MOTHER MONTHLY INCOME
// ============================================================

router.patch(
  "/update_mother_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherMonthlyIncomeZodSchema),
  motherDetailsPatchController.updateMotherMonthlyIncome,
);

// ============================================================
// PATCH MOTHER MOBILE NO 1
// ============================================================

router.patch(
  "/update_mother_mobile_no_1",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherMobileNo1ZodSchema),
  motherDetailsPatchController.updateMotherMobileNo1,
);

// ============================================================
// PATCH MOTHER MOBILE NO 2
// ============================================================

router.patch(
  "/update_mother_mobile_no_2",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherMobileNo2ZodSchema),
  motherDetailsPatchController.updateMotherMobileNo2,
);

// ============================================================
// PATCH MOTHER MOBILE NO 3
// ============================================================

router.patch(
  "/update_mother_mobile_no_3",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateMotherMobileNo3ZodSchema),
  motherDetailsPatchController.updateMotherMobileNo3,
);

// ============================================================
// DELETE MOTHER NID
// ============================================================

router.delete(
  "/delete_mother_nid",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherNid,
);

// ============================================================
// DELETE MOTHER OCCUPATION
// ============================================================

router.delete(
  "/delete_mother_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherOccupation,
);

// ============================================================
// DELETE MOTHER JOB TITLE
// ============================================================

router.delete(
  "/delete_mother_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherJobTitle,
);

// ============================================================
// DELETE MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

router.delete(
  "/delete_mother_educational_qualification",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherEducationalQualification,
);

// ============================================================
// DELETE MOTHER MONTHLY INCOME
// ============================================================

router.delete(
  "/delete_mother_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherMonthlyIncome,
);

// ============================================================
// DELETE MOTHER MOBILE NO 1
// ============================================================

router.delete(
  "/delete_mother_mobile_no_1",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherMobileNo1,
);

// ============================================================
// DELETE MOTHER MOBILE NO 2
// ============================================================

router.delete(
  "/delete_mother_mobile_no_2",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherMobileNo2,
);

// ============================================================
// DELETE MOTHER MOBILE NO 3
// ============================================================

router.delete(
  "/delete_mother_mobile_no_3",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsDeleteController.deleteMotherMobileNo3,
);

// ============================================================
// DISCONNECT MOTHER DETAILS
// ============================================================

router.delete(
  "/disconnect_mother_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectMotherDetailsZodSchema),
  motherDetailsController.disconnectMotherDetails,
);

export const motherDetailsRouter:Router = router;


// import { Router } from "express";

// import { userAuth } from "../../middlewares/userAuth";
// import { validateZodSchema } from "../../middlewares/validate.zod.schema";
// import { motherDetailsController } from "./motherDetails.controller";
// import {
//   connectMotherDetailsZodSchema,
//   createMotherDetailsZodSchema,
//   updateMotherEducationalQualificationZodSchema,
//   updateMotherJobTitleZodSchema,
//   updateMotherMonthlyIncomeZodSchema,
//   updateMotherMobileNo1ZodSchema,
//   updateMotherMobileNo2ZodSchema,
//   updateMotherMobileNo3ZodSchema,
//   updateMotherNameZodSchema,
//   updateMotherNidZodSchema,
//   updateMotherOccupationZodSchema,
// } from "./motherDetails.zod.validation";

// const router = Router();
// const adminRoles = ["SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"] as const;

// router.post(
//   "/create_mother_details",
//   userAuth(...adminRoles),
//   validateZodSchema(createMotherDetailsZodSchema),
//   motherDetailsController.createMotherDetails,
// );
// router.post(
//   "/connect_mother_details",
//   userAuth(...adminRoles),
//   validateZodSchema(connectMotherDetailsZodSchema),
//   motherDetailsController.connectMotherDetails,
// );

// const updateRoutes = [
//   [
//     "/update_mother_name",
//     updateMotherNameZodSchema,
//     motherDetailsController.updateMotherName,
//   ],
//   [
//     "/update_mother_nid",
//     updateMotherNidZodSchema,
//     motherDetailsController.updateMotherNid,
//   ],
//   [
//     "/update_mother_occupation",
//     updateMotherOccupationZodSchema,
//     motherDetailsController.updateMotherOccupation,
//   ],
//   [
//     "/update_mother_job_title",
//     updateMotherJobTitleZodSchema,
//     motherDetailsController.updateMotherJobTitle,
//   ],
//   [
//     "/update_mother_educational_qualification",
//     updateMotherEducationalQualificationZodSchema,
//     motherDetailsController.updateMotherEducationalQualification,
//   ],
//   [
//     "/update_mother_monthly_income",
//     updateMotherMonthlyIncomeZodSchema,
//     motherDetailsController.updateMotherMonthlyIncome,
//   ],
//   [
//     "/update_mother_mobile_no_1",
//     updateMotherMobileNo1ZodSchema,
//     motherDetailsController.updateMotherMobileNo1,
//   ],
//   [
//     "/update_mother_mobile_no_2",
//     updateMotherMobileNo2ZodSchema,
//     motherDetailsController.updateMotherMobileNo2,
//   ],
//   [
//     "/update_mother_mobile_no_3",
//     updateMotherMobileNo3ZodSchema,
//     motherDetailsController.updateMotherMobileNo3,
//   ],
// ] as const;

// for (const [path, schema, controller] of updateRoutes) {
//   router.patch(
//     path,
//     userAuth(...adminRoles),
//     validateZodSchema(schema),
//     controller,
//   );
// }

// export const motherDetailsRouter: Router = router;
