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
const generalSubjectIds = uniqueIds("subject");
const quranicSubjectIds = uniqueIds("Quranic subject");

const periodSelection = (
  data: {
    general_period_id?: string;
    quranic_period_id?: string;
    general_subject_ids: string[];
    quranic_subject_ids: string[];
    arabic_period_id?: string;
    arabic_subject_id?: string;
  },
  ctx: z4.RefinementCtx,
) => {
  const hasPeriod = Boolean(data.general_period_id);
  const hasQuranicPeriod = Boolean(data.quranic_period_id);
  const hasSubjectIds = Boolean(data.general_subject_ids.length);
  const hasQuranicSubjectIds = Boolean(data.quranic_subject_ids.length);
  const hasArabicPeriod = Boolean(data.arabic_period_id);
  const hasArabicSubject = Boolean(data.arabic_subject_id);

  // Check Arabic period and subject
  if (hasArabicPeriod !== hasArabicSubject) {
    ctx.addIssue({
      code: "custom",
      path: ["arabic_period_id"],
      message:
        "Arabic period and arabic subject are paired. Either provide both or neither.",
    });
  }

  // Exactly one period must be provided
  if (hasPeriod === hasQuranicPeriod) {
    ctx.addIssue({
      code: "custom",
      path: ["general_period_id"],
      message:
        "Provide exactly one of general_period_id or quranic_period_id.",
    });
  }

  if (hasPeriod) {
    if (!hasSubjectIds) {
      ctx.addIssue({
        code: "custom",
        path: ["general_subject_ids"],
        message:
          "General subject must be provided when general period is provided.",
      });
    }

    if (hasQuranicSubjectIds) {
      ctx.addIssue({
        code: "custom",
        path: ["quranic_subject_ids"],
        message:
          "Quranic subject must not be provided when general period is provided.",
      });
    }
  }

  if (hasQuranicPeriod) {
    if (hasSubjectIds) {
      ctx.addIssue({
        code: "custom",
        path: ["general_subject_ids"],
        message:
          "General subject must not be provided when quranic period is provided.",
      });
    }

    if (!hasQuranicSubjectIds) {
      ctx.addIssue({
        code: "custom",
        path: ["quranic_subject_ids"],
        message:
          "Quranic subject must be provided when general period is not provided.",
      });
    }
  }
};

const createClassRoutinePayload = z4
  .object({
    class_ids: classIds,
    shift_id: uuid("shift"),
    teacher_ids: teacherIds,
    general_period_id: uuid("period").optional(),
    general_subject_ids: generalSubjectIds.default([]),
    quranic_period_id: uuid("Quranic period").optional(),
    quranic_subject_ids: quranicSubjectIds.default([]),
    arabic_period_id: uuid("Arabic period").optional(),
    arabic_subject_id: uuid("Arabic subject").optional(),
  })
  .superRefine(periodSelection);

const updateClassRoutinePayload = z4
  .object({
    class_ids: classIds,
    shift_id: uuid("shift"),
    general_period_id: uuid("period").optional(),
    quranic_period_id: uuid("Quranic period").optional(),
    teacher_ids: teacherIds,
    general_subject_ids: generalSubjectIds,
    quranic_subject_ids: quranicSubjectIds,
    arabic_period_id: uuid("Arabic period").optional(),
    arabic_subject_id: uuid("Arabic subject").optional(),
  })
  .superRefine(periodSelection);

const updateClassRoutineParamsZodSchema = z4.object({
  id: uuid("class routine"),
});

const updateClassRoutineSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({ field: z4.literal("class_ids"), value: classIds }),
  z4.object({ field: z4.literal("shift_id"), value: uuid("shift") }),
  z4.object({ field: z4.literal("general_period_id"), value: uuid("period") }),
  z4.object({
    field: z4.literal("quranic_period_id"),
    value: uuid("Quranic period"),
  }),
  z4.object({ field: z4.literal("teacher_ids"), value: teacherIds }),
  z4.object({ field: z4.literal("subject_ids"), value: generalSubjectIds }),
  z4.object({
    field: z4.literal("quranic_subject_ids"),
    value: quranicSubjectIds,
  }),
  z4.object({
    field: z4.literal("arabic_period_id"),
    value: uuid("Arabic period"),
  }),
  z4.object({
    field: z4.literal("arabic_subject_id"),
    value: uuid("Arabic subject"),
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
