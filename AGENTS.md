# AGENTS.md

Guidance for future Codex sessions working in this repository.

## Read First

- Treat `docs/CURRENT_STATUS.md` as the current source of truth for what the restored repo actually does.
- Treat `Pocket_Practice_Master_Plan.md` as the MVP planning document.
- Treat `README.md` as a long-term future goals document, not a description of current app behavior.
- Before making broad product or architecture changes, re-check the current app structure and package scripts because this repo was restored after a drive wipe.

## Project Goal

Pocket.Practice is a browser-based guitar fretboard practice app. The current working product helps learners practice short drills, get immediate feedback, review local session history, and connect short lessons to matching practice sessions.

The current demo layer includes a tester checklist and local reset control so a few people can try the first learning loop on the same device or browser.

The first public learning loop should stay focused on:

- Note recognition
- Chord tones
- Scale degrees

The app also currently includes advanced/stretch drills:

- Interval landmarks
- CAGED octave shapes
- Triad inversion recognition

Longer-term roadmap items such as bass, alternate tunings, audio, ear training, accounts, cloud sync, subscriptions, marketplace features, and a backend are intentionally deferred.

## Current Stack

- TypeScript
- pnpm workspace, pinned via `packageManager` to `pnpm@11.7.0`
- Next.js App Router in `apps/web`
- React client components
- Vitest for unit tests
- Playwright for browser E2E tests
- Zod for localStorage payload validation
- Zustand is installed, but not yet central to state management

## Repository Structure

- `apps/web`: Next.js app and browser UI.
- `apps/web/app/components`: UI components for the fretboard explorer, practice hub, lesson cards, settings, review, and progress dashboard.
- `apps/web/app/lib`: drill logic, lesson data, localStorage helpers, practice storage snapshot loading, shared session completion persistence, Zod validation, and lesson progress helpers.
- `apps/web/app/lessons`: lesson list and lesson detail routes.
- `apps/web/e2e`: Playwright coverage for the practice hub and core note/chord/scale lesson-to-practice flows.
- `packages/music-theory-engine`: UI-independent TypeScript package for notes, pitch classes, intervals, major/minor scales, and major/minor triads.
- `packages/fretboard-engine`: UI-independent TypeScript package for standard guitar tuning, fret positions, note lookup, scale maps, and chord maps.
- `docs/CURRENT_STATUS.md`: current state and near-term roadmap.
- `docs/DEMO_TEST_PLAN.md`: tester script, feedback questions, and temporary deployment notes for private demos.
- `Pocket_Practice_Master_Plan.md`: MVP planning source.

## Current Persistence Model

- All progress is local-only via `window.localStorage`.
- Stored data includes recent drill sessions, custom drill presets, and lesson progress.
- `apps/web/app/lib/browserStorage.ts` owns low-level browser storage helpers.
- `apps/web/app/lib/practiceStorage.ts` owns practice-specific storage keys and the aggregate stored practice snapshot.
- `apps/web/app/lib/practiceSessionCompletion.ts` owns shared session completion persistence for drill histories.
- `apps/web/app/lib/lessonProgress.ts` owns lesson progress parsing, serialization, and course progress logic.
- Stored session history, presets, and lesson progress should be validated before the app uses them.
- The Practice Hub includes a reset button for clearing local demo progress between testers.
- There is no account system, backend sync, database, or cloud history.

## Commands

Run commands from the repository root unless noted.

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm lint
```

Command notes:

- `pnpm dev` starts the web app through `@pocket-practice/web`.
- `pnpm build:packages` builds the two internal engine packages.
- `pnpm typecheck`, `pnpm test`, and `pnpm lint` build internal packages first so a clean restore does not depend on existing `dist` files.
- `pnpm test` runs Vitest unit tests. The web package excludes `apps/web/e2e/**` so Playwright specs are not collected by Vitest.
- `pnpm test:e2e` runs Playwright. It starts the Next dev server on `http://127.0.0.1:3000`.
- Playwright browser binaries may need to be installed with `pnpm --filter @pocket-practice/web exec playwright install chromium` on a fresh machine.

## Development Conventions

- Keep engine packages framework-independent. Do not add React, DOM, or browser storage assumptions to `packages/music-theory-engine` or `packages/fretboard-engine`.
- Prefer adding tested pure logic in `apps/web/app/lib` before wiring it into large React components.
- `FretboardExplorer.tsx` is still too large. Storage hydration and session completion persistence have been extracted; when changing related behavior, prefer extracting drill setup, prompt progression, answer handling, hooks, or drill-specific modules instead of adding more state and branching there.
- Preserve the current local-only MVP unless the user explicitly asks for backend/account work.
- Keep the first public MVP messaging centered on notes, chord tones, and scale degrees while leaving advanced drills accessible.
- Do not treat the long-term README roadmap as implemented functionality.
- Use Zod or existing structured helpers for localStorage parsing instead of ad hoc casts.
- Keep Playwright specs in `apps/web/e2e`; keep unit tests next to the logic they cover.
- Prefer small, scoped changes and verify with the narrowest useful command, then broader checks for cross-cutting edits.

## Testing Guidance

- For engine changes, run the relevant package tests plus root `pnpm typecheck`.
- For drill logic changes under `apps/web/app/lib`, run `pnpm --filter @pocket-practice/web test` or root `pnpm test`.
- For lesson-to-practice navigation, persistence, or hub UI changes, run `pnpm test:e2e`.
- For Next component or route changes, run `pnpm typecheck`; run `pnpm build` when route generation or production behavior may be affected.
- If Playwright fails after a successful run, remove generated `apps/web/test-results/` unless the user needs the artifact.

## Current Roadmap

Near-term work:

1. Run a hands-on demo pass with 2-5 testers using `docs/DEMO_TEST_PLAN.md`.
2. Continue extracting state and behavior out of `FretboardExplorer.tsx`, especially drill setup and answer handling.
3. Consider a small shared test utility for browser localStorage mocks if storage tests keep growing.
4. Keep the first public MVP visually and conceptually centered on notes, chord tones, and scale degrees.
5. Revisit Zustand only when shared client state becomes clearer than component-local state.

Deferred until product fit is clearer:

- Bass support
- Alternate tunings
- Audio playback, tuner, MIDI, recording, and ear training
- Authentication and cloud sync
- Supabase or another backend
- Stripe, subscriptions, or payments
- Video lesson hosting
- User-generated content or marketplace features

## Recent Recovery Context

This repo was restored after a drive wipe. Recent local commits restored project status and local tooling, added Zod-backed storage validation, Playwright browser regression coverage, a Practice Hub split between the core MVP path and advanced practice, and extracted practice storage/session completion helpers. Future sessions should preserve those recovery notes and avoid assuming missing future-roadmap features exist.
