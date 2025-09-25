import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EventSchema } from "./EventSchema";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const parsed = EventSchema.safeParse(body);
    const id = (await params).id
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.flatten() },
        { status: 422 }
      );
    }
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase
      .from("Events")
      .update([parsed.data])
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json(
        { message: error.message || "Something went wrong" },
        { status: Number(error.code) || 400 }
      );
    }

    return NextResponse.json(
      { message: "Event updated successfully", event: data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Failed to create event" },
      { status: 500 }
    );
  }
}
