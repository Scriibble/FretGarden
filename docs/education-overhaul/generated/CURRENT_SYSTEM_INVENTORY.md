# Current System Inventory

Generated for Phase 0 of the FretGarden education-system overhaul.

## Baseline

- Branch: `feature-database`
- Working tree before audit edits: clean
- Validation run on 2026-07-14:
  - `pnpm test`: passed; package builds plus 139 Vitest tests.
  - `pnpm typecheck`: passed.
  - `pnpm lint`: passed; this repo's lint scripts run TypeScript checks.
  - `pnpm build`: passed; Next generated 26 static pages.
  - `pnpm test:e2e`: passed; 13 Chromium Playwright tests.

## Repository Map

- `apps/web`: Next.js App Router app with lesson pages, practice UI, local storage, Supabase auth shell, Vitest tests, and Playwright tests.
- `apps/web/app/lib`: lesson data, drill evaluators, progress helpers, browser storage, practice history summaries, and Supabase helpers.
- `apps/web/app/components`: client UI for lessons, practice, review, history, and progress displays.
- `packages/music-theory-engine`: pure note, scale, chord, interval, transposition, and enharmonic utilities.
- `packages/fretboard-engine`: pure standard-tuning fretboard map, note lookup, scale-to-fretboard, and chord-to-fretboard utilities.
- `supabase`: local Supabase config and one migration for public user profiles.
- `docs`: current product, demo, deployment, content-agent, and brand documentation.

## Curriculum And Lesson Content

- Primary source: `apps/web/app/lib/lessons.ts`.
- Current count: 13 lesson objects.
- Lesson shape includes `slug`, `eyebrow`, `title`, `summary`, prose sections, fretboard applications, play prompts, song connection, creative task, check-understanding Q/A, and one paired practice link.
- Paired drill types: `note`, `chordTone`, `scaleDegree`, `interval`, `octaveShape`, `triadInversion`.
- Paired practice criteria are currently prompt-count plus minimum accuracy, commonly 10 or 12 prompts at 80 percent or higher.
- `apps/web/app/lessons/[slug]/page.tsx` renders lessons as static pages with reading sections, guided play prompt, song connection, writing task, check-understanding answers, lesson completion checklist, and optional drill card.
- Lesson content is authored as TypeScript objects, not as versioned educational content records. There are no explicit objective IDs, evidence requirements, prerequisite graph, review policy, remediation route, accessibility-equivalent record, or content version per lesson.

## Lesson Completion And Course Path

- Learning progress source: `apps/web/app/lib/lessonLearningProgress.ts`.
- Storage key: `pocket-practice:lesson-learning-progress`.
- Status values: `in-progress`, `complete`.
- Required checkpoints: `read`, `play`, `write`.
- `LessonCompletionCard` starts a lesson automatically when the page loads, lets the learner check each checkpoint, and also exposes a `Mark lesson complete` button that completes all checkpoints at once.
- `buildLearningCourseProgress` derives the current lesson, up-next lesson, percent complete, and path state from the first incomplete lesson in the array order.
- This learning path has no prerequisite evidence check, no delayed retrieval requirement, and no independent validation of the self-reported checklist.

## Practice Reinforcement And Lesson Practice Progress

- Practice progress source: `apps/web/app/lib/lessonProgress.ts`.
- Storage key: `pocket-practice:lesson-progress`.
- Status values: `in-progress`, `complete`.
- `markLessonStarted` is called when a lesson-linked practice URL opens.
- `markLessonPracticed` marks a lesson practice record complete when the drill session reaches the lesson's `promptCount` and `minAccuracy`.
- The practice card says drills are optional reinforcement and no longer define lesson completion, but Playwright tests still assert lesson-linked drills persist `status: "complete"` in `pocket-practice:lesson-progress`.
- Drill practice completion is separate from checklist lesson completion, but both use the learner-facing word "complete".

## Drill And Exercise Runtime

- Shared drill helpers: `apps/web/app/lib/drillSession.ts` and `apps/web/app/lib/practiceSessionCompletion.ts`.
- A drill summary stores attempted count, correct count, missed count, accuracy, and an `isComplete` flag once attempts reach the prompt count.
- Completion creates a compact session with ID, completion time, prompt count, correct, missed, accuracy, and missed prompts.
- The live practice component is `apps/web/app/components/FretboardExplorer.tsx`.
- Six drills are implemented:
  - Note recognition: click a fretted position for a target note on a target string.
  - Chord tones: choose a note name for a requested root, quality, and chord tone.
  - Scale degrees: click a fretted position for a requested scale degree on a target string.
  - Interval landmarks: click a fretted position for an interval above a root on a target string.
  - Octave shapes: click a target octave position from a highlighted source.
  - Triad inversions: choose the bass note for a requested inversion.
- Prompt generation supports fixed or random order, selected filters, short/full session length, custom presets, and missed-prompt review mode.
- The fretboard UI hides answer labels before most fretboard-answer attempts, then highlights/reveals the correct answer after a selection.
- Open-string answers are rejected for note, scale-degree, interval, and octave-shape drills.

## Feedback, Review, And Recommendations

- Immediate feedback is shown after each attempt with correct-answer revelation and a short explanation.
- Missed prompts are stored in completed sessions and displayed in the review panel.
- The review panel allows "Practice misses", which switches the active drill to `reviewMode: "missed"` and fixed prompt order.
- Performance summaries aggregate weak spots by category and sort by low accuracy, misses, attempted count, and label.
- Practice Hub recommendation chooses a strong weak spot first when accuracy is below 80 percent or misses are at least 2; otherwise it recommends the current learning course lesson's paired drill, then any visible weak spot, then note warmup.
- There is no delayed review schedule, evidence recency model, durable retention state, or distinction between immediate correction and independent later retrieval.

## Persistence And Data

- Current educational progress is local-first through `window.localStorage`.
- Stored items include lesson learning progress, lesson practice progress, drill session histories, and custom presets.
- Zod validation filters invalid local storage payloads before use.
- `practiceStorage.ts` can read and clear all local practice keys.
- Supabase is present for account/profile shell only. The migration `supabase/migrations/20260712162241_create_profiles.sql` creates `public.profiles` with RLS policies. It does not store lesson, drill, evidence, mastery, review, or progress data.
- Current docs state cloud progress sync is planned but not implemented.

## Tests Covering Educational Behavior

- Unit tests cover engines, lesson lookup/schema assumptions, drill prompt/evaluator logic, summaries, missed-prompt extraction, local storage parsing, lesson progress, lesson learning progress, and practice session completion.
- Playwright covers lesson-to-practice URLs, completion of representative note, scale-degree, and chord-tone drill sessions, local progress persistence, mobile note drill completion, practice history, settings, and exploration/practice separation.
- Existing tests assert current completion behavior rather than constitutional conformance. There are no tests for delayed retrieval, support-condition limits, prerequisite evidence, remediation routing, honest claim ceilings, content conformance, or migration of legacy evidence.

## Current End-To-End Path

1. Lesson content is authored in `lessons.ts`.
2. `/lessons/[slug]` statically renders lesson prose and interactive completion cards.
3. Opening a lesson starts local learning progress automatically.
4. The learner self-checks `read`, `play`, and `write`, or presses `Mark lesson complete`.
5. The optional reinforcement card links to `/practice?drill=<type>&lesson=<slug>#practice`.
6. `FretboardExplorer` reads the URL, selects the drill, starts a lesson practice progress record, and builds a prompt queue.
7. The learner answers prompts; each answer records raw selected note/string/fret or selected note plus correctness.
8. When prompt count is reached, a completed session is stored in localStorage.
9. If the active lesson matches the completed drill, `markLessonPracticed` stores accuracy, prompt count, attempt time, and `complete` or `in-progress` status.
10. Review panels show missed prompts and weak spots. Practice Hub uses weak spots and course progress to recommend another session.
