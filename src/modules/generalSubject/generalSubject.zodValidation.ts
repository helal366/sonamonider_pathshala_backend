import z4 from "zod/v4";

const generalSubjectName = (requiredMessage: string) =>
  z4
    .string({ error: requiredMessage })
    .trim()
    .min(1, "Subject name cannot be empty.");

const createGeneralSubjectZodSchema = z4.object({
  general_subject_name: generalSubjectName("Subject name is required."),
});

const updateGeneralSubjectIdParamsZodSchema = z4.object({
  general_subject_id: z4.uuid({ message: "Invalid subject ID format." }),
});

const updateGeneralSubjectZodSchema = createGeneralSubjectZodSchema;

const updateGeneralSubjectSingleFieldZodSchema = z4.object({
  field: z4.literal("general_subject_name"),
  value: generalSubjectName("Subject name is required."),
});

const deleteGeneralSubjectIdParamsZodSchema =
  updateGeneralSubjectIdParamsZodSchema;
const getSingleGeneralSubjectParamsZodSchema =
  updateGeneralSubjectIdParamsZodSchema;

export type TCreateGeneralSubjectPayload = z4.infer<
  typeof createGeneralSubjectZodSchema
>;
export type TUpdateGeneralSubjectParams = z4.infer<
  typeof updateGeneralSubjectIdParamsZodSchema
>;
export type TUpdateGeneralSubjectPayload = z4.infer<
  typeof updateGeneralSubjectZodSchema
>;
export type TUpdateGeneralSubjectSingleFieldPayload = z4.infer<
  typeof updateGeneralSubjectSingleFieldZodSchema
>;
export type TDeleteGeneralSubjectParams = z4.infer<
  typeof deleteGeneralSubjectIdParamsZodSchema
>;
export type TGetSingleSubjectParams = z4.infer<
  typeof getSingleGeneralSubjectParamsZodSchema
>;

export const subjectZodSchema = {
  createGeneralSubjectZodSchema,
  updateGeneralSubjectIdParamsZodSchema,
  updateGeneralSubjectZodSchema,
  updateGeneralSubjectSingleFieldZodSchema,
  deleteGeneralSubjectIdParamsZodSchema,
  getSingleGeneralSubjectParamsZodSchema,
};
