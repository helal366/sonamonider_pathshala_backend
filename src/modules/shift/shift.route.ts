import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { shiftController } from "./shift.controller";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { shiftZodSchema } from "./shift.zodValidation";
import { Role } from "#db-client";

const router = Router();

// =============================================
// CREATE SHIFT ROUTE
// =============================================
router.post("/create", userAuth(Role.SUPER_ADMIN), shiftController.createShift);

// =============================================
// DELETE SHIFT ROUTE
// =============================================
router.delete(
  "/delete/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(shiftZodSchema.deleteShiftZodSchema),
  shiftController.deleteShift,
);

// =============================================
// UPDATE SHIFT FIELD ROUTE
// =============================================
router.patch(
  "/update/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(shiftZodSchema.updateShiftFieldParamsZodSchema),
  validateZodSchema(shiftZodSchema.updateShiftFieldZodSchema),
  shiftController.updateShiftField,
);

// =============================================
// GET SHIFT NAMES ROUTE
// =============================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  shiftController.getShiftNames,
);

// =============================================
// GET SINGLE SHIFT ROUTE
// =============================================
router.get(
  "/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(shiftZodSchema.getSingleShiftZodSchema),
  shiftController.getSingleShift,
);
export const shiftRouter: Router = router;
