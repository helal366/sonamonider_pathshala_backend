import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { createSpouseInformationZodSchema } from "./spouseInformation.zod.validation";
import { spouseInformationController } from "./spouseInformation.controller";

const router = Router();
router.post(
    "/create", 
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(createSpouseInformationZodSchema),
    spouseInformationController.createSpouseInformation
);
export const spouseInformationRouter: Router = router;
