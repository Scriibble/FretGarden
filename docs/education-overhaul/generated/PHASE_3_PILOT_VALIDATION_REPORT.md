# Phase 3 Pilot Validation Report

Date: 2026-07-14

## Decision

Gate 4 validation is implemented and reviewable. The pilot is **not yet ready for Gate 5 limited migration**.

The isolated pilot proves the observation-to-evidence architecture, support-aware claims, prerequisite decisions, objective-aware delayed review, remediation routing, equivalent controls, local replay, malformed-data recovery, and legacy-storage isolation. It also exposes educational and governance gaps that must be resolved before current curriculum segments depend on the new path.

## Scope

Phase 3 is interpreted as Gate 4 pilot validation and hardening. It does not authorize Supabase education tables, RLS changes, account sync, legacy progress import, current lesson replacement, or limited curriculum migration.

## Gate 4 Findings

| Area | Result | Evidence | Remaining limit |
| --- | --- | --- | --- |
| Educational conformance | Conditional | Generated schema/reference/ownership/review/equivalence report; pure claim tests | Authored note application and transfer are not yet embodied as a distinct learner task |
| Technical correctness | Pass for pilot scope | Engine, content, runtime, storage, E2E, type, lint, and build checks | Browser storage write failure is returned by the adapter but not yet surfaced in the UI |
| Usability | Conditional | Complete opening flow, stop path, remediation, specific next action, mobile layout | No moderated learner study or author feedback session has been recorded |
| Accessibility | Conditional | Semantic form, grid labels, equivalent coordinate selects, keyboard/button pulse, reduced motion, optional sound | No formal screen-reader or external accessibility audit has been recorded |
| Data integrity | Pass for local pilot | Versioned namespace, idempotent append, malformed payload quarantine/export, legacy isolation | Local device loss and quota failure remain outside the pilot guarantee |
| Performance | Pass for pilot scope | Static route production build and responsive browser verification | No production telemetry or field performance sample exists |
| Migration feasibility | Conditional | Additive packages, isolated route, rollback by code reversion | No representative legacy importer or parallel-reporting rehearsal is authorized yet |
| Authoring feasibility | Conditional | Four objectives validate; deterministic report generation catches drift | One small pilot is insufficient to prove larger curriculum authoring cost |

## Defects Corrected During Validation

1. The practice-plan accessibility equivalent claimed an independent ceiling above its supported evidence requirement. The validator found it and the content ceiling is now `supported_performance`.
2. Pulse review obligations were scheduled but had no learner completion path. Pulse and note obligations now route to their matching delayed task.
3. An unsuccessful delayed review lost its source context before retry. Review context now remains until retained evidence is observed.
4. Early delayed attempts could register a second initial review. Review scheduling now applies only to an immediate independent requirement.
5. The note summary could use the first scheduled review from another objective. Claim timing is now filtered to the note objective.
6. Malformed or unknown pilot storage could be overwritten after an in-memory reset. The raw payload is now preserved under a separate recovery key and exposed for export.
7. Repeated pulse attempts reused an event identity. Every started pulse task now receives a distinct attempt identity.
8. Reduced-motion mode removed transitions but left the pulse animation active. It now removes the animation while preserving textual beat updates and optional sound.
9. Multi-page and timed E2E flows competed with dev-server compilation under a 30-second test ceiling. The per-test budget is now 60 seconds while assertion timeouts remain 10 seconds.

## Authoring Validation Implemented

`@pocket-practice/education-content` now checks:

- schema shape and required fields;
- unique lesson, exercise, policy, remediation, and equivalent identities;
- objective, prerequisite, placement, and exercise references;
- required-prerequisite cycles;
- active objective ownership by both a lesson and an exercise;
- evidence ownership across objective, exercise, and lesson boundaries;
- exercise quality dimensions against evidence requirements;
- delayed evidence, objective review policy, and lesson review alignment;
- remediation and accessibility references;
- equivalent-path evaluator consistency and claim-ceiling inflation;
- strictly increasing review delays.

`pnpm report:education` regenerates `PILOT_CONFORMANCE_REPORT.md`. Tests require the committed file to exactly match the validated registry.

## Validation Scenarios

Automated browser coverage includes:

- complete opening flow and legacy-key isolation;
- answer revelation limiting the claim and requiring a fresh set;
- successful delayed natural-note review preserving historical achievement;
- successful delayed pulse review using its original evidence;
- malformed pilot payload preservation before fresh-state recovery.
- reduced-motion pulse behavior with preserved beat text.

## Technical Results

- `pnpm report:education`: generated report matches the registry exactly.
- `pnpm test`: 175 tests passed across 19 files.
- `pnpm test:education`: 36 focused policy, content, runtime, and storage tests.
- `pnpm typecheck`: passed all workspace projects.
- `pnpm lint`: passed all workspace projects.
- `pnpm build`: passed; `/education-pilot` is statically generated at 12.7 kB route size.
- `pnpm test:e2e -- --reporter=line`: 19 browser tests passed.
- Browser review: 1280x720 and 390x844 layouts had no horizontal overflow or console warnings; equivalent-control activation retained focus.

The initial plan, pulse, delayed pulse review, malformed recovery, fretboard equivalent controls, summary, and reduced-motion behavior are automated or covered by the browser review. A formal external accessibility audit remains outstanding.

## Gate 5 Entry Conditions

Gate 5 remains blocked until:

1. The musical-application and transfer step is implemented or the authored transfer claim is removed.
2. Pulse tempo variation is implemented or the objective scope is narrowed from 50–70 BPM to the observed 60 BPM task.
3. A learner-visible response to storage write failure is approved and implemented.
4. A formal accessibility review and at least one representative learner/usability review are recorded.
5. Educational-debt and constitutional-interpretation owners are named.
6. A separate limited-migration plan defines the selected curriculum segment, legacy mapping fixtures, parallel reporting, telemetry boundaries, and rollback rehearsal.

## Rollback

Phase 3 remains additive. Rollback removes the validation additions and restores the Phase 2 route behavior. No production schema, auth, deployment, or legacy education record was changed.
