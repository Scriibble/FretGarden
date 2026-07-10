const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 8_000;

type WaitlistRequest = {
  email?: unknown;
  source?: unknown;
  website?: unknown;
};

function normalizedString(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: "Submit the waitlist form using JSON." },
      { status: 415 }
    );
  }

  let body: WaitlistRequest;

  try {
    body = (await request.json()) as WaitlistRequest;
  } catch {
    return Response.json(
      { error: "The waitlist submission could not be read." },
      { status: 400 }
    );
  }

  // Silently accept honeypot submissions so bots do not learn how the filter works.
  if (normalizedString(body.website, 200)) {
    return Response.json({
      message: "You’re on the FretGarden email list."
    });
  }

  const email = normalizedString(body.email, 254).toLowerCase();
  const source = normalizedString(body.source, 80) || "unknown";

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    return Response.json(
      {
        error:
          "The FretGarden email list is still being connected. Please try again later."
      },
      { status: 503 }
    );
  }

  try {
    new URL(webhookUrl);
  } catch {
    return Response.json(
      { error: "The FretGarden email list is temporarily unavailable." },
      { status: 503 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  const webhookToken = process.env.WAITLIST_WEBHOOK_TOKEN?.trim();

  if (webhookToken) {
    headers.Authorization = `Bearer ${webhookToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        source,
        project: "FretGarden",
        subscribedAt: new Date().toISOString()
      }),
      cache: "no-store",
      signal: controller.signal
    });

    if (!webhookResponse.ok) {
      return Response.json(
        { error: "The email list could not be reached. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({
      message:
        "You’re on the FretGarden email list. Watch your inbox for future development updates."
    });
  } catch {
    return Response.json(
      { error: "The email list could not be reached. Please try again." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
