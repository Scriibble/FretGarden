# FretGarden Codex Skill Library

This package contains:

- `AGENTS.md` — repository-wide safety and product rules
- `.agents/skills/` — 15 task-specific Codex skills

## Installation

Copy `AGENTS.md` and the `.agents` folder into the root of the FretGarden repository.

Expected structure:

```text
FretGarden/
├── AGENTS.md
└── agents/
    └── skills/
        ├── refactor-bp/
        │   └── SKILL.md
        ├── feature-architect/
        │   └── SKILL.md
        └── ...
```

## Recommended first use

1. Commit and tag the current working baseline.
2. Invoke `test-smith` in characterization mode.
3. Invoke `refactor-bp` in strict review-only mode.
4. Approve only a small first batch.
5. Use `release-reviewer` before merging.

## Important

These skills are designed to review first and preserve current behavior. Read each skill before relying on it, and keep changes isolated on branches or worktrees.