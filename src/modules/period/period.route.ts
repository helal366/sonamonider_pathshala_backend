import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { periodController } from "./period.controller.js";
import { periodZodSchema } from "./period.zodValidation.js";

const router = Router();

router.post(
  "/create_period",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(periodZodSchema.createPeriodZodSchema),
  periodController.createPeriod,
);

router.patch(
  "/update_period/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(periodZodSchema.updatePeriodParamsZodSchema),
  validateZodSchema(periodZodSchema.updatePeriodZodSchema),
  periodController.updatePeriod,
);

router.patch(
  "/update_single_period_field/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(periodZodSchema.updatePeriodParamsZodSchema),
  validateZodSchema(periodZodSchema.updatePeriodSingleFieldZodSchema),
  periodController.updatePeriodSingleField,
);

router.delete(
  "/delete_period/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(periodZodSchema.deletePeriodParamsZodSchema),
  periodController.deletePeriod,
);

router.get(
  "/get_periods",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  periodController.getAllPeriods,
);

router.get(
  "/get_period/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(periodZodSchema.getSinglePeriodParamsZodSchema),
  periodController.getSinglePeriod,
);

export const periodRouter: Router = router;
