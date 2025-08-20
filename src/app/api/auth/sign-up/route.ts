import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const cookieStore = cookies();
  const { email, password, firstName, lastName } = await req.json();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        firstName: firstName,
        lastName: lastName,
      },
      emailRedirectTo: `${url.origin}/api/auth/callback`,
    },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.redirect(url.origin, {
    status: 301,
  });
}
