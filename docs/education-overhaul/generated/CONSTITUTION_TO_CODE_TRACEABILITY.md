# Constitution To Code Traceability

Generated for Phase 0 of the FretGarden education-system overhaul.

| Constitutional subsystem | Current code or docs | Current status | Proposed Phase 1 target |
| --- | --- | --- | --- |
| Chapter 1: Foundation, terms, claim discipline | `AGENTS.md`, `docs/brand/BRAND_STRATEGY.md`, lesson/practice copy | Partially represented as product guidance | Add repo-local education addendum and conformance language for educational claims |
| Chapter 2: Learning objectives and evidence | Objectives are implied in `apps/web/app/lib/lessons.ts` and drill prompt types | Nonconforming | Objective registry with IDs, versions, domains, conditions, quality standards, evidence requirements, and claim limits |
| Chapter 3: Lesson architecture | `apps/web/app/lessons/[slug]/page.tsx`, `LessonCompletionCard`, `lessons.ts` sections | Partially conforming content flow; not schema-backed | Versioned lesson phases: encounter, model, attempt, feedback, fade, retrieve, vary, apply, exit, return |
| Chapter 4: Exercise architecture and drill design | `*Recognition.ts`, `drillSession.ts`, `FretboardExplorer.tsx` | Partially conforming for deterministic task/evaluator design | Exercise contracts linked to objectives, support levels, variation rules, and invalid task conditions |
| Chapter 5: Assessment construction and validity | Prompt count plus accuracy in `LessonPracticeCriteria`; drill attempts | Nonconforming as assessment evidence | Evidence records separated from raw observations and scores; validity checks per objective |
| Chapter 6: Mastery, readiness, progression | `lessonProgress.ts`, `lessonLearningProgress.ts`, `buildLearningCourseProgress`, `buildLessonReviewOutcome` | Nonconforming for readiness/mastery; partially safe because UI mostly says completion | Mastery/readiness policy layer with support limits, recency, confidence, and prerequisite evidence |
| Chapter 7: Review, retention, spaced retrieval | Missed-prompt review mode; weak-spot recommendation | Partially conforming immediate review only | Delayed review obligations, due state, recency, retrieval outcomes, and confidence updates |
| Chapter 8: Feedback and error classification | Immediate feedback in `FretboardExplorer`; review panel missed prompt details | Partially conforming | Observable error taxonomy plus feedback mappings and next instructional action |
| Chapter 9: Remediation and adaptive difficulty | Focused presets, weak spots, "Practice misses" | Partially conforming | Remediation routes that change instruction while preserving objective integrity |
| Chapter 10: Curriculum architecture and prerequisite graphs | Lesson array order, previous/next helpers, first incomplete current lesson | Nonconforming | Prerequisite graph and placement/bypass rules based on evidence |
| Chapter 11: Practice-session architecture and sustainable practice | Quick warmup/session length presets; Practice Hub recommendations | Partially conforming | Practice regulation objective, load budget, review load policy, and sustainable next action |
| Chapter 12: Fretboard and note learning | `fretboard-engine`, note recognition drill, fretboard lesson content | Partially conforming | Explicit note-retrieval objectives with constrained regions, unsupported retrieval, variation, and delayed review |
| Chapter 13: Interval, scale-degree, chord-tone pedagogy | Chord tone, scale degree, interval drills and lessons | Partially conforming | Objective-specific evidence definitions that connect function, sound, fretboard action, and application |
| Chapter 14: Rhythm and metronome pedagogy | No metronome or timing evaluator found | Nonconforming for planned pilot scope | Pulse synchronization objective and task model in pilot; no unsupported audio diagnosis |
| Chapter 15: Ear-training and auditory pedagogy | Listening goals in lesson prose; no ear-training engine | Undetermined/nonimplemented | Accessibility-aware auditory tasks only when evidence can be validly captured |
| Chapter 16: Scales, chords, harmony, musical application | Lesson prose, write-with-it tasks, theory engine | Partially conforming | Application evidence separated from reading/checklist completion |
| Chapter 17: Instructional voice, accessibility, content QA | Lesson copy, semantic UI, docs guidance, tests | Partially conforming | Content conformance reports, claim-language tests, accessibility-equivalent metadata |

## Data Flow Trace

| Stage | Current implementation | Gap to constitution |
| --- | --- | --- |
| Content definition | TypeScript lesson objects and hard-coded prompt arrays | No content version, objective IDs, prerequisites, review policy, remediation routes, or accessibility-equivalent records |
| Lesson rendering | Static Next route maps lesson sections to UI | No phase contract or objective/evidence display model |
| Lesson participation | Local checklist and manual complete button | Self-report can create completion without evidence |
| Drill attempt | UI builds attempt object with selected answer and correctness | Attempt lacks support level, task condition, response time policy, invalidation reason, and evidence interpretation |
| Session summary | Correct/missed/accuracy plus missed prompts | Score collapses multidimensional evidence into a summary |
| Lesson-linked practice | Accuracy/prompt-count threshold sets practice status complete | Does not distinguish performance, learning, retention, readiness, or mastery |
| Review | Missed-prompt mode and weak-spot recommendations | No delayed retrieval registration or retention state |
| Persistence | LocalStorage envelopes with Zod parsing | No durable evidence store, content version, policy version, migration provenance, or cloud sync |
| Recommendation | Weak spot or current lesson paired drill | No prerequisite/readiness policy or sustainable review-load policy |

## Audit Unit Coverage

| Audit unit | Representative paths | Classification |
| --- | --- | --- |
| Curriculum container | `apps/web/app/lib/lessons.ts` | `PARTIALLY_CONFORMS` |
| Unit/module | Lesson array order and lesson helpers | `NONCONFORMING` for prerequisite graph |
| Lesson | `/lessons/[slug]`, `LessonCompletionCard` | `PARTIALLY_CONFORMS` |
| Explanation/content block | Lesson sections, play prompts, writing tasks | `PARTIALLY_CONFORMS` |
| Exercise/drill | `*Recognition.ts`, `FretboardExplorer.tsx` | `PARTIALLY_CONFORMS` |
| Assessment-like interaction | Lesson practice criteria, completed drill sessions | `NONCONFORMING` |
| Attempt evaluator | `build*Attempt`, `is*Correct*` helpers | `PARTIALLY_CONFORMS` |
| Feedback/hint behavior | Immediate feedback strings, review panel | `PARTIALLY_CONFORMS` |
| Progress record | `lessonProgress.ts`, `lessonLearningProgress.ts` | `NONCONFORMING` |
| Mastery/readiness/progression rule | First incomplete lesson, accuracy threshold | `NONCONFORMING` |
| Review/recommendation mechanism | Missed review, weak spots, Practice Hub | `PARTIALLY_CONFORMS` |
| Remediation/adaptation behavior | Focused presets and missed-prompt sessions | `PARTIALLY_CONFORMS` |
| Learner-facing educational status | "Complete", "current", "up next", weak spots | `PARTIALLY_CONFORMS` |
| Educational analytics event | None found beyond local session history | `UNDETERMINED` |
| Domain engine | `packages/music-theory-engine`, `packages/fretboard-engine` | `PARTIALLY_CONFORMS` |
| Accessibility behavior | ARIA labels, buttons, mobile tests | `UNDETERMINED` |

## Proposed Boundaries

- Keep `packages/music-theory-engine` and `packages/fretboard-engine` as pure domain layers.
- Add a pure pedagogical policy layer for evidence, claims, readiness, review, remediation, and practice-session composition.
- Move educational content toward versioned data shaped by the starter-kit schema, with local repository conventions considered before any database schema is proposed.
- Keep UI as presentation/runtime orchestration; it should display and collect attempts, not independently create mastery/readiness claims.
- Treat localStorage records as legacy observations until a migration strategy is approved.
