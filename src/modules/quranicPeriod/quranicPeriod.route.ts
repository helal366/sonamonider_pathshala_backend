import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js"; // Your custom params validator
import { quranicPeriodController } from "./quranicPeriod.controller.js";
import { quranicPeriodZodSchema } from "./quranicPeriod.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

// =======================================================
// CREATE QURANIC PERIOD ROUTE
// =======================================================
router.post(
  "/create_quranic_period",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(quranicPeriodZodSchema.createQuranicPeriodZodSchema),
  quranicPeriodController.createQuranicPeriod,
);

// =========================================================
// UPDATE QURANIC PERIOD ROUTE
// =========================================================
router.patch(
  "/update_quranic_period/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(quranicPeriodZodSchema.updateQuranicPeriodParamsZodSchema),
  validateZodSchema(quranicPeriodZodSchema.updateQuranicPeriodZodSchema),
  quranicPeriodController.updateQuranicPeriod,
);

// =========================================================
// UPDATE QURANIC SINGLE FIELD ROUTE
// =========================================================
router.patch(
  "/update_quranic_single_period_field/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(
    quranicPeriodZodSchema.updateQuranicPeriodSingleFieldParamsZodSchema,
  ),
  validateZodSchema(
    quranicPeriodZodSchema.updateQuranicPeriodSingleFieldZodSchema,
  ),
  quranicPeriodController.updateQuranicPeriodSingleField,
);

// =========================================================
// DELETE QURANIC PERIOD ROUTE
// =========================================================
router.delete(
  "/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(quranicPeriodZodSchema.deleteQuranicPeriodParamsZodSchema),
  quranicPeriodController.deleteQuranicPeriod,
);

// ==========================================================
// GET ALL QURANIC PERIODS ROUTE
// ==========================================================
router.get(
  "/get_quranic_periods",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  quranicPeriodController.getAllQuranicPeriods,
);

// ==================================================================
// GET SINGLE QURANIC  PERIOD BY PATH PARAM ID ROUTE
// ==================================================================
router.get(
  "/get_quranic_period/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(
    quranicPeriodZodSchema.getSingleQuranicPeriodParamsZodSchema,
  ), // Uses your optimized params middleware helper
  quranicPeriodController.getSingleQuranicPeriod,
);

export const quranicPeriodRouter: Router = router;
