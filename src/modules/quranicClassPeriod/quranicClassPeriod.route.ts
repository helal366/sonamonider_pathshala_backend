import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";// Your custom params validator
import { quranicClassPeriodController } from "./quranicClassPeriod.controller.js";
import {
  createQuranicClassPeriodZodSchema,
  deleteQuranicClassPeriodZodSchema,
  getSingleQuranicClassPeriodZodSchema,
  updateQuranicClassPeriodZodSchema,
} from "./quranicClassPeriod.zodValidation.js";

const router = Router();

// CREATE QURANIC CLASS PERIOD
router.post(
  "/create_quranic_class_period",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(createQuranicClassPeriodZodSchema),
  quranicClassPeriodController.createQuranicClassPeriod,
);

// UPDATE QURANIC CLASS PERIOD
router.patch(
  "/update_quranic_class_period",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(updateQuranicClassPeriodZodSchema),
  quranicClassPeriodController.updateQuranicClassPeriod,
);

// DELETE QURANIC CLASS PERIOD
router.delete(
  "/delete_quranic_class_period",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(deleteQuranicClassPeriodZodSchema),
  quranicClassPeriodController.deleteQuranicClassPeriod,
);

// GET ALL QURANIC CLASS PERIODS
router.get(
  "/get_quranic_class_periods",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  quranicClassPeriodController.getAllQuranicClassPeriods,
);

// GET SINGLE QURANIC CLASS PERIOD BY PATH PARAM ID
router.get(
  "/get_quranic_class_period/:quranic_class_period_id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(getSingleQuranicClassPeriodZodSchema), // Uses your optimized params middleware helper
  quranicClassPeriodController.getSingleQuranicClassPeriod,
);

export const quranicClassPeriodRouter: Router = router;
