export const logoutZodSchema = z4.object({});
export type TLogoutZodSchema = z4.infer<typeof logoutZodSchema>;
import z4 from "zod/v4";

export const loginZodSchema = z4.object({
  user_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User name is required"
          : "Invalid username format",
    })
    .trim()
    .min(1, "User name is required")
    .regex(/^01\d{9}(?:-\d+)?$/, "Invalid username format"),
  user_password: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User password is required"
          : "Invalid password format",
    })
    .min(6, "User password must be at least 6 characters"),
});
export type TLoginZodSchema = z4.infer<typeof loginZodSchema>;
