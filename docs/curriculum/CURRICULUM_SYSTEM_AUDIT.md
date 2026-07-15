# Curriculum System Audit

Date: 2026-07-14

Branch: `codex/curriculum-foundations`

Status: Phase 1 baseline; superseded for implementation status by `CURRICULUM_IMPLEMENTATION_AUDIT.md`

## Sources Reviewed

- `FRETGARDEN_CURRICULUM_OVERHAUL.md`: implementation, lesson-quality, validation, and acceptance requirements.
- `Comprehensive_Guitar_and_Music_Theory_Curriculum.pdf`: six-level, 48-unit educational roadmap.
- Existing FretGarden application, education packages, lesson content, progress logic, and tests.

The Markdown source adds three mandatory opening units. PDF Units 1-48 therefore map to FretGarden Units 4-51 without reordering.

## Repository Baseline

| Area | Current implementation | Classification |
| --- | --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript | Reuse as-is |
| Package manager | pnpm workspace | Reuse as-is |
| Web app | `apps/web` | Reuse with extension |
| Education logic | `packages/education-engine` | Reuse as-is |
| Education content | `packages/education-content` with Zod schemas and conformance validation | Reuse with extension |
| Music theory | Pure `packages/music-theory-engine` | Reuse as-is |
| Fretboard | Pure `packages/fretboard-engine` plus accessible web fretboard | Reuse with extension |
| Lesson route | `/lessons` and `/lessons/[slug]` | Replace content and rendering; retain route family |
| Lesson data | Eight records in `apps/web/app/lib/lessons.ts` | Migrate useful concepts; replace active catalog |
| Lesson completion | Local self-reported read/play/write checkpoints | Replace for new curriculum; preserve legacy records as history |
| Drill progress | Local accuracy and prompt-count summaries | Preserve as reinforcement history, not curriculum mastery |
| Evidence model | Support-aware attempts, evidence, claims, review, and remediation | Reuse as-is |
| Pilot persistence | Versioned local store with recovery and write-failure handling | Reuse patterns; do not merge stores silently |
| Authentication | Supabase auth/profile paths | Reuse as-is; no curriculum change |
| Database | No production education tables | No change in Phase 1 |
| Analytics | No production education telemetry | No change in Phase 1 |
| Deployment | Existing Next.js workspace build | Reuse as-is |

## Existing Content Inventory

The active lesson catalog contains eight concept lessons:

1. Fretboard map
2. Repeating notes
3. Triads
4. Scale degrees
5. Intervals
6. Octave shapes
7. Triad inversions
8. Major-scale landmarks

Strengths:

- Each lesson includes explanation, a playable prompt, a song connection, and a creative task.
- Drill links and course ordering are deterministic and tested.
- Fretboard, interval, scale-degree, chord-tone, octave, and inversion drill engines are reusable.
- Gate 5A/5B preserves legacy history separately from current evaluated evidence.

Limits:

- The path begins with abstract fretboard theory rather than instrument setup, sound, pulse, and first playable music.
- Completion can be marked after self-reporting read/play/write activity without demonstrating the lesson objective.
- Knowledge-check answers are displayed rather than attempted and evaluated.
- Lessons have no explicit prerequisites, common-error correction, remediation path, or delayed review plan.
- Ear training, rhythm, technique, repertoire, reflection, and creativity are not distributed as curriculum strands.
- Every lesson ends in a memory-oriented drill even when the stated objective requires performance or application.

## Capability Audit

| Capability | Finding | Decision |
| --- | --- | --- |
| Fretboard interaction | Mature 12-fret semantic interaction and pure note mapping | Reuse with accessible lesson modes |
| Note/chord/scale drills | Deterministic generators and evaluators | Reuse as optional reinforcement or objective-specific assessment |
| Pulse evaluation | Pilot supports 50/60/70 BPM tapping and timing evidence | Reuse timing concepts; add a general metronome tool |
| Metronome audio | No learner-facing general metronome | Implement in Unit 3 |
| Practice timer | No functional learner timer | Implement in Unit 2 |
| Tablature | No structured tab renderer | Phase 2 requirement |
| Chord diagrams | No structured chord renderer | Phase 2 requirement |
| Rhythm notation | Text and pilot pulse only | Add accessible rhythm blocks now; structured grid in Phase 2 |
| Knowledge checks | Static definition lists only | Replace with attempted checks and explanatory feedback |
| Mastery | Legacy completion plus isolated pilot evidence | New units use explicit criteria; evidence integration expands incrementally |
| Review/remediation | Strong pure engine and pilot routes | Reuse contracts and extend curriculum ownership |
| Practice logging | Pilot-specific reflection and export | Add foundation local records; production design remains deferred |

## Source Quality Findings

The PDF is a curriculum roadmap, not finished lesson content. It supplies unit titles, strand outcomes, applications, assessments, and practice emphasis. It does not supply complete lesson sequences, original examples, diagrams, tablature, interactive feedback, or remediation content.

The Markdown specification explicitly permits original educational authoring and forbids copying copyrighted tabs. Every implemented unit must therefore expand the roadmap into original, testable instruction without pretending the PDF already contains finished lessons.

The existing constitutional evidence model is stricter than the example curriculum types in the new specification. Curriculum presentation contracts must sit beside the evidence model rather than weakening or replacing it.

## Risks

| Risk | Severity | Control |
| --- | --- | --- |
| Fifty-one mapped units could be mistaken for fifty-one implemented units | P0 | Store and validate `implemented` versus `mapped`; report status explicitly |
| Existing completion could be upgraded into mastery | P0 | Preserve legacy records as history; create no evidence from old completion |
| Physical guitar performance cannot always be measured automatically | P1 | Use explicit performance checklists and recorded values; never claim automatic observation |
| Metronome audio and visual state could disagree | P1 | Drive both from one scheduler and test pure timing calculations |
| A beginner path could overload learners with controls and terminology | P1 | Progressive disclosure, small tasks, exact starting conditions, and remediation |
| Curriculum expansion could inflate initial bundles | P2 | Keep structured content in package modules and avoid rendering all 51 units at once |
| Source repertoire references could create copyright risk | P1 | Use original examples and generic listening/repertoire criteria |

## Phase 1 Boundary

Phase 1 implements and exposes only Units 1-3. Units 4-51 are mapped with stable identities and source provenance but remain explicitly unimplemented. Existing eight lesson records are removed from the active catalog; their stored completion and drill records are not rewritten or deleted.

No Supabase, RLS, authentication, deployment, environment, production telemetry, or production education persistence change is authorized.
