import z4 from "zod/v4";

// 🌟 Regex to strictly validate standard time format (e.g., "6:00 AM", "12:30 PM")
const timeStringRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;

// CREATE QURANIC CLASS PERIOD ZOD SCHEMA
export const createQuranicClassPeriodZodSchema = z4.object({
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

// UPDATE QURANIC CLASS PERIOD ZOD SCHEMA
export const updateQuranicClassPeriodZodSchema = z4.object({
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

// DELETE QURANIC CLASS PERIOD ZOD SCHEMA
export const deleteQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_id: z4.uuid({
    message: "Invalid Quranic class period ID format. Must be a valid UUID.",
  }),
});

export type TDeleteQuranicClassPeriodZodSchema = z4.infer<typeof deleteQuranicClassPeriodZodSchema>;

// GET SINGLE QURANIC CLASS PERIOD BY ID ZOD SCHEMA
export const getSingleQuranicClassPeriodZodSchema = z4.object({
  quranic_class_period_id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});

export type TGetSingleQuranicClassPeriodZodSchema = z4.infer<typeof getSingleQuranicClassPeriodZodSchema>;
