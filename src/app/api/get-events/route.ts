import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventClass = searchParams.get("class"); // "all" | "upcoming" | "completed"
    const searchByTitle = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const now = new Date().toISOString();
    // start building query
    let query = supabase.from("Events").select("*", { count: "exact" });
    // Apply class filters
    if (eventClass === "upcoming") {
      query = query
        .gt("startDateTime", now)
        .order("startDateTime", { ascending: true });
    } else if (eventClass === "completed") {
      query = query
        .lt("endDateTime", now)
        .order("endDateTime", { ascending: false });
    }
    // Apply search filter (independent of class filter)
    if (searchByTitle) {
      query = query.ilike("title", `%${searchByTitle}%`);
    }

    // Pagination (range is inclusive, so subtract 1 from end index)
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        data,
        meta: {
          total: count ?? 0,
          page,

          limit,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
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
