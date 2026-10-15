import z4 from "zod/v4";

const subjectName = (requiredMessage: string) =>
  z4
    .string({ error: requiredMessage })
    .trim()
    .min(1, "Subject name cannot be empty.");

const createSubjectZodSchema = z4.object({
  subject_name: subjectName("Subject name is required."),
});

const updateSubjectParamsZodSchema = z4.object({
  id: z4.uuid({ message: "Invalid subject ID format." }),
});

const updateSubjectZodSchema = createSubjectZodSchema;

const updateSubjectSingleFieldZodSchema = z4.object({
  field: z4.literal("subject_name"),
  value: subjectName("Subject name is required."),
});

const deleteSubjectParamsZodSchema = updateSubjectParamsZodSchema;
const getSingleSubjectParamsZodSchema = updateSubjectParamsZodSchema;

export type TCreateSubjectPayload = z4.infer<typeof createSubjectZodSchema>;
export type TUpdateSubjectParams = z4.infer<typeof updateSubjectParamsZodSchema>;
export type TUpdateSubjectPayload = z4.infer<typeof updateSubjectZodSchema>;
export type TUpdateSubjectSingleFieldPayload = z4.infer<
  typeof updateSubjectSingleFieldZodSchema
>;
export type TDeleteSubjectParams = z4.infer<typeof deleteSubjectParamsZodSchema>;
export type TGetSingleSubjectParams = z4.infer<
  typeof getSingleSubjectParamsZodSchema
>;

export const subjectZodSchema = {
  createSubjectZodSchema,
  updateSubjectParamsZodSchema,
  updateSubjectZodSchema,
  updateSubjectSingleFieldZodSchema,
  deleteSubjectParamsZodSchema,
  getSingleSubjectParamsZodSchema,
};
