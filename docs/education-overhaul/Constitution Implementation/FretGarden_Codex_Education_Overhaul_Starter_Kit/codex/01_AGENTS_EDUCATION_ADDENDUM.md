# AGENTS.md Addendum — FretGarden Educational Work

This addendum governs all work that changes educational behavior or educational claims.

## Authority

The Pedagogical Constitution in `../constitution/` is normative. Product requirements, implementation convenience, legacy behavior, engagement metrics, and local coding preferences do not override it.

## Scope

This addendum applies when modifying:

- curriculum order or prerequisites;
- lesson content or lesson components;
- drills, quizzes, games, assessments, or practice modes;
- scoring, mastery, readiness, progression, review, streak, or unlock logic;
- hints, feedback, error handling, remediation, or adaptive difficulty;
- music-theory, fretboard, rhythm, metronome, ear-training, harmony, or practice-session systems;
- educational analytics and learner-facing status claims.

## Required pre-change questions

Before changing educational behavior, identify:

1. the objective being served;
2. the evidence the behavior produces;
3. the conditions and support under which evidence is produced;
4. the strongest justified claim;
5. the next instructional action;
6. the relevant constitutional chapters;
7. the tests that will establish conformance.

## Prohibited shortcuts

Do not:

- equate completion with mastery;
- use accuracy alone as universal evidence;
- award mastery from immediate repetition after answer revelation;
- infer durable learning without delayed retrieval;
- unlock required dependencies solely because a screen was visited;
- make a task easier by removing the capability it claims to train;
- classify an error cause beyond observable evidence;
- use speed as the only measure of fluency;
- use praise, points, or streaks as substitutes for instructional feedback;
- rewrite all curriculum content before a pilot proves the architecture;
- delete legacy progress without a documented migration and rollback plan.

## Change discipline

Educational changes must be:

- traceable to constitutional requirements;
- represented in schemas rather than hidden in UI code;
- testable at the policy or domain level;
- versioned when they alter evidence meaning or progression;
- reversible during migration;
- documented as educational debt when temporarily nonconforming.

## Review gates

Explicit approval is required before:

- production database migrations;
- bulk curriculum migration;
- irreversible progress-state conversion;
- replacing mastery or progression logic;
- deleting old lesson or evidence structures;
- enabling adaptive decisions for all users.

## Definition of done

An educational change is not complete until:

- the intended capability is explicit;
- evidence and claim limits are explicit;
- support conditions are recorded;
- review and remediation behavior are defined;
- learner-facing language is accurate;
- automated conformance tests pass;
- traceability documentation is updated.
