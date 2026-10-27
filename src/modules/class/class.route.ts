import { Router } from "express";
import { classController } from "./class.controller";
import { userAuth } from "../../middlewares/userAuth";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { classZodSchema } from "./class.zodValidation";
import { Role } from "#db-client";

const router = Router();

// =============================================
// CREATE CLASS NAME ROUTE
// =============================================
router.post(
  "/create",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(classZodSchema.createClassZodSchema),
  classController.createClassName,
);

// =============================================
// DELETE CLASS NAME ROUTE
// =============================================
router.delete(
  "/delete/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(classZodSchema.classIdParamsZodSchema),
  classController.deleteClassName,
);

// =============================================
// UPDATE CLASS FIELD ROUTE
// =============================================
router.patch(
  "/update/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(classZodSchema.classIdParamsZodSchema),
  validateZodSchema(classZodSchema.updateClassFieldZodSchema),
  classController.updateClassField,
);

// =============================================
// GET ALL CLASS NAME ROUTE
// =============================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  classController.getAllClassNames,
);

export const classRouter: Router = router;
