import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { academicResultZodSchema } from "./academicResult.zod.validation";
import { academicResultController } from "./academicResult.controller";

const router = Router();

// ==========================================
// CREATE ACADEMIC RESULT ROUTE
// ==========================================
router.post(
    "/create", 
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    validateZodSchema(academicResultZodSchema.createAcademicResultZodSchema),
    academicResultController.createAcademicResult
)
export const academicResultRouter:Router = router;