import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json(
        { message: "Missing event ID" },
        { status: 400 }
      );
    }
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    const { error } = await supabase.from("Events").delete().eq("id", id);
    if (error) {
      return NextResponse.json(
        { message: error.message || "Failed to delete event" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
}
