# Proposed Repository Changes

Status: Phase 1 change map for Gate 2 review. Paths are proposed; none exist merely because they appear here.

## Pilot File Map

```text
packages/
  education-engine/
    package.json
    tsconfig.json
    src/
      index.ts
      contracts.ts
      evidence.ts
      claims.ts
      readiness.ts
      review.ts
      remediation.ts
      session.ts
      *.test.ts
  education-content/
    package.json
    tsconfig.json
    src/
      index.ts
      schema.ts
      validate.ts
      pilot/
        objectives.ts
        lessons.ts
        exercises.ts
        policies.ts
      *.test.ts

apps/web/app/
  education-pilot/
    page.tsx
  components/education/
    EducationPilot.tsx
    LessonPhase.tsx
    ObjectiveStatus.tsx
    AccessibleFretResponse.tsx
    PulseTask.tsx
    PracticePlan.tsx
  lib/education/
    orchestrator.ts
    evaluators.ts
    clock.ts
    storage/
      educationPilotStorage.ts
    *.test.ts

docs/education-overhaul/
  schemas/education-content.schema.json
  generated/PILOT_CONFORMANCE_REPORT.md
```

Exact component names may be refined during Phase 2, but ownership boundaries should not move without a decision-log entry.

## Existing Files Expected To Change In Phase 2

| Path | Smallest proposed change |
| --- | --- |
| `package.json` | Add education packages to `build:packages` and add `test:education` after package tests exist |
| `pnpm-lock.yaml` | Workspace links only unless runtime validation requires an already-approved dependency |
| `apps/web/package.json` | Add workspace dependencies on education engine/content |
| `apps/web/app/styles.css` | Add isolated pilot styles that follow current visual tokens |
| `AGENTS.md` | Reference the in-repo education addendum if the file exists in the tracked repository and approval includes contributor guidance |

The existing lesson, drill, progress, practice history, engines, Supabase migration, auth helpers, and current routes are not changed for the pilot unless a later implementation plan identifies a narrowly required adapter.

## Explicitly Out Of Scope

- No edits to `supabase/migrations` or RLS policies.
- No conversion of `apps/web/app/lib/lessons.ts`.
- No replacement of `lessonLearningProgress.ts` or `lessonProgress.ts`.
- No redesign of `FretboardExplorer.tsx`.
- No current navigation change unless separately approved for pilot access.
- No production analytics or cloud sync.
- No advanced ear-training diagnosis or audio-input assessment.
- No bulk copy rewrite or learner-facing status change on legacy screens.

## Implementation Slices

### Slice 1: Contracts And Pure Policy

Create the education engine, IDs/version contracts, evidence interpretation, readiness, review, remediation, and session composition. Prove constitutional invariants with unit tests before adding UI.

### Slice 2: Content Contract And Pilot Registry

Adapt the starter schema, define four pilot objectives and lessons, add graph/conformance validators, and generate a pilot conformance report. Content remains repository-authored and version controlled.

### Slice 3: Runtime And Local Persistence

Add the orchestrator, evaluators, injected clock, append-only local adapter, replay, and recovery behavior. No browser component should contain a claim or readiness threshold.

### Slice 4: Isolated Learner Flow

Render the pilot sequence at `/education-pilot`, including equivalent response controls, feedback, reattempt, delayed-review state, remediation, and explicit next actions.

### Slice 5: End-To-End Validation

Add Playwright scenarios, migration fixtures that prove legacy isolation, accessibility checks, production build verification, and the committed pilot conformance report.

Each slice should be a small logical commit and should remain revertible independently where dependencies permit.

## Test Placement

| Test type | Proposed location | Coverage |
| --- | --- | --- |
| Policy | `packages/education-engine/src/*.test.ts` | Claim ceilings, readiness, review, remediation, session limits |
| Content/schema | `packages/education-content/src/*.test.ts` | Required fields, references, graph, phase/evidence alignment, equivalents |
| Runtime/storage | `apps/web/app/lib/education/*.test.ts` | Lifecycle, replay, invalid tasks, persistence, clock |
| UI/component | Adjacent web Vitest tests where practical | Honest language, support/status display, next action |
| End to end | `apps/web/e2e/education-pilot.spec.ts` | Required pilot scenarios and reload behavior |
| Conformance | New `pnpm test:education` | Engine, content, runtime invariants and generated report verification |

All existing `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test:e2e` checks remain required.

## Major Proposal Records

### R1. Add Two Workspace Packages

- Constitutional requirement: Chapters 2-11 and 17 require explicit, reusable, testable policy and content contracts.
- Current implementation: Domain packages are clean, while education policy/content are embedded in the web app.
- Proposed implementation: Add `education-engine` and `education-content` following existing TypeScript/Vitest package conventions.
- Affected files: New package trees, root package scripts, lockfile, web dependencies.
- Risks: Additional build coordination and unclear early APIs.
- Alternatives considered: One package, simpler initially but conflates authored content with reusable policy; web-only modules, preserves framework coupling.
- Test strategy: Independent package builds and tests plus forbidden-import checks or package-boundary review.
- Migration consequences: Additive only; removing web imports and packages rolls back the pilot foundations.

### R2. Add An Isolated Web Route

- Constitutional requirement: Gate 3 requires an observable full lifecycle with rollback and no destructive legacy migration.
- Current implementation: Current lesson and practice routes embody legacy completion behavior.
- Proposed implementation: Add `/education-pilot` without replacing or silently redirecting current routes.
- Affected files: New route/components/lib modules and isolated styles.
- Risks: Duplicate UI patterns and accidental public discoverability.
- Alternatives considered: Feature flag inside current routes, rejected for initial pilot because it increases regression surface; separate app, rejected as unnecessary infrastructure.
- Test strategy: E2E isolation, no-change legacy flow tests, direct-route access, refresh, mobile, keyboard, and malformed-storage tests.
- Migration consequences: Route and namespaced data can be removed without touching existing progress.

### R3. Establish A Canonical Content Schema

- Constitutional requirement: Chapters 2-4, 7, 9, 10, and 17 require author-time conformance.
- Current implementation: Starter schema is nested documentation and current lesson types omit core educational fields.
- Proposed implementation: Adapt a canonical schema under `docs/education-overhaul/schemas`, backed by runtime contracts and drift checks.
- Affected files: Canonical schema, content package validators, conformance tests/report.
- Risks: Two sources of truth.
- Alternatives considered: Hand-maintain both indefinitely, rejected; TypeScript only, insufficient for external authoring/tooling.
- Test strategy: Generate or compare schema snapshots and validate valid/invalid fixtures.
- Migration consequences: Pilot content only; legacy lessons remain outside the schema and are listed as educational debt.

## Review Checkpoints Before Editing Runtime Code

1. Approve or amend package boundaries and names.
2. Approve pilot route and local-only persistence.
3. Approve internal and learner-facing vocabulary.
4. Approve the 24-hour review policy and pilot objective scopes.
5. Approve the exact Phase 2 file-level implementation plan.
