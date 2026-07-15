# Curriculum Phase 4 Plan

Date: 2026-07-14

Status: Approved, implemented, and in final validation

## Goal

Implement FretGarden Units 20-27 as the complete Level 3 musicianship sequence. Move learners from integrated fretboard harmony through functional harmony, seventh chords, motif development, chord-tone improvisation, multi-part arrangement, and a portfolio project.

## Approved Unit Scope

| Unit | Title | Primary application evidence |
| ---: | --- | --- |
| 20 | CAGED System and Fretboard Integration | Revoice one harmony through five regions and arrange a three-section song across registers |
| 21 | Diatonic Harmony in Major Keys | Harmonize a major key, perform cadence types, and write purpose-built progressions |
| 22 | Relative Minor and Minor-Key Harmony | Compare minor forms and perform a minor verse with relative-major chorus |
| 23 | Seventh Chords and Arpeggio Soloing | Build seventh qualities and target guide tones through a changing progression |
| 24 | Melodic Development and Motif | Develop one motif into a coherent sixteen-bar melody |
| 25 | Chord-Tone Improvisation | Perform and audit an eight-bar solo whose strong beats follow the harmony |
| 26 | Arrangement and Multiple Guitar Parts | Create a role map and revise texture collisions in a multi-guitar arrangement |
| 27 | Level 3 Musicianship Project | Complete a portfolio performance with analysis, transcription, arrangement, reflection, and weak-domain plan |

## Implementation Boundaries

- Use schema version 3 and existing validated structured content blocks.
- Validate pitches and scale/arpeggio formulas through the independent fretboard and music-theory engines.
- Preserve model, guided attempt, scaffold fade, independent attempt, remediation, and delayed review in every lesson.
- Use only original repository examples; add no copyrighted transcription.
- Keep all performance, transcription, ear, timing, and arrangement evidence explicitly self-confirmed.
- Keep curriculum progress in `fretgarden:curriculum-progress:v1`; add no Supabase, auth, legacy conversion, telemetry, microphone, upload, or production-data change.

## Checkpoints

1. `6e8b9df`: strengthen Level 3 theory validation.
2. `d9d0377`: implement CAGED and functional harmony units.
3. `66cc681`: complete Level 3 musicianship curriculum.
4. Final documentation, report regeneration, full validation, and Phase 4 checkpoint.

## Acceptance

Automated acceptance requires curriculum validation, focused and full unit tests, typecheck, lint, production build, complete Playwright, education conformance generation, responsive review, and `git diff --check`.

Gate 4 human accessibility and usability evidence remains deferred under `GOV-004` and continues to block final project release acceptance.
