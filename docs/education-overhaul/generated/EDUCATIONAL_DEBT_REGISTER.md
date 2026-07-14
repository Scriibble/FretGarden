# Educational Debt Register

Updated: 2026-07-14

| ID | Debt | Severity | Evidence | Required resolution | Owner | Expiration |
| --- | --- | --- | --- | --- | --- | --- |
| ED-001 | Natural-note `apply` and `transfer` are authored but not a distinct observable learner task | P0 | Content declares `note-two-note-pattern` and `note-transfer`; runtime exit produces immediate independent evidence only | Implement an honest playable-pattern transfer task or remove the transfer claim | Unassigned | Before Gate 5 |
| ED-002 | Pulse objective scope says 50–70 BPM while the implemented task is fixed at 60 BPM | P1 | Pilot content and runtime disagree on tempo variation | Add validated tempo variation or narrow the authored scope | Unassigned | Before Gate 5 |
| ED-003 | Guided model, supported attempt, and scaffold fade are represented more strongly in content than in the distinct UI states | P1 | Lesson phases are authored; learner flow primarily exposes direct attempts plus answer revelation | Add observable support/fade states or narrow the phase declarations | Unassigned | Before Gate 5 |
| ED-004 | Storage quota or write failure is not learner-visible | P1 | `writeEducationPilotStore` returns `false`; UI does not present it | Add a non-shaming persistence warning and export/retry action | Engineering/product | Before learner pilot |
| ED-005 | Formal screen-reader and moderated usability validation are absent | P1 | Semantic and responsive checks are automated/manual engineering checks only | Record representative accessibility and learner sessions | Product/accessibility | Before Gate 5 |
| ED-006 | Educational-debt and constitutional-interpretation owners are unnamed | P0 | Phase 1 decisions 30–31 remain blocked | Name accountable human owners | Product leadership | Before Gate 5 approval |
| ED-007 | Review timing trusts the local device clock | P2 | Local-only pilot uses ISO timestamps from the browser | Define clock and conflict policy in the production persistence design | Engineering | Before production persistence |
| ED-008 | Authoring feasibility is proven only for four objectives | P2 | One compact registry and generated report exist | Author one representative migrated segment and record effort before scaling | Curriculum/engineering | During Gate 5 planning |

Items with an unassigned owner cannot be accepted as bounded debt. They remain approval blockers.
