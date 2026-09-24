import { Router } from "express";
import { positionController } from "./position.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createPositionZodSchema, deletePositionZodSchema, getSinglePositionZodSchema, updatePositionZodSchema } from "./position.zod.validation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();
router.post(
  "/create_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(createPositionZodSchema),
  positionController.createPosition,
);

router.patch(
  "/update_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updatePositionZodSchema),
  positionController.updatePosition,
);

router.delete(
  "/delete_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(deletePositionZodSchema),
  positionController.deletePosition,
);

router.get(
  "/get_positions",
  userAuth("SUPER_ADMIN"),
  positionController.getAllPositions,
);

router.get(
  "/get_position/:id",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(getSinglePositionZodSchema),
  positionController.getSinglePosition,
);

export const positionRouter: Router = router;
