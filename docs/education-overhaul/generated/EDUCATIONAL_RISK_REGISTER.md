# Educational Risk Register

Generated for Phase 0 of the FretGarden education-system overhaul.

| ID | Risk | Probability | Impact | Priority | Mitigation | Owner | Approval gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Lesson or drill `complete` is interpreted as mastery/readiness in future work | High | High | P0 | Rename/partition claims in target model; preserve legacy completion as historical record only | Product/engineering | Gate 2 |
| R-002 | Existing local progress is inflated during migration | Medium | High | P0 | Map legacy completion to historical completion, legacy score to limited observation, and unknown support to reduced confidence | Engineering | Gate 5 |
| R-003 | Accuracy and prompt count remain the only evidence model | High | High | P1 | Introduce observation/evidence/claim/decision separation and conformance tests | Engineering | Gate 2 |
| R-004 | Prompted, corrected, or scaffolded performance is stored as independent evidence | High | High | P1 | Record support conditions per attempt and cap claim strength | Engineering | Gate 3 |
| R-005 | No delayed retrieval means immediate success is overvalued | High | High | P1 | Add delayed-review registration and recency/confidence policy in pilot | Engineering/product | Gate 3 |
| R-006 | Repeated errors repeat the same task instead of changing instruction | Medium | Medium | P1 | Define observable error categories and remediation routes for pilot objectives | Curriculum/engineering | Gate 3 |
| R-007 | Course sequencing advances by lesson order rather than prerequisite evidence | High | Medium | P1 | Add prerequisite graph and readiness checks; allow valid prior-evidence bypass | Product/engineering | Gate 2 |
| R-008 | Current UI owns too much educational policy | High | Medium | P2 | Move policy to pure helpers tested outside React; leave UI as orchestration/presentation | Engineering | Gate 2 |
| R-009 | Practice recommendations overload learners or chase weak spots without session constraints | Medium | Medium | P2 | Add sustainable practice/session budget policy and explicit next action | Product/curriculum | Gate 3 |
| R-010 | Accessibility alternatives do not produce equivalent evidence | Medium | High | P2 | Add accessibility-equivalent metadata and test one pilot equivalent where practical | Product/engineering | Gate 3 |
| R-011 | Domain engine expansion becomes coupled to educational policy | Medium | Medium | P2 | Preserve pure engine APIs; add policy/content layers outside packages | Engineering | Gate 2 |
| R-012 | Starter-kit schema is treated as final database schema too early | Medium | High | P0 | Use schema as pilot content contract only until architecture and migration are approved | Engineering/product | Gate 2 |
| R-013 | E2E tests lock in nonconforming completion language | Medium | Medium | P2 | Update tests only with approved behavior changes; add constitutional invariant tests | Engineering | Gate 3 |
| R-014 | Supabase profile shell encourages premature cloud progress migration | Low | High | P0 | Do not add production progress tables before migration plan and rollback are approved | Engineering/product | Gate 2 |
| R-015 | Existing lesson content is bulk rewritten before architecture proves itself | Medium | High | P0 | Limit implementation to approved vertical slice and document educational debt elsewhere | Product/curriculum | Gate 3 |

## Current Containment

- No production educational database tables currently exist.
- Educational records are local-only and can be treated as legacy observations.
- The app already separates music/fretboard engines from React and persistence.
- Existing validation is green, so future pilot changes can be compared against a known baseline.

## Highest-Risk Approval Questions

1. What learner-facing terms should replace or qualify `complete` for participation, practice performance, readiness, and mastery?
2. How should existing local completion records be displayed after the new evidence model exists?
3. Which pilot objective should be the first source of truth for the objective/evidence schema?
4. What is the minimum acceptable delayed-review interval for the pilot?
5. Which accessibility-equivalent response path is required for the pilot rather than deferred?
