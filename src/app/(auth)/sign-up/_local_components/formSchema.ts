import { z } from "zod";

const formSchema = z.object({
  firstName:z.string(),
  lastName:z.string(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long"),
});

export { formSchema };
