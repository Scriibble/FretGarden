# Curriculum Migration Plan

Date: 2026-07-14

Status: Phase 1 foundation replacement approved

## Replacement Boundary

The active eight-lesson concept path is replaced by the three foundation units. Existing local lesson-learning and drill records remain unchanged and continue to appear only as preserved history where already supported.

No old completion record creates a curriculum mastery criterion, evidence record, readiness decision, or review obligation.

## Route Strategy

- `/lessons` becomes the implemented curriculum path.
- `/lessons/tending-the-practice-garden`, `/lessons/focused-practice-pomodoro`, and `/lessons/using-a-metronome` render the foundation units.
- Removed lesson slugs redirect to the new lesson library rather than returning a broken route.
- The Gate 5B fretboard reinforcement link is relabeled and routed to the existing note drill until Unit 14 is implemented.
- Practice drill routes remain unchanged.

## Storage Strategy

Phase 1 uses new versioned, local-only curriculum keys. Readers and writers must not mutate:

- `pocket-practice:lesson-learning-progress`
- `pocket-practice:lesson-progress`
- Gate 5A migration inputs
- education-pilot records

Physical performance is represented by an explicit learner checklist or recorded value. It must not be labeled automatically verified.

## Rollback

Revert the curriculum foundation commits and restore the previous lesson catalog. New curriculum keys can remain inert; no legacy or production cleanup is required. Practice drills, pilot evidence, authentication, and Supabase are unaffected.

## Later Migration

Phase 2 should implement PDF Units 1-8 as FretGarden Units 4-11, then migrate useful parts of the old concept lessons when Units 14, 15, and 17 are authored. Every tranche requires source mapping, content validation, browser review, and a status audit that distinguishes `mapped` from `implemented`.

