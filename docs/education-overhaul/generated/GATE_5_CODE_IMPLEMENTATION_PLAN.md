# Gate 5 Code Implementation Plan

Status: APPROVED AND IMPLEMENTED for Gate 5A; no later migration scope authorized

Updated: 2026-07-14

## Requested Approval Boundary

Approval recorded: Evan Anderson approved this exact Gate 5A boundary on 2026-07-14. Implementation evidence is recorded in `GATE_5A_VALIDATION_REPORT.md`.

Approve only Gate 5A: a read-only `fretboard-map` legacy mapper, deterministic parallel-report builder, unlinked local preview route, fixtures, and tests.

This approval would not authorize changes to existing lesson/practice behavior, navigation exposure, legacy storage, pilot storage, Supabase, RLS, authentication, deployment, production telemetry, or any second curriculum segment.

## Behavioral Outcome

After Gate 5A, a reviewer can visit `/education-migration/fretboard-map` and see:

- preserved legacy lesson participation;
- preserved legacy drill summary;
- current education-pilot capability claims and review state;
- explicit unknown legacy conditions;
- mapping diagnostics;
- a local JSON export of the report.

The route is a read-only migration rehearsal. It does not alter either system, advertise itself in navigation, or change what learners see on `/lessons/fretboard-map` and `/practice`.

## Proposed Files

### New migration contracts

`apps/web/app/lib/education/migration/contracts.ts`

Add migration-specific types:

- `HistoricalEducationRecord`
- `LegacySourceRef`
- `LegacyMappingDiagnostic`
- `LegacyMappingResult`
- `FretboardMapParallelReport`
- `MigrationReportVersion`

Keep these contracts in the web migration boundary. Do not add historical records to `@pocket-practice/education-engine`; the policy engine should continue accepting only observable attempts and evidence.

### Pure source inspection and mapping

`apps/web/app/lib/education/migration/fretboardMapLegacyMapping.ts`

Proposed APIs:

```ts
export function inspectFretboardMapLegacySources(input: {
  learningProgressRaw: string | null;
  lessonProgressRaw: string | null;
  noteHistoryRaw: string | null;
}): FretboardMapLegacySourceSnapshot;

export function mapFretboardMapLegacyHistory(
  snapshot: FretboardMapLegacySourceSnapshot
): LegacyMappingResult;
```

The inspector uses the existing `parseLessonLearningProgress` and `parseLessonProgress` functions after classifying absent, malformed, versioned, and unversioned envelopes. It never calls a browser API and never writes. Note history is counted only as unattributed context and is not mapped.

The mapper applies LM-001 through LM-020, deterministic IDs, deduplication, stable ordering, and the required unknown-condition list.

### Pure education-store parser

Modify `apps/web/app/lib/education/storage/educationPilotStorage.ts`:

```ts
export function parseEducationPilotStore(
  raw: string | null,
  now: string
): {
  store: EducationPilotStore;
  state: "absent" | "valid" | "invalid_json" | "unknown_schema";
};
```

This parser has no storage argument and no side effects. Existing `readEducationPilotStore` delegates to it, preserving its current quarantine behavior for the pilot route. The migration preview calls only the pure parser so malformed pilot data cannot create or modify the recovery key.

### Parallel report builder

`apps/web/app/lib/education/migration/fretboardMapParallelReport.ts`

Proposed API:

```ts
export function buildFretboardMapParallelReport(input: {
  historical: LegacyMappingResult;
  educationStore: EducationPilotStore;
  educationStoreState: "absent" | "valid" | "invalid_json" | "unknown_schema";
  now: string;
}): FretboardMapParallelReport;
```

The builder filters evidence and reviews for:

- `fretboard.coordinates.basic@1`
- `fretboard.natural-notes.region-1@1`

It calls existing pure claim/review functions, never the attempt interpreter. It presents history and claims in separate fields and emits neutral copy. `now` is injected for deterministic tests.

### Browser read adapter

`apps/web/app/lib/education/migration/readFretboardMapMigrationInputs.ts`

Read only these keys with `getItem`:

- `pocket-practice:lesson-learning-progress`
- `pocket-practice:lesson-progress`
- `pocket-practice:note-recognition-history`
- `pocket-practice:education-pilot:v1`
- `pocket-practice:education-pilot:recovery:v1` for before/after integrity assertion only

Return raw strings. Do not call `setItem`, `removeItem`, or a recovery-aware reader.

### Preview route

New files:

- `apps/web/app/education-migration/fretboard-map/page.tsx`
- `apps/web/app/components/education/FretboardMapMigrationReport.tsx`
- `apps/web/app/components/education/fretboardMapMigrationReport.module.css`

The route:

- is unlinked from all navigation and legacy lessons;
- identifies itself as a migration review, not a learner status screen;
- shows legacy history and current evidence in separate full-width sections;
- provides a user-triggered local JSON export;
- provides no import, accept, merge, reset, or write button;
- shows malformed/unknown source diagnostics without raw payloads;
- includes a clear statement that legacy completion remains preserved but is not independent evidence.

### Fixtures and unit tests

New files:

- `apps/web/app/lib/education/migration/fixtures/fretboardMapLegacyFixtures.ts`
- `apps/web/app/lib/education/migration/fretboardMapLegacyMapping.test.ts`
- `apps/web/app/lib/education/migration/fretboardMapParallelReport.test.ts`

Tests cover LM-001 through LM-020, deterministic replay, ordering, unknown conditions, source classification, no evidence generation, contradictory pilot evidence, and injected-clock behavior.

Modify `apps/web/app/lib/education/storage/educationPilotStorage.test.ts` to test the pure parser and prove existing quarantine behavior remains unchanged.

### Browser coverage

New file:

- `apps/web/e2e/education-migration.spec.ts`

Scenarios:

1. Empty sources produce a neutral report and no writes.
2. Complete legacy learning/practice records appear only as historical context.
3. Pilot independent/retained/transfer states remain separate from legacy history.
4. Malformed source data produces diagnostics and remains byte-for-byte unchanged.
5. Repeated report loads are idempotent and create no storage key.
6. Existing `/lessons/fretboard-map` to `/practice` flow remains unchanged.
7. Mobile layout has no horizontal overflow or clipped controls.
8. JSON export contains mapped/report data but no raw source payload.

## Explicit Non-Changes

Do not modify:

- `apps/web/app/lib/lessons.ts`
- `apps/web/app/components/LessonCompletionCard.tsx`
- `apps/web/app/components/LessonLibrary.tsx`
- `apps/web/app/components/FretboardExplorer.tsx`
- `apps/web/app/lib/lessonProgress.ts`
- `apps/web/app/lib/lessonLearningProgress.ts`
- `apps/web/app/lib/browserStorage.ts`
- `apps/web/app/lib/practiceStorage.ts`
- any Supabase, auth, middleware, environment, deployment, or migration file

Existing parsers may be imported by the migration module; their behavior and signatures remain unchanged.

## Implementation Sequence

### Commit 1: Pure mapping contract and fixtures

- Add migration contracts, source inspector, mapper, fixture table, and tests.
- Run focused web tests, typecheck, and lint.
- Rollback: revert one isolated commit; no runtime import exists yet.

### Commit 2: Read-only pilot parser and parallel report

- Add the side-effect-free pilot parser and report builder.
- Prove existing pilot recovery tests are unchanged.
- Run focused education tests and report tests.
- Rollback: revert the commit; no storage format changes exist.

### Commit 3: Unlinked preview and browser rehearsal

- Add the route, component, styling, export, and Playwright suite.
- Record byte-for-byte before/after storage snapshots.
- Run complete unit, type, lint, build, E2E, and responsive checks.
- Rollback: remove the route/component and migration imports; source data is untouched.

### Commit 4: Gate 5A validation report

- Regenerate conformance and validation reports.
- Record authoring effort, fixture results, route size, test totals, and rollback rehearsal.
- Do not mark Gate 5 complete; request review before any navigation exposure or behavior change.

## Risks And Controls

| Risk | Control |
| --- | --- |
| Legacy completion is mistaken for capability | Separate type, separate report section, explicit educational limit, no engine conversion API |
| Source parser silently hides malformed data | Inspector classifies raw envelope before calling existing parsers and emits diagnostics |
| Preview mutates recovery state | Pure pilot parser; raw `getItem` adapter only; byte-for-byte E2E assertions |
| Global note history is falsely attributed | Exclude it from mapping and emit `unattributed_session` diagnostic |
| Report becomes a second learner dashboard | Unlinked review route, migration language, no course percentage or mastery vocabulary |
| Scope expands to another lesson | Literal segment type `"fretboard-map"`; fixture and route names are segment-specific |
| Local diagnostics leak data | No network calls, no free-form text or raw payload in report/export |
| Rollback leaves data residue | No writes and no new storage key; route removal is the entire runtime rollback |

## Required Validation

- `pnpm report:education`
- `pnpm test:education`
- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e -- --reporter=line`
- In-app browser review at desktop and mobile widths
- `git diff --check`
- Storage key/value inventory before and after report rehearsal

## Approval Record

Evan Anderson approved Gate 5A exactly as described on 2026-07-14. The implementation followed this boundary and passed the required validation. Any navigation exposure, changed legacy behavior, second segment, production data path, or later migration step still requires a new concrete plan and explicit approval.
