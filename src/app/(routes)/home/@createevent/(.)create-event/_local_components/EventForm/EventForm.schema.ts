import { z } from "zod";

const reminderSchema = z.object({
  method: z.enum(["email", "popup"]),
  minutes: z.number().min(1), // minutes before event
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),

  organizer: z
    .object({
      name: z.string(),
      email: z.string().email("Invalid email").or(z.literal("")).optional(),
      phone: z.string().optional(),
    })
    .optional(),
  eventType: z.string().optional(),
  reminders: z.array(reminderSchema).optional(),
});
