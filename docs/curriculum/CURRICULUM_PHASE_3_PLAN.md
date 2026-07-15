# Curriculum Phase 3 Plan

Date: 2026-07-14

Status: Approved, implemented, and automatically validated

## Goal

Implement FretGarden Units 12-19 as the complete Level 2 sequence. Move learners from movable harmony through improvisation, fretboard fluency, scale-based melody, rhythm vocabulary, triads, and lead-sheet communication into a complete original performance project.

## Approved Unit Scope

| Unit | Title | Primary application evidence |
| ---: | --- | --- |
| 12 | Barre Chords and Movable Harmony | Perform I-IV-V-vi in three keys with sustainable partial or full voicings |
| 13 | Minor Pentatonic and Blues Language | Track a 12-bar form and improvise two call-and-response choruses |
| 14 | Fretboard Notes and Octave Shapes | Retrieve natural-note roots and use named octaves in an original riff |
| 15 | Major Scale and Diatonic Melody | Compose an eight-bar melody with motive, sequence, climax, and resolution |
| 16 | Rhythm Guitar Vocabulary | Sustain a two-minute groove using continuous motion, syncopation, muting, and feel |
| 17 | Triads in Open and Movable Contexts | Arrange a voice-led second part with named triad tones and inversions |
| 18 | Lead-Sheet Literacy and Transposition | Read two original charts and transpose a progression into two keys |
| 19 | Level 2 Band and Songwriting Project | Perform and assess a charted two-to-four-minute original piece |

## Implementation Boundaries

- Extend schema version 3 with validated movable chord barres, fretboard maps, scale patterns, progression charts, and lead sheets.
- Validate pitches and scale formulas through the independent fretboard and music-theory engines.
- Preserve model, guided attempt, scaffold fade, independent attempt, remediation, and delayed review in every lesson.
- Use only original repository examples; add no copyrighted transcription.
- Keep all performance and ear evidence explicitly self-confirmed. Add no microphone, recording upload, or automated listening claim.
- Keep curriculum progress in `fretgarden:curriculum-progress:v1`; add no Supabase, auth, legacy conversion, or production-data change.

## Checkpoints

1. `8465406`: validated Level 2 music structures and renderers.
2. `dc975ab`: movable harmony, blues language, and fretboard units.
3. `b08c0ed`: major-scale melody, rhythm guitar, triads, and lead-sheet units.
4. Unit 19, final browser coverage, reports, and validation record.

## Acceptance

Automated acceptance requires curriculum validation, focused and full unit tests, typecheck, lint, production build, complete Playwright, education conformance generation, responsive review, and `git diff --check`.

Gate 4 human accessibility and usability evidence remains deferred under `GOV-004` and continues to block final project release acceptance.
