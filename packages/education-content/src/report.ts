import type { EducationContent } from "./schema.js";
import { validateEducationContent } from "./validate.js";

export function renderConformanceReport(content: EducationContent): string {
  const report = validateEducationContent(content);
  const result = report.valid ? "CONFORMS" : "DOES NOT CONFORM";
  const issueLines = report.valid
    ? "- No schema, identity, graph, ownership, review, or equivalence issues found."
    : report.issues
        .map(({ code, path, message }) => `- \`${code}\` at \`${path}\`: ${message}`)
        .join("\n");
  const objectiveRows = content.objectives
    .map((objective) => {
      const evidence = objective.evidenceRequirements
        .map(({ claimSupported }) => claimSupported.replaceAll("_", " "))
        .join(", ");
      return `| \`${objective.id}@${objective.version}\` | ${evidence} | ${objective.reviewPolicyId ?? "None"} |`;
    })
    .join("\n");

  return `# Pilot Conformance Report

Generated from \`@pocket-practice/education-content\`. Content version: \`${content.contentVersion}\`. Schema version: \`${content.schemaVersion}\`.

## Result

\`${result}\` for the implemented pilot scope.

- Objectives: ${report.counts.objectives}
- Lessons: ${report.counts.lessons}
- Exercises: ${report.counts.exercises}
- Review policies: ${report.counts.reviewPolicies}
- Remediation routes: ${report.counts.remediationRoutes}
- Accessibility equivalents: ${report.counts.accessibilityEquivalents}
- Conformance issues: ${report.issues.length}

## Authoring Validation

${issueLines}

The validator checks schema shape, unique identities, prerequisite references and cycles, objective lesson/exercise ownership, evidence ownership and quality alignment, delayed-review alignment, remediation and accessibility references, evaluator equivalence, claim ceilings, and increasing review delays.

## Objective Coverage

| Objective | Evidence ceilings | Review policy |
| --- | --- | --- |
${objectiveRows}

## Constitutional Claim Limits

- Screen visits and phase completion produce no capability evidence.
- Hinted, prompted, or corrected work cannot create independent evidence.
- Immediate repetition cannot create retained evidence.
- Invalid timing tasks do not count against the learner.
- Contradictory delayed evidence preserves earlier achievement while setting current state to \`needs_refresh\`.
- The pilot does not issue a mastery claim.
- Legacy progress keys are neither read nor written by the pilot.

## Validation Coverage

- Pure education-policy invariants run in \`@pocket-practice/education-engine\`.
- Content conformance and report drift checks run in \`@pocket-practice/education-content\`.
- Evaluator, persistence, recovery, and replay tests run in the web package.
- Playwright covers opening flow, support limits, objective-aware delayed review, equivalent controls, reload behavior, and legacy-key isolation.

## Deferred Beyond Pilot

- Production database schema, RLS, account sync, and retention policy.
- Bulk lesson conversion and legacy progress import.
- Audio-input diagnosis and auditory-discrimination objectives.
- Full curriculum graph and advanced adaptive policy.
- Learner-facing mastery vocabulary.
`;
}
