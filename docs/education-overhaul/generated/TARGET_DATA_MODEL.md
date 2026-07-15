# Target Education Data Model

Status: Phase 1 logical model for Gate 2 review. It is not a production database schema.

## Model Rules

- Content definitions, runtime observations, interpretations, and decisions are separate records.
- Records are append-only where practical; corrections supersede records with provenance.
- Every reference uses a stable ID and explicit version.
- Every claim cites the evidence records that justify it and the policy that interpreted them.
- Unknown support, validity, or version metadata lowers the claim ceiling.
- Timestamps are ISO 8601 UTC strings; elapsed timing also uses monotonic milliseconds when available.

## Content Definitions

### ObjectiveDefinition

| Field | Meaning |
| --- | --- |
| `id`, `version`, `status` | Stable identity, positive integer version, draft/active/retired lifecycle |
| `domain`, `capability` | Domain category and observable learner capability |
| `contentScope` | Notes, strings, frets, tempo, concepts, or other bounded material |
| `conditions` | Required context, representations, tools, and constraints |
| `qualityStandards` | Named dimensions and acceptable criteria; never only a total score |
| `targetIndependence` | Maximum support allowed for the intended claim |
| `prerequisites` | Version-aware graph edges with relationship and evidence threshold |
| `evidenceRequirements` | Required actions, conditions, dimensions, delay, variation, and claim ceiling |
| `reviewPolicyId`, `masteryPolicyId` | Versioned policy references |

### PrerequisiteEdge

Includes `objectiveId`, accepted version range, `relationship`, minimum claim kind, minimum independence, recency window, accepted placement task IDs, and the next action when evidence is missing. Required edges cannot depend on lesson completion.

### LessonDefinition

Includes `id`, `version`, `title`, primary and secondary objective references, entry conditions, ordered phase definitions, exit evidence references, delayed review registrations, remediation routes, accessibility equivalents, and content-quality metadata.

### ActivityDefinition And ExerciseDefinition

An activity declares its phase, objective alignment, learner action, support offered, feedback map, and produced task type. An exercise additionally declares prompt generation, response contract, evaluator ID, quality dimensions, variation axes, invalidation conditions, attempt limits, support fade, and evidence eligibility.

### EvidenceRequirement

Includes `id`, objective reference, required learner action, conditions, quality dimensions, claim supported, maximum support level, minimum delay, novelty/variation requirement, minimum valid samples, contradiction handling, and expiration/recency rule.

### ReviewPolicy And RemediationRoute

A review policy defines qualifying evidence, delay sequence, due windows, lapse behavior, and load limits. A remediation route defines observable triggers, instructional response, support change, exit condition, and preserved objective invariants.

### AccessibilityEquivalent

Includes source activity, alternate modality, unchanged capability, permitted representation changes, response contract, evaluator, evidence ceiling, and known limitations. An alternative is invalid if it removes the target capability.

## Runtime Records

### EducationSession

Stores `sessionId`, learner-local subject ID, content and policy versions, mode, target objectives, available-time budget, start/end times, lifecycle state, selected accessibility mode, and resulting next action. It does not store mastery as a mutable flag.

### TaskInstance

Freezes `taskInstanceId`, activity/exercise IDs and versions, objective references, prompt payload, expected-response contract, support ceiling, variation values, validity requirements, creation time, and deterministic seed where applicable. Freezing prevents later content edits from changing what an old attempt meant.

### AttemptRecord

Stores:

```text
attemptId
sessionId
taskInstanceId
startedAt / respondedAt / monotonicDurationMs
response payload
supportLevel
supportsUsed[]
correctionState
device and task validity observations
schemaVersion / contentVersion / policyVersion
```

The response payload is domain-specific but validated. Correctness is not the attempt itself.

### ObservationRecord

An evaluator emits one or more observations such as correctness, selected coordinate, expected coordinate, timing offset, timing variability, omission, or system invalidity. Each observation includes evaluator version and observable facts only.

### EvidenceRecord

An interpreter links objective, requirement, attempt, and observation IDs. It stores evidence kind, quality-dimension results, independence level, delay classification, variation classification, validity, confidence category, claim ceiling, and reasons. Evidence never deletes the raw attempt.

### CapabilityClaim

A derived claim includes objective/version, kind, current state, supporting and contradicting evidence IDs, strength category, valid-through/next-review time, policy version, and human-readable rationale token. Claims can be superseded but historical claims remain traceable.

### ReadinessDecision

Stores target objective/activity, decision `ready`, `ready_with_support`, or `not_yet_demonstrated`, evaluated prerequisites, evidence snapshot, missing requirements, bypass/placement result, policy version, and next action. It avoids the word "locked" unless access is genuinely unavailable.

### ReviewObligation

Stores objective, source evidence, sequence index, `dueAt`, due window, state, completion evidence, lapse result, and reschedule provenance. Early practice can be linked without satisfying the obligation.

### FeedbackEvent, RemediationEvent, And NextAction

Feedback links observations to specific language, correction, and next action. Remediation records its observable trigger, route version, instructional change, support adjustment, and exit result. A next action includes type, target, reason code, estimated duration, priority, and learner-facing explanation.

## Record Relationships

```text
ObjectiveDefinition <- EvidenceRequirement <- ExerciseDefinition
         ^                                      |
         |                                      v
   CapabilityClaim <- EvidenceRecord <- ObservationRecord <- AttemptRecord
         |                                                     |
         v                                                     v
 ReadinessDecision                                      TaskInstance
         |
         +-> NextAction <- ReviewObligation / RemediationEvent
```

## Pilot Policy Defaults

| Concern | Proposed default |
| --- | --- |
| Support ranking | `modeled < guided < prompted < independent` |
| Corrected answer | Creates correction evidence only; requires a later unsupported task |
| Confidence | Categorical: `insufficient`, `limited`, `moderate`, `strong` |
| First delayed review | Due after 24 real hours; test clock may advance in automated tests |
| Later reviews | 3 days, then 7 days after qualifying retrieval |
| Contradictory delayed evidence | Preserve history, set current state to `needs_refresh`, route remediation |
| Missing metadata | Evidence retained as history with an `unknown` condition and limited ceiling |
| Invalid task | Excluded from learner evidence; system observation retained |
| Pilot persistence | Versioned localStorage envelope under a new education-pilot namespace |

## Legacy Mapping Contract

| Legacy source | Permitted import meaning | Prohibited interpretation |
| --- | --- | --- |
| Learning lesson `complete` | Historical participation/completion | Independent performance, retention, readiness, mastery |
| Practice lesson `complete` | Historical session threshold met | Mastery or durable learning |
| Accuracy and prompt count | Limited summary observation | Multidimensional evidence without raw conditions |
| Missed prompts | Historical error observations if prompt identity remains valid | Current weakness without recency evaluation |
| Unknown support | Explicit `unknown` support with reduced ceiling | Independent evidence |

The pilot performs no automatic import. This mapping becomes executable only at Gate 5.

## Starter Schema Disposition

The bundled `education-content.schema.json` is accepted as a useful conceptual seed but needs these additions before pilot use: stable IDs for evidence requirements and policies, typed prerequisites, activity/exercise contracts, policy references, quality-dimension definitions, version/revision distinction, status lifecycle, referential integrity rules, and stricter review/remediation/accessibility shapes.

The canonical implementation should use TypeScript contracts plus runtime validation in `packages/education-content`; a generated or synchronized JSON Schema should support documentation and external tooling. CI must detect drift between them.

## Major Proposal Records

### D1. Separate Attempt, Observation, Evidence, Claim, And Decision

- Constitutional requirement: Chapters 2, 5, 6, and 8 require valid evidence and bounded claims.
- Current implementation: Attempts, correctness, score, completion, and recommendation are partially collapsed.
- Proposed implementation: Use the runtime records above with explicit provenance links.
- Affected modules: Education packages, pilot runtime/storage, conformance fixtures.
- Risks: More records and debugging complexity.
- Alternatives considered: One aggregate progress object, rejected because it cannot preserve support, uncertainty, or reinterpretation.
- Test strategy: Serialization, referential integrity, claim-ceiling, invalid-task, and replay tests.
- Migration consequences: Legacy summaries remain limited observations; no inferred fields are fabricated.

### D2. Store Versioned Append-Only Pilot Records Locally

- Constitutional requirement: Chapters 5-7 and 17 require explainability, review, and honest status; Gate 3 requires reversible persistence.
- Current implementation: Local records are mutable summaries with separate keys.
- Proposed implementation: Add a distinct versioned envelope containing append-only sessions, attempts, observations, evidence, decisions, reviews, and remediation events.
- Affected modules: New pilot storage adapter and tests only.
- Risks: Browser storage growth and schema evolution.
- Alternatives considered: Supabase first, deferred; in-memory only, rejected because delayed review and reload scenarios need persistence.
- Test strategy: Quota-aware compaction policy tests, malformed payload recovery, idempotent write, version rejection, and round-trip fixtures.
- Migration consequences: Removing the pilot key is a complete rollback; current keys are untouched.

### D3. Derive Current Capability State

- Constitutional requirement: Chapters 6 and 7 require recency, contradiction, and retention to affect current claims without erasing history.
- Current implementation: `complete` is stored directly and remains complete.
- Proposed implementation: Replay relevant evidence through a versioned reducer to derive current state and next review.
- Affected modules: Education engine claim/review reducers and pilot status UI.
- Risks: Policy changes can alter displayed state.
- Alternatives considered: Persist only the latest state, rejected because it loses explainability and migration safety.
- Test strategy: Deterministic replay, policy-version snapshots, stale evidence, lapse, recovery, and contradictory evidence tests.
- Migration consequences: Old derived snapshots may be cached but must be reproducible from source records.

## Production Data Boundary

This model does not approve Supabase tables, RLS policies, account-linked learner identifiers, retention periods, analytics export, or cross-device sync. Those require a separate production data design and explicit approval after pilot validation.
