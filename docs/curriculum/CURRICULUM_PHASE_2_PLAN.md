# Proposed Curriculum Phase 2 Plan

Date: 2026-07-14

Status: Implemented; automated validation complete

## Goal

Complete the first playable guitar sequence, Units 4-11, so a new guitarist moves from holding the instrument and producing a clear sound to performing and reflecting on a short, original integration piece. Continue the Phase 1 teaching pattern: explain, model, guide, fade support, attempt independently, diagnose, review, and apply.

## Unit Scope

| Unit | Title | Primary learner outcome |
| ---: | --- | --- |
| 4 | Meet the Guitar and Produce a Clear Sound | Identify essential guitar parts, use a stable posture, tune with an external tuner, and produce relaxed clear fretted notes |
| 5 | Pulse, Subdivision, and First Chords | Maintain a slow pulse, distinguish beat from subdivision, and change between a minimal two-chord vocabulary |
| 6 | Open-Chord Vocabulary I | Form and connect a small set of open chords while diagnosing muted, buzzing, and strained notes |
| 7 | Reading Rhythm and Tablature | Decode original one-string tab and basic rhythm grids, then perform them with a count-in |
| 8 | Melody, Scales, and Musical Alphabet | Relate the musical alphabet to one string and use a compact note collection to create a short phrase |
| 9 | Power Chords and Rock Rhythm | Move a two-note power-chord shape with controlled muting and stable eighth-note pulse |
| 10 | Open-Chord Vocabulary II and Song Form | Add a small chord set, recognize sections, and perform an original multi-section progression |
| 11 | Level 1 Integration Project | Plan, rehearse, perform, and reflect on an original study combining pulse, chords, melody, and form |

## Implementation Work

1. Extend curriculum contracts with structured chord-diagram, tablature, rhythm-grid, instrument-setup, and model/guided/independent block types. Require accessible text equivalents and validation for every visual music block.
2. Add reusable renderers for chord shapes, tab, rhythm grids, tuning guidance, progressive exercise states, and performance logs. Keep rendering in the web app and music facts in pure packages.
3. Fully author Units 4-11 from the mapped curriculum source using original musical examples. Include prerequisites, exact starting conditions, modeling, support fade, common-error remediation, knowledge checks, performance criteria, changed-context application, and delayed review.
4. Reuse the Unit 3 metronome and existing pure fretboard/music-theory engines. Do not add microphone-based tuning or audio diagnosis; Unit 4 will guide use of an external tuner and label performance checks as self-confirmed.
5. Connect lesson sequencing and progress summaries to the eight new units while preserving the isolated `v1` curriculum store and all legacy history.
6. Add schema, unit, component, and Playwright coverage for every new music block, prerequisite boundary, completion ceiling, responsive layout, keyboard path, reduced motion, malformed storage, and legacy drill isolation.
7. Run the curriculum validator, education conformance report, full unit suite, typecheck, lint, production build, full Playwright, responsive review, and a new implementation audit before requesting Phase 2 acceptance.

## Suggested Checkpoints

- Commit 1: structured music-content contracts, validation, and renderer tests.
- Commit 2: Units 4-6 and chord/clear-sound learning experiences.
- Commit 3: Units 7-10 and tab, rhythm, melody, power-chord, and form experiences.
- Commit 4: Unit 11 integration project, delayed review, browser coverage, and documentation.

## Approved Decisions

- Units 4-11 were implemented as one Phase 2 scope with four logical checkpoints.
- All chord, rhythm, tab, riff, melody, and project examples are original repository content.
- Unit 4 uses external-tuner guidance without microphone access.
- Curriculum persistence remains local-only and isolated from legacy progress.

## Exclusions

No Supabase schema, RLS, authentication, deployment, environment configuration, production telemetry, legacy-record conversion, microphone permission, copyrighted tablature, or Units 12-51 implementation is included.
