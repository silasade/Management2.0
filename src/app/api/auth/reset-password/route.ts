import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies: () => cookies() });
    const { error } = await supabase.auth.updateUser({ password });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
