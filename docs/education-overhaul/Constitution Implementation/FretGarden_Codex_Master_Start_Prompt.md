# Codex Master Start Prompt — FretGarden Education-System Overhaul

You are beginning a controlled overhaul of FretGarden's education system.

## Governing authority

The files in `/Users/evananderson/Documents/FretGarden/Theory Engine/Constitution Implementation/FretGarden_Codex_Education_Overhaul_Starter_Kit` are the FretGarden Pedagogical Constitution, Chapters 1–17. Treat them as the authoritative educational specification for this repository.

Their authority applies to every:

- curriculum and pathway;
- learning objective;
- lesson and explanation;
- exercise and drill;
- assessment and evidence claim;
- mastery, readiness, and progression decision;
- review and retention mechanism;
- feedback and error response;
- remediation and adaptive-difficulty behavior;
- practice-session recommendation;
- fretboard, rhythm, ear-training, theory, harmony, and application lesson;
- learner-facing educational message;
- accessibility-equivalent learning path;
- educational data model, analytics event, and future educational feature.

When existing code, content, product behavior, comments, or prior documentation conflict with the constitution, document the conflict. Do not silently preserve the old rule. Do not silently change the constitution.

## Required operating method

Do not begin with a full curriculum rewrite.

First perform repository discovery and produce reviewable artifacts. Read:

1. `codex/01_AGENTS_EDUCATION_ADDENDUM.md`
2. `docs/02_REPOSITORY_DISCOVERY_AND_AUDIT_SPEC.md`
3. `docs/03_TARGET_EDUCATION_SYSTEM_ARCHITECTURE.md`
4. `docs/04_MIGRATION_AND_APPROVAL_GATES.md`
5. `docs/05_VERTICAL_SLICE_PILOT_SPEC.md`
6. `docs/06_CONFORMANCE_AND_TEST_PLAN.md`
7. `schemas/education-content.schema.json`

## Phase 0 — Repository discovery

Inspect the repository without changing production behavior. Locate and document:

- curriculum, unit, and lesson content;
- exercise generators and interaction components;
- answer evaluation and scoring;
- progress persistence;
- mastery, completion, unlock, and readiness logic;
- review queues, spaced-repetition behavior, or practice recommendations;
- feedback, hints, corrections, and retry behavior;
- user-facing educational copy;
- content-loading, seed, migration, and database code;
- analytics or telemetry relevant to learning;
- tests covering educational behavior;
- feature flags, mocks, placeholders, and dead code;
- where current behavior depends on UI state rather than educational evidence.

Output:

```text
docs/education-overhaul/generated/
  CURRENT_SYSTEM_INVENTORY.md
  CONSTITUTIONAL_COMPLIANCE_AUDIT.md
  CONSTITUTION_TO_CODE_TRACEABILITY.md
  EDUCATIONAL_RISK_REGISTER.md
  UNRESOLVED_IMPLEMENTATION_DECISIONS.md
```

Do not implement the overhaul during this phase, except for harmless documentation scaffolding.

## Phase 1 — Target architecture proposal

After discovery, propose:

- objective and evidence models;
- curriculum graph and prerequisite representation;
- lesson, phase, exercise, assessment, and review models;
- attempt and evidence records;
- mastery/readiness/progression state;
- feedback and error-classification structures;
- remediation and adaptive-difficulty routing;
- practice-session composition;
- accessibility-equivalent demonstrations;
- content versioning and migration strategy;
- boundaries between reusable music-theory logic, educational policy, UI, and persistence.

Output:

```text
docs/education-overhaul/generated/
  TARGET_EDUCATION_ARCHITECTURE.md
  TARGET_DATA_MODEL.md
  PROPOSED_REPOSITORY_CHANGES.md
  MIGRATION_PLAN.md
  PILOT_VERTICAL_SLICE_PLAN.md
```

For every major proposal, include:

- constitutional requirement;
- current implementation;
- proposed implementation;
- files or modules affected;
- risks;
- alternatives considered;
- test strategy;
- migration consequences.

Stop and request approval before modifying production schemas, migrating existing progress, or rewriting the complete curriculum.

## Phase 2 — Pilot vertical slice

After approval, implement only the pilot described in `docs/05_VERTICAL_SLICE_PILOT_SPEC.md`.

The pilot must demonstrate the full educational lifecycle:

```text
objective
→ prerequisite/readiness check
→ lesson encounter and model
→ supported attempt
→ feedback and correction
→ scaffold fading
→ unsupported retrieval
→ variation
→ musical application
→ exit evidence
→ delayed review registration
→ mastery/readiness update
→ remediation route when necessary
```

Do not treat lesson completion as mastery.

## Non-negotiable implementation rules

1. Every core objective must have explicit evidence requirements.
2. A learner must use the claimed capability to succeed.
3. Support conditions must be recorded and must limit the strength of the claim.
4. Corrected or prompted success is not independent mastery.
5. Scores are observations or summaries, not mastery by themselves.
6. Progression must use readiness and prerequisite evidence, not completion alone.
7. Review must be designed when the lesson is authored, not added as an afterthought.
8. Difficulty changes must preserve objective integrity.
9. Repeated errors must change the instructional response.
10. Learner-facing status language must remain honest, specific, and non-shaming.
11. Theory must connect to sound, physical action, retrieval, and musical use where relevant.
12. Automated inference must expose uncertainty and must not claim causes it cannot observe.
13. Existing user progress must not be discarded or falsely reclassified.
14. Preserve working non-educational infrastructure unless a change is necessary and justified.
15. Prefer small, reviewable changes with tests over broad speculative rewrites.

## Initial response required from Codex

Before editing, respond with:

1. the repository areas you will inspect;
2. the constitution chapters most relevant to each area;
3. the commands or searches you intend to run;
4. the artifacts you will produce;
5. any immediate access limitation;
6. confirmation that no full rewrite will occur before the audit and architecture gate.

Then begin Phase 0.
