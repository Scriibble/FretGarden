import {
  EDUCATION_POLICY_VERSION,
  type CapabilityClaim,
  type PrerequisiteRule,
  type ReadinessDecision,
  type VersionRef
} from "./contracts";
import { compareEvidenceKinds } from "./evidence";

export function evaluateReadiness(input: {
  target: VersionRef;
  prerequisites: PrerequisiteRule[];
  claims: CapabilityClaim[];
  now: string;
}): ReadinessDecision {
  const satisfied: string[] = [];
  const missing: string[] = [];

  for (const prerequisite of input.prerequisites) {
    const claim = input.claims.find(
      (candidate) =>
        candidate.objective.id === prerequisite.objective.id &&
        candidate.objective.version === prerequisite.objective.version
    );
    const hasRequiredKind =
      claim?.strongestKind !== null &&
      claim?.strongestKind !== undefined &&
      compareEvidenceKinds(claim.strongestKind, prerequisite.minimumKind) >= 0;
    const isCurrent = claim?.state !== "needs_refresh" && claim?.state !== "review_due";

    if (hasRequiredKind && isCurrent) {
      satisfied.push(prerequisite.objective.id);
    } else if (prerequisite.relationship === "required") {
      missing.push(prerequisite.objective.id);
    }
  }

  if (missing.length > 0) {
    return {
      target: input.target,
      decision: "not_yet_demonstrated",
      satisfied,
      missing,
      nextAction: `placement:${missing[0]}`,
      rationale: "Prerequisite evidence has not yet been shown. A short placement task can check prior knowledge.",
      policyVersion: EDUCATION_POLICY_VERSION
    };
  }

  const recommendedMissing = input.prerequisites.some(
    (prerequisite) =>
      prerequisite.relationship === "strongly_recommended" &&
      !satisfied.includes(prerequisite.objective.id)
  );

  return {
    target: input.target,
    decision: recommendedMissing ? "ready_with_support" : "ready",
    satisfied,
    missing: [],
    nextAction: `start:${input.target.id}`,
    rationale: recommendedMissing
      ? "Required evidence is present; optional support is available."
      : "Current prerequisite evidence supports starting this objective.",
    policyVersion: EDUCATION_POLICY_VERSION
  };
}
