import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "#db-client";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema";
import { arabicPeriodZodSchema } from "./arabicPeriod.zodValidation";
import { arabicPeriodController } from "./arabicPeriod.controller";

const router = Router();
// ==========================================================
// CREATE ARABIC PERIOD ROUTE
// ==========================================================
router.post(
    "/create_arabic_period",
    userAuth(Role.SUPER_ADMIN),
    validateZodSchema(arabicPeriodZodSchema.createArabicPeriodZodSchema),
    arabicPeriodController.createArabicPeriod
);

// ==========================================================
// DELETE ARABIC PERIOD ROUTE
// ==========================================================
router.delete(
    "/delete_arabic_period/:id",
    userAuth(Role.SUPER_ADMIN),
    validateZodParams(arabicPeriodZodSchema.deleteArabicPeriodParamsZodSchema),
    arabicPeriodController.deleteArabicPeriod
)
export const arabicPeriodRouter:Router = router;