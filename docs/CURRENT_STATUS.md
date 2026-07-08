# Pocket.Practice Current Status

This document describes the repository as it exists today. Treat `README.md` as the long-term product vision and `Pocket_Practice_Master_Plan.md` as the MVP planning source.

## Current Product Shape

Pocket.Practice is currently a browser-based guitar fretboard practice app for standard EADGBE tuning. The working app focuses on short drills, immediate feedback, local session history, and lesson-linked practice.

The current MVP is broader than the earliest master-plan scope. It includes note recognition, chord tone recognition, scale degree recognition, interval landmarks, CAGED octave shapes, and triad inversion recognition.

## Architecture

- `apps/web`: Next.js app router application with React client components.
- `packages/music-theory-engine`: framework-independent TypeScript package for notes, pitch classes, intervals, major/minor scales, and major/minor triads.
- `packages/fretboard-engine`: framework-independent TypeScript package for standard guitar tuning, fret positions, note lookup, scale maps, and chord maps.
- `apps/web/app/lib`: drill logic, lesson data, browser storage helpers, and local lesson progress helpers.
- `apps/web/app/components`: UI components for the fretboard explorer, practice hub, settings, review, lessons, and progress dashboard.

## Persistence

Progress is local-only. The app stores recent drill sessions, custom drill presets, and lesson progress in `window.localStorage`.

There is no account system, backend sync, database, subscription flow, or cloud progress history.

## Known Architecture Debt

- `FretboardExplorer.tsx` still owns too much state and behavior. It should continue to be split into focused hooks and drill-specific view/controller modules.
- Several app dependencies are planned or installed ahead of usage. `zustand` and `zod` are present but not yet central to the implementation.
- The root scripts build internal packages before typecheck/test/lint so a clean restore does not depend on pre-existing `dist` folders.

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

1. Continue extracting state and storage logic out of `FretboardExplorer.tsx`.
2. Decide whether all six current drills belong in the first public MVP, or whether the MVP should narrow around notes, chord tones, and scale degrees first.
3. Add browser-level regression coverage for the main lesson-to-practice flow.
4. Introduce structured validation for localStorage payloads if progress data becomes more complex.
5. Revisit `zustand` only when shared client state becomes clearer than the current component-local state model.
