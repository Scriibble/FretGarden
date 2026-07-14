# Accessibility Review Protocol

Updated: 2026-07-14

## Purpose

Use this protocol to decide whether the isolated `/education-pilot` route is accessible enough to close the human portion of Gate 4. Automated checks are supporting evidence only. A named human reviewer must execute this protocol and record findings before signoff.

This review does not authorize changes to legacy lessons, authentication, Supabase, deployment, or production data policy.

## Review Record

| Field | Value |
| --- | --- |
| Build or commit | Pending execution entry |
| Reviewer | Evan Anderson, self-reviewer |
| Review date | Pending |
| Desktop OS/browser | Pending |
| Screen reader/version | Pending |
| Mobile OS/browser | Pending |
| Input methods | Keyboard, pointer, touch, and assistive input as available |
| Result | **PROTOCOL APPROVED; EXECUTION EVIDENCE PENDING** |

Retain screenshots, screen-reader notes, exported pilot data used during failure testing, and finding IDs with this record. Do not include learner names, account data, or secrets.

## Setup

1. Start from an empty local pilot store at `/education-pilot`.
2. Run once at desktop width and once at a mobile width no greater than 390 CSS pixels.
3. Test normal motion and `prefers-reduced-motion: reduce`.
4. Test at 200% browser zoom and 400% text/reflow where the platform supports it.
5. Seed a due pulse review whose source attempt used 60 BPM.
6. Use a test browser profile that can simulate local storage write failure.

## Required Checks

| ID | Check | Pass criterion | Result / evidence |
| --- | --- | --- | --- |
| A11Y-01 | Landmarks and headings | Page title, progress navigation, task heading, feedback, alerts, and summary are announced in a coherent order | Pending |
| A11Y-02 | Keyboard completion | Every pilot task, tempo option, hint, retry, export, and exit action is reachable and operable without a pointer; focus remains visible | Pending |
| A11Y-03 | Fretboard equivalent | Labeled string/fret controls can complete the same evaluated capability as the grid without a higher claim ceiling | Pending |
| A11Y-04 | Control names and states | Grid cells, selected tempo, disabled source tempo, sound checkbox, progress, and pulse tap expose understandable names and states | Pending |
| A11Y-05 | Feedback announcements | Correct, corrected, supported, independent, retained, transfer, invalid, and persistence-failure states are announced once and remain available for review | Pending |
| A11Y-06 | Timing task operation | Pulse tapping works by keyboard and assistive activation; optional sound is not required; invalid hidden-page timing is not counted against the learner | Pending |
| A11Y-07 | Reduced motion | Pulse animation is removed while beat text, selected BPM, optional sound, and task completion remain usable | Pending |
| A11Y-08 | Zoom and reflow | At 200% zoom and mobile width, no text or controls overlap, clip essential content, or require two-dimensional page scrolling | Pending |
| A11Y-09 | Color and contrast | Text, focus indicators, selected states, errors, and success states remain distinguishable without relying on color alone and meet the approved contrast target | Pending |
| A11Y-10 | Support-state clarity | Model, guided attempt, scaffold fade, independent attempt, and support ceilings are understandable when read linearly | Pending |
| A11Y-11 | Changed-context review | A due review identifies a changed tempo, disables the source tempo, and communicates retained evidence only after the changed independent task | Pending |
| A11Y-12 | Persistence failure | The unsaved alert is announced, does not trap focus, and exposes operable retry and JSON export actions | Pending |
| A11Y-13 | Stop path | “End session here” and “Lesson library” are reachable without losing already displayed evidence or implying failure | Pending |

## Finding Rules

- `Blocker`: prevents completion or creates a false educational claim for an affected access path. Gate 4 cannot close.
- `Major`: materially impairs understanding, operation, or equivalent evidence. Fix or obtain explicit bounded-debt approval before Gate 4 closes.
- `Minor`: does not prevent an equivalent task but should be scheduled with an owner and expiration.
- `Observation`: improvement idea with no demonstrated access failure.

Record each finding as `A11Y-FINDING-NNN` with steps, expected behavior, actual behavior, affected technology, severity, owner, and disposition. Re-run affected checks after a fix.

## Signoff

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Accessibility reviewer | Evan Anderson | Pending execution | Pending |
| Education/product owner | Evan Anderson | Protocol approved | 2026-07-14 |
| Engineering owner | Evan Anderson | Protocol approved | 2026-07-14 |

Gate 4 accessibility closure requires all required checks to pass, or each remaining Major/Minor finding to have explicit approval, an accountable owner, and an expiration. Blockers cannot be accepted as debt.
