import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return NextResponse.json(
      {
        ok: false,
        service: "supabase",
        error: "Supabase environment variables are missing."
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: publishableKey
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          service: "supabase",
          error: "Supabase rejected the connection.",
          upstreamStatus: response.status
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      service: "supabase",
      message: "FretGarden successfully reached Supabase."
    });
  } catch (error) {
    console.error("Supabase health check failed:", error);

    return NextResponse.json(
      {
        ok: false,
        service: "supabase",
        error: "FretGarden could not reach Supabase."
      },
      { status: 503 }
    );
  }
}