# Education Governance Decision Log

Updated: 2026-07-14

## GOV-001: Accountable Owners

- Status: APPROVED
- Approved by: Evan Anderson
- Approval date: 2026-07-14
- Scope: Education-system overhaul governance

FretGarden is currently developed and governed by one person. The following roles are assigned explicitly so educational debt and constitutional interpretation have an accountable owner:

| Responsibility | Owner | Working title |
| --- | --- | --- |
| Educational-debt approval and expiration | Evan Anderson | Product and Curriculum Owner |
| Final Pedagogical Constitution interpretation | Evan Anderson | Product and Education Owner |
| Engineering implementation and rollback | Evan Anderson | Sole Developer |
| Gate approval | Evan Anderson | Project Owner |

The concentration of authority is intentional for the current project structure. Material musical or accessibility uncertainty should still be recorded and, when practical, reviewed by a representative learner, guitar educator, or accessibility-experienced person. External reviewers provide evidence and advice; they do not become project owners unless a later decision assigns that authority.

## GOV-002: Gate 4 Human Protocols

- Status: APPROVED FOR EXECUTION
- Approved by: Evan Anderson
- Approval date: 2026-07-14

The accessibility and usability protocols are approved as the human-review method. Approval of the method is not a claim that its checks or participant sessions have occurred. Each protocol retains `PENDING EXECUTION` until results and findings are recorded.

## GOV-003: Gate 5 Planning Scope

- Status: APPROVED FOR DOCUMENTATION
- Approved by: Evan Anderson
- Approval date: 2026-07-14

Prepare a docs-only Gate 5 plan using `fretboard-map` as the recommended first segment. Define legacy mapping fixtures, parallel reporting, feature isolation, telemetry boundaries, and rollback rehearsal. Present an exact code-level plan for separate approval before changing legacy behavior, application code, or production data paths.

This decision does not authorize Gate 5 code implementation, Supabase work, RLS changes, authentication changes, deployment changes, or mutation of legacy progress.
