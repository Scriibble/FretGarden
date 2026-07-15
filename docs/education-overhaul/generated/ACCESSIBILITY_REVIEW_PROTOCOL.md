# Accessibility Review Protocol

Updated: 2026-07-14

## Purpose

Use this protocol to decide whether the isolated `/education-pilot` route is accessible enough to close the human portion of Gate 4. Automated checks are supporting evidence only. A named human reviewer must execute this protocol and record findings before signoff.

This review does not authorize changes to legacy lessons, authentication, Supabase, deployment, or production data policy.

## Review Record

| Field | Value |
| --- | --- |
| Build or commit | `376a1f3` |
| Reviewer | Evan Anderson, self-reviewer |
| Technical preflight | Codex, 2026-07-14 |
| Review date | Limited owner confirmation on 2026-07-14; full execution deferred |
| Desktop OS/browser | Technical preflight: macOS 13.7.8, Chromium/Playwright 1.61.1 |
| Screen reader/version | Evan Anderson confirms correct operation; product/version not recorded |
| Mobile OS/browser | Technical viewport preflight complete; physical mobile run pending |
| Input methods | Keyboard, pointer, touch, and assistive input as available |
| Result | **LIMITED SCREEN-READER CONFIRMATION; FULL PROTOCOL DEFERRED TO FINAL PROJECT SIGNOFF** |

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
| A11Y-01 | Landmarks and headings | Page title, progress navigation, task heading, feedback, alerts, and summary are announced in a coherent order | Technical structure pass; screen-reader order pending. See `GATE_4_REVIEW_EXECUTION_RECORD.md`. |
| A11Y-02 | Keyboard completion | Every pilot task, tempo option, hint, retry, export, and exit action is reachable and operable without a pointer; focus remains visible | Representative keyboard pulse pass; full human keyboard/focus run pending. |
| A11Y-03 | Fretboard equivalent | Labeled string/fret controls can complete the same evaluated capability as the grid without a higher claim ceiling | Technical pass; human equivalent-path run pending. |
| A11Y-04 | Control names and states | Grid cells, selected tempo, disabled source tempo, sound checkbox, progress, and pulse tap expose understandable names and states | Technical pass after A11Y-FINDING-001; screen-reader confirmation pending. |
| A11Y-05 | Feedback announcements | Correct, corrected, supported, independent, retained, transfer, invalid, and persistence-failure states are announced once and remain available for review | Status/alert preflight pass after A11Y-FINDING-002; announcement run pending. |
| A11Y-06 | Timing task operation | Pulse tapping works by keyboard and assistive activation; optional sound is not required; invalid hidden-page timing is not counted against the learner | Keyboard and policy pass; assistive activation pending. |
| A11Y-07 | Reduced motion | Pulse animation is removed while beat text, selected BPM, optional sound, and task completion remain usable | Automated pass; platform human confirmation pending. |
| A11Y-08 | Zoom and reflow | At 200% zoom and mobile width, no text or controls overlap, clip essential content, or require two-dimensional page scrolling | Narrow-viewport pass; literal 200%/400% zoom pending. |
| A11Y-09 | Color and contrast | Text, focus indicators, selected states, errors, and success states remain distinguishable without relying on color alone and meet the approved contrast target | Text ratios pass after A11Y-FINDING-003; human state/focus review pending. |
| A11Y-10 | Support-state clarity | Model, guided attempt, scaffold fade, independent attempt, and support ceilings are understandable when read linearly | Technical state pass; screen-reader comprehension pending. |
| A11Y-11 | Changed-context review | A due review identifies a changed tempo, disables the source tempo, and communicates retained evidence only after the changed independent task | Automated pass; announcement/comprehension pending. |
| A11Y-12 | Persistence failure | The unsaved alert is announced, does not trap focus, and exposes operable retry and JSON export actions | Operability pass; alert and focus behavior pending. |
| A11Y-13 | Stop path | “End session here” and “Lesson library” are reachable without losing already displayed evidence or implying failure | Technical pass; human meaning/focus review pending. |

## Finding Rules

- `Blocker`: prevents completion or creates a false educational claim for an affected access path. Gate 4 cannot close.
- `Major`: materially impairs understanding, operation, or equivalent evidence. Fix or obtain explicit bounded-debt approval before Gate 4 closes.
- `Minor`: does not prevent an equivalent task but should be scheduled with an owner and expiration.
- `Observation`: improvement idea with no demonstrated access failure.

Record each finding as `A11Y-FINDING-NNN` with steps, expected behavior, actual behavior, affected technology, severity, owner, and disposition. Re-run affected checks after a fix.

## Signoff

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Accessibility reviewer | Evan Anderson | Screen reader works; full protocol deferred under `GOV-004` | 2026-07-14 |
| Education/product owner | Evan Anderson | Protocol approved | 2026-07-14 |
| Engineering owner | Evan Anderson | Protocol approved | 2026-07-14 |

Gate 4 accessibility closure requires all required checks to pass, or each remaining Major/Minor finding to have explicit approval, an accountable owner, and an expiration. Blockers cannot be accepted as debt.

`GOV-004` permits implementation work to continue while this evidence is deferred. It does not mark the protocol complete; final project acceptance or release still requires execution and finding resolution.
