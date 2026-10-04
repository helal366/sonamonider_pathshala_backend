import { Router } from "express";
import { classController } from "./class.controller";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { classZodSchema } from "./class.zod.validation";

const router = Router();

// =============================================
// CREATE CLASS NAME ROUTE
// =============================================
router.post(
  "/create",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(classZodSchema.createClassZodSchema),
  classController.createClassName,
);

// =============================================
// DELETE CLASS NAME ROUTE
// =============================================
router.delete(
  "/delete/:class_id",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(classZodSchema.deleteClassNameZodSchema),
  classController.deleteClassName,
);

// =============================================
// UPDATE CLASS FIELD ROUTE
// =============================================
router.patch(
  "/update/:class_id",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(classZodSchema.updateClassFieldZodSchema),
  classController.updateClassField,
);

// =============================================
// GET ALL CLASS NAME ROUTE
// =============================================
router.get(
  "/",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  classController.getAllClassNames,
);
export const classRouter: Router = router;
