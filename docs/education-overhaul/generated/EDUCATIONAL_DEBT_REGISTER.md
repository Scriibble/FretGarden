# Educational Debt Register

Updated: 2026-07-14

| ID | Status | Debt | Severity | Closure evidence or required resolution | Owner | Expiration |
| --- | --- | --- | --- | --- | --- | --- |
| ED-001 | RESOLVED | Natural-note application and transfer lacked a distinct observable learner task | P0 | `natural-note-application` now evaluates two ordered patterns across strings 6 and 5; revealed/support-assisted work is capped below transfer; unit and Playwright coverage pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-002 | RESOLVED | Pulse objective said 50–70 BPM while the task was fixed at 60 BPM | P1 | Authored 50/60/70 BPM selector drives timing and animation; delayed review disables the source tempo and requires changed context for retained evidence | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-003 | RESOLVED | Model, guided attempt, scaffold fade, and independent attempt were not explicit UI states | P1 | Pulse flow implements all four states; fretboard model and post-support fade states make claim ceilings and fresh independent retrieval explicit | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-004 | RESOLVED | Local storage write failure was not learner-visible | P1 | Failed writes preserve the in-memory store and surface retry/export actions in a non-shaming alert; adapter and Playwright failure tests pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-005 | OPEN | Formal screen-reader and moderated usability validation are absent | P1 | Protocols approved by Evan Anderson; execute `ACCESSIBILITY_REVIEW_PROTOCOL.md` and `USABILITY_REVIEW_PROTOCOL.md`, then record findings and final signoffs | Evan Anderson | Before Gate 4 approval |
| ED-006 | RESOLVED | Educational-debt and constitutional-interpretation owners were unnamed | P0 | Evan Anderson now owns both responsibilities; concentration of authority is recorded in `GOVERNANCE_DECISION_LOG.md` | Evan Anderson | Closed 2026-07-14 |
| ED-007 | OPEN | Review timing trusts the local device clock | P2 | Define clock and conflict policy in the separately approved production persistence design | Engineering | Before production persistence |
| ED-008 | OPEN | Authoring feasibility is proven only for four objectives | P2 | Implement the approved `fretboard-map` Gate 5A rehearsal and record authoring effort before scaling | Evan Anderson | During Gate 5A implementation |

## Gate Effect

The four implementation debts that motivated this closure pass and the governance-owner debt are resolved. Gate 4 still requires human accessibility/usability execution. Gate 5 also requires its own approved limited-migration implementation plan; this register does not authorize migration.

Open items with an unassigned accountable person cannot be accepted as bounded debt.
