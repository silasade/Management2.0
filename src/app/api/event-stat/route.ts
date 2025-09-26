import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });

    const now = new Date().toISOString();
    // Total events
    const { count: totalEvents, error: totalError } = await supabase
      .from("Events")
      .select("*", { count: "exact", head: true });
    if (totalError) {
      return NextResponse.json(
        { message: totalError.message },
        { status: 400 }
      );
    }
    // Upcoming events = startDateTime > now
    const { count: upcomingEvents, error: upcomingError } = await supabase
      .from("Events")
      .select("*", { count: "exact", head: true })
      .gt("startDateTime", now);
    if (upcomingError) {
      return NextResponse.json(
        { message: upcomingError.message },
        { status: 400 }
      );
    }
    // Completed events = endDateTime < now
    const { count: completedEvents, error: completedError } = await supabase
      .from("Events")
      .select("*", { count: "exact", head: true })
      .lte("endDateTime", now);
    if (completedError) {
      return NextResponse.json(
        { message: completedError.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        totalEvents: totalEvents ?? 0,
        upcomingEvents: upcomingEvents ?? 0,
        completedEvents: completedEvents ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || "Error fetching event statistics",
      },
      { status: 500 }
    );
  }
}
