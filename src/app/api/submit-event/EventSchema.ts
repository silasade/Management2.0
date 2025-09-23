import { z } from "zod";

export const EventSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  organizerName: z.string(),
  organizerEmail: z.string().optional(),
  organizerPhone: z.string().optional(),
  eventType: z.string().optional(),
  googleEventId:z.string()
});
