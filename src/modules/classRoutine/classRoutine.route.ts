import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { classRoutineController } from "./classRoutine.controller.js";
import { classRoutineZodSchema } from "./classRoutine.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

// ====================================================
// CREATE CLASS ROUTINE ROUTE
// ====================================================
router.post(
  "/create_class_routine",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(classRoutineZodSchema.createClassRoutineZodSchema),
  classRoutineController.createClassRoutine,
);

// ====================================================
// UPDATE CLASS ROUTINE ROUTE
// ====================================================
router.patch(
  "/update_class_routine/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(classRoutineZodSchema.updateClassRoutineParamsZodSchema),
  validateZodSchema(classRoutineZodSchema.updateClassRoutineZodSchema),
  classRoutineController.updateClassRoutine,
);

// ====================================================
// UPDATE SINGLE CLASS ROUTINE ROUTE
// ====================================================
router.patch(
  "/update_single_class_routine_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(classRoutineZodSchema.updateClassRoutineParamsZodSchema),
  validateZodSchema(
    classRoutineZodSchema.updateClassRoutineSingleFieldZodSchema,
  ),
  classRoutineController.updateClassRoutineSingleField,
);

// ====================================================
// DELETE CLASS ROUTINE ROUTE
// ====================================================
router.delete(
  "/delete_class_routine/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(classRoutineZodSchema.deleteClassRoutineParamsZodSchema),
  classRoutineController.deleteClassRoutine,
);

// ====================================================
// GET ALL CLASS ROUTINE ROUTE
// ====================================================
router.get(
  "/get_class_routines",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  classRoutineController.getAllClassRoutines,
);

// ====================================================
// GET SINGLE CLASS ROUTINE ROUTE
// ====================================================
router.get(
  "/get_class_routine/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(classRoutineZodSchema.getSingleClassRoutineParamsZodSchema),
  classRoutineController.getSingleClassRoutine,
);

export const classRoutineRouter: Router = router;
