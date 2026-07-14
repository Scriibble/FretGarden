# Educational Debt Register

Updated: 2026-07-14

| ID | Status | Debt | Severity | Closure evidence or required resolution | Owner | Expiration |
| --- | --- | --- | --- | --- | --- | --- |
| ED-001 | RESOLVED | Natural-note application and transfer lacked a distinct observable learner task | P0 | `natural-note-application` now evaluates two ordered patterns across strings 6 and 5; revealed/support-assisted work is capped below transfer; unit and Playwright coverage pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-002 | RESOLVED | Pulse objective said 50–70 BPM while the task was fixed at 60 BPM | P1 | Authored 50/60/70 BPM selector drives timing and animation; delayed review disables the source tempo and requires changed context for retained evidence | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-003 | RESOLVED | Model, guided attempt, scaffold fade, and independent attempt were not explicit UI states | P1 | Pulse flow implements all four states; fretboard model and post-support fade states make claim ceilings and fresh independent retrieval explicit | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-004 | RESOLVED | Local storage write failure was not learner-visible | P1 | Failed writes preserve the in-memory store and surface retry/export actions in a non-shaming alert; adapter and Playwright failure tests pass | Closed by Gate 4 implementation | Closed 2026-07-14 |
| ED-005 | OPEN | Formal screen-reader and moderated usability validation are absent | P1 | Execute `ACCESSIBILITY_REVIEW_PROTOCOL.md` and `USABILITY_REVIEW_PROTOCOL.md`; record findings and named signoffs | Product/accessibility | Before Gate 4 approval |
| ED-006 | OPEN | Educational-debt and constitutional-interpretation owners are unnamed | P0 | Name accountable human owners and update decisions 30–31 | Product leadership | Before Gate 4 approval |
| ED-007 | OPEN | Review timing trusts the local device clock | P2 | Define clock and conflict policy in the separately approved production persistence design | Engineering | Before production persistence |
| ED-008 | OPEN | Authoring feasibility is proven only for four objectives | P2 | Author one representative migration segment and record effort before scaling | Curriculum/engineering | During Gate 5 planning |

## Gate Effect

The four implementation debts that motivated this closure pass are resolved. Gate 4 still requires human accessibility/usability execution and named governance owners. Gate 5 also requires its own approved limited-migration plan; this register does not authorize migration.

Open items with an unassigned accountable person cannot be accepted as bounded debt.
