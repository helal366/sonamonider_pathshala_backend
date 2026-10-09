import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { shiftController } from "./shift.controller";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { shiftZodSchema } from "./shift.zodValidation";

const router = Router();

// =============================================
// CREATE SHIFT ROUTE
// =============================================
router.post("/create", userAuth("SUPER_ADMIN"), shiftController.createShift);

// =============================================
// DELETE SHIFT ROUTE
// =============================================
router.delete(
  "/delete/:id",
  userAuth("SUPER_ADMIN"),
  shiftController.deleteShift,
);

// =============================================
// UPDATE SHIFT FIELD ROUTE
// =============================================
router.patch(
  "/update/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(shiftZodSchema.updateShiftFieldParamsZodSchema),
  validateZodSchema(shiftZodSchema.updateShiftFieldZodSchema),
  shiftController.updateShiftField,
);

// =============================================
// GET SHIFT NAMES ROUTE
// =============================================
router.get(
  "/",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  shiftController.getShiftNames,
);

export const shiftRouter: Router = router;
