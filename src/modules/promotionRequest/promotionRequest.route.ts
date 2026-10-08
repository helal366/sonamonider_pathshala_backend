import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { promotionRequestsZodSchema } from "./promotionRequest.zod.validation";
import { promotionRequestController } from "./promotionRequest.controller";

// =========================================================
// CREATE PROMOTION REQUEST ROUTE
// =========================================================
const router = Router();
router.post(
  "/create_promotion_request",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(promotionRequestsZodSchema.createPromotionRequestZodSchema),
  promotionRequestController.createPromotionRequest,
);

// =========================================================
// DELETE PROMOTION REQUEST ROUTE
// =========================================================
router.delete(
  "/delete_promotion_request",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(promotionRequestsZodSchema.deletePromotionRequestZodSchema),
  promotionRequestController.deletePromotionRequest
)
export const promotionRequestRouter: Router = router;
