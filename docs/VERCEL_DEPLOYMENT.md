# Vercel Deployment

Use this guide to host a private Pocket.Practice demo on Vercel.

## Current Fit

FretGarden can be deployed to Vercel as a local-first Next.js app with
Supabase-backed account creation. Lesson progress, drill history, and presets
are still stored in each browser's `localStorage`.

This means:

- Supabase environment variables are required for signup, login, password reset,
  account, profile editing, and auth callback routes.
- Testers on different browsers or devices will not share progress.
- Resetting demo progress only clears the current browser.

Required account environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

The waitlist integration is optional and uses the private variables documented
in `docs/WAITLIST_SETUP.md`.

Optional tester survey environment variable:

```bash
NEXT_PUBLIC_TESTER_SURVEY_URL="https://forms.gle/your-form"
```

When this value is present, `/tester-feedback` links directly to the live
tester survey. When it is absent, the page explains that the survey link is not
configured yet.

## Supabase Auth Redirects

Confirm these URLs in the hosted Supabase Auth URL configuration before inviting
external account testers:

- **Site URL:** the production FretGarden URL when production is ready.
- **Local development callback:** `http://127.0.0.1:3000/auth/callback`
- **Localhost callback:** `http://localhost:3000/auth/callback`
- **Vercel preview callback:** the preview deployment callback URL, or the
  approved preview wildcard pattern for this project.
- **Production callback:** `https://<production-domain>/auth/callback`

The checked-in `supabase/config.toml` covers local CLI development only. Hosted
Supabase redirect settings must be verified in the Supabase dashboard or via
the project management API.

## Recommended Vercel Setup

Import the GitHub repository into Vercel with these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`

The `apps/web/vercel.json` file records these build settings so the Vercel project should pick them up when Root Directory is set to `apps/web`.

## Why These Settings

The web app lives in `apps/web`, and that package owns the `next` dependency Vercel needs to detect the framework. The app imports workspace packages from `packages/music-theory-engine` and `packages/fretboard-engine`, so the `apps/web` build script runs `pnpm -w build:packages` before `next build`.

## Pre-Deploy Checks

Run these from the repository root before pushing a demo build:

```bash
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## After Deploying

1. Open the Vercel preview or production URL.
2. Walk through the demo path in `docs/DEMO_TEST_PLAN.md`.
3. Confirm the first lesson opens.
4. Confirm the note, chord-tone, and scale-degree drills work.
5. Confirm the reset button clears local demo progress.
6. Create a test account, confirm the email if required, sign in, open
   `/account`, and sign out.
7. Confirm `/forgot-password`, `/update-password`, and `/account-notice`
   render correctly. Test a real password reset email before inviting broader
   account testers.
8. Confirm `/privacy`, `/terms`, `/accessibility`, and `/tester-feedback`
   render correctly.
9. If a tester survey is live, confirm `NEXT_PUBLIC_TESTER_SURVEY_URL` opens the
   expected form from `/tester-feedback`.
10. Confirm the Supabase hosted redirect allow-list includes the local, preview,
   and production callback URLs listed above.

## Needed From The Project Owner

To complete deployment in Vercel, provide or confirm:

- The GitHub repository is pushed and available to Vercel.
- Which Vercel account/team should own the project.
- The project name to use in Vercel.
- Whether the first deployment should be a preview URL or promoted to production.
- Optional custom domain, if any.
