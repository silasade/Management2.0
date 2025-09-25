import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a supabase client tied to the request/response cookies
  const supabase = createMiddlewareClient({ req, res });

  const publicUrls = ["/reset-password"];
  if (publicUrls.includes(req.nextUrl.pathname)) {
    return res;
  }

  // This will automatically refresh the session if the access token is expired,
  // as long as the refresh token cookie is still valid.
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // If no session, redirect to home
  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If session exists but has no provider_token, redirect to Google sign-in
  if (!session.provider_token) {
    return NextResponse.redirect(
      new URL("/api/auth/signin-with-google", req.url)
    );
  }

  return res;
}

export const config = {
  matcher: ["/home/:path*"],
};
