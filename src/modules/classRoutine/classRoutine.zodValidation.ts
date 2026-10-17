import z4 from "zod/v4";

const uuid = (field: string) =>
  z4.uuid({ message: `Invalid ${field} ID format.` });

const uniqueIds = (field: string) =>
  z4.array(uuid(field)).refine((ids) => new Set(ids).size === ids.length, {
    message: `A ${field} cannot be assigned more than once to a routine.`,
  });

const classIds = uniqueIds("class").min(1, {
  message: "At least one class must be assigned to a routine.",
});
const teacherIds = uniqueIds("teacher").min(1, {
  message: "At least one teacher must be assigned to a routine.",
});
const subjectIds = uniqueIds("subject");
const quranicSubjectIds = uniqueIds("Quranic subject");

const periodSelection = (
  data: { period_id?: string; quranic_period_id?: string },
  ctx: z4.RefinementCtx,
) => {
  if (Boolean(data.period_id) === Boolean(data.quranic_period_id)) {
    ctx.addIssue({
      code: "custom",
      path: ["period_id"],
      message: "Provide exactly one of period_id or quranic_period_id.",
    });
  }
};

const createClassRoutinePayload = z4
  .object({
    class_ids: classIds,
    shift_id: uuid("shift"),
    period_id: uuid("period").optional(),
    quranic_period_id: uuid("Quranic period").optional(),
    teacher_ids: teacherIds,
    subject_ids: subjectIds.default([]),
    quranic_subject_ids: quranicSubjectIds.default([]),
  })
  .superRefine(periodSelection);

const updateClassRoutinePayload = z4
  .object({
    class_ids: classIds,
    shift_id: uuid("shift"),
    period_id: uuid("period").optional(),
    quranic_period_id: uuid("Quranic period").optional(),
    teacher_ids: teacherIds,
    subject_ids: subjectIds,
    quranic_subject_ids: quranicSubjectIds,
  })
  .superRefine(periodSelection);

const updateClassRoutineParamsZodSchema = z4.object({
  id: uuid("class routine"),
});

const updateClassRoutineSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({ field: z4.literal("class_ids"), value: classIds }),
  z4.object({ field: z4.literal("shift_id"), value: uuid("shift") }),
  z4.object({ field: z4.literal("period_id"), value: uuid("period") }),
  z4.object({
    field: z4.literal("quranic_period_id"),
    value: uuid("Quranic period"),
  }),
  z4.object({ field: z4.literal("teacher_ids"), value: teacherIds }),
  z4.object({ field: z4.literal("subject_ids"), value: subjectIds }),
  z4.object({
    field: z4.literal("quranic_subject_ids"),
    value: quranicSubjectIds,
  }),
]);

export type TCreateClassRoutinePayload = z4.infer<
  typeof createClassRoutinePayload
>;
export type TUpdateClassRoutinePayload = z4.infer<
  typeof updateClassRoutinePayload
>;
export type TUpdateClassRoutineParams = z4.infer<
  typeof updateClassRoutineParamsZodSchema
>;
export type TUpdateClassRoutineSingleFieldPayload = z4.infer<
  typeof updateClassRoutineSingleFieldZodSchema
>;
export type TDeleteClassRoutineParams = TUpdateClassRoutineParams;
export type TGetSingleClassRoutineParams = TUpdateClassRoutineParams;

export const classRoutineZodSchema = {
  createClassRoutineZodSchema: createClassRoutinePayload,
  updateClassRoutineParamsZodSchema,
  updateClassRoutineZodSchema: updateClassRoutinePayload,
  updateClassRoutineSingleFieldZodSchema,
  deleteClassRoutineParamsZodSchema: updateClassRoutineParamsZodSchema,
  getSingleClassRoutineParamsZodSchema: updateClassRoutineParamsZodSchema,
};
