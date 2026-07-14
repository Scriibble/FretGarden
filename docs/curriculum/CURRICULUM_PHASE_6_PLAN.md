# Curriculum Phase 6 Plan

Date: 2026-07-14

Status: Approved, implemented, and in final validation

## Goal

Implement FretGarden Units 36-43 as the complete Level 5 advanced musicianship sequence. Move learners from advanced harmonic color through chord-scale decisions, modulation, advanced minor systems, technique vocabulary, large-form development, reharmonization, and an advanced jury.

## Approved Unit Scope

| Unit | Title | Primary application evidence |
| ---: | --- | --- |
| 36 | Extended Chords and Color Tones | Voice extended harmony with clear guide tones and color-tone decisions |
| 37 | Chord-Scale Relationships | Map collections from function, targets, and tension behavior |
| 38 | Modulation and Key Relationships | Write a prepared and confirmed key change |
| 39 | Advanced Melodic and Harmonic Minor | Use altered minor-system degrees in minor ii-V-i contexts |
| 40 | Advanced Technique as Musical Vocabulary | Perform a technique etude with named phrase jobs |
| 41 | Form, Development, and Large-Scale Direction | Build a larger form with development, contrast, transition, and return |
| 42 | Reharmonization and Substitution | Reharmonize a melody while preserving melody, function, and bass direction |
| 43 | Level 5 Advanced Musicianship Jury | Present an advanced portfolio defense with performance and evidence |

## Implementation Boundaries

- Use schema version 3 and existing validated structured content blocks.
- Preserve model, guided attempt, scaffold fade, independent attempt, remediation, and delayed review in every lesson.
- Use only original repository examples; add no copyrighted transcription.
- Keep all performance, technique, modulation, reharmonization, and jury evidence explicitly self-confirmed.
- Keep curriculum progress in `fretgarden:curriculum-progress:v1`; add no Supabase, auth, legacy conversion, telemetry, microphone, upload, or production-data change.

## Checkpoints

1. `183dfcc`: implement Level 5 advanced curriculum.
2. Final documentation, e2e boundary update, report regeneration, full validation, and Phase 6 checkpoint.

## Acceptance

Automated acceptance requires curriculum validation, focused and full unit tests, typecheck, lint, production build, complete Playwright, education conformance generation, and `git diff --check`.

Gate 4 human accessibility and usability evidence remains deferred under `GOV-004` and continues to block final project release acceptance.
