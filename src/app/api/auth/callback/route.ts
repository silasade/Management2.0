import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });
    const {error}=await supabase.auth.exchangeCodeForSession(code);
    if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
  }

return NextResponse.redirect(`${url.origin}/home`, { status: 302 });
}
