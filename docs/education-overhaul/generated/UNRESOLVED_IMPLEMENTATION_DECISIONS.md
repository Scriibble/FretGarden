# Unresolved Implementation Decisions

Generated for Phase 0 of the FretGarden education-system overhaul.

These decisions cannot be safely answered from the current repository and constitution package alone. They should be resolved during Phase 1 architecture before pilot implementation.

## Phase 1 Disposition

The table below records proposed Gate 2 defaults. `PROPOSED` means the Phase 1 artifacts contain a concrete recommendation but implementation still requires approval. `DEFERRED` means the choice is intentionally outside the pilot. `BLOCKED` means repository evidence cannot identify the required human owner.

| Decisions | Status | Phase 1 disposition |
| --- | --- | --- |
| 1-4 | PROPOSED | Use exposure, supported/independent performance, retained performance, review, and readiness language; keep legacy copy unchanged; describe legacy evidence neutrally; keep the Garden metaphor in product tone rather than evidence labels. |
| 5-8 | PROPOSED | Pilot the full opening sequence on isolated `/education-pilot`; use a real 24-hour first review; author new pilot content rather than reclassifying an existing lesson. |
| 9-13 | PROPOSED | Store explicit evidence kinds and ordered support levels; note evidence includes correctness, scope coverage, independence, validity, variation, correction history, and delay; corrected reattempts do not create independent evidence; contradictory delayed evidence preserves history and sets current state to `needs_refresh`. |
| 14-18 | PROPOSED | Persist pilot data in a separate localStorage namespace; use versioned transforms and a pilot-only reset; preserve legacy keys through Gate 7; do not import them into the pilot; record schema, content, objective/lesson, and policy versions. |
| 19-22 | PROPOSED | Add separate education policy and content workspace packages; adapt the starter schema into typed runtime contracts plus synchronized JSON Schema; keep pilot content in versioned TypeScript registries; verify conformance in CI and commit the pilot report. |
| 23-25 | PROPOSED | Use semantic-grid and explicit coordinate response equivalents; do not claim visual substitutes are equivalent to auditory discrimination; measure pulse with keyboard/pointer/button taps against an optional audiovisual pulse, without audio-input diagnosis. |
| 26-29 | PROPOSED | Add `pnpm test:education`; retain legacy tests as control-path coverage; require all test layers relevant to the pilot plus migration-isolation fixtures; write the detailed manual QA script during Phase 2 alongside the implemented flow. |
| 30-31 | RESOLVED | Evan Anderson is the educational-debt approver and final constitutional-interpretation owner. The sole-developer concentration of authority is recorded in `GOVERNANCE_DECISION_LOG.md`. |
| 32 | PROPOSED | Require a decision-log entry for changes to objective meaning, evidence/claim policy, progression, review timing, accessibility equivalence, migration semantics, or an approved architecture boundary. Use inline notes only for behavior-preserving implementation detail. |

The detailed rationale, risks, alternatives, tests, and migration consequences are in the five Phase 1 artifacts. Approval may accept, amend, or reject each proposed default independently.

## Product And Language

1. What learner-facing vocabulary should distinguish lesson participation, drill performance, readiness, retention, and mastery?
2. Should existing "Lesson complete" copy remain temporarily as legacy completion language, or should the pilot introduce new status terms immediately behind a flag/isolated route?
3. How much uncertainty should be shown to learners for provisional legacy records?
4. Should the Garden metaphor appear in evidence/status language, or stay mostly in navigation and product tone?

## Pilot Scope

5. Which opening pilot sequence is authoritative for implementation: practice regulation first, metronome/pulse first, or fretboard note retrieval first?
6. What is the smallest delayed-review interval acceptable for a pilot demo while still being educationally honest?
7. Should the pilot live inside the existing `/lessons` and `/practice` flow, or behind an isolated route/feature flag?
8. Which existing lesson should be mapped to the first pilot objective, if any, rather than creating new pilot content?

## Evidence And Policy

9. What evidence strength levels should the product expose internally: exposure, participation, supported performance, independent performance, retention, transfer, readiness, mastery, or a smaller subset?
10. How should support levels be named and ranked for FretGarden: modeled, guided, prompted, independent, or product-specific terms?
11. What quality dimensions are required for the first fretboard note objective: correctness, string constraint, region constraint, variation, timing, verbal naming, physical execution, or delayed retrieval?
12. Should immediate corrected reattempts create any claim beyond correction response?
13. How should contradictory evidence affect current readiness during the pilot?

## Data And Migration

14. Should pilot attempt/evidence records persist in localStorage first, Supabase first, or both under a feature flag?
15. What is the rollback path if a pilot evidence schema ships locally and then changes?
16. How long should legacy localStorage records be preserved after the new model exists?
17. Should old `lesson-progress` and `lesson-learning-progress` records be read into the pilot UI, or shown only in legacy screens?
18. What content/policy versioning granularity is required: objective version, lesson version, policy version, or all three?

## Architecture

19. Where should the pedagogical policy layer live: `apps/web/app/lib/education`, a new workspace package, or another boundary?
20. Should the starter-kit schema be copied into `docs/education-overhaul/schemas` and used directly, or adapted into repo-local TypeScript/Zod contracts first?
21. What is the permanent split between content authoring data and TypeScript helper code?
22. Should content conformance reports be generated in CI, committed as artifacts, or both?

## Accessibility And Modality

23. What accessibility-equivalent path is required for fretboard clicking tasks?
24. How should auditory objectives be handled for learners who cannot use sound or for environments where sound is unavailable?
25. Can the pilot include metronome/timing evidence without audio input, or should it rely on user action aligned to visual pulse only?

## Testing And Acceptance

26. What command name should run education conformance tests: `pnpm test:education`, a package script, or a filtered Vitest suite?
27. Which existing tests should remain as legacy behavior tests during the pilot?
28. What minimum automated coverage is required before Gate 3 approval: schema, policy, domain, runtime integration, UI, migration fixtures, or all listed layers?
29. What manual QA script should demonstrate the full pilot lifecycle from prerequisite check through delayed review?

## Governance

30. Who approves educational debt items and expiration dates? **Resolved: Evan Anderson, Product and Curriculum Owner.**
31. Who owns final constitutional interpretation when a product goal conflicts with a chapter requirement? **Resolved: Evan Anderson, Product and Education Owner.**
32. What changes require a decision log entry versus an inline implementation note?
