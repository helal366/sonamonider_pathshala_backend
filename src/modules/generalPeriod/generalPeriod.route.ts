import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { periodController } from "./generalPeriod.controller.js";
import { periodZodSchema } from "./generalPeriod.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

router.post(
  "/create_general_period",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(periodZodSchema.createPeriodZodSchema),
  periodController.createPeriod,
);

router.patch(
  "/update_general_period/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(periodZodSchema.updatePeriodParamsZodSchema),
  validateZodSchema(periodZodSchema.updatePeriodZodSchema),
  periodController.updatePeriod,
);

router.patch(
  "/update_single_general_period_field/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(periodZodSchema.updatePeriodParamsZodSchema),
  validateZodSchema(periodZodSchema.updatePeriodSingleFieldZodSchema),
  periodController.updatePeriodSingleField,
);

router.delete(
  "/delete_general_period/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(periodZodSchema.deletePeriodParamsZodSchema),
  periodController.deletePeriod,
);

router.get(
  "/get_general_periods",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  periodController.getAllPeriods,
);

router.get(
  "/get_general_period/:general_subject_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(periodZodSchema.getSinglePeriodParamsZodSchema),
  periodController.getSinglePeriod,
);

export const generalPeriodRouter: Router = router;
