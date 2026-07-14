# Educational Debt Register

Updated: 2026-07-14

| ID | Status | Debt | Severity | Closure evidence or required resolution | Owner | Expiration |
| --- | --- | --- | --- | --- | --- | --- |
| ED-001 | RESOLVED | Natural-note application and transfer lacked a distinct observable learner task | P0 | `natural-note-application` now evaluates two ordered patterns across strings 6 and 5; revealed/support-assisted work is capped below transfer; unit and Playwright coverage pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-002 | RESOLVED | Pulse objective said 50–70 BPM while the task was fixed at 60 BPM | P1 | Authored 50/60/70 BPM selector drives timing and animation; delayed review disables the source tempo and requires changed context for retained evidence | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-003 | RESOLVED | Model, guided attempt, scaffold fade, and independent attempt were not explicit UI states | P1 | Pulse flow implements all four states; fretboard model and post-support fade states make claim ceilings and fresh independent retrieval explicit | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-004 | RESOLVED | Local storage write failure was not learner-visible | P1 | Failed writes preserve the in-memory store and surface retry/export actions in a non-shaming alert; adapter and Playwright failure tests pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-005 | ACCEPTED / DEFERRED | Full accessibility protocol evidence and moderated usability validation remain incomplete | P1 | Evan confirms current screen-reader operation; `GOV-004` defers the detailed accessibility protocol and three representative sessions without treating them as passed | Evan Anderson | Before final project acceptance or release |
| ED-006 | RESOLVED | Educational-debt and constitutional-interpretation owners were unnamed | P0 | Evan Anderson now owns both responsibilities; concentration of authority is recorded in `GOVERNANCE_DECISION_LOG.md` | Evan Anderson | Closed 2026-07-14 |
| ED-007 | OPEN | Review timing trusts the local device clock | P2 | Define clock and conflict policy in the separately approved production persistence design | Engineering | Before production persistence |
| ED-008 | RESOLVED | Representative limited-migration authoring effort had not been measured | P2 | Gate 5A implemented one `fretboard-map` rehearsal with 20 fixtures and recorded file, line, test, bundle, and rollback effort in `GATE_5A_VALIDATION_REPORT.md` | Evan Anderson | Closed 2026-07-14 |

## Gate Effect

The Gate 4 implementation debts, governance-owner debt, and Gate 5A authoring-measurement debt are resolved. `ED-005` is bounded process debt: it does not block separately approved implementation work, but it blocks final project acceptance or release until resolved. Gate 5 remains open, and this register does not authorize conversion or later migration work.

Open items with an unassigned accountable person cannot be accepted as bounded debt.
