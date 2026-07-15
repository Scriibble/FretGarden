# FretGarden Repository Instructions

For curriculum, lessons, exercises, assessment, feedback, progression, review, remediation, practice sessions, learner-facing educational claims, and educational data, also follow `docs/education-overhaul/Constitution Implementation/FretGarden_Codex_Education_Overhaul_Starter_Kit/codex/01_AGENTS_EDUCATION_ADDENDUM.md`.

FretGarden is a working application. Preserve current behavior unless a behavior change is explicitly approved.

## Default operating mode

- Begin significant work in review-only mode.
- Do not edit files until the user explicitly approves a concrete implementation plan.
- Prefer small, isolated, reversible changes over broad rewrites.
- Do not combine unrelated refactors with feature work.
- Do not replace major libraries, frameworks, state systems, or architectural patterns without approval.
- Do not modify production data, deployment settings, secrets, authentication providers, or database policies without explicit approval.
- Never expose secrets, tokens, private keys, service-role keys, passwords, database URLs, or session values.

## Before editing

1. Inspect the relevant code, tests, configuration, and documentation.
2. Explain current behavior.
3. Identify affected files.
4. Propose the smallest safe change.
5. Identify likely regressions and required tests.
6. Wait for explicit approval when the task is architectural, security-sensitive, destructive, or broad.

## During implementation

- Preserve public APIs unless a breaking change was approved.
- Keep the music-theory and fretboard engines independent from UI, framework, database, and deployment code.
- Favor deterministic, testable logic.
- Avoid unnecessary dependencies.
- Keep changes focused on the approved scope.
- Do not silently fix unrelated issues.

## Validation

Run the project’s available checks after changes:

- lint
- typecheck
- unit tests
- integration tests
- production build

Report pre-existing failures separately from failures introduced by the change.

## Git discipline

- Work on a dedicated branch or worktree for significant changes.
- Keep commits small and logically focused.
- Do not rewrite history, force-push, or delete the protected baseline.
- Provide a rollback path for risky work.

## FretGarden product principles

- The app should feel like a guided practice garden, not a drill dashboard or landing page.
- Encourage consistent, focused, sustainable practice.
- Preserve the Garden metaphor without forcing decorative language into every screen.
- Keep lessons approachable, accurate, progressive, and musically useful.
- Optimize for learning quality rather than manipulative engagement.
