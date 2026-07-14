# Repository Discovery and Constitutional Audit Specification

## Purpose

This specification defines the first required activity before implementation: understanding the existing FretGarden education system and comparing it to the constitution.

## Audit units

Codex must inventory each of the following as an independent audit unit:

1. curriculum container;
2. unit/module;
3. lesson;
4. explanation or content block;
5. exercise or drill;
6. assessment-like interaction;
7. attempt evaluator;
8. feedback and hint behavior;
9. progress record;
10. mastery/readiness/progression rule;
11. review or recommendation mechanism;
12. remediation/adaptation behavior;
13. learner-facing educational status;
14. educational analytics event;
15. domain engine or music-theory library;
16. accessibility behavior.

## Required inventory fields

For each discovered educational component record:

```text
ID or path
component type
runtime owner
data source
user-visible behavior
objective implied or declared
evidence collected
support conditions
claim made
next action
persistence behavior
tests
known limitations
constitutional chapters implicated
```

## Compliance classifications

Use only these statuses:

- `CONFORMS`
- `PARTIALLY_CONFORMS`
- `NONCONFORMING`
- `UNDETERMINED`
- `NOT_APPLICABLE`
- `TEMPORARY_EDUCATIONAL_DEBT`

Do not classify a component as conforming merely because it is factually correct.

## Priority model

Classify findings by consequence:

- **P0 — Integrity risk:** false mastery, invalid progression, destructive migration, inaccessible required path, or materially misleading educational claims.
- **P1 — Core learning risk:** weak objectives, invalid evidence, absent retrieval, guessing, prompt dependence, or unresponsive repeated errors.
- **P2 — Quality risk:** incomplete application, weak feedback, inconsistent voice, excessive cognitive load, or poor practice sustainability.
- **P3 — Refinement:** documentation, naming, minor consistency, or maintainability concerns.

## Mandatory audit questions

For every core lesson or exercise:

- What must the learner actually do?
- Is the intended capability causally necessary for success?
- Could the learner pass through guessing, recognition, visual cue dependence, or memorized UI behavior?
- Is evidence attributable to the learner rather than the system?
- Is prompting recorded?
- Is there a correction and reattempt?
- Is there later unsupported retrieval?
- Is there meaningful variation or application?
- What does completion currently mean?
- What learner-facing claim is shown?
- What happens when performance is unstable?
- When is the capability revisited?

## Required audit outputs

### CURRENT_SYSTEM_INVENTORY.md

A neutral factual map of existing architecture.

### CONSTITUTIONAL_COMPLIANCE_AUDIT.md

Findings grouped by P0–P3, with chapter references and affected paths.

### CONSTITUTION_TO_CODE_TRACEABILITY.md

A matrix mapping each constitutional subsystem to existing and proposed code.

### EDUCATIONAL_RISK_REGISTER.md

Risks, probability, impact, mitigations, owner, and approval gate.

### UNRESOLVED_IMPLEMENTATION_DECISIONS.md

Questions that cannot be answered from the constitution or repository alone.

## Exit criteria

Discovery is complete only when Codex can explain the current end-to-end path from content definition to learner interaction to persisted progress and future lesson selection.
