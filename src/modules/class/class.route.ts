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
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(classZodSchema.createClassZodSchema),
    classController.createClass
)
export const classRouter:Router = router;