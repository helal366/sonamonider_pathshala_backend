import z4 from "zod/v4";

const uuid = (field: string) =>
  z4.uuid({ message: `Invalid ${field} ID format.` });

const subjectIdArray = z4
  .array(uuid("subject"))
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "A subject cannot be assigned more than once to a specific period.",
  });
const subjectIds = subjectIdArray.default([]);

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
    class_id: uuid("class"),
    period_id: uuid("period").optional(),
    quranic_period_id: uuid("Quranic period").optional(),
    teacher_id: uuid("teacher"),
    subjects: subjectIds,
  })
  .superRefine(periodSelection);

const updateClassRoutinePayload = z4
  .object({
    class_id: uuid("class"),
    period_id: uuid("period").optional(),
    quranic_period_id: uuid("Quranic period").optional(),
    teacher_id: uuid("teacher"),
    subjects: z4.array(uuid("subject")).refine(
      (ids) => new Set(ids).size === ids.length,
      {
        message: "A subject cannot be assigned more than once to a routine.",
      },
    ),
  })
  .superRefine(periodSelection);

const updateClassRoutineParamsZodSchema = z4.object({
  id: uuid("class routine"),
});

const updateClassRoutineSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({ field: z4.literal("class_id"), value: uuid("class") }),
  z4.object({ field: z4.literal("period_id"), value: uuid("period") }),
  z4.object({
    field: z4.literal("quranic_period_id"),
    value: uuid("Quranic period"),
  }),
  z4.object({ field: z4.literal("teacher_id"), value: uuid("teacher") }),
  z4.object({ field: z4.literal("subjects"), value: subjectIdArray }),
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
