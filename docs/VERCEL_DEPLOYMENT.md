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
- **Root Directory:** repository root
- **Install Command:** `pnpm install --frozen-lockfile`
- **Build Command:** `pnpm build:packages && pnpm --filter @pocket-practice/web build`
- **Output Directory:** `apps/web/.next`

The root `vercel.json` records these build settings so the Vercel project should pick them up from the repo.

## Why These Settings

The web app lives in `apps/web`, but it imports workspace packages from `packages/music-theory-engine` and `packages/fretboard-engine`. Those packages export built `dist` files, so Vercel needs to build the internal packages before building the Next app.

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
