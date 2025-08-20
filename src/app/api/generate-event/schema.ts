import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().default("NOT FOUND"),
  description: z.string().default("NOT FOUND"),
  location: z.string().default("NOT FOUND"),
  startDateTime: z.string().default("NOT FOUND"),
  endDateTime: z.string().default("NOT FOUND"),
  organizer: z
    .object({
      name: z.string().default("NOT FOUND"),
      email: z
        .string()
        .transform((val) => (/^\S+@\S+\.\S+$/.test(val) ? val : "NOT FOUND"))
        .default("NOT FOUND"),

      phone: z.union([z.literal("NOT FOUND"), z.string()]),
    })
    .default({ name: "NOT FOUND", email: "NOT FOUND", phone: "NOT FOUND" }),
  eventType: z.string().default("NOT FOUND"),
});

