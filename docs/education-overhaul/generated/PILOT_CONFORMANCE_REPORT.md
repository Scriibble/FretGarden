# Pilot Conformance Report

Generated from `@pocket-practice/education-content`. Content version: `pilot-1`. Schema version: `1`.

## Result

`CONFORMS` for the implemented pilot scope.

- Objectives: 4
- Lessons: 4
- Exercises: 5
- Review policies: 1
- Remediation routes: 5
- Accessibility equivalents: 5
- Conformance issues: 0

## Authoring Validation

- No schema, identity, graph, ownership, review, or equivalence issues found.

The validator checks schema shape, unique identities, prerequisite references and cycles, objective lesson/exercise ownership, evidence ownership and quality alignment, delayed-review alignment, remediation and accessibility references, evaluator equivalence, claim ceilings, and increasing review delays.

## Objective Coverage

| Objective | Evidence ceilings | Review policy |
| --- | --- | --- |
| `practice.focused-session@1` | supported performance | None |
| `rhythm.external-pulse.basic@1` | independent performance, retained performance | pilot-spaced-review |
| `fretboard.coordinates.basic@1` | independent performance | None |
| `fretboard.natural-notes.region-1@1` | independent performance, retained performance, transfer | pilot-spaced-review |

## Constitutional Claim Limits

- Screen visits and phase completion produce no capability evidence.
- Hinted, prompted, or corrected work cannot create independent evidence.
- Immediate repetition cannot create retained evidence.
- Invalid timing tasks do not count against the learner.
- Contradictory delayed evidence preserves earlier achievement while setting current state to `needs_refresh`.
- The pilot does not issue a mastery claim.
- Legacy progress keys are neither read nor written by the pilot.

## Validation Coverage

- Pure education-policy invariants run in `@pocket-practice/education-engine`.
- Content conformance and report drift checks run in `@pocket-practice/education-content`.
- Evaluator, persistence, recovery, and replay tests run in the web package.
- Playwright covers opening flow, support limits, objective-aware delayed review, equivalent controls, reload behavior, and legacy-key isolation.

## Deferred Beyond Pilot

- Production database schema, RLS, account sync, and retention policy.
- Bulk lesson conversion and legacy progress import.
- Audio-input diagnosis and auditory-discrimination objectives.
- Full curriculum graph and advanced adaptive policy.
- Learner-facing mastery vocabulary.
