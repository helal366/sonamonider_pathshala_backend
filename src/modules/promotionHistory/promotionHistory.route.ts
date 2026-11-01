import { Role } from "#db-client";
import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams } from "../../middlewares/validateZodSchema.js";
import { promotionHistoryController } from "./promotionHistory.controller.js";
import { promotionHistoryZodSchema } from "./promotionHistory.zodValidation.js";

const router = Router();
const promotionHistoryRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
];

router.get(
  "/get_by_management_staff_id/:entity_id",
  userAuth(...promotionHistoryRoles),
  validateZodParams(
    promotionHistoryZodSchema.promotionHistoryEntityIdParamsZodSchema,
  ),
  promotionHistoryController.getPromotionHistoryByManagementStaffId,
);

router.get(
  "/get_by_academic_staff_id/:entity_id",
  userAuth(...promotionHistoryRoles),
  validateZodParams(
    promotionHistoryZodSchema.promotionHistoryEntityIdParamsZodSchema,
  ),
  promotionHistoryController.getPromotionHistoryByAcademicStaffId,
);

router.get(
  "/get_by_student_id/:entity_id",
  userAuth(...promotionHistoryRoles),
  validateZodParams(
    promotionHistoryZodSchema.promotionHistoryEntityIdParamsZodSchema,
  ),
  promotionHistoryController.getPromotionHistoryByStudentId,
);

router.get(
  "/get_by_governing_body_id/:entity_id",
  userAuth(...promotionHistoryRoles),
  validateZodParams(
    promotionHistoryZodSchema.promotionHistoryEntityIdParamsZodSchema,
  ),
  promotionHistoryController.getPromotionHistoryByGoverningBodyId,
);

router.get(
  "/",
  userAuth(...promotionHistoryRoles),
  promotionHistoryController.getAllPromotionHistories,
);

router.get(
  "/:id",
  userAuth(...promotionHistoryRoles),
  validateZodParams(
    promotionHistoryZodSchema.promotionHistoryIdParamsZodSchema,
  ),
  promotionHistoryController.getPromotionHistoryById,
);

export const promotionHistoryRouter: Router = router;
