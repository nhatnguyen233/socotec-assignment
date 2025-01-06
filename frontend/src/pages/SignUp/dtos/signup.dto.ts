import { z } from "zod";

// Define the Zod schema
export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmedPassword: z
      .string()
      .min(6, "Confirmed password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"], // Error will be attached to this field
  });

// Infer the TypeScript type
export type SignUpFormData = z.infer<typeof signUpSchema>;
