# Usability Review Protocol

Updated: 2026-07-14

## Purpose

Use this protocol to evaluate whether the isolated education pilot feels like a guided, sustainable practice path and whether learners understand what their evidence means. This is a moderated human review; Playwright success does not satisfy it.

## Review Record

| Field | Value |
| --- | --- |
| Build or commit | `376a1f3` |
| Facilitator | Evan Anderson |
| Education observer | Evan Anderson; external educator input remains recommended |
| Expert preflight | Codex, 2026-07-14 |
| Session dates | No moderated human sessions recorded |
| Participant profile | Early learner, returning learner, and educator/curriculum author all pending |
| Result | **EXPERT PREFLIGHT COMPLETE; THREE PARTICIPANT SESSIONS PENDING** |

Use at least three representative sessions before Gate 4 signoff: one early learner, one returning learner, and one guitar educator or curriculum author. Obtain appropriate consent and do not store names, account identifiers, recordings, or sensitive data in this repository.

## Session Method

1. Ask the participant to think aloud without teaching the interface in advance.
2. Let the participant stop, pause, choose a lighter session, use support, or leave the pilot naturally.
3. Intervene only for safety or after the participant is fully blocked; record the intervention.
4. Ask comprehension questions after the relevant task, not before it.
5. Record task outcome, observed friction, participant interpretation, and facilitator confidence separately.

## Required Tasks

| ID | Scenario | What to observe | Pass criterion | Result / evidence |
| --- | --- | --- | --- | --- |
| UX-01 | Choose a five-minute or reduced-load plan | Whether the target, duration, and next action feel workable rather than punitive | Participant can set or lighten the session and explain the immediate plan | Expert preflight pass; participant evidence pending. |
| UX-02 | Complete pulse model and guided attempt | Whether “model” and “supported practice” are understood | Participant recognizes that guided success is useful but not independent evidence | Expert preflight pass; participant evidence pending. |
| UX-03 | Fade support and complete an independent pulse at 50, 60, or 70 BPM | Whether the transition feels clear and musically coherent | Participant notices support removal and can identify the selected tempo | Expert preflight pass; participant evidence pending. |
| UX-04 | Complete coordinate and note retrieval | Orientation, prompt interpretation, controls, and feedback usefulness | Participant completes using the grid or equivalent controls without facilitator instruction | Expert preflight pass; participant evidence pending. |
| UX-05 | Reveal an answer, then retry | Emotional response and claim comprehension | Participant understands the corrected set is capped and that a fresh set is needed; copy is non-shaming | Expert preflight pass; participant evidence pending. |
| UX-06 | Complete the two-note application | Whether ordered note placement feels like musical application rather than duplicate recall | Participant can explain what changed and why both notes must be selected | Expert preflight pass; participant evidence pending. |
| UX-07 | Read the summary and next action | Interpretation of independent, retained, and transfer language | Participant can state what was shown, what was not claimed, and what happens next | Expert preflight pass; participant evidence pending. |
| UX-08 | Complete a due review at a changed tempo | Whether delayed and changed-context retrieval are understood | Participant notices the source tempo is unavailable and understands why another tempo is used | Expert preflight pass; participant evidence pending. |
| UX-09 | Encounter local save failure | Trust, recovery expectations, and action choice | Participant understands work is unsaved locally and can retry or export without believing legacy history was erased | Expert preflight pass; participant evidence pending. |
| UX-10 | End the session early | Autonomy and emotional tone | Participant can stop without coercion, loss language, streak pressure, or a false failure message | Expert preflight pass; participant evidence pending. |

## Comprehension Questions

Ask in the participant’s own words:

1. What did “practiced with support” mean here?
2. What changed before the independent attempt?
3. What does the two-note task show that a single-note answer does not?
4. Why did the delayed pulse review use a different tempo?
5. What is saved, what is not saved, and what would you do after the storage warning?
6. What is the next useful practice action?

Do not count a response as understood if it merely repeats the interface wording without an accurate explanation.

## Acceptance Criteria

- No participant is blocked from completing the core path without facilitator instruction.
- At least two of three participants accurately distinguish supported from independent evidence.
- At least two of three accurately explain the purpose of changed-context pulse review and two-note application.
- All participants can find the stop path and describe the persistence warning’s consequence.
- No observed copy or interaction uses shame, urgency, streak pressure, or completion theater to drive continuation.
- The educator/curriculum reviewer finds no material musical inaccuracy in the 50/60/70 BPM pulse task, natural-note prompts, or two-note patterns.

Any failed criterion becomes `UX-FINDING-NNN` with severity, evidence, owner, resolution, and retest status. A finding that creates false capability evidence or prevents the task is a Gate 4 blocker.

## Signoff

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Usability facilitator | Evan Anderson | Protocol approved; participant execution pending | 2026-07-14 |
| Guitar education reviewer | Pending | Pending | Pending |
| Product owner | Evan Anderson | Protocol approved | 2026-07-14 |
| Engineering owner | Evan Anderson | Protocol approved | 2026-07-14 |

Gate 4 usability closure requires the acceptance criteria to pass or remaining non-blocking findings to be explicitly accepted with a named owner and expiration.
