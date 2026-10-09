import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema";
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
);

// =========================================================
// ACTION PROMOTION REQUEST ROUTE
// =========================================================
router.patch(
  "/action_promotion_request",
  userAuth("SUPER_ADMIN"), 
  validateZodSchema(promotionRequestsZodSchema.actionPromotionRequestZodSchema),
  promotionRequestController.actionPromotionRequest
);

// =========================================================
// GET PROMOTION REQUESTS FILTER ROUTE
// =========================================================
router.get(
  "/",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(promotionRequestsZodSchema.getPromotionRequestsZodSchema),
  promotionRequestController.getAllPromotionRequests
);

// =========================================================
// GET SINGLE PROMOTION REQUEST ROUTE
// =========================================================
router.get(
  "/get_promotion_request/:promotion_request_id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(promotionRequestsZodSchema.getSinglePromotionRequestZodSchema), // Parses req.params
  promotionRequestController.getSinglePromotionRequest
);

export const promotionRequestRouter: Router = router;
