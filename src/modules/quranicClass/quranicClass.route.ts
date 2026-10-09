import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";// Your custom params validator
import { quranicClassController } from "./quranicClass.controller.js";
import { quranicClassZodSchema } from "./quranicClass.zodValidation.js";

const router = Router();

// CREATE QURANIC CLASS
router.post(
  "/create_quranic_class",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(quranicClassZodSchema.createQuranicClassZodSchema),
  quranicClassController.createQuranicClass,
);

// UPDATE QURANIC CLASS
router.patch(
  "/update_quranic_class",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(quranicClassZodSchema.updateQuranicClassZodSchema),
  quranicClassController.updateQuranicClass,
);

// DELETE QURANIC CLASS
router.delete(
  "/delete_quranic_class",
  userAuth("SUPER_ADMIN", "ADMIN"),
  validateZodSchema(quranicClassZodSchema.deleteQuranicClassZodSchema),
  quranicClassController.deleteQuranicClass,
);

// GET ALL QURANIC CLASSES
router.get(
  "/get_quranic_classes",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  quranicClassController.getAllQuranicClasses,
);

// GET SINGLE QURANIC CLASS BY PATH PARAM ID
router.get(
  "/get_quranic_class/:quranic_class_id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(quranicClassZodSchema.getSingleQuranicClassZodSchema), // Uses your optimized params middleware helper
  quranicClassController.getSingleQuranicClass,
);

export const quranicClassRouter: Router = router;
