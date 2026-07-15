# FretGarden Current Status

This document describes the repository as it exists today. Treat `README.md` as the long-term product vision and `Pocket_Practice_Master_Plan.md` as the MVP planning source.

## Current Product Shape

FretGarden is currently a browser-based guitar fretboard practice app for standard EADGBE tuning. The working app focuses on short drills, immediate feedback, local session history, account creation, and lesson-linked practice.

The current MVP is broader than the earliest master-plan scope. It includes note recognition, chord tone recognition, scale degree recognition, interval landmarks, CAGED octave shapes, and triad inversion recognition. The UI now visually foregrounds the first public learning loop around notes, chord tones, and scale degrees while keeping the advanced drills available. A tester checklist and local reset control support short playable demo sessions.

## Architecture

- `apps/web`: Next.js App Router application with React client components, marketing pages, Supabase auth routes, and local-first practice tools.
- `packages/music-theory-engine`: framework-independent TypeScript package for notes, pitch classes, intervals, major/minor scales, and major/minor triads.
- `packages/fretboard-engine`: framework-independent TypeScript package for standard guitar tuning, fret positions, note lookup, scale maps, and chord maps.
- `apps/web/app/lib`: drill logic, lesson data, browser storage helpers, practice storage snapshot loading, shared session completion persistence, local lesson progress helpers, Supabase client helpers, and Zod-backed localStorage validation.
- `apps/web/app/components`: UI components for the fretboard explorer, practice hub, settings, review, lessons, and progress dashboard.
- `apps/web/e2e`: Playwright browser coverage for the main practice hub and core note/chord/scale lesson-to-practice flows.
- `docs/DEMO_TEST_PLAN.md`: tester script, feedback questions, and temporary deployment notes for private demos.

## Persistence

Practice progress is local-only. The app stores recent drill sessions, custom drill presets, and lesson progress in `window.localStorage`. Stored lesson progress, session history, and custom preset payloads are validated before being used by the app. The Practice Hub includes a reset button for clearing local demo progress between testers.

Account creation, sign-in, sign-out, password reset, and display-name editing
are real Supabase-backed features. The account page confirms the authenticated
user and profile shell, but it does not yet sync lesson progress, drill
history, or presets. There is no subscription flow, payment system, or cloud
progress history yet.

## Known Architecture Debt

- `FretboardExplorer.tsx` still owns too much state and behavior. Storage hydration and session completion persistence have been extracted, but drill setup and prompt handling should continue to move into focused helpers, hooks, or drill-specific modules.
- `zustand` is installed ahead of a clearer shared client-state need.
- The root scripts build internal packages before typecheck/test/lint so a clean restore does not depend on pre-existing `dist` folders.
- Unit tests and browser E2E tests are split between Vitest and Playwright so Playwright specs do not get collected by the unit runner. Browser storage validation and shared session completion persistence have focused unit coverage.
- Account UI is intentionally minimal. Login, signup, callback, signout,
  password reset, profile editing, and account routes exist, but cloud sync and
  full account settings are still future work. Public-facing privacy, terms,
  accessibility, and tester-feedback pages now document the early-access
  boundary.

## Deferred Features

The following are future roadmap items, not current app behavior:

- Bass support
- Audio playback, tuner, MIDI, and recording
- Ear training and rhythm training
- Cloud progress sync
- Stripe, subscriptions, or payments
- Video lesson hosting
- User-generated content or marketplace features

## Likely Next Steps

1. Decide how Supabase profiles should connect to local lesson and drill progress before implementing cloud sync.
2. Execute the Gate 4 accessibility and usability protocols with the test group before broad account rollout.
3. Continue extracting state and behavior out of `FretboardExplorer.tsx`, especially drill setup and answer handling.
4. Keep the first public MVP messaging centered on notes, chord tones, and scale degrees while preserving advanced drills as stretch practice.
5. Move into the curriculum overhaul once the account surface is stable.
