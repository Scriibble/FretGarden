# FretGarden waitlist setup

The marketing site now submits email-list requests to `POST /api/waitlist`.
The route validates the address and forwards it to a private server-side webhook.
No email addresses are written to the repository or stored on the Vercel file
system.

## Environment variables

Set these in `apps/web/.env.local` for local development and in the Vercel
project settings for deployment:

```bash
WAITLIST_WEBHOOK_URL="https://your-private-webhook.example/subscribe"
WAITLIST_WEBHOOK_TOKEN="optional-bearer-token"
```

`WAITLIST_WEBHOOK_TOKEN` is optional. Do not prefix either variable with
`NEXT_PUBLIC_`; the browser should never receive the webhook URL or token.

## Webhook payload

The configured endpoint receives JSON in this shape:

```json
{
  "email": "listener@example.com",
  "source": "about-building-in-public",
  "project": "FretGarden",
  "subscribedAt": "2026-07-10T21:00:00.000Z"
}
```

The endpoint should return any HTTP status from `200` through `299` after it
has saved the address or handed it to the email-list provider. A non-success
response is shown to the visitor as a temporary submission failure.

A webhook automation service, a small private API, or an email-marketing
provider integration can sit behind this URL. Keep provider credentials in the
webhook or server environment rather than in client-side code.

## Tester survey link

The tester feedback page uses a separate public environment variable:

```bash
NEXT_PUBLIC_TESTER_SURVEY_URL="https://forms.gle/your-form"
```

Use the blueprint at `docs/testing/GOOGLE_FORMS_TESTER_SURVEY_BLUEPRINT.md` to
create the form, then paste the live form URL into local and hosted
environments. This URL is public because it is rendered as a normal outbound
link.

## Local test

After configuring the webhook, run the app and submit either waitlist form:

```bash
pnpm dev
```

The form appears in the Building in Public section on `/about`.
