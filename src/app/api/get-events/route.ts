import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventClass = searchParams.get("class"); // "all" | "upcoming" | "completed"
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const now = new Date().toISOString();
    let query = supabase.from("Events").select("*");
    if (eventClass === "upcoming") {
      query = query.gt("startDateTime", now);
    } else if (eventClass === "completed") {
      query = query.lt("endDateTime", now);
    }
    // "all" or null just fetches everything (default query)
    const { data, error } = await query;
    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { data },
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
