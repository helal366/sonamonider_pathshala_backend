import { Router } from "express";
import { positionController } from "./position.controller.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { positionZodSchema } from "./position.zodValidation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();

// ============================================
// CREATE POSITION ROUTE
// ============================================
router.post(
  "/create_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(positionZodSchema.createPositionZodSchema),
  positionController.createPosition,
);

// ============================================
// UPDATE POSITION ROUTE
// ============================================
router.patch(
  "/update_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(positionZodSchema.updatePositionZodSchema),
  positionController.updatePosition,
);

// =============================================
// DELETE POSITION ROUTE
// =============================================
router.delete(
  "/delete_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(positionZodSchema.deletePositionZodSchema),
  positionController.deletePosition,
);

// =============================================
// GET ALL POSITIONS ROUTE
// =============================================
router.get(
  "/get_positions",
  userAuth("SUPER_ADMIN"),
  positionController.getAllPositions,
);

// =============================================
// GET SINGLE POSITION ROUTE
// =============================================
router.get(
  "/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(positionZodSchema.getSinglePositionParamsZodSchema),
  positionController.getSinglePosition,
);

export const positionRouter: Router = router;
