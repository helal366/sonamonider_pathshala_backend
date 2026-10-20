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
);

// ==========================================================
// UPDATE ARABIC PERIOD SINGLE FIELD ROUTE
// ==========================================================
router.patch(
    "/update_quranic_period/:id",
    userAuth(Role.SUPER_ADMIN),
    validateZodParams(arabicPeriodZodSchema.updateArabicPeriodSingleFieldParamsZodSchema),
    validateZodSchema(arabicPeriodZodSchema.updateArabicPeriodSingleFieldZodSchema),
    arabicPeriodController.updateArabicPeriodSingleField
);

// ==========================================================
// GET ALL ARABIC PERIOD ROUTE
// ==========================================================
router.get(
    "/",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    arabicPeriodController.getAllArabicPeriods
);

// ==========================================================
// GET SINGLE ARABIC PERIOD ROUTE
// ==========================================================
router.get(
    "/single_arabic_period/:id",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodParams(arabicPeriodZodSchema.getSingleArabicPeriodParamsZodSchema),
    arabicPeriodController.getSingleArabicPeriod
)
export const arabicPeriodRouter:Router = router;