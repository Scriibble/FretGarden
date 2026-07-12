import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/account";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_confirmation_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase confirmation callback failed:", error);

    return NextResponse.redirect(
      new URL("/login?error=confirmation_failed", requestUrl.origin)
    );
  }

  const destination = next.startsWith("/") ? next : "/account";

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}