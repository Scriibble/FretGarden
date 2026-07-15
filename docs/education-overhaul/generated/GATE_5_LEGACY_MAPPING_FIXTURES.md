# Gate 5 Legacy Mapping Fixtures

Status: Implemented; LM-001 through LM-020 pass in Gate 5A

Updated: 2026-07-14

## Purpose

These fixtures define the expected read-only interpretation of legacy `fretboard-map` data. They are specifications for future JSON/TypeScript fixtures and tests; this document does not import or mutate learner data.

## Shared Expectations

Every fixture must assert:

- source storage strings are unchanged after mapping and reporting;
- no `AttemptRecord`, `EvidenceRecord`, `ReadinessDecision`, or review obligation is created;
- generated IDs and ordering are deterministic across repeated runs;
- unrelated lesson records are ignored but preserved;
- unknown conditions remain explicit;
- malformed source data never becomes positive evidence.

## Fixture Matrix

| ID | Input condition | Expected historical output | Expected diagnostic | Prohibited outcome |
| --- | --- | --- | --- | --- |
| LM-001 | Both legacy keys absent | No records | `source_records_seen: 0` | Creating not-observed evidence |
| LM-002 | Learning record started with no checkpoints | No participation record | One valid but non-mappable record | Treating page visit as exposure |
| LM-003 | Learning record with `read` only | One participation record with `read: true` | No error | Independent or readiness evidence |
| LM-004 | Learning record with `read`, `play`, and `write`, status complete | One participation record preserving all checkpoints and legacy status | No error | Claiming successful physical execution |
| LM-005 | Practice record started but never attempted | No practice summary | One valid but non-mappable record | Practice evidence from route entry |
| LM-006 | Practice attempt below threshold | One practice summary with accuracy, prompt count, and `in-progress` | Required unknown-condition list | Contradictory capability evidence |
| LM-007 | Practice attempt at 10 prompts and 80% | One practice summary preserving `complete` as a legacy fact | Required unknown-condition list | Independent-performance evidence |
| LM-008 | High-accuracy complete practice record | Same ceiling as LM-007 | Required unknown-condition list | Retained, transfer, or mastery evidence |
| LM-009 | Learning and practice complete | Two records, participation then practice summary | No merge diagnostic | Combining records into stronger evidence |
| LM-010 | Unrelated `repeating-notes` records alongside `fretboard-map` | Only `fretboard-map` maps; all source strings preserved | Ignored unrelated count | Importing a second segment |
| LM-011 | Duplicate `fretboard-map` source entries | One deterministic record per category | Duplicate count | Duplicate mapped history |
| LM-012 | Malformed JSON envelope | No mapped records | Malformed-envelope diagnostic | Resetting or overwriting source data |
| LM-013 | Valid envelope with malformed record | Valid attributable records only | Omitted-record count | Partial malformed record becoming history |
| LM-014 | Legacy array format without version | Valid attributable records map with source version `unversioned` | Legacy-format count | Inventing version 1 provenance |
| LM-015 | Missing attempt timestamp but summary values exist | Practice summary with `occurredAt: null` | `timestamp_unknown` | Inventing current timestamp |
| LM-016 | Pilot independent evidence plus legacy complete | Parallel report shows both independently | Combination count only | Legacy history strengthening claim |
| LM-017 | Pilot contradictory delayed evidence plus legacy complete | Historical records unchanged; claim remains `needs_refresh` | Combination count only | Legacy completion overriding contradiction |
| LM-018 | Pilot transfer evidence plus no legacy history | Transfer appears only in evidence column | No legacy records | Backfilling legacy completion |
| LM-019 | Global note-session history present without lesson attribution | Session history excluded from segment mapping | Unattributed-session count | Guessing it belongs to `fretboard-map` |
| LM-020 | Mapping/report called twice with identical input | Deep-equal records and diagnostics | No added duplicate | Writing replay state or changing IDs |

## Canonical Examples

### Historical Participation Input

```json
{
  "slug": "fretboard-map",
  "status": "complete",
  "startedAt": "2026-06-01T10:00:00.000Z",
  "completedAt": "2026-06-01T10:12:00.000Z",
  "completedCheckpoints": ["read", "play", "write"]
}
```

Expected interpretation: the learner recorded reading, playing, and writing activities and the legacy UI marked the lesson complete. No correctness, independence, validity, retention, or transfer condition is known.

### Historical Practice Input

```json
{
  "slug": "fretboard-map",
  "drill": "note",
  "status": "complete",
  "startedAt": "2026-06-01T10:13:00.000Z",
  "completedAt": "2026-06-01T10:18:00.000Z",
  "lastAttemptedAt": "2026-06-01T10:18:00.000Z",
  "lastAccuracy": 90,
  "lastPromptCount": 10
}
```

Expected interpretation: one historical note-practice summary with 90% accuracy over 10 prompts. Support, revealed answers, variation, delay, validity, and policy/content versions are unknown. Legacy completion remains historical metadata only.

## Deterministic Identity

IDs use stable authored parts, not hashes of private raw payloads:

```text
legacy:fretboard-map:learning:<startedAt-or-unknown>
legacy:fretboard-map:practice:<lastAttemptedAt-or-startedAt-or-unknown>
```

If duplicate records share an ID, select the record with the latest attributable update/completion timestamp. When timestamps are equal or missing, preserve the first valid parsed record and emit a duplicate diagnostic. Do not combine fields from separate records.

## Ordering

Sort mapped records by:

1. known `occurredAt` ascending;
2. category `participation` before `practice_summary` when timestamps match;
3. deterministic ID ascending;
4. unknown timestamps last.

## Required Test Layers

- Pure mapper table tests for LM-001 through LM-020.
- Type tests proving mapped history is not evidence.
- Integration tests using existing legacy parsers and pilot store parser.
- Browser test proving `/lessons/fretboard-map` and its drill remain unchanged.
- Browser or integration test proving report generation writes no local-storage key.
- Rollback test using byte-for-byte snapshots before and after repeated report generation.
