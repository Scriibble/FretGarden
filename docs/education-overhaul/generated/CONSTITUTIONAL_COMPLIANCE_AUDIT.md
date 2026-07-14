# Constitutional Compliance Audit

Generated for Phase 0 of the FretGarden education-system overhaul.

## P0 - Integrity Risk

### P0-01: Learner-facing completion can exceed evidence

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/components/LessonCompletionCard.tsx`, `apps/web/app/lib/lessonLearningProgress.ts`, `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/lib/lessonProgress.ts`
- Current behavior: A lesson can be marked complete through self-reported checkpoints or one click. A lesson-linked drill can also produce `Lesson complete` when prompt count and accuracy criteria pass.
- Capability or claim involved: Lesson completion and course path progress.
- Constitutional requirement: Chapters 2, 5, and 6 require explicit objectives, valid evidence, and progression claims that do not exceed evidence. Chapter 17 requires honest learner-facing status language.
- Evidence: The completion records store status, timestamps, checklist items, last accuracy, and prompt count, but not objective ID, support condition, delayed retrieval, confidence, or claim limits.
- Learner consequence: A learner may see completion language without evidence that the claimed capability was independently demonstrated or retained.
- Recommended action: In Phase 1, separate historical completion, lesson participation, practice observation, evidence claim, readiness, and mastery language.
- Tests required: Invariant tests that visiting/checking a lesson cannot create mastery or readiness, and that learner-facing claims never exceed evidence.
- Approval gate: Gate 2 architecture approval before replacement; Gate 3 pilot before production behavior change.

### P0-02: Legacy progress has no migration meaning under the constitution

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/lib/lessonProgress.ts`, `apps/web/app/lib/lessonLearningProgress.ts`, `apps/web/app/lib/browserStorage.ts`, `apps/web/app/lib/practiceStorage.ts`
- Current behavior: Local records use `complete` and `in-progress` without a constitutional interpretation. They are versioned only at envelope level.
- Capability or claim involved: Historical achievement, current readiness, and future migration.
- Constitutional requirement: Chapter 6 and migration gates require legacy progress preservation without false reclassification as mastery.
- Evidence: Stored records lack support conditions, content version, policy version, objective IDs, and evidence confidence.
- Learner consequence: A future migration could either discard learner history or inflate legacy completion into stronger claims.
- Recommended action: Treat all existing lesson and drill records as historical observations/provisional legacy claims until revalidated.
- Tests required: Migration fixtures for no progress, completion only, high score, stale evidence, and missing metadata.
- Approval gate: Gate 2 architecture and Gate 5 limited migration.

## P1 - Core Learning Risk

### P1-01: Objectives and evidence are implied, not explicit

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/lib/lessons.ts`, drill modules in `apps/web/app/lib/*Recognition.ts`
- Current behavior: Lesson titles, summaries, prompts, and practice links imply objectives; drill attempts store correctness and task dimensions.
- Capability or claim involved: Note retrieval, chord-tone recognition, scale-degree recognition, interval location, octave-shape navigation, triad-inversion recognition.
- Constitutional requirement: Chapters 2 and 5 require explicit objective/evidence definitions and evidence aligned to the capability.
- Evidence: There is no objective registry or schema-backed objective/evidence link in current lesson data.
- Learner consequence: It is hard to prove a task measures the intended learning objective rather than recognition, UI familiarity, or short-term recall.
- Recommended action: Introduce objective IDs and evidence requirements in the pilot content model.
- Tests required: Content conformance tests for objective, task/evidence alignment, conditions, claim limits, and exit evidence.
- Approval gate: Gate 2 architecture.

### P1-02: Prompt and support conditions are not recorded

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/lib/drillSession.ts`, all drill session builders
- Current behavior: The system stores selected answers and correctness, but not whether the answer was produced after modeling, a hint, answer revelation, target-string highlighting, missed-review mode, random/fixed order, or other support.
- Capability or claim involved: Independence level and strength of evidence.
- Constitutional requirement: Chapters 2, 5, and 6 require support conditions to limit the claim strength.
- Evidence: Session records store `missedPrompts`, `accuracy`, and `attempts`; settings are not part of completed session records.
- Learner consequence: Prompted or scaffolded success can be interpreted the same as independent success.
- Recommended action: Store task conditions and support level with each attempt/evidence record in the pilot.
- Tests required: Hinted/prompted/corrected success cannot become independent mastery.
- Approval gate: Gate 3 pilot.

### P1-03: No delayed retrieval or retention model

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/lib/*Recognition.ts`, `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/lib/practiceHistory.ts`
- Current behavior: Review is immediate or later only if the learner manually chooses missed-prompt review or receives a weak-spot recommendation from recent local history.
- Capability or claim involved: Retention, current confidence, and readiness.
- Constitutional requirement: Chapter 7 requires designed review and spaced retrieval; Chapter 6 requires durable readiness not based on immediate repetition alone.
- Evidence: No review schedule, due date, evidence recency, retention state, or delayed review registration exists.
- Learner consequence: Immediate performance can be mistaken for stable learning.
- Recommended action: Pilot a delayed-review obligation record and use delayed outcome to update readiness/confidence.
- Tests required: Delayed review succeeds/lapses; delayed review can reduce current confidence without deleting history.
- Approval gate: Gate 3 pilot.

### P1-04: Remediation changes prompt set but not instructional response

- Status: `PARTIALLY_CONFORMS`
- Affected paths: `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/components/PracticeReviewPanel.tsx`
- Current behavior: Missed prompts and weak spots are surfaced. "Practice misses" switches to missed-review mode. Recommendations can select focused presets for some weak-spot categories.
- Capability or claim involved: Error response and adaptive routing.
- Constitutional requirement: Chapters 8 and 9 require repeated errors to change the instructional response and avoid unsupported causal diagnosis.
- Evidence: The system reports what was missed and sometimes chooses a focused preset, but it does not classify observable error types beyond dimensions like note/string/degree/quality, and it does not provide a changed lesson/remediation explanation.
- Learner consequence: Repeated errors may lead to repeated exposure to the same task instead of a targeted teaching move.
- Recommended action: Pilot observable error categories and route each to a distinct remediation activity.
- Tests required: Repeated patterned errors route to a changed response.
- Approval gate: Gate 3 pilot.

### P1-05: Course path is sequence-only, not prerequisite/evidence based

- Status: `NONCONFORMING`
- Affected paths: `apps/web/app/lib/lessons.ts`, `apps/web/app/lib/lessonLearningProgress.ts`, `apps/web/app/components/LessonLibrary.tsx`
- Current behavior: Current and next lessons are based on array order and first incomplete checklist status.
- Capability or claim involved: Readiness and progression.
- Constitutional requirement: Chapters 6 and 10 require prerequisite/readiness decisions based on evidence, not page order or completion alone.
- Evidence: Lesson objects do not include prerequisites. `buildLearningCourseProgress` has no access to evidence records.
- Learner consequence: Learners can move forward without prerequisite capability evidence, while prior knowledge cannot formally bypass content with valid evidence.
- Recommended action: Add prerequisite graph and readiness policy in architecture; pilot prior-knowledge bypass with valid evidence.
- Tests required: Missing prerequisite blocks or redirects; valid prior evidence can satisfy prerequisite.
- Approval gate: Gate 2 architecture, Gate 3 pilot.

## P2 - Quality Risk

### P2-01: Feedback is immediate and specific but not yet dimensional enough

- Status: `PARTIALLY_CONFORMS`
- Affected paths: `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/components/PracticeReviewPanel.tsx`
- Current behavior: Feedback identifies correct and incorrect answers, shows correct note/function, and review lists missed prompts and weak spots.
- Capability or claim involved: Feedback quality and next instructional action.
- Constitutional requirement: Chapter 8 requires actionable feedback and careful error classification.
- Evidence: Feedback often says what the correct answer was but not why the learner may have missed, which dimension to attend to next, or what changed action to take.
- Learner consequence: Learners may know the answer after revelation without knowing how to repair the underlying skill.
- Recommended action: In the pilot, define feedback mappings per objective and observable error type.
- Tests required: Feedback specifies a next action; system does not infer unobservable causes.
- Approval gate: Gate 3 pilot.

### P2-02: Practice sustainability is lightly represented

- Status: `PARTIALLY_CONFORMS`
- Affected paths: `apps/web/app/components/PracticeSessionSettings.tsx`, `apps/web/app/lib/*Recognition.ts`, `apps/web/app/components/PracticeHub.tsx`
- Current behavior: Session length presets include short sessions and quick warmups; practice copy encourages short focused work.
- Capability or claim involved: Sustainable practice and session composition.
- Constitutional requirement: Chapter 11 requires sustainable practice architecture and review load constraints.
- Evidence: There is no explicit practice-session objective, fatigue/load state, focused-work interval, or review-load budget.
- Learner consequence: Practice can be brief, but the system cannot yet adapt session composition to sustainable load evidence.
- Recommended action: Pilot practice regulation objective and shorter-session choice with explicit next action.
- Tests required: Learner chooses shorter sustainable session; review load respects constraints.
- Approval gate: Gate 3 pilot.

### P2-03: Accessibility alternatives are UI-level, not educational-equivalence records

- Status: `UNDETERMINED`
- Affected paths: `apps/web/app/components/FretboardExplorer.tsx`, `apps/web/app/components/LessonCompletionCard.tsx`, `apps/web/app/styles.css`
- Current behavior: UI uses semantic labels, buttons, status text, and Playwright checks some mobile behavior. There is no education-specific accessibility-equivalent metadata.
- Capability or claim involved: Equivalent learning path and demonstration.
- Constitutional requirement: Chapter 17 requires accessibility and content QA, including educationally equivalent paths where needed.
- Evidence: Current audit did not perform full accessibility testing; no equivalent path model exists.
- Learner consequence: Some learners may be blocked from producing equivalent evidence if the only task modality is visual fretboard clicking.
- Recommended action: Include accessibility-equivalent response metadata in the pilot schema and test at least one equivalent response path where practical.
- Tests required: UI accessibility tests plus content conformance report for equivalents.
- Approval gate: Gate 3 pilot.

## P3 - Refinement

### P3-01: Domain engines are well-separated but limited in scope

- Status: `PARTIALLY_CONFORMS`
- Affected paths: `packages/music-theory-engine/src/index.ts`, `packages/fretboard-engine/src/index.ts`
- Current behavior: Engines are pure and deterministic for current needs, with tests. They do not know about UI, mastery, or persistence.
- Capability or claim involved: Domain knowledge layer.
- Constitutional requirement: Chapters 12-16 and target architecture expect reusable domain logic separated from policy and UI.
- Evidence: Engines expose note spelling, scales, chords, intervals, fretboard positions, and mapping helpers.
- Learner consequence: Positive foundation; future advanced pedagogy may need richer spelling, rhythm, ear-training, and tuning support.
- Recommended action: Preserve this boundary; expand only when objective/evidence needs require it.
- Tests required: Domain tests remain independent from UI/persistence.
- Approval gate: Normal implementation review.

### P3-02: Existing docs already warn against overclaiming

- Status: `PARTIALLY_CONFORMS`
- Affected paths: `docs/LESSON_CONTENT_AGENT.md`, `docs/brand/BRAND_STRATEGY.md`, `docs/CURRENT_STATUS.md`
- Current behavior: Docs advise lesson robustness, optional drills, progress separation, and avoiding fake mastery claims.
- Capability or claim involved: Contributor guidance and product voice.
- Constitutional requirement: Chapter 17 requires consistent instructional voice and content QA.
- Evidence: Guidance exists but is not yet enforceable through schema or tests.
- Learner consequence: Good intent may drift as content grows.
- Recommended action: Move enforceable educational rules into schemas/conformance tests and reference the constitution addendum from repo instructions.
- Tests required: Content conformance fixture for pilot lessons.
- Approval gate: Gate 2 architecture.
