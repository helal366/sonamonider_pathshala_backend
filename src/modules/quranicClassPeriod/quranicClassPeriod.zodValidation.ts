import z4 from "zod/v4";

// 🌟 Regex to strictly validate standard time format (e.g., "6:00 AM", "12:30 PM")
const timeStringRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;

// ==========================================================
// CREATE QURANIC CLASS PERIOD ZOD SCHEMA
// ==========================================================
const createQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic class period name is required."
          : "Invalid period name format.",
    })
    .trim()
    .min(1, "Quranic class period name cannot be empty."),

  start_time: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Start time is required." : "Invalid start time format.",
    })
    .trim()
    .regex(timeStringRegex, "Invalid time format. Expected format like '6:00 AM' or '12:30 PM'."),

  end_time: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "End time is required." : "Invalid end time format.",
    })
    .trim()
    .regex(timeStringRegex, "Invalid time format. Expected format like '8:00 AM' or '02:30 PM'."),
});

export type TCreateQuranicClassPeriodZodSchema = z4.infer<typeof createQuranicClassPeriodZodSchema>;

// =========================================================
// UPDATE QURANIC CLASS PERIODS ZOD SCHEMA
// =========================================================
const updateQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_id: z4.uuid({
    message: "Invalid Quranic class period ID format. Must be a valid UUID.",
  }),
  
  quranic_class_period_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic class period name is required."
          : "Invalid period name format.",
    })
    .trim()
    .min(1, "Quranic class period name cannot be empty."),

  start_time: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Start time is required." : "Invalid start time format.",
    })
    .trim()
    .regex(timeStringRegex, "Invalid time format. Expected format like '6:00 AM'."),

  end_time: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "End time is required." : "Invalid end time format.",
    })
    .trim()
    .regex(timeStringRegex, "Invalid time format. Expected format like '8:00 AM'."),
});

export type TUpdateQuranicClassPeriodZodSchema = z4.infer<typeof updateQuranicClassPeriodZodSchema>;


// ===================================================
// UPDATE QURANIC CLASS SINGLE FIELD ZOD SCHEMA
// ===================================================
const updateQuranicClassPeriodSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    quranic_class_period_id: z4.uuid({ message: "Invalid ID format. Must be a valid UUID." }),
    field: z4.literal("quranic_class_period_name"),
    value: z4.string({ error: (issue) => "Period name is required." }).trim().min(1, "Period name cannot be empty."),
  }),
  ...(["start_time", "end_time"] as const).map((timeField) =>
    z4.object({
      quranic_class_period_id: z4.uuid({ message: "Invalid ID format. Must be a valid UUID." }),
      field: z4.literal(timeField),
      value: z4
        .string({ error: (issue) => `${timeField.replace("_", " ")} is required.` })
        .trim()
        .regex(timeStringRegex, "Invalid time format. Expected format like '6:00 AM' or '12:30 PM'."),
    })
  ),
]);

export type TUpdateQuranicClassPeriodSingleFieldPayload = z4.infer<
  typeof updateQuranicClassPeriodSingleFieldZodSchema
>;
// ===================================================
// DELETE QURANIC CLASS PERIOD ZOD SCHEMA
// ===================================================
const deleteQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_id: z4.uuid({
    message: "Invalid Quranic class period ID format. Must be a valid UUID.",
  }),
});

export type TDeleteQuranicClassPeriodZodSchema = z4.infer<typeof deleteQuranicClassPeriodZodSchema>;

// ====================================================================
// GET SINGLE QURANIC CLASS PERIOD BY ID ZOD SCHEMA
// ====================================================================
const getSingleQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});

export type TGetSingleQuranicClassPeriodZodSchema = z4.infer<typeof getSingleQuranicClassPeriodZodSchema>;


export const quranicClassPeriodZodSchema = {
  createQuranicClassPeriodZodSchema,
  updateQuranicClassPeriodZodSchema,
  updateQuranicClassPeriodSingleFieldZodSchema,
  deleteQuranicClassPeriodZodSchema,
  getSingleQuranicClassPeriodZodSchema
}
