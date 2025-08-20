import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieStore = cookies();
  const url = new URL(req.url);
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${url.origin}/api/auth/callback`, 
      scopes:'https://www.googleapis.com/auth/calendar'
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(data.url); // sends user to Google
}
