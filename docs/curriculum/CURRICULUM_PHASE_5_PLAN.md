# Curriculum Phase 5 Plan

Date: 2026-07-14

Status: Approved, implemented, and in final validation

## Goal

Implement FretGarden Units 28-35 as the complete Level 4 creative sequence. Move learners from modal color and chromatic harmony through chord melody, advanced rhythm, style vocabulary, counterpoint, and an upper-intermediate creative portfolio.

## Approved Unit Scope

| Unit | Title | Primary application evidence |
| ---: | --- | --- |
| 28 | Modes as Sounds, Not Shapes | Compose modal studies with audible center and characteristic degree |
| 29 | Secondary Dominants and Tonicization | Write and resolve temporary dominant targets inside one key |
| 30 | Borrowed Chords and Modal Mixture | Use parallel-mode borrowed chords for section color |
| 31 | Voice Leading and Chord Melody | Arrange melody-forward shells with traceable inner voices |
| 32 | Advanced Rhythm and Meter | Perform odd groupings and clean release sections with recovery |
| 33 | Genre Language and Stylistic Authenticity | Create original style studies from specific musical/context observations |
| 34 | Counterpoint and Independent Lines | Compose and audit two independent guitar lines |
| 35 | Level 4 Creative Portfolio | Present multiple artifacts plus a complete performance and weak-domain plan |

## Implementation Boundaries

- Use schema version 3 and existing validated structured content blocks.
- Validate pitches and modal formulas through the independent fretboard and music-theory engines.
- Preserve model, guided attempt, scaffold fade, independent attempt, remediation, and delayed review in every lesson.
- Use only original repository examples; add no copyrighted transcription.
- Keep all performance, style, timing, counterpoint, and portfolio evidence explicitly self-confirmed.
- Keep curriculum progress in `fretgarden:curriculum-progress:v1`; add no Supabase, auth, legacy conversion, telemetry, microphone, upload, or production-data change.

## Checkpoints

1. `333ac8c`: implement Level 4 creative curriculum.
2. Final documentation, e2e boundary update, report regeneration, full validation, and Phase 5 checkpoint.

## Acceptance

Automated acceptance requires curriculum validation, focused and full unit tests, typecheck, lint, production build, complete Playwright, education conformance generation, and `git diff --check`.

Gate 4 human accessibility and usability evidence remains deferred under `GOV-004` and continues to block final project release acceptance.
