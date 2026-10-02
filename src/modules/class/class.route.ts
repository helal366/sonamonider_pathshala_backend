import { Router } from "express";
import { classController } from "./class.controller";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { classZodSchema } from "./class.zod.validation";

const router = Router();

// =============================================
// CREATE CLASS NAME ROUTE
// =============================================
router.post(
    "/create",
    userAuth("SUPER_ADMIN"),
    validateZodSchema(classZodSchema.createClassZodSchema),
    classController.createClassName
);


// =============================================
// DELETE CLASS NAME ZOD SCHEMA
// =============================================
router.delete(
    "/delete/:class_id",
    userAuth("SUPER_ADMIN"),
    validateZodSchema(classZodSchema.deleteClassNameZodSchema),
    classController.deleteClassName
);

// =============================================
// UPDATE CLASS FIELD ZOD SCHEMA
// =============================================
router.patch(
    "/update/:class_id",
    userAuth("SUPER_ADMIN"),
    validateZodSchema(classZodSchema.updateClassFieldZodSchema),
)
export const classRouter:Router = router;