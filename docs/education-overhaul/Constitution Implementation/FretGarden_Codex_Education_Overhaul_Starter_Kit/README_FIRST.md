# FretGarden Education Overhaul Starter Kit

This package is the controlled entry point for introducing the FretGarden Pedagogical Constitution to Codex and beginning the education-system overhaul.

## Do not begin with a full rewrite

The constitution is authoritative, but the repository must first be inspected. Codex should not bulk-rewrite lessons, replace progression logic, or migrate data until the discovery, audit, architecture, and pilot gates are complete.

## Package contents

- `constitution/` — Chapters 1–17 of the FretGarden Pedagogical Constitution.
- `codex/00_MASTER_START_PROMPT.md` — paste this into Codex first.
- `codex/01_AGENTS_EDUCATION_ADDENDUM.md` — merge or reference from the repository's `AGENTS.md`.
- `docs/` — audit, architecture, migration, pilot, testing, and implementation specifications.
- `schemas/` — initial machine-readable schema proposal.
- `templates/` — decision, educational-debt, conformance, and audit templates.
- `MANIFEST_SHA256.txt` — integrity hashes for every packaged file.

## Recommended repository placement

Copy this package into:

```text
docs/education-overhaul/
```

Then add this line to the repository root `AGENTS.md`:

```markdown
For all curriculum, lesson, exercise, assessment, feedback, progression, review, remediation, practice-session, and learner-facing educational work, read and follow `docs/education-overhaul/codex/01_AGENTS_EDUCATION_ADDENDUM.md`.
```

## First Codex session

1. Commit the repository before beginning.
2. Add this package without modifying the existing application.
3. Open `codex/00_MASTER_START_PROMPT.md`.
4. Paste its contents into Codex.
5. Allow Codex to inspect the repository and produce the required audit artifacts.
6. Review and approve the target architecture before implementation.
7. Approve only the pilot vertical slice before broad migration.

## Definition of a safe start

The overhaul has begun correctly when Codex has produced:

- a current-system inventory;
- a constitution-to-code traceability map;
- a noncompliance report;
- a target educational architecture;
- a migration plan with approval gates;
- a proposed pilot vertical slice;
- and a list of unresolved decisions.

No full curriculum migration should occur before those artifacts are reviewed.
