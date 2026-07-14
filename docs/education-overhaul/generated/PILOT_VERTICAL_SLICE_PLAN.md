# Pilot Vertical Slice Plan

Status: Phase 1 pilot proposal for Gate 2 review. Phase 2 begins only after explicit approval of a concrete implementation plan.

## Pilot Outcome

Build the constitution starter kit's opening sequence on an isolated `/education-pilot` route. The sequence introduces the Garden's practice expectations, sustainable focused practice, external pulse, fretboard coordinates, and natural-note retrieval. The note objective demonstrates the complete evidence-to-review lifecycle; the other objectives prove session regulation, timing observations, and prerequisites.

## Objective Registry

| ID | Capability | Scope | Evidence ceiling in pilot |
| --- | --- | --- | --- |
| `practice.focused-session.v1` | Select one target and sustainable interval, follow it, notice a stop/reduce-load signal, and name the next useful action | 5, 10, or 15 minute pilot sessions | Independent performance; retained/mastery claims excluded |
| `rhythm.external-pulse.basic.v1` | Produce repeated taps aligned to an external pulse with defined stability and decreasing support | Quarter-note taps at 60 BPM, then varied 50-70 BPM | Independent performance and delayed retrieval |
| `fretboard.coordinates.basic.v1` | Identify string and fret coordinates using equivalent controls | Strings 6 and 5, open through fret 5 | Independent performance |
| `fretboard.natural-notes.region-1.v1` | Retrieve designated natural-note locations from varied prompts without answer cues, then after delay and changed context | String 6: E/F/G; string 5: A/B/C; frets 0-5 | Independent, retained, transfer, readiness |

Garden philosophy and expectations are encounter content linked to the practice objective; viewing them records exposure only.

## Prerequisite Graph

```text
practice.focused-session.v1 --strongly_recommended--> rhythm.external-pulse.basic.v1
practice.focused-session.v1 --strongly_recommended--> fretboard.coordinates.basic.v1
fretboard.coordinates.basic.v1 --required--> fretboard.natural-notes.region-1.v1
```

The required coordinate prerequisite can be satisfied by a short independent placement task. Missing evidence routes to coordinate orientation; valid prior knowledge bypasses instruction without fabricating lesson completion.

## Learner Flow

1. Position: choose a primary target and a 5, 10, or 15 minute interval.
2. Encounter: read concise Garden expectations and identify a useful stop/reduce-load signal.
3. Model: observe pulse tapping and fretboard coordinate/note examples.
4. Supported attempt: complete guided tasks with visible cues.
5. Interpret: receive dimensional feedback tied to observed correctness, coordinate selection, or tap stability.
6. Adjust: choose or receive a changed response after repeated errors or instability.
7. Fade: remove answer-producing cues and reduce pulse support.
8. Retrieve: complete unsupported tasks.
9. Vary: change prompt order, tempo, string, and equivalent response control.
10. Apply: locate a prompted note as part of a small playable two-note pattern.
11. Exit: evaluate evidence requirements and explain the strongest justified claim.
12. Return: register due review and present one specific next action.

## Evidence Requirements

### Focused Practice

- Learner names one target and chooses an interval.
- Timer completion is an observation, not proof of attention quality.
- Learner can stop or shorten without penalty and records a reason category voluntarily.
- Exit requires naming a next useful action; no physical or motivational cause is inferred.

### External Pulse

- Valid task contains at least eight taps after a count-in.
- Observations include median absolute offset and timing variability; exact thresholds are content-policy fields, not UI constants.
- Guided visual subdivisions can support performance but cannot create independent evidence.
- Focus loss, clock discontinuity, insufficient samples, or input cancellation invalidates the task without counting learner failure.
- Delayed retrieval is due after 24 hours; timing instability routes to slower tempo, count-in, and shorter tap groups.

### Coordinates

- Placement task uses varied prompts across both strings and at least three frets.
- All responses are keyboard operable and may use the semantic fretboard or explicit string/fret controls.
- A hint or highlighted coordinate caps evidence at supported performance.

### Natural-Note Retrieval

- Exit set contains eight independently answered, varied prompts covering both strings and all six target relationships across the set.
- A qualifying exit set requires at least six correct responses, no answer cues, valid task conditions, and no immediate repetition of a revealed answer counting as independent retrieval.
- Accuracy is one dimension; coverage, independence, validity, variation, and correction history are also required.
- Delayed review after at least 24 hours uses five varied prompts, both strings, and no visible answers.
- Four valid correct responses plus required coverage supports retained performance; a lapse preserves history, routes a contrast/remodel task, and schedules another review.
- Transfer uses the alternate response control or a changed note-pattern context while preserving the coordinate capability.

Thresholds are pilot hypotheses to validate, not universal definitions of mastery.

## Feedback And Remediation

| Observable pattern | Feedback | Changed instructional response |
| --- | --- | --- |
| Wrong fret, correct string | Name expected coordinate and compare neighboring landmarks | Two-choice coordinate contrast, then fade |
| Wrong string | Restate string numbering/orientation | Short coordinate orientation task before note prompts |
| Repeated note miss | Reveal relationship once and ask learner to describe it | Different prompt after correction, then later unsupported retrieval |
| Taps consistently early/late | Report observed direction without guessing cause | Count-in plus slower tempo |
| Taps unstable | Report changing spacing | Four-tap groups with stronger pulse, then fade |
| Support repeatedly requested | Acknowledge useful support and state claim limit | Return to model/contrast, then new independent task |
| Device/task invalid | Explain that the attempt was not counted | Retry or choose equivalent input |
| Attention/physical quality declined | Honor shorter session | Save next action and end without penalty |

## Learner-Facing Status

Use plain, non-shaming language:

- `Encountered`
- `Practiced with support`
- `Shown independently`
- `Review due tomorrow`
- `Retrieved after a delay`
- `Needs a refresh`
- `Ready for the next step`
- `Prerequisite evidence not yet shown`

Legacy screens keep current copy during the pilot. The new route does not call screen completion mastery.

## Required Scenarios

| Scenario | Expected behavior |
| --- | --- |
| Independent success | Strongest immediate claim is independent performance; review is registered |
| Success after hint | Supported claim only; a new unsupported task is required |
| Repeated retrieval error | Instruction changes, then returns to a novel unsupported prompt |
| Timing instability | Dimensional feedback and slower/shorter remediation |
| Task or device failure | Task invalidated; no learner penalty |
| Shorter sustainable session | Session saves history and next action without failure language |
| Delayed review succeeds | Retained claim and later review are registered |
| Delayed review lapses | History preserved; current state needs refresh and remediation |
| Missing prerequisite | Coordinate task offered with explanation |
| Valid prior knowledge | Placement evidence permits bypass |

## Accessibility And Modality

- Semantic fretboard cells expose string, fret, and current selection to assistive technology.
- Explicit string/fret selects are an equivalent response path evaluated identically.
- Pulse can be audiovisual, visual-only, or audio-only where timing remains measurable; input supports keyboard, pointer, and accessible button activation.
- Motion reduction disables nonessential animation without removing pulse timing information.
- No auditory discrimination claim is made by the pulse task.

## Persistence And Review Demonstration

Pilot records use localStorage only and survive reload. Production behavior requires a real 24-hour delay. Automated tests use an injected clock; a development-only fixture may seed a due review but must be visibly marked and unavailable in production builds.

The UI explains why an item is due and estimates its duration. Early practice is stored but does not satisfy retention evidence.

## Acceptance Tests

- All 12 core invariants in the starter conformance plan have automated coverage.
- Every required scenario above has a policy/runtime test; critical learner flows have Playwright coverage.
- Visiting or finishing screens cannot produce independent, retained, readiness, or mastery claims.
- Hints, answer revelation, and correction cap evidence correctly.
- Review due state is based on injected time and cannot be satisfied early.
- Invalid timing tasks do not affect learner evidence.
- Required prerequisite placement and bypass both work.
- Equivalent response controls produce equivalent evidence.
- Existing lesson/practice E2E tests continue to pass unchanged unless a separately approved test-only adjustment is required.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm test:e2e`, and new `pnpm test:education` pass.

## Pilot Exclusions

- Complete curriculum conversion
- Production database or account sync
- Replacement of current lesson/practice routes
- Advanced adaptive algorithms
- Audio-input performance diagnosis
- Durable mastery claims from the short pilot
- Irreversible legacy progress conversion

## Major Proposal Records

### P1. Pilot The Full Opening Sequence On One Isolated Route

- Constitutional requirement: Chapters 3, 6-12, 14, and 17 plus the starter pilot spec require the complete lifecycle and opening sequence.
- Current implementation: Existing lessons and drills cover pieces but not support-aware evidence, pulse, delayed review, or prerequisites.
- Proposed implementation: Four objectives on `/education-pilot`, with note retrieval carrying the complete lifecycle.
- Affected modules: New education packages, route, components, runtime/storage, tests, and conformance report.
- Risks: Pilot scope may be too large for one implementation pass.
- Alternatives considered: Note retrieval only, smaller but fails timing and sustainable-session scenarios; broad current-route retrofit, too risky.
- Test strategy: Build in slices and require policy/content tests before UI; automate all ten scenarios.
- Migration consequences: None; pilot content and records are isolated.

### P2. Use A Real 24-Hour Retention Boundary

- Constitutional requirement: Chapter 7 prohibits immediate repetition from standing in for delayed retrieval.
- Current implementation: Review can begin immediately from missed prompts.
- Proposed implementation: First qualifying retention review is due after 24 hours, with 3-day and 7-day follow-ups.
- Affected modules: Review policy/content, injected clock, storage, status UI, tests.
- Risks: Slower manual validation and learner drop-off before return.
- Alternatives considered: Five-minute demo delay, rejected as educationally misleading; test-only time travel, accepted only for automation/development fixtures.
- Test strategy: Boundary, early-attempt, overdue, lapse, success, and clock-tampering-resistant behavior tests within browser limits.
- Migration consequences: Legacy immediate review remains legacy practice and does not satisfy new retention evidence.

### P3. Make Note-Response Controls Educationally Equivalent

- Constitutional requirement: Chapter 17 requires accessible paths that preserve the claimed capability.
- Current implementation: Fretboard clicking has semantic labels but no explicit equivalent evidence contract.
- Proposed implementation: Semantic grid and explicit coordinate controls emit the same response shape and use the same evaluator.
- Affected modules: Pilot content, response component, evaluator, conformance and E2E tests.
- Risks: A linear control may reduce spatial demand.
- Alternatives considered: Keyboard grid only, may remain difficult for some users; note-name multiple choice, rejected because it removes location retrieval.
- Test strategy: Same prompt/response fixtures across modalities plus keyboard and screen-reader-oriented checks.
- Migration consequences: Pattern becomes a requirement for future migrated fretboard tasks.

## Gate 3 Entry Decision

Before implementation, approve or amend the package boundaries, four objective scopes, evidence thresholds, learner-facing vocabulary, isolated route, local-only persistence, real review timing, equivalent controls, and rollback plan. Any unresolved item should be logged as an explicit pilot hypothesis or blocker rather than hidden in code.
