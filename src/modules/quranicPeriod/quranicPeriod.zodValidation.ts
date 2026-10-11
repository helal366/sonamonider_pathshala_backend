import z4 from "zod/v4";

// 🌟 Regex to strictly validate standard time format (e.g., "6:00 AM", "12:30 PM")
const timeStringRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;

// CHECK START TIME ALWAYS LESS THAN END TIME
const toMinutes = (time: string): number => {
  const [clock, period] = time.trim().toUpperCase().split(/\s+/);
  const [hours, minutes] = clock!.split(":").map(Number);

  const hours24 = (hours! % 12) + (period === "PM" ? 12 : 0);

  return hours24 * 60 + minutes!;
};
// ==========================================================
// CREATE QURANIC PERIOD ZOD SCHEMA
// ==========================================================
const createQuranicPeriodZodSchema = z4
  .object({
    quranic_period_name: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Quranic period name is required."
            : "Invalid period name format.",
      })
      .trim()
      .min(1, "Quranic period name cannot be empty."),

    start_time: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Start time is required."
            : "Invalid start time format.",
      })
      .trim()
      .min(1, "Start time is required."),

    end_time: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "End time is required."
            : "Invalid end time format.",
      })
      .trim()
      .regex(
        timeStringRegex,
        "Invalid end time format. Expected format like '8:00 AM' or '2:30 PM'.",
      ),
  })
  .superRefine((data, ctx) => {
  const periodName = data.quranic_period_name.trim().toUpperCase();

  if (periodName === "HIFZ_NIGHT") {
    if (data.start_time.trim().toUpperCase() !== "AFTER_MAGRIB") {
      ctx.addIssue({
        code: "custom",
        path: ["start_time"],
        message: 'Start time for HIFZ_NIGHT must be "AFTER_MAGRIB".',
      });
    }

    // Skip clock-time comparison for HIFZ_NIGHT.
    return;
  }

  // For every other period, start_time must be a standard clock time.
  if (!timeStringRegex.test(data.start_time.trim())) {
    ctx.addIssue({
      code: "custom",
      path: ["start_time"],
      message:
        "Invalid start time format. Expected format like '6:00 AM' or '12:30 PM'.",
    });

    return;
  }

  // For every other period, end_time must be later than start_time.
  if (toMinutes(data.end_time) <= toMinutes(data.start_time)) {
    ctx.addIssue({
      code: "custom",
      path: ["end_time"],
      message: "End time must be after start time.",
    });
  }
});

export type TCreateQuranicPeriodZodSchema = z4.infer<typeof createQuranicPeriodZodSchema>;

// =========================================================
// UPDATE QURANIC PERIODS ZOD SCHEMA
// =========================================================
const updateQuranicPeriodParamsZodSchema = z4.object({
    id: z4.uuid({
    message: "Invalid Quranic period ID format. Must be a valid UUID.",
  }),
})
export type TUpdateQuranicPeriodParamsZodSchema = z4.infer<typeof updateQuranicPeriodParamsZodSchema>;

const updateQuranicPeriodZodSchema = z4.object({
  quranic_period_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic period name is required."
          : "Invalid period name format.",
    })
    .trim()
    .min(1, "Quranic period name cannot be empty."),

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

export type TUpdateQuranicPeriodZodSchema = z4.infer<typeof updateQuranicPeriodZodSchema>;


// ===================================================
// UPDATE QURANIC SINGLE FIELD ZOD SCHEMA
// ===================================================
const updateQuranicPeriodSingleFieldParamsZodSchema = z4.object({
  id: z4.uuid({ message: "Invalid ID format. Must be a valid UUID." }),
});
export type TUpdateQuranicPeriodSingleFieldParamsZodSchema = z4.infer<typeof updateQuranicPeriodSingleFieldParamsZodSchema>;

const updateQuranicPeriodSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("quranic_period_name"),
    value: z4.string({ error: (issue) => "Period name is required." }).trim().min(1, "Period name cannot be empty."),
  }),
  ...(["start_time", "end_time"] as const).map((timeField) =>
    z4.object({
      field: z4.literal(timeField),
      value: z4
        .string({ error: () => `${timeField.replace("_", " ")} is required.` })
        .trim()
        .regex(timeStringRegex, "Invalid time format. Expected format like '6:00 AM' or '12:30 PM'."),
    })
  ),
]);
export type TUpdateQuranicPeriodSingleFieldPayload = z4.infer<
  typeof updateQuranicPeriodSingleFieldZodSchema
>;
// ===================================================
// DELETE QURANIC PERIOD ZOD SCHEMA
// ===================================================
const deleteQuranicPeriodParamsZodSchema = z4.object({
  id: z4.uuid({
    message: "Invalid Quranic period ID format. Must be a valid UUID.",
  }),
});

export type TDeleteQuranicPeriodParamsZodSchema = z4.infer<typeof deleteQuranicPeriodParamsZodSchema>;

// ====================================================================
// GET SINGLE QURANIC PERIOD BY ID ZOD SCHEMA
// ====================================================================
const getSingleQuranicPeriodParamsZodSchema = z4.object({
  id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});

export type TGetSingleQuranicPeriodParamsZodSchema = z4.infer<typeof getSingleQuranicPeriodParamsZodSchema>;


export const quranicPeriodZodSchema = {
  createQuranicPeriodZodSchema,

  updateQuranicPeriodParamsZodSchema,
  updateQuranicPeriodZodSchema,

  updateQuranicPeriodSingleFieldParamsZodSchema,
  updateQuranicPeriodSingleFieldZodSchema,

  deleteQuranicPeriodParamsZodSchema,
  getSingleQuranicPeriodParamsZodSchema
}
