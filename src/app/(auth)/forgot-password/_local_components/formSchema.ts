import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export { formSchema };
