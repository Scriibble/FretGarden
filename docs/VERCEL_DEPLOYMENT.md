# Vercel Deployment

Use this guide to host a private Pocket.Practice demo on Vercel.

## Current Fit

Pocket.Practice can be deployed to Vercel without backend setup. The current app is a local-only Next.js demo: lesson progress, drill history, and presets are stored in each browser's `localStorage`.

This means:

- No environment variables are required for the current demo.
- Testers on different browsers or devices will not share progress.
- Resetting demo progress only clears the current browser.

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

## Needed From The Project Owner

To complete deployment in Vercel, provide or confirm:

- The GitHub repository is pushed and available to Vercel.
- Which Vercel account/team should own the project.
- The project name to use in Vercel.
- Whether the first deployment should be a preview URL or promoted to production.
- Optional custom domain, if any.
