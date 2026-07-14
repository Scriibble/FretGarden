# Constitutional Conformance and Test Plan

## Test layers

### Schema tests

Validate:

- required objective and evidence fields;
- valid prerequisite references;
- lesson phase completeness;
- review specifications;
- remediation routes;
- content versioning;
- accessibility metadata.

### Domain tests

Verify music-theory and fretboard answers independently of UI.

### Policy tests

Test:

- claim limits under prompts;
- mastery transitions;
- readiness decisions;
- evidence recency;
- review scheduling;
- remediation triggers;
- difficulty preservation;
- contradictory evidence;
- bypass decisions.

### Runtime integration tests

Test complete flows from lesson load through persisted evidence and next-action selection.

### UI tests

Test:

- no false mastery language;
- feedback specifies a next action;
- support state is represented;
- uncertainty is communicated;
- accessibility alternatives remain educationally equivalent.

### Migration tests

Test representative legacy users:

- no progress;
- completion only;
- high scores;
- partial unit completion;
- stale evidence;
- contradictory records;
- missing metadata.

## Core invariant tests

1. Visiting a lesson cannot create mastery.
2. Completing all screens cannot create mastery without evidence.
3. A hinted correct answer cannot be recorded as independent evidence.
4. Answer revelation requires a later unsupported retrieval opportunity.
5. A task invalidated by system failure does not count against the learner.
6. Repeated patterned errors route to a changed response.
7. Delayed review can reduce current confidence without deleting historical achievement.
8. Difficulty adaptation cannot remove the target capability.
9. A prerequisite may be satisfied by valid prior evidence, not only prior lesson completion.
10. Learner-facing claims never exceed evidence strength.
11. Review load respects sustainable-practice constraints.
12. A score cannot be the only stored representation of a multidimensional attempt.

## Content conformance fixture

Every pilot lesson should have a generated report answering:

```text
primary objective
prerequisites
entry evidence
lesson phases
scaffolds and fade plan
task/evidence alignment
feedback and correction
retrieval
variation
application
exit evidence
review schedule
remediation routes
claim limits
accessibility equivalents
```

## CI recommendation

Add a dedicated command such as:

```bash
pnpm test:education
```

It should run schema, policy, domain, content-conformance, and migration tests.
