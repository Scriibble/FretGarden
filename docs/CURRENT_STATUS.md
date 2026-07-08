# Pocket.Practice Current Status

This document describes the repository as it exists today. Treat `README.md` as the long-term product vision and `Pocket_Practice_Master_Plan.md` as the MVP planning source.

## Current Product Shape

Pocket.Practice is currently a browser-based guitar fretboard practice app for standard EADGBE tuning. The working app focuses on short drills, immediate feedback, local session history, and lesson-linked practice.

The current MVP is broader than the earliest master-plan scope. It includes note recognition, chord tone recognition, scale degree recognition, interval landmarks, CAGED octave shapes, and triad inversion recognition. The UI now visually foregrounds the first public learning loop around notes, chord tones, and scale degrees while keeping the advanced drills available.

## Architecture

- `apps/web`: Next.js app router application with React client components.
- `packages/music-theory-engine`: framework-independent TypeScript package for notes, pitch classes, intervals, major/minor scales, and major/minor triads.
- `packages/fretboard-engine`: framework-independent TypeScript package for standard guitar tuning, fret positions, note lookup, scale maps, and chord maps.
- `apps/web/app/lib`: drill logic, lesson data, browser storage helpers, local lesson progress helpers, and Zod-backed localStorage validation.
- `apps/web/app/components`: UI components for the fretboard explorer, practice hub, settings, review, lessons, and progress dashboard.
- `apps/web/e2e`: Playwright browser coverage for the main practice hub and lesson-to-practice flows.

## Persistence

Progress is local-only. The app stores recent drill sessions, custom drill presets, and lesson progress in `window.localStorage`. Stored lesson progress, session history, and custom preset payloads are validated before being used by the app.

There is no account system, backend sync, database, subscription flow, or cloud progress history.

## Known Architecture Debt

- `FretboardExplorer.tsx` still owns too much state and behavior. It should continue to be split into focused hooks and drill-specific view/controller modules.
- `zustand` is installed ahead of a clearer shared client-state need.
- The root scripts build internal packages before typecheck/test/lint so a clean restore does not depend on pre-existing `dist` folders.
- Unit tests and browser E2E tests are split between Vitest and Playwright so Playwright specs do not get collected by the unit runner.

## Deferred Features

The following are future roadmap items, not current app behavior:

- Bass support
- Audio playback, tuner, MIDI, and recording
- Ear training and rhythm training
- Authentication and cloud sync
- Supabase or another backend
- Stripe, subscriptions, or payments
- Video lesson hosting
- User-generated content or marketplace features

## Likely Next Steps

1. Continue extracting state and behavior out of `FretboardExplorer.tsx`, especially drill setup, prompt flow, and completion handling.
2. Add focused unit coverage around the browser storage validation helpers and malformed localStorage payloads.
3. Expand Playwright coverage for the remaining lesson-linked drills once their MVP priority is settled.
4. Keep the first public MVP messaging centered on notes, chord tones, and scale degrees while preserving advanced drills as stretch practice.
5. Revisit `zustand` only when shared client state becomes clearer than the current component-local state model.
