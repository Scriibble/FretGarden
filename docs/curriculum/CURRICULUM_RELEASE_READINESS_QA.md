# Curriculum Release-Readiness QA

Date: 2026-07-14

Status: Phase 8 hardening implemented; automated validation complete

## Scope

This pass reviews the completed 51-unit curriculum after Phase 7. It does not add new units, change legacy progress meaning, convert historical lesson records, alter Supabase, change authentication, add telemetry, or modify production data paths.

## Automated QA Added

The education-content test suite now enforces curriculum-wide release-readiness contracts:

- Every implemented unit has a matching lesson, assessment, and review plan.
- Unit route metadata, lesson estimated minutes, and assessment requirements stay aligned.
- Every Unit 4-51 lesson keeps the explicit model -> guided attempt -> scaffold fade -> independent attempt sequence.
- Every lesson keeps at least three completion criteria, at least one reflection criterion, required evidence, learner-confirmed verification, remediation guidance, and difficulty-scaling guidance.
- Every review plan retains immediate, next-session, one-week, and long-term review prompts.

The pass found and resolved one content gap: Unit 3 now includes an explicit metronome reflection criterion for timing observations.

## Catalog Usability Added

The `/lessons` catalog now supports:

- search across title, summary, outcomes, level, and tags;
- level filtering;
- progress-status filtering;
- a live count of visible units;
- responsive wrapped controls without horizontal scrolling.

These controls are read-only and use only the already loaded curriculum index plus existing local curriculum-progress records.

## Human QA Still Required

Gate 4 accessibility and usability evidence remains deferred under `GOV-004`. The current automated and browser checks support release readiness, but they do not close final acceptance. Before release, the recorded protocols still need human execution and signoff:

- `/Users/evananderson/Documents/GitHub/Pocket.Practice/docs/education-overhaul/generated/ACCESSIBILITY_REVIEW_PROTOCOL.md`
- `/Users/evananderson/Documents/GitHub/Pocket.Practice/docs/education-overhaul/generated/USABILITY_REVIEW_PROTOCOL.md`

The already recorded screen-reader confirmation remains useful supporting evidence, but it is not the complete Gate 4 evidence package.

## Validation Record

| Check | Result |
| --- | --- |
| `pnpm --filter @pocket-practice/education-content test` | Passed: 24 tests |
| `pnpm --filter @pocket-practice/web typecheck` | Passed |
| `pnpm exec playwright test e2e/curriculum-foundations.spec.ts` from `apps/web` | Passed: 12 Chromium scenarios |
| `pnpm validate:curriculum` | Passed: 51 units, 51 implemented, 0 mapped |
| `pnpm report:education` | Passed; pilot conformance regenerated |
| `pnpm test` | Passed: 266 workspace tests, including 214 web tests |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm build` | Passed; 72 static pages generated and all 51 lesson routes statically generated |
| `pnpm test:e2e` | Passed: 49 Chromium scenarios |
| `git diff --check` | Passed |

## Rollback

Revert the Phase 8 hardening commit to remove the catalog filters, additional QA tests, and Unit 3 reflection criterion. No data cleanup is required because this pass writes no migration records and changes no production persistence.
