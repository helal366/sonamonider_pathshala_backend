import z4 from "zod/v4";

const timeStringRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i;

export const toMinutes = (time: string): number => {
  const [clock, meridiem] = time.trim().toUpperCase().split(/\s+/);
  const [hours, minutes] = clock!.split(":").map(Number);
  return (hours! % 12) * 60 + minutes! + (meridiem === "PM" ? 12 * 60 : 0);
};

const periodName = (message: string) =>
  z4
    .string({ error: message })
    .trim()
    .min(1, "Period name cannot be empty.");

const periodTime = (field: "start_time" | "end_time") =>
  z4
    .string({ error: `${field.replace("_", " ")} is required.` })
    .trim()
    .regex(
      timeStringRegex,
      `Invalid ${field.replace("_", " ")} format. Expected format like '8:00 AM'.`,
    );

const createPeriodZodSchema = z4
  .object({
    period_name: periodName("Period name is required."),
    start_time: periodTime("start_time"),
    end_time: periodTime("end_time"),
  })
  .superRefine((data, ctx) => {
    if (toMinutes(data.end_time) <= toMinutes(data.start_time)) {
      ctx.addIssue({
        code: "custom",
        path: ["end_time"],
        message: "End time must be after start time.",
      });
    }
  });

const updatePeriodParamsZodSchema = z4.object({
  id: z4.uuid({ message: "Invalid period ID format." }),
});

const updatePeriodZodSchema = createPeriodZodSchema;

const updatePeriodSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("period_name"),
    value: periodName("Period name is required."),
  }),
  z4.object({ field: z4.literal("start_time"), value: periodTime("start_time") }),
  z4.object({ field: z4.literal("end_time"), value: periodTime("end_time") }),
]);

const deletePeriodParamsZodSchema = updatePeriodParamsZodSchema;
const getSinglePeriodParamsZodSchema = updatePeriodParamsZodSchema;

export type TCreatePeriodPayload = z4.infer<typeof createPeriodZodSchema>;
export type TUpdatePeriodParams = z4.infer<typeof updatePeriodParamsZodSchema>;
export type TUpdatePeriodPayload = z4.infer<typeof updatePeriodZodSchema>;
export type TUpdatePeriodSingleFieldPayload = z4.infer<
  typeof updatePeriodSingleFieldZodSchema
>;
export type TDeletePeriodParams = z4.infer<typeof deletePeriodParamsZodSchema>;
export type TGetSinglePeriodParams = z4.infer<
  typeof getSinglePeriodParamsZodSchema
>;

export const periodZodSchema = {
  createPeriodZodSchema,
  updatePeriodParamsZodSchema,
  updatePeriodZodSchema,
  updatePeriodSingleFieldZodSchema,
  deletePeriodParamsZodSchema,
  getSinglePeriodParamsZodSchema,
};
