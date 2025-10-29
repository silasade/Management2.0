import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { EventSchema } from "./schema";

// Create the provider with your Gemini API key
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { extractedText } = await req.json();

    if (!extractedText || extractedText.trim() === "") {
      return new Response(
        JSON.stringify({ error: "No invitation text provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `
You are an AI that converts event invitation text into structured JSON for a calendar.
You can infer an eventType from description.
you can also infer the description from the title if not found and vice versa.
if you can't find the startDateTime it can be the same as endDate time and vice versa.
Make sure to convert the date to ISO format.
For "organizer.email":
- Must be in the format user@domain.com.
- If not present or invalid, output exactly "NOT FOUND"
Do not output placeholders like "@", "•@", etc.
Return ONLY a valid JSON object. 
Do not add explanations, code blocks, or text before/after the JSON.


{
  "title": "string",
  "description": "string",
  "location": "string",
  "startDateTime": "string",
  "endDateTime": "string",
  "organizer": {"name": "string", "email": "string", "phone": "string"},
  "eventType": "string"
}

If a field is missing, use "NOT FOUND".
Ensure email and phone are valid formats; otherwise, set them to "NOT FOUND".

Invitation text: """${extractedText}"""
`;

    const result = await generateObject({
      model: openrouter("mistralai/mistral-7b-instruct:free"),
      prompt,
      schema: EventSchema,
      mode: "json",
    });
    const raw = JSON.stringify(result.object);
    const cleaned = cleanJSON(raw);

    const eventObject = EventSchema.parse(JSON.parse(cleaned));

    return new Response(JSON.stringify(eventObject), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Error generating event object",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
function cleanJSON(raw: string) {
  return raw
    .replace(/```json|```/g, "") // remove ```json and ```
    .replace(/Here is the JSON output[:]?/i, "") // remove intro text
    .trim();
}
