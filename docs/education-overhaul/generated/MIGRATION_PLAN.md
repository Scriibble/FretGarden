# Education System Migration Plan

Status: Phase 1 staged strategy for Gate 2 review. No migration is authorized by this document.

Current update: Gate 4 implementation is complete, governance owners are assigned, and `GOV-004` defers the remaining human protocol evidence until final project signoff. Separately approved implementation work may continue, but final acceptance or release remains blocked by the deferred evidence. Gate 5A's read-only `fretboard-map` rehearsal and Gate 5B's learner-facing read-only bridge are implemented and validated in `GATE_5A_VALIDATION_REPORT.md` and `GATE_5B_VALIDATION_REPORT.md`. Gate 5B authorizes navigation exposure only within its approved no-write boundary; it does not authorize conversion, a second segment, production persistence, or any later migration step.

## Migration Principles

1. Add and prove the new path before replacing any legacy behavior.
2. Preserve historical achievement without upgrading its educational meaning.
3. Keep observations and migration provenance so interpretations can be revised.
4. Rehearse every data conversion against fixtures before production schema work.
5. Keep rollback available through the pilot, limited migration, and parallel-reporting stages.

## Current Baseline

Phase 0 recorded a green baseline on branch `feature-database`: 139 Vitest tests, typecheck, lint, production build, and 13 Playwright tests passed. Educational data is local-only; Supabase stores profiles but no education records. The working tree contains only the untracked education-overhaul documentation tree.

## Gates And Deliverables

### Gate 2: Architecture Approval

Required review set:

- `TARGET_EDUCATION_ARCHITECTURE.md`
- `TARGET_DATA_MODEL.md`
- `PROPOSED_REPOSITORY_CHANGES.md`
- this migration plan
- `PILOT_VERTICAL_SLICE_PLAN.md`
- resolved or explicitly deferred Phase 0 decisions

Approval permits a concrete Phase 2 implementation plan for the isolated pilot. It does not permit production schema work or legacy conversion.

### Gate 3: Pilot Implementation Approval

Implement only the opening pilot at `/education-pilot`. Add pure packages, pilot content, local namespaced persistence, and tests. Current lesson/practice routes remain the control path.

Exit evidence:

- all core invariant tests pass;
- pilot content has a conformance report;
- local records explain each claim and decision;
- all required scenarios are automated or have an approved manual test where automation is not feasible;
- rollback is demonstrated.

### Gate 4: Pilot Validation

Review educational validity, usability, accessibility, content authoring effort, storage behavior, performance, and policy explainability. A successful demo is insufficient; failures and ambiguity become bounded educational debt or block migration.

### Gate 5: Limited Migration

After separate approval, migrate one coherent curriculum segment. Continue legacy reporting alongside new reporting. Add an importer only after representative local and future cloud data contracts are approved.

Current checkpoint: Gate 5A validates the read-only comparison and Gate 5B exposes that comparison to learners. No importer or converted record exists, so Gate 5 remains open.

Permitted legacy mappings:

- learning completion -> historical participation;
- practice threshold -> historical practice event;
- score/prompt count -> limited summary observation;
- unknown support -> explicit unknown condition;
- old mastery-like labels -> provisional legacy claim requiring revalidation.

### Gate 6: Full Migration

Requires stable authoring, rehearsed data migration, approved learner communication, bounded educational debt, production persistence design, conformance CI, and evidence that the limited segment did not inflate or discard progress.

### Gate 7: Legacy Removal

Remove old logic only after no active path depends on it, imported records are verified, rollback windows expire, and deletion receives explicit approval.

## Pilot Data Evolution

Pilot localStorage uses a new key prefix and a versioned envelope. Schema readers accept only known versions, preserve malformed payloads from destructive rewriting, and surface a recoverable reset for pilot data only. Runtime migrations are pure transforms with fixture tests and provenance.

During Phase 2, schema changes may reset pilot data only when clearly labeled as development data and approved in the implementation plan. Once learner testing begins, transforms must preserve records or export them before reset.

## Legacy Coexistence

The pilot neither reads nor writes these existing keys as evidence:

- `pocket-practice:lesson-learning-progress`
- `pocket-practice:lesson-progress`
- existing practice session history and presets

Legacy screens continue to use their current meanings and copy. The pilot may display a neutral notice that existing activity has not yet been evaluated under the new evidence model; it must not imply that history was lost.

## Future Production Persistence Gate

Before Supabase work, produce and approve a separate physical data design covering tables, account ownership, RLS, deletion/export, retention, idempotency, offline conflict handling, content/policy version joins, indexes, backfill, telemetry boundaries, and rollback SQL. Local pilot identifiers must not be assumed to be production learner IDs.

No current Supabase migration is modified by this plan.

## Rollback Strategy

### Pilot Rollback

1. Remove navigation exposure, if later added.
2. Remove the isolated route and web imports.
3. Remove pilot-only storage data or leave it inert for export; do not clear legacy keys.
4. Revert root build filters and package dependencies.
5. Remove new packages after no imports remain.
6. Run the complete baseline validation suite.

Because the pilot does not mutate legacy records or production schema, rollback restores behavior by code reversion alone.

### Limited-Migration Rollback

Keep legacy reads and reports active, write migration provenance, make conversions idempotent, retain source records, and use a versioned feature switch. A rollback changes the active reader/decision path; it does not delete converted or source data.

### Production Rollback

Must be designed with the physical schema. It requires forward-compatible down behavior, data backups, tested restore, and a communication plan. This is intentionally unresolved until Gate 5 preparation.

## Verification Matrix

| Stage | Required verification |
| --- | --- |
| Documentation only | Links, ASCII/format checks, repository status; no runtime suite needed for doc-only edits |
| Policy/content foundations | Package build, lint, typecheck, unit tests, schema/conformance tests |
| Pilot runtime | Above plus web integration, storage fixtures, production build |
| Pilot UI | Above plus Playwright lifecycle, mobile/keyboard/accessibility checks |
| Limited migration | Representative no/partial/high/stale/contradictory/malformed legacy fixtures, idempotency, rollback rehearsal |
| Production persistence | Local Supabase migration tests, RLS tests, backup/restore rehearsal, security review |

## Major Proposal Records

### M1. Additive Pilot Before Any Conversion

- Constitutional requirement: Chapters 6-7 and Gates 3-5 prohibit inflated mastery and require delayed evidence.
- Current implementation: Legacy local records lack support, delay, and policy versions.
- Proposed implementation: Run an isolated pilot with a separate store and no automatic import.
- Affected modules: New pilot modules only; current storage modules remain unchanged.
- Risks: Learners may see two histories during testing.
- Alternatives considered: Convert on first run, rejected because missing conditions cannot be reconstructed; discard history, prohibited.
- Test strategy: Assert byte-for-byte nonmutation of representative legacy keys through pilot flows.
- Migration consequences: Future import remains an explicit Gate 5 project.

### M2. Preserve Legacy History With Limited Meaning

- Constitutional requirement: Chapters 5-7 require claims to match evidence; rule 13 forbids discarding or falsely reclassifying progress.
- Current implementation: Completion and accuracy are the strongest retained fields.
- Proposed implementation: Map them only to historical participation/practice and limited observations, with provenance and unknown support.
- Affected modules: Future importer, reporting adapters, learner communication; none in Phase 2 pilot.
- Risks: Users may feel downgraded if language is careless.
- Alternatives considered: Grandfather mastery, rejected as invalid; hide history, rejected as disrespectful and misleading.
- Test strategy: Migration fixtures and copy review for every source state.
- Migration consequences: New readiness may require revalidation while historical achievement stays visible.

### M3. Defer Production Schema Until Pilot Validation

- Constitutional requirement: Gate 2 explicitly bars production schema migration before approval; Gate 4 requires proof first.
- Current implementation: Supabase has profile-only tables and policies.
- Proposed implementation: Use local pilot persistence and design physical cloud storage after validation.
- Affected modules: No Supabase files in Phase 2.
- Risks: Pilot does not prove cross-device sync or RLS.
- Alternatives considered: Cloud-first pilot, rejected because it expands security and migration risk before educational policy stabilizes.
- Test strategy: Local persistence now; later dedicated database/RLS suite.
- Migration consequences: Pilot logical IDs and versions inform but do not dictate production tables.

## Stop Conditions

Stop and request approval if implementation would require changing current learner-facing completion behavior, writing production data, altering auth/RLS/deployment, converting legacy progress, expanding beyond the pilot objectives, or weakening an evidence requirement to fit the UI.
