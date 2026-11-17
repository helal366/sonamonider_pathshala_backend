import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "#db-client";
import { tuitionFeePaymentController } from "./tuitionFeePayment.controller";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { tuitionFeePaymentZodSchema } from "./tuitionFeePayment.zodSchema";

const router = Router();

// =========================================================
// Create Tuition Fee Route
// =========================================================
router.post(
  "/create_tuition_fee_payment",
  userAuth(Role.STUDENT),
  validateZodSchema(tuitionFeePaymentZodSchema.createTuitionFeePaymentZodSchema),
  tuitionFeePaymentController.createTuitionFeePayment,
);

export const tuitionFeePaymentRouter: Router = router;
