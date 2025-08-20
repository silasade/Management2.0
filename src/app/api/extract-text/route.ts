export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response("No image provided", { status: 400 });
    }
    const formData = new FormData();
    formData.append("base64Image", imageBase64);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: process.env.OCR_SPACE_API_KEY!,
      },
      body: formData,
    });
    const data = await res.json();
    const extractedText =
      data?.ParsedResults?.[0]?.ParsedText || "No text extracted";
    return new Response(JSON.stringify({ text: extractedText }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response((error as Error).message, { status: 500 });
  }
}
