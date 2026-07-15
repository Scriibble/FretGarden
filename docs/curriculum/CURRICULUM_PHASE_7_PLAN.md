# Curriculum Phase 7 Plan

Date: 2026-07-14

Status: Approved and implemented; final validation pending

## Goal

Complete the first full FretGarden curriculum by implementing Units 44-51, the Level 6 artist-portfolio sequence, without changing legacy progress, production data paths, Supabase, authentication, deployment, telemetry, or existing lesson-completion semantics.

## Scope

| FretGarden unit | Source unit | Lesson |
| ---: | ---: | --- |
| 44 | 41 | Songwriting Identity and Constraint |
| 45 | 42 | Melody, Prosody, and Lyrics |
| 46 | 43 | Arrangement for Rhythm Section and Ensemble |
| 47 | 44 | Alternate Tunings, Capo, and Guitar-Specific Composition |
| 48 | 45 | Production-Aware Guitar and Demo Craft |
| 49 | 46 | Professional Charts, Scores, and Communication |
| 50 | 47 | Independent Study and Teaching the Concept |
| 51 | 48 | Capstone: Complete Artist Portfolio |

## Implementation Requirements

- Add authored lesson content, review plans, curriculum index metadata, and unit tests for all final units.
- Preserve schema version 3 and existing validated block types.
- Continue explicit model -> guided attempt -> scaffold fade -> independent attempt states.
- Use learner-confirmed evidence for advanced portfolio, chart, demo, teaching, and performance work.
- Keep all generated examples original and avoid copyrighted repertoire or tablature.
- Keep progress isolated under `fretgarden:curriculum-progress:v1`.
- Keep all replaced legacy lesson and drill storage untouched.

## Checkpoints

1. Content checkpoint: final Level 6 curriculum source, exports, index metadata, and education-content tests.
2. Documentation and product checkpoint: lesson-library copy, Playwright catalog boundary, source map, prerequisite map, implementation audit, regenerated education report, and full validation.

## Acceptance Checks

- `pnpm validate:curriculum`
- `pnpm --filter @pocket-practice/education-content test`
- `pnpm report:education`
- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e`
- `git diff --check`

## Boundaries

Phase 7 does not add Supabase schema, RLS, authentication, deployment, environment configuration, production telemetry, legacy conversion, microphone permission, audio upload, automatic performance diagnosis, or external content dependency.

Gate 4 accessibility and usability evidence remains deferred under `GOV-004` and still blocks final project acceptance or release.

## Rollback

Revert the Phase 7 commits beginning with `ff25ab0`. No data cleanup is required because curriculum progress remains isolated and no production or legacy storage migration is introduced.
