# Target Education Architecture

Status: Phase 1 proposal for Gate 2 review. This document authorizes no production change.

## Architectural Outcome

FretGarden should make a traceable distinction between content intent, learner observations, evidence interpretation, capability claims, and instructional decisions. Existing lesson and drill behavior remains the legacy path while one isolated pilot proves the model.

```text
versioned objective and content
  -> task instance and support conditions
  -> learner attempt and raw observations
  -> evidence interpretation with claim ceiling
  -> current capability claim
  -> readiness, review, remediation, or next-action decision
  -> specific learner-facing explanation
```

## Design Principles

1. Completion records participation; it never creates mastery or readiness by itself.
2. Raw observations are append-only. Policies may reinterpret them without rewriting history.
3. Support, correction, delay, variation, and task validity travel with each attempt.
4. Educational decisions are deterministic, explainable, versioned, and testable without React.
5. Existing music-theory and fretboard engines remain independent of education policy, UI, persistence, and deployment.
6. The pilot is additive, isolated, locally persisted, and removable without converting legacy data.
7. Learner-facing claims cannot exceed the strongest valid evidence.

## Proposed Layers And Ownership

| Layer | Proposed owner | Responsibilities | Dependency rule |
| --- | --- | --- | --- |
| Domain knowledge | Existing `packages/music-theory-engine` and `packages/fretboard-engine` | Notes, intervals, chords, scales, tunings, fretboard positions, answer equivalence | Must not import education, web, persistence, or UI code |
| Pedagogical policy | New `packages/education-engine` | Evidence interpretation, claim ceilings, readiness, review, remediation, session composition | May consume domain values through inputs; no React, Next.js, browser, database, or content imports |
| Content definition | New `packages/education-content` | Versioned objectives, graph, lessons, activities, rubrics, feedback, review, remediation, accessibility equivalents | Depends on education contracts and domain engines; no runtime or UI imports |
| Runtime orchestration | New `apps/web/app/lib/education` | Session lifecycle, task selection, policy invocation, persistence ports, next-action coordination | Depends on education packages; policy decisions must remain in `education-engine` |
| Persistence | Pilot adapters in `apps/web/app/lib/education/storage` | Append-only local records, schema validation, versioned envelopes, idempotent writes | Implements ports; no policy inference while reading or writing |
| Presentation | Isolated `apps/web/app/education-pilot` route and education components | Render content, collect responses, show feedback/status, expose equivalent controls | Cannot directly create claims, readiness, review, or mastery state |

`packages/education-engine` and `packages/education-content` are separate because policy must be testable against fixtures without loading the curriculum, while content validation must be able to reject an invalid authored lesson before runtime.

## Policy Vocabulary

### Support

Internal support levels are ordered as `modeled`, `guided`, `prompted`, and `independent`. Answer revelation is recorded separately as a correction event. A correct response after revelation is corrected performance, not independent evidence.

### Evidence And Claims

The pilot stores evidence kinds rather than a single score:

- `exposure`: content was encountered; no capability claim.
- `supported_performance`: the capability was used with modeled, guided, or prompted support.
- `independent_performance`: a valid task was completed without answer-producing support.
- `retained_performance`: independent evidence produced after the objective's minimum delay.
- `transfer`: independent evidence under a specified changed context.
- `readiness`: a decision that named prerequisites are sufficiently supported and current.

`mastery` remains an internal aggregate concept outside the first pilot's learner-facing vocabulary. The pilot may report "Practiced with support," "Shown independently," "Review due," "Retrieved after a delay," or "Ready for the next step." It must not report mastery from one session.

### Current State

Current state is derived, not stored as truth: `not_observed`, `developing`, `independent_once`, `review_due`, `retained`, `needs_refresh`, or `insufficient_evidence`. Historical achievements remain visible even when current readiness declines.

## Curriculum Graph

Objectives are immutable identities with explicit versions. Prerequisite edges point to an objective ID plus a minimum evidence requirement, relationship, recency rule, and bypass rule. Lesson order is presentation order only.

Required relationships are `required`, `strongly_recommended`, `supporting`, `corequisite`, and `enrichment`. A required edge blocks the dependent activity only when valid prior evidence or a placement task cannot satisfy it. Missing evidence produces a specific next action, not a punitive lock message.

Graph validation must reject missing references, duplicate versions, cycles among required edges, orphaned core objectives, and prerequisite requirements that no task can satisfy.

## Lesson And Exercise Runtime

A lesson is a versioned sequence of phases: position, activate, encounter, attend, model, attempt, interpret, adjust, fade, retrieve, vary, apply, consolidate, exit, and return. Not every phase must render a separate screen, but every omitted phase requires an explicit conformance justification.

An activity references one or more objectives and produces task instances. A task instance freezes prompt content, expected response, support ceiling, quality dimensions, validity conditions, content version, and policy version. Evaluators return observations only. The policy layer interprets those observations into evidence.

System or device failures invalidate a task rather than recording learner failure. Timing tasks must record visibility loss, clock discontinuity, insufficient samples, and input cancellation where observable. Automated feedback describes observed behavior and does not infer unobservable causes.

## Feedback, Remediation, And Adaptation

Observable error categories for the pilot are `incorrect_response`, `omission`, `coordinate_confusion`, `timing_early`, `timing_late`, `timing_unstable`, `support_dependency`, and `task_invalid`. Each feedback record includes the observation, concise correction, next action, and whether evidence was limited.

Repeated patterned errors route to a different instructional response: re-model, narrower contrast, coordinate orientation, slower pulse, reduced prompt set, or rest/shorter session. Adaptation may change load, support, ordering, tempo, range, or representation, but it cannot remove the capability named by the objective.

## Review And Sustainable Practice

The pilot default review schedule is 24 hours, 3 days, and 7 days after qualifying independent evidence. The 24-hour interval is real elapsed time in learner behavior; tests use an injected clock. Early voluntary practice is allowed but cannot satisfy delayed-retention evidence.

Session composition accepts an available-time budget and attention/load preference. Due review is bounded to at most 40 percent of a mixed session unless the learner explicitly chooses a review-only session. The policy always returns a reason and a specific next action.

A delayed lapse changes current state to `needs_refresh`, schedules remediation and another review, and preserves the earlier independent achievement as history.

## Accessibility Equivalence

Every evidence-producing activity declares the capability that must remain invariant and the response modalities that may vary. The note-retrieval pilot offers both a keyboard-operable semantic fretboard and explicit string/fret controls. Both produce the same coordinate response and are evaluated by the same policy.

The pulse pilot accepts keyboard, pointer, or accessible button taps against an audiovisual pulse. Audio is optional for this objective; removing sound does not alter the external-pulse capability. Activities that fundamentally require auditory discrimination will require separate equivalent objectives or an explicit limitation, not a falsely equivalent visual substitute.

## Versioning And Compatibility

Every stored runtime record includes `schemaVersion`, `contentVersion`, and `policyVersion`. Objective and lesson versions increment when meaning, evidence requirements, or progression consequences change. Copy edits that preserve meaning may use a content revision without invalidating evidence.

Legacy `lesson-learning-progress`, `lesson-progress`, and practice histories remain readable by legacy screens. The pilot stores records under a separate namespace and does not import them automatically. A future migration may map legacy completion to historical participation and legacy scores to limited observations with unknown support, never to retained performance or mastery.

## Major Proposal Records

### A1. Add A Framework-Free Education Policy Package

- Constitutional requirement: Chapters 2, 5-11 require explicit evidence, claim, readiness, review, remediation, and session policies.
- Current implementation: Accuracy, completion, recommendations, and course position are distributed across web helpers and `FretboardExplorer.tsx`.
- Proposed implementation: Add `@pocket-practice/education-engine` containing pure contracts and deterministic policy functions.
- Affected modules: New package; root build filters; web package dependency. Existing domain engines remain unchanged.
- Risks: Premature abstraction or policy APIs that fit only one task.
- Alternatives considered: Keep helpers under the web app, rejected because it preserves UI ownership; put policy in music theory, rejected because it couples pedagogy to domain knowledge.
- Test strategy: Table-driven unit tests for all constitutional invariants, policy versions, contradictory evidence, and invalid tasks.
- Migration consequences: None until the pilot calls the package; legacy paths continue unchanged.

### A2. Add A Versioned Content Package

- Constitutional requirement: Chapters 2-4, 7, 9, 10, and 17 require explicit objectives, phases, review, remediation, prerequisites, and equivalents.
- Current implementation: Thirteen unversioned TypeScript lessons and hard-coded drill prompt arrays.
- Proposed implementation: Add `@pocket-practice/education-content` with typed pilot registries and conformance validation, adapting rather than treating the starter JSON Schema as final.
- Affected modules: New package, canonical schema copy under `docs/education-overhaul/schemas`, education test command.
- Risks: Duplicate TypeScript and JSON-schema definitions; authoring friction.
- Alternatives considered: JSON-only content, rejected for the pilot because runtime validation and author ergonomics are weaker; database-authored content, deferred until persistence needs are proven.
- Test strategy: Schema fixtures, reference integrity, graph checks, phase/evidence alignment, review/remediation/accessibility checks.
- Migration consequences: Existing `lessons.ts` stays authoritative for legacy routes; no bulk conversion.

### A3. Use An Isolated Pilot Runtime And Local Store

- Constitutional requirement: Chapters 5-9 and Gate 3 require full evidence lifecycle, review, remediation, explainability, and reversibility.
- Current implementation: Existing practice localStorage records collapse attempts into correctness and summaries.
- Proposed implementation: Add `/education-pilot`, a runtime orchestrator, and append-only pilot localStorage records behind a distinct key prefix.
- Affected modules: New web route, education components, runtime/storage helpers, web tests.
- Risks: Parallel systems create temporary duplication; local data is device-specific.
- Alternatives considered: Replace current lesson/practice routes, rejected as too risky; Supabase first, deferred because it would require production schema and policy approval.
- Test strategy: Runtime integration tests, localStorage compatibility fixtures, Playwright lifecycle scenarios, reload/idempotency tests.
- Migration consequences: Pilot removal clears only its namespace; legacy data and behavior are untouched.

### A4. Use Evidence-Based Graph Progression

- Constitutional requirement: Chapters 6 and 10 require readiness and prerequisites to use evidence rather than screen order.
- Current implementation: The first incomplete lesson is current and the next array item is up next.
- Proposed implementation: Evaluate prerequisite edges against current valid evidence, including placement/bypass evidence and recency.
- Affected modules: Education engine readiness policy, content graph, pilot runtime and status UI.
- Risks: Overblocking learners or making reasons opaque.
- Alternatives considered: Completion gates, rejected as invalid; advisory-only ordering, retained for recommended edges but not required capability dependencies.
- Test strategy: Missing, stale, supported-only, contradictory, placement, bypass, and cycle fixtures.
- Migration consequences: Applies only to pilot objectives until limited migration is approved.

## Gate 2 Approval Boundary

Approval of this architecture permits implementation planning for the isolated pilot. It does not approve production database migrations, legacy progress conversion, current-route behavior changes, bulk curriculum rewriting, or global adaptive decisions.
