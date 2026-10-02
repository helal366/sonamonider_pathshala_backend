import z4 from "zod/v4";

const studentReadmissionZodSchema = z4.object({
  student_id: z4.uuid({
    error: (issue) => {
      issue.input === undefined
        ? "Student ID is required."
        : "Invalid student ID format.";
    },
  }),
  
});
