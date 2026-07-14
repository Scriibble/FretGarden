# Migration Plan and Approval Gates

## Principle

The overhaul must move from understanding to architecture to proof before scale.

## Gate 0 — Baseline protection

Required:

- clean working tree or documented exceptions;
- backup or branch;
- current test results recorded;
- current educational flows demonstrated;
- current database schema captured.

No educational changes before this baseline exists.

## Gate 1 — Discovery approval

Required artifacts:

- current-system inventory;
- compliance audit;
- traceability map;
- risk register;
- unresolved decisions.

Approval question:

> Is the current system understood well enough that implementation will not accidentally preserve, duplicate, or destroy important behavior?

## Gate 2 — Architecture approval

Required:

- target architecture;
- target data model;
- repository change plan;
- migration strategy;
- pilot plan;
- rollback approach.

No production schema migration before approval.

## Gate 3 — Pilot implementation approval

Implement one vertical slice only.

Required:

- feature flag or isolated route;
- no destructive legacy migration;
- domain and policy tests;
- content conformance tests;
- attempt/evidence persistence;
- observable learner flow;
- review and remediation paths.

## Gate 4 — Pilot validation

Validate:

- educational conformance;
- technical correctness;
- usability;
- accessibility;
- data integrity;
- performance;
- migration feasibility;
- authoring feasibility.

The pilot must expose weaknesses. Do not treat a successful demo as sufficient proof.

## Gate 5 — Limited migration

Migrate one coherent curriculum segment. Run old and new reporting in parallel where practical.

Required:

- mapping of legacy completion to new historical records;
- no automatic inflation to mastery;
- explicit unknown or unvalidated states;
- rollback;
- telemetry that distinguishes system errors from learner errors.

## Gate 6 — Full migration

Only after:

- pilot criteria pass;
- content authoring workflow is stable;
- conformance tests cover core rules;
- database migration is rehearsed;
- progress-state communication is approved;
- educational debt is bounded.

## Gate 7 — Legacy removal

Remove old logic only when:

- no production path depends on it;
- migrated evidence is verified;
- rollback window has elapsed;
- documentation and tests reference the new system;
- deletion is explicitly approved.

## Legacy progress rule

Preserve historical achievement without pretending it establishes current mastery under the new standard.

Suggested mapping:

```text
legacy completion → historical completion record
legacy score → imported observation with limited claim
legacy mastery → provisional legacy claim requiring revalidation
unknown support conditions → evidence confidence reduced
```
