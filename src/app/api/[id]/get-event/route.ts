import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}
export async function GET({ params }: RouteParams) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    let { data: Events, error } = await supabase
      .from("Events")
      .select("*")
      .eq("id", id);

    if (error)
      return NextResponse.json({ message: error.message }, { status: 400 });

    return NextResponse.json(
      { data: Events, message: "Event fetched successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Something went wrong" },
      {
        status: 200,
      }
    );
  }
}
