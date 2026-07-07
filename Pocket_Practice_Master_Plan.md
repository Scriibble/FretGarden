# Pocket.Practice Master Plan

## Product Vision

Pocket.Practice helps guitar learners build practical fretboard knowledge through short, focused practice sessions for chords, scales, and note recognition.

The first version should feel like a useful practice tool, not a complete music education platform. The core promise is simple: open the app, choose a focused drill, practice for a few minutes, and see whether you are improving.

## Phase 1: Define the MVP

Goal: Narrow the first release to a small, testable learning loop.

### Audience

- Beginner to early-intermediate guitar players
- Learners who know basic open chords but struggle with fretboard fluency
- Self-taught players who want structured, repeatable practice

### MVP Scope

- One instrument: guitar
- One tuning: standard EADGBE
- Fretboard view for frets 0-12
- Notes, intervals, major/minor chords, and major/minor scales
- Practice drills with prompts, answers, feedback, and local progress
- No account required
- No payments
- No recording, tuner, MIDI, community, or marketplace

### Deliverables

- MVP feature list
- User stories
- Acceptance criteria
- Lightweight product roadmap

## Phase 2: Core Practice Experience

Goal: Build the main user workflow before expanding the platform.

### Core Screens

- Home dashboard
- Practice mode selector
- Fretboard practice screen
- Chord practice screen
- Scale practice screen
- Progress summary

### Practice Loop

1. The app gives the learner a prompt.
2. The learner answers by selecting notes, frets, chord tones, or scale tones.
3. The app gives immediate feedback.
4. The session tracks correct answers, missed items, and streaks.
5. The learner sees a small progress summary at the end.

### Deliverables

- Wireframes for the MVP screens
- Basic design system
- Clickable prototype or functional static UI
- Empty, loading, and completion states

## Phase 3: Music Theory Engine

Goal: Create a small, tested theory package that powers the app without UI assumptions.

Package:

```text
packages/music-theory-engine
```

### Responsibilities

- Notes and pitch classes
- Accidentals and enharmonic spellings
- Intervals
- Major and minor scales
- Major and minor triads
- Chord tones
- Scale degrees

### Initial API Examples

```ts
getScale("C", "major")
getChord("A", "minor")
getInterval("C", "G")
getEnharmonicNotes("F#")
```

### Acceptance Criteria

- Handles all 12 pitch classes
- Supports major and natural minor scales
- Supports major and minor triads
- Includes deterministic enharmonic behavior
- Has unit tests for common keys and edge cases
- Does not depend on React or browser APIs

## Phase 4: Fretboard Engine

Goal: Convert theory concepts into guitar fretboard positions.

Package:

```text
packages/fretboard-engine
```

Depends on:

```text
packages/music-theory-engine
```

### Responsibilities

- Standard guitar tuning
- String and fret note calculation
- Fretboard position mapping
- Chord tone mapping
- Scale tone mapping
- Data structures usable by React components

### Initial API Examples

```ts
getFretboard({ tuning: "standard", frets: 12 })
findNotesOnFretboard("C")
mapScaleToFretboard("G", "major")
mapChordToFretboard("E", "minor")
```

### Acceptance Criteria

- Correctly maps notes across strings 1-6 and frets 0-12
- Supports standard tuning first
- Returns structured data, not rendered markup
- Includes tests for open strings, octave positions, chords, and scales

## Phase 5: Frontend Application

Goal: Build the usable Pocket.Practice app around the engines.

### Recommended Stack

- TypeScript
- React
- Next.js
- Tailwind CSS
- Zustand for lightweight client state
- Zod for validating structured practice data

### MVP Features

- Interactive fretboard
- Chord tone display
- Scale pattern display
- Note recognition drill
- Chord tone drill
- Scale degree drill
- Local progress storage
- Session summary

### Deferred Features

- Authentication
- Supabase
- PostgreSQL
- Stripe
- Subscriptions
- User-generated content

## Phase 6: Educational Content

Goal: Add enough lesson content to support the practice drills without turning the MVP into a full course platform.

### Initial Content

- What the fretboard is
- How standard tuning works
- How notes repeat across the neck
- What intervals are
- How major and minor triads are built
- How major and minor scales are built

### Content Format

- Short lesson pages
- One concept per lesson
- One practice drill attached to each lesson
- Completion based on finishing the paired drill

### Acceptance Criteria

- Lessons explain only concepts used in MVP drills
- Each lesson links directly to practice
- No long-form course system required for MVP

## Phase 7: Audio

Goal: Add sound only after the visual and practice loop works.

### MVP Audio

- Optional note playback
- Optional chord playback
- Simple metronome if needed for a specific drill

### Deferred Audio

- Tuner
- Recording
- MIDI input
- Ear training
- Advanced playback controls

### Recommended Library

- Tone.js

## Phase 8: Backend and Accounts

Goal: Add persistence and monetization after the app proves useful without accounts.

### Add Later

- User accounts
- Cloud progress sync
- Saved practice history
- Courses
- Subscriptions
- Payments

### Possible Stack

- Supabase Auth
- PostgreSQL
- Stripe

### Backend Tables

- users
- profiles
- practice_sessions
- lesson_progress
- subscriptions

## Phase 9: Future Roadmap

These are intentionally outside the MVP.

- Bass support
- Alternate tunings
- Seventh chords and extended chords
- Modes
- Roman numeral analysis
- Chord finder
- Fingering suggestions
- Notation rendering with VexFlow
- Ear training
- MIDI input
- Tuner
- Recording
- Challenges
- Community features
- Marketplace

## Build Order

1. Define MVP user stories and acceptance criteria.
2. Build and test `music-theory-engine`.
3. Build and test `fretboard-engine`.
4. Build the interactive fretboard UI.
5. Add the first three practice drills.
6. Add local progress and session summaries.
7. Add short supporting lessons.
8. Add optional playback.
9. Reassess backend, accounts, and monetization.

## First Implementation Milestone

The first milestone is complete when a learner can:

- Open Pocket.Practice without signing in
- View a standard guitar fretboard
- Choose a note recognition drill
- Answer prompts on the fretboard
- Receive immediate feedback
- Finish a short session
- See a summary of correct and missed notes

