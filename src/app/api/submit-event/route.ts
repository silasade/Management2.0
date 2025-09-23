import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EventSchema } from "./EventSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = EventSchema.safeParse(body);

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
      .insert([parsed.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          message: error.message || "Something went wrong",
          cause: error.cause,
          details: error.details,
          name: error.name,
        },
        { status:  400 }
      );
    }

    return NextResponse.json(
      { message: "Event created successfully", event: data },
      { status: 201 }
    );
  } catch (error) {
    const e= error as Error
    return NextResponse.json(
      {
        message: (error as Error).message || "Failed to create event",
        cause: e.cause,
        name: e.name,
      },
      { status: 500 }
    );
  }
}
