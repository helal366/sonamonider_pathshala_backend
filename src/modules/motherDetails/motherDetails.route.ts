import { Router } from "express";

import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { motherDetailsController } from "./motherDetails.controller";
import {
  connectMotherDetailsZodSchema,
  createMotherDetailsZodSchema,
  updateMotherEducationalQualificationZodSchema,
  updateMotherJobTitleZodSchema,
  updateMotherMonthlyIncomeZodSchema,
  updateMotherMobileNo1ZodSchema,
  updateMotherMobileNo2ZodSchema,
  updateMotherMobileNo3ZodSchema,
  updateMotherNameZodSchema,
  updateMotherNidZodSchema,
  updateMotherOccupationZodSchema,
} from "./motherDetails.zod.validation";

const router = Router();
const adminRoles = ["SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"] as const;

router.post(
  "/create_mother_details",
  userAuth(...adminRoles),
  validateZodSchema(createMotherDetailsZodSchema),
  motherDetailsController.createMotherDetails,
);
router.post(
  "/connect_mother_details",
  userAuth(...adminRoles),
  validateZodSchema(connectMotherDetailsZodSchema),
  motherDetailsController.connectMotherDetails,
);

const updateRoutes = [
  [
    "/update_mother_name",
    updateMotherNameZodSchema,
    motherDetailsController.updateMotherName,
  ],
  [
    "/update_mother_nid",
    updateMotherNidZodSchema,
    motherDetailsController.updateMotherNid,
  ],
  [
    "/update_mother_occupation",
    updateMotherOccupationZodSchema,
    motherDetailsController.updateMotherOccupation,
  ],
  [
    "/update_mother_job_title",
    updateMotherJobTitleZodSchema,
    motherDetailsController.updateMotherJobTitle,
  ],
  [
    "/update_mother_educational_qualification",
    updateMotherEducationalQualificationZodSchema,
    motherDetailsController.updateMotherEducationalQualification,
  ],
  [
    "/update_mother_monthly_income",
    updateMotherMonthlyIncomeZodSchema,
    motherDetailsController.updateMotherMonthlyIncome,
  ],
  [
    "/update_mother_mobile_no_1",
    updateMotherMobileNo1ZodSchema,
    motherDetailsController.updateMotherMobileNo1,
  ],
  [
    "/update_mother_mobile_no_2",
    updateMotherMobileNo2ZodSchema,
    motherDetailsController.updateMotherMobileNo2,
  ],
  [
    "/update_mother_mobile_no_3",
    updateMotherMobileNo3ZodSchema,
    motherDetailsController.updateMotherMobileNo3,
  ],
] as const;

for (const [path, schema, controller] of updateRoutes) {
  router.patch(
    path,
    userAuth(...adminRoles),
    validateZodSchema(schema),
    controller,
  );
}

export const motherDetailsRouter: Router = router;
