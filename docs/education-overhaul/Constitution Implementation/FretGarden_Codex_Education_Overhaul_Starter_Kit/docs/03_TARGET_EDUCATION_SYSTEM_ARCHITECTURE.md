# Target Education-System Architecture

## Architectural objective

FretGarden should represent educational intent and evidence explicitly. Educational policy must not be inferred from page order, UI completion, or isolated score fields.

## Recommended layers

### 1. Domain knowledge layer

Pure, standalone, deterministic music-domain libraries:

- pitch and note spelling;
- fretboard mapping and tunings;
- intervals and scale degrees;
- chord and scale construction;
- rhythm representations;
- answer normalization;
- transposition and equivalence.

This layer must not know about UI, mastery, engagement, or database concerns.

### 2. Pedagogical policy layer

Pure or mostly pure rules for:

- objective requirements;
- evidence interpretation;
- prompt/support limitations;
- readiness and prerequisite evaluation;
- mastery state transitions;
- review scheduling decisions;
- feedback selection;
- remediation routing;
- difficulty adjustment;
- session composition.

### 3. Content-definition layer

Versioned curriculum data:

- objectives;
- prerequisite graph;
- lessons and phases;
- exercises and assessments;
- feedback mappings;
- review specifications;
- remediation routes;
- accessibility equivalents;
- domain-specific rubrics.

### 4. Runtime orchestration layer

Coordinates:

- lesson sessions;
- attempts;
- exercise selection;
- feedback;
- support changes;
- evidence capture;
- exit decisions;
- review registration;
- next-action selection.

### 5. Persistence layer

Stores observations separately from interpretations:

- attempts;
- conditions;
- prompts and hints;
- evidence records;
- mastery claims;
- readiness decisions;
- review state;
- remediation history;
- content versions;
- migration provenance.

### 6. Presentation layer

Displays:

- lesson content;
- tasks and controls;
- actionable feedback;
- current status;
- review reasons;
- next actions;
- uncertainty where relevant.

The UI must not independently create mastery, readiness, or progression claims.

## Observation-to-decision chain

Every educational decision should be traceable through:

```text
objective
→ task
→ attempt
→ observation
→ evidence interpretation
→ capability claim
→ readiness/progression/review decision
→ learner-facing explanation
```

## Required separation of records

Do not collapse these into one score:

- raw response;
- correctness;
- timing or performance dimensions;
- prompt/support condition;
- inferred evidence;
- confidence;
- mastery state;
- readiness state;
- progression action.

## Versioning rule

Any change that alters what an objective means, what evidence supports it, or how progression is decided requires a versioned content or policy change and an explicit treatment of existing evidence.

## Compatibility rule

Existing educational behavior may be wrapped or adapted temporarily, but compatibility layers must be labeled and scheduled for removal. New work must target the explicit architecture.
