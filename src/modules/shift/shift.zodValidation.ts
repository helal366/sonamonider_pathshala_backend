import z4 from "zod/v4";

// =============================================
// CREATE SHIFT ZOD SCHEMA
// =============================================
const createShiftZodSchema = z4.object({
  shift_name: z4.string({
    error: (issue) => {
      issue.input === undefined
        ? "Shift name is required."
        : "Invalid Shift name format.";
    },
  }),
});
export type TCreateShiftZodSchema = z4.infer<typeof createShiftZodSchema>;

// =============================================
// DELETE SHIFT ZOD SCHEMA
// =============================================
const deleteShiftZodSchema = z4.object({
  id: z4.uuid({
    error: (issue) => {
      issue.input === undefined
        ? "Shift ID is required."
        : "Invalid Shift ID format.";
    },
  }),
});
export type TDeleteShiftZodSchema = z4.infer<typeof deleteShiftZodSchema>;

// =============================================
// UPDATE SHIFT FIELD ZOD SCHEMA
// =============================================
const updateShiftFieldParamsZodSchema = z4.object({
  id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Shift ID is required."
        : "Invalid Shift ID format."
  }),
});
export type TUpdateShiftFieldParamsZodSchema = z4.infer<
  typeof updateShiftFieldParamsZodSchema
>;

const UpdateShiftField = ["shift_name"] as const;
const updateShiftFieldZodSchema = z4.object({
  field: z4.enum(UpdateShiftField, "Invalid Shift field name"),
  value: z4
    .string({
      error: (issue) => 
        issue.input === undefined 
        ? "Shift field value is required." 
        : "Invalid shift value format."
    })
    .trim()
    .min(1, "Shift field value is required."),
});
export type TUpdateShiftFieldZodSchema = z4.infer<
  typeof updateShiftFieldZodSchema
>;
export const shiftZodSchema = {
  createShiftZodSchema,
  deleteShiftZodSchema,
  updateShiftFieldZodSchema,
  updateShiftFieldParamsZodSchema,
};
