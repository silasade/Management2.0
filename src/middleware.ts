import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const publicUrls=["/reset-password"]
  if (publicUrls.includes(req.nextUrl.pathname)){
    return res
  }
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log(session);
  console.log(error);
  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/home/:path*"],
};
