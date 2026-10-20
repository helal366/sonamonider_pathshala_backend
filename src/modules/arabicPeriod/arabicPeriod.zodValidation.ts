import z4 from "zod/v4";
import { timeStringRegex } from "../../commonInterfaces/interfaces";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";

// ==========================================================
// CREATE ARABIC PERIOD ZOD SCHEMA
// ==========================================================
const createArabicPeriodZodSchema = z4
  .object({
    arabic_period_name: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Arabic period name is required."
            : "Invalid arabic period name format.",
      })
      .trim()
      .min(1, "Arabic period name is required."),

    start_time: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Start time is required."
            : "Invalid start time format.",
      })
      .trim()
      .min(1, "Start time is required.")
      .regex(
        timeStringRegex,
        "Invalid start time format. Expected format like '8:00 AM' or '2:30 PM'.",
      ),

    end_time: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "End time is required."
            : "Invalid end time format.",
      })
      .trim()
      .min(1, "End time is required.")
      .regex(
        timeStringRegex,
        "Invalid end time format. Expected format like '8:00 AM' or '2:30 PM'.",
      ),
  })
  .superRefine((data, ctx) => {
    if (
      helperFunctions.toMinutes(data.end_time) <=
      helperFunctions.toMinutes(data.start_time)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_time"],
        message: "End time must be after start time.",
      });
    }
  });

export type TCreateArabicPeriodZodSchema = z4.infer<
  typeof createArabicPeriodZodSchema
>;

// ==========================================================
// DELETE ARABIC PERIOD ZOD SCHEMA
// ==========================================================
const deleteArabicPeriodParamsZodSchema = z4.object({
  id: z4.uuid("Invalid arabic period ID format."),
});
export type TDeleteArabicPeriodParamsZodSchema = z4.infer<
  typeof deleteArabicPeriodParamsZodSchema
>;

// ==========================================================
// UPDATE ARABIC PERIOD SINGLE FIELD ZOD SCHEMA
// ==========================================================
const updateArabicPeriodSingleFieldParamsZodSchema = z4.object({
  id: z4.uuid("Invalid arabic period ID format."),
});
export type TUpdateArabicPeriodSingleFieldParamsZodSchema = z4.infer<
  typeof updateArabicPeriodSingleFieldParamsZodSchema
>;

const updateArabicPeriodSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("arabic_period_name"),
    value: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Field value is required."
            : "Invalid field value format.",
      })
      .trim()
      .min(1, "Field value is required."),
  }),
  ...(["start_time", "end_time"] as const).map((timeField)=>
    z4.object({
      field: z4.literal(timeField),
      value: z4.string({
        error: () => `${timeField.replace("_", " ")}  is required.`
      }).trim().regex(
        timeStringRegex,
          "Invalid time format. Expected format like '6:00 AM' or '12:30 PM'.",
      )
    })
  )
]);
export type TUpdateArabicPeriodSingleFieldZodSchema = z4.infer<
  typeof updateArabicPeriodSingleFieldZodSchema
>;

// ==========================================================
// GET SINGLE ARABIC PERIOD ZOD SCHEMA
// ==========================================================
const getSingleArabicPeriodParamsZodSchema = z4.object({
  id: z4.uuid("Invalid Arabic period ID format.")
});
export type TGetSingleArabicPeriodParamsZodSchema = z4.infer<typeof getSingleArabicPeriodParamsZodSchema>;
export const arabicPeriodZodSchema = {
  createArabicPeriodZodSchema,
  deleteArabicPeriodParamsZodSchema,
  updateArabicPeriodSingleFieldParamsZodSchema,
  updateArabicPeriodSingleFieldZodSchema,
  getSingleArabicPeriodParamsZodSchema
};
