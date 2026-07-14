# Lesson Content Agent

Guidance for future agents tasked with making Pocket.Practice lesson content more robust, educational, and useful with a guitar in hand.

## Mission

Turn Pocket.Practice lessons from short drill introductions into guided music-theory education. Lessons should help a learner understand what a concept means, find it on the guitar, hear or feel why it matters, recognize it in existing music, and use it to write something new.

The first implementation should keep lessons separate from drills. Drills can remain available as optional reinforcement, but lesson completion should not initially depend on quiz-style practice.

## Product Context

- Pocket.Practice/FretGarden is currently a local-first browser-based guitar fretboard practice app with basic Supabase account creation.
- The current public learning loop is focused on note recognition, chord tones, and scale degrees.
- Existing lesson pages are intentionally lightweight and currently point into paired drills.
- Advanced drill areas exist for interval landmarks, CAGED octave shapes, and triad inversion recognition.
- Longer-term features such as cloud progress sync, audio, ear training, subscriptions, bass, alternate tunings, and marketplace behavior remain deferred unless the user explicitly asks for them.

Before making broad changes, read:

- `docs/CURRENT_STATUS.md`
- `Pocket_Practice_Master_Plan.md`
- `AGENTS.md`
- The current lesson model in `apps/web/app/lib/lessons.ts`

Treat `README.md` as long-term vision, not current behavior.

## Teaching Principles

- Teach like the learner has a guitar nearby. Every lesson should include moments where the student plays, listens, compares, or writes.
- Prefer plain language first, then introduce formal theory terms once the musical idea is clear.
- Connect each concept to the fretboard, not only to abstract note names.
- Make lessons feel guided rather than flash-card-like. Use explanation, examples, checkpoints, reflection, and small creative tasks.
- Keep the learner oriented: explain why the concept matters for playing songs, learning songs, improvising, writing riffs, or writing chord progressions.
- Favor short, focused lessons over sprawling articles. A lesson should teach one main idea deeply enough to be useful.
- Keep the first public learning path centered on notes, chord tones, and scale degrees while allowing advanced paths to grow after the core path is stronger.

## Default Lesson Anatomy

Each robust lesson should include:

1. **Concept**
   - A beginner-friendly explanation of the main idea.
   - The formal theory name and common alternate names, when useful.
   - A brief statement of why the concept matters musically.

2. **Fretboard Application**
   - Guitar-specific examples in standard tuning.
   - Concrete string and fret references when appropriate.
   - Movable patterns only when the underlying note or interval logic is explained.

3. **Play This Now**
   - A short prompt the learner can physically play.
   - Clear instructions using note names, frets, strings, chord names, or scale degrees.
   - A listening goal, such as noticing tension, resolution, brightness, darkness, stability, or movement.

4. **Song Connection**
   - A copyright-safe connection to existing songs or common song patterns.
   - Discuss key, chord movement, harmonic function, form, rhythm, texture, or scale-degree behavior.
   - Do not copy copyrighted lyrics, tablature, full melodies, or distinctive riffs.
   - Short, generic examples such as Roman numerals, scale degrees, or common chord progressions are preferred.

5. **Write With It**
   - A small creative assignment using the concept.
   - Examples: write a two-chord vamp, alter one chord tone, create a four-bar melody from scale degrees, move a riff to a new key, or write a progression with a specific emotional target.

6. **Check Understanding**
   - A few reflective or self-check questions.
   - These should test understanding, not just recognition speed.
   - If a drill exists, link it as optional reinforcement rather than the core lesson.

## Curriculum Direction

Build a progression from brand-new student to intermediate and advanced theory. Keep the path modular so individual lessons can still stand alone.

Suggested arc:

- **Absolute Beginner**
  - What strings and frets are
  - Open strings and standard tuning
  - Half steps and whole steps
  - Note names and repeating notes
  - Octaves and why the twelfth fret repeats

- **Beginner Fretboard Theory**
  - Finding notes on specific strings
  - Sharps, flats, and enharmonic names
  - Major scale basics
  - Scale degrees as numbers
  - Roots, 3rds, and 5ths
  - Major and minor triads

- **Songwriting Foundations**
  - Chord progressions in keys
  - I, IV, V, and vi in major keys
  - Minor-key basics
  - Writing melodies from chord tones
  - Using non-chord tones as passing or neighbor tones
  - Cadences, tension, and resolution

- **Intermediate Theory**
  - Intervals by sound, fretboard distance, and function
  - Seventh chords
  - Diatonic triads and seventh chords
  - Inversions and voice leading
  - CAGED as a fretboard navigation system
  - Pentatonic scales and their relationship to major/minor
  - Borrowed chords and modal mixture at an introductory level

- **Advanced Theory**
  - Modes as sounds and as chord-scale relationships
  - Secondary dominants
  - Applied chords and tonicization
  - Extended chords: 9ths, 11ths, and 13ths
  - Altered dominants and common substitutions
  - Modulation and key changes
  - Harmonic analysis of full song sections
  - Writing progressions with intentional harmonic color

Do not attempt to implement the entire arc at once unless asked. Start by strengthening the core path and designing data structures that can grow.

## Architecture Guidance

- Preserve the current local-only MVP.
- Do not break existing drills, existing lesson-to-practice links, storage validation, or tests.
- Keep `packages/music-theory-engine` framework-independent. Do not add React, DOM, browser storage, or app UI assumptions there.
- Use `packages/music-theory-engine` for factual theory behavior when possible.
- Add to the theory engine only when the app needs reusable, tested theory logic. Additive changes are fine; breaking existing exported behavior is not.
- Prefer typed lesson/content models in `apps/web/app/lib` before wiring large UI changes into React components.
- If lessons need richer structure, model that structure explicitly instead of packing complex content into ad hoc strings.
- Track lesson progress separately from drill completion. Progress may include reading completion, play-along checkpoints, self-checks, and creative assignments.
- Keep drill links optional at first. A lesson can recommend a drill after teaching the concept, but should still make educational sense without launching a drill.
- Use Zod or existing structured helpers for any new localStorage payload validation.
- Keep unit tests close to pure logic. Use Playwright when changing lesson navigation, progress UI, or browser behavior.

## Song Reference Policy

Named songs may be referenced when they help learners connect theory to real music, but the implementation must remain copyright-safe.

Allowed:

- Naming a song and artist as a reference point.
- Describing broad musical concepts in the song.
- Discussing chord-function patterns, Roman numerals, keys, form, texture, rhythm, and general harmonic motion.
- Using short generic examples such as `I-V-vi-IV`, `1-2-3-5`, or invented non-distinctive phrases.

Avoid:

- Copying lyrics.
- Copying tablature.
- Reproducing full melodies, distinctive riffs, solos, or hooks.
- Presenting a copyrighted song transcription as lesson content.

When in doubt, use public-domain examples, invented examples, or generic progressions.

## Implementation Expectations

When changing code, future agents should:

- Read the current app structure before editing.
- Keep changes scoped and reversible.
- Add tests for new lesson schemas, progress parsing, storage validation, or theory-engine behavior.
- Run the narrowest relevant verification first, then broader checks when the change touches shared behavior.
- Prefer `pnpm typecheck` for route/component/type changes.
- Prefer `pnpm --filter @pocket-practice/web test` or root `pnpm test` for lesson logic changes.
- Run `pnpm test:e2e` for lesson navigation, progress UI, or lesson-to-practice browser flows.

Markdown-only updates to this file do not require automated tests.
