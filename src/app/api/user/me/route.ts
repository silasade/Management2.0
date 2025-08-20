import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.auth.getUser();
  const {data:{session}}=await supabase.auth.getSession()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({
    firstName: data.user?.user_metadata.firstName,
    lastName: data.user?.user_metadata.lastName,
    email: data.user?.email,
    provider_token:session?.provider_token
  });
}
