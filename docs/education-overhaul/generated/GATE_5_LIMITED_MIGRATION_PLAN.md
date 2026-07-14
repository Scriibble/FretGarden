# Gate 5 Limited Migration Plan

Status: Gate 5A rehearsal and Gate 5B read-only learner bridge implemented and validated; Gate 5 remains open

Updated: 2026-07-14

## Decision

Implementation update: the read-only `fretboard-map` mapper, parallel report, unlinked preview, fixtures, and rollback rehearsal are complete. See `GATE_5A_VALIDATION_REPORT.md`. No conversion or later migration step is authorized.

Use `fretboard-map` as the first limited-migration segment. Begin with a read-only mapping and parallel-report rehearsal. Do not replace, rewrite, or reinterpret the existing lesson or practice flow during the first code slice.

Gate 4 human protocol execution remains open and is deferred under `GOV-004`. Separately approved Gate 5 implementation may continue, but it must not be treated as release-ready until the deferred evidence is completed and resulting findings are resolved. Gate 5B separately approved learner navigation and `/progress` within a read-only boundary; it did not authorize conversion or a writer.

## Why `fretboard-map`

`fretboard-map` is the smallest coherent bridge between the legacy course and the validated pilot:

- It is the first lesson and already owns the `note` reinforcement drill.
- Its low-E examples include E, F, and G; its A-string examples include A, B, and C.
- Those locations overlap the pilot objective `fretboard.natural-notes.region-1@1`.
- Existing learning progress is keyed by the stable slug `fretboard-map`.
- Existing practice progress records the same slug, drill, timestamps, prompt count, and accuracy.
- Existing Playwright coverage already protects the lesson-to-drill path and legacy completion behavior.

The overlap is useful for comparison, but it does not make legacy completion equivalent to pilot evidence. The lesson also teaches half steps, sharps, and octave organization beyond the pilot natural-note objective.

## Scope

### Included

- Read legacy `fretboard-map` records through existing parsers.
- Map valid records into immutable historical-context records with explicit provenance and unknown conditions.
- Build a deterministic parallel report that displays legacy history beside new capability claims without merging them.
- Rehearse malformed, partial, complete, stale, duplicate, and contradictory fixtures.
- Prove that report generation does not mutate any storage key.
- Add a local, unlinked preview route only if separately approved in the code plan.
- Export a report locally for review without transmitting it.

### Excluded

- `repeating-notes` or any other lesson.
- Changes to `/lessons/fretboard-map`, its completion checklist, its practice link, or its copy.
- Changes to `/practice`, note-drill prompts, thresholds, session history, or completion behavior.
- Automatic import into `AttemptRecord`, `EvidenceRecord`, `CapabilityClaim`, `ReadinessDecision`, or `ReviewObligation`.
- Writes to legacy keys or the education-pilot key.
- Supabase tables, RLS, authentication, account sync, deployment, remote telemetry, or production data retention.
- Learner-facing mastery or migration-complete language.

## Source Records

| Source | Current key | Relevant fields | Maximum valid interpretation |
| --- | --- | --- | --- |
| Lesson learning progress | `pocket-practice:lesson-learning-progress` | slug, status, timestamps, read/play/write checkpoints | Historical participation with named self-reported activities |
| Lesson practice progress | `pocket-practice:lesson-progress` | slug, drill, status, timestamps, accuracy, prompt count | Historical practice summary with unknown support and task conditions |
| Note session history | `pocket-practice:note-recognition-history` | session totals and attempts | Not attributable to `fretboard-map` because sessions do not retain lesson slug; exclude from segment import |

All source reads use the existing Zod-backed parsers. Unknown or malformed source records produce diagnostics, not inferred history.

## Historical Mapping Contract

The mapper produces `HistoricalEducationRecord` values in memory:

```ts
interface HistoricalEducationRecord {
  id: string;
  segmentId: "fretboard-map";
  category: "participation" | "practice_summary";
  occurredAt: string | null;
  source: {
    storageKey: string;
    storageVersion: number | "unversioned";
    sourceSlug: "fretboard-map";
  };
  relatedObjectives: Array<{ id: string; version: number }>;
  facts: Array<{ name: string; value: string | number | boolean }>;
  unknownConditions: string[];
  educationalLimit: string;
}
```

These are historical context records, not evidence records. They do not satisfy prerequisites, schedule review, alter capability state, or enter evidence ranking.

Required unknown conditions for practice summaries include:

- `support_level_unknown`
- `answer_revelation_unknown`
- `prompt_variation_unknown`
- `delay_condition_unknown`
- `task_validity_unknown`
- `content_version_unknown`
- `policy_version_unknown`

## Mapping Rules

1. A learning record with at least one checkpoint maps to historical participation.
2. `status: complete` records all present checkpoints and legacy completion as facts; it does not imply capability.
3. A practice record with `lastAttemptedAt`, `lastAccuracy`, or `lastPromptCount` maps to a historical practice summary.
4. Legacy `status: complete` remains a fact named `legacy_status`; it never becomes independent evidence.
5. A record without an attributable timestamp uses `occurredAt: null` and adds `timestamp_unknown`.
6. Global note-session history is not mapped because the session schema does not retain lesson attribution.
7. Duplicate inputs produce one deterministic output per source category and slug.
8. Malformed records are omitted from mapped history and counted in diagnostics.
9. New pilot evidence and contradictory delayed evidence never rewrite historical records.
10. No mapped record is passed to `interpretAttempt`, `deriveCapabilityClaim`, `evaluateReadiness`, or `scheduleNextReview`.

## Parallel Report

`buildFretboardMapParallelReport` receives already parsed legacy arrays plus an education store and an injected clock. It returns:

- legacy learning status and checkpoints;
- legacy practice status, last attempt, prompt count, and accuracy;
- mapped historical records and diagnostics;
- current claims for `fretboard.coordinates.basic@1` and `fretboard.natural-notes.region-1@1`;
- evidence counts by kind;
- scheduled/due review state;
- a neutral next action;
- an explicit explanation that legacy history was preserved but not evaluated under the new evidence policy.

The two columns remain independent. The report must never calculate a blended percentage, upgraded status, or winner between systems.

## Feature Isolation

The first implementation slice uses an additive module boundary under `apps/web/app/lib/education/migration/`. It has no side-effect imports and accepts parsed data as function arguments.

If a UI preview is approved, it lives at `/education-migration/fretboard-map`, is unlinked from production navigation, reads local data only, and writes nothing. Existing lesson and practice routes remain unchanged. Removal of the route and migration directory restores the prior application.

No environment variable, deployment flag, authentication check, or remote configuration is introduced for this local rehearsal.

## Telemetry Boundary

No network telemetry is authorized. The rehearsal may calculate in-memory diagnostics only:

- source records seen, accepted, omitted, and deduplicated;
- mapped records by category;
- missing timestamp and unknown-condition counts;
- legacy/new-system state combinations;
- report generation version.

Diagnostics contain no free-form learner text, account identifier, raw storage payload, full note-attempt history, or device fingerprint. They can be shown in the local preview or included in a user-triggered JSON export. Nothing is sent automatically.

## Rollback Rehearsal

Before implementation acceptance:

1. Capture representative legacy key strings byte-for-byte.
2. Generate the mapping and parallel report repeatedly.
3. Assert every captured legacy key remains byte-for-byte identical.
4. Assert the education-pilot key and recovery key remain identical.
5. Assert no new storage key exists after report generation.
6. Remove or disable the preview route and verify legacy lesson/practice flows still pass.
7. Revert the limited-migration commit and rerun the full validation suite.

Because the first slice is read-only, rollback requires code reversion only; it has no data rollback step.

## Acceptance Criteria

- Every fixture in `GATE_5_LEGACY_MAPPING_FIXTURES.md` passes.
- Mapping is deterministic and idempotent.
- No historical record is assignable to `EvidenceRecord` without an explicit compile-time conversion that does not exist.
- Legacy and pilot storage are byte-for-byte unchanged.
- Current `fretboard-map` Playwright behavior remains unchanged.
- Parallel-report copy accurately distinguishes history from capability evidence.
- Engine, content, web, type, lint, build, and E2E checks pass.
- A rollback rehearsal is recorded.

## Stop Conditions

Stop and request approval if the implementation would change a legacy reader or writer, alter lesson/practice meaning, expand navigation beyond the approved Gate 5B bridge, infer evidence from legacy completion, write a migration result, add a second segment, introduce remote telemetry, or touch production persistence.
