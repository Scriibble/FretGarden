import {
  EDUCATION_POLICY_VERSION,
  type CapabilityClaim,
  type Confidence,
  type EvidenceKind,
  type EvidenceRecord,
  type VersionRef
} from "./contracts";
import { compareEvidenceKinds } from "./evidence";

const confidenceRank: Record<Confidence, number> = {
  insufficient: 0,
  limited: 1,
  moderate: 2,
  strong: 3
};

export function deriveCapabilityClaim(input: {
  objective: VersionRef;
  evidence: EvidenceRecord[];
  now: string;
  reviewDueAt?: string;
}): CapabilityClaim {
  const relevant = [...input.evidence]
    .filter(
      (record) =>
        record.objective.id === input.objective.id &&
        record.objective.version === input.objective.version &&
        record.outcome !== "invalid"
    )
    .sort((left, right) => Date.parse(left.observedAt) - Date.parse(right.observedAt));
  const supporting = relevant.filter(
    (record): record is EvidenceRecord & { kind: EvidenceKind } =>
      record.outcome === "supports" && record.kind !== null
  );
  const contradicting = relevant.filter((record) => record.outcome === "contradicts");
  const strongest = supporting.reduce<(EvidenceRecord & { kind: EvidenceKind }) | null>(
    (current, record) =>
      current === null || compareEvidenceKinds(record.kind, current.kind) > 0
        ? record
        : current,
    null
  );
  const latestSupport = supporting.at(-1);
  const latestContradiction = contradicting.at(-1);
  const contradictionIsCurrent =
    latestSupport !== undefined &&
    latestContradiction !== undefined &&
    Date.parse(latestContradiction.observedAt) > Date.parse(latestSupport.observedAt) &&
    latestContradiction.supportLevel === "independent";

  if (strongest === null) {
    return claim(input.objective, {
      state: relevant.length === 0 ? "not_observed" : "insufficient_evidence",
      strongestKind: null,
      confidence: relevant.length === 0 ? "insufficient" : "limited",
      supportingEvidenceIds: [],
      contradictingEvidenceIds: contradicting.map(({ id }) => id),
      rationale: relevant.length === 0 ? "No evidence has been observed." : "Current evidence does not yet meet the requirement."
    });
  }

  if (contradictionIsCurrent) {
    return claim(input.objective, {
      state: "needs_refresh",
      strongestKind: strongest.kind,
      confidence: "limited",
      supportingEvidenceIds: supporting.map(({ id }) => id),
      contradictingEvidenceIds: contradicting.map(({ id }) => id),
      rationale: "Earlier achievement is preserved, and newer independent evidence calls for a refresh."
    });
  }

  const reviewIsDue =
    input.reviewDueAt !== undefined && Date.parse(input.now) >= Date.parse(input.reviewDueAt);
  const state = reviewIsDue
    ? "review_due"
    : strongest.kind === "transfer"
      ? "applied"
      : strongest.kind === "retained_performance"
      ? "retained"
      : strongest.kind === "independent_performance"
        ? "independent_once"
        : "developing";

  const reviewDue = input.reviewDueAt === undefined ? {} : { reviewDueAt: input.reviewDueAt };

  return claim(input.objective, {
    state,
    strongestKind: strongest.kind,
    confidence: strongest.confidence,
    supportingEvidenceIds: supporting.map(({ id }) => id),
    contradictingEvidenceIds: contradicting.map(({ id }) => id),
    ...reviewDue,
    rationale:
      state === "review_due"
        ? "Independent performance was observed and delayed retrieval is now due."
        : state === "applied"
          ? "The capability was observed independently in a changed musical context."
        : state === "retained"
          ? "Independent retrieval was observed after a meaningful delay."
          : state === "independent_once"
            ? "Independent performance was observed once; delayed review is still required."
            : "Performance has been observed with support."
  });
}

function claim(
  objective: VersionRef,
  values: Omit<CapabilityClaim, "objective" | "policyVersion">
): CapabilityClaim {
  return {
    objective,
    ...values,
    policyVersion: EDUCATION_POLICY_VERSION
  };
}

export function strongestConfidence(evidence: EvidenceRecord[]): Confidence {
  return evidence.reduce<Confidence>(
    (current, record) =>
      confidenceRank[record.confidence] > confidenceRank[current]
        ? record.confidence
        : current,
    "insufficient"
  );
}
