import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies(); // await is required in Next.js App Router
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const session = sessionData?.session;

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    if (sessionError) {
      return NextResponse.json(
        { error: sessionError.message },
        { status: 400 }
      );
    }
    const user = userData.user;

    const fullName = user?.user_metadata?.full_name ?? null;
    const [firstName, lastName] = fullName ? fullName.split(" ") : [null, null];

    return NextResponse.json({
      firstName,
      lastName,
      email: userData.user?.email ?? null,
      provider_token: session?.provider_token ?? null,
    });
  } catch (err: any) {
    console.error("Error in GET /api/user/me:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
