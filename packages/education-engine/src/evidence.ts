import type {
  AttemptRecord,
  Confidence,
  EvidenceKind,
  EvidenceRecord,
  EvidenceRequirement,
  SupportLevel
} from "./contracts";

const supportRank: Record<SupportLevel, number> = {
  modeled: 0,
  guided: 1,
  prompted: 2,
  independent: 3
};

const evidenceRank: Record<EvidenceKind, number> = {
  correction: 0,
  exposure: 1,
  supported_performance: 2,
  independent_performance: 3,
  retained_performance: 4,
  transfer: 5,
  readiness: 6
};

export function compareEvidenceKinds(left: EvidenceKind, right: EvidenceKind): number {
  return evidenceRank[left] - evidenceRank[right];
}

export function interpretAttempt(
  attempt: AttemptRecord,
  requirement: EvidenceRequirement
): EvidenceRecord {
  const reasons: string[] = [];
  const qualityByDimension = new Map(
    attempt.observations.map((observation) => [observation.dimension, observation])
  );
  const requiredQuality = requirement.qualityDimensions.map((dimension) =>
    qualityByDimension.get(dimension)
  );
  const qualityComplete = requiredQuality.every(
    (observation) => observation !== undefined && observation.passed
  );

  if (!attempt.valid) {
    return buildEvidence(attempt, requirement, {
      outcome: "invalid",
      kind: null,
      confidence: "insufficient",
      reasons: [attempt.invalidReason ?? "task_invalid"]
    });
  }

  if (attempt.correctionState !== "none") {
    reasons.push("answer_revealed_or_corrected");
    return buildEvidence(attempt, requirement, {
      outcome: "supports",
      kind: "correction",
      confidence: "limited",
      reasons
    });
  }

  if (!qualityComplete) {
    reasons.push("quality_standard_not_met");
    return buildEvidence(attempt, requirement, {
      outcome: "contradicts",
      kind: null,
      confidence: "limited",
      reasons
    });
  }

  if (
    supportRank[attempt.supportLevel] < supportRank[requirement.maxSupportLevel] ||
    attempt.supportsUsed.length > 0
  ) {
    reasons.push("support_limits_claim");
    return buildEvidence(attempt, requirement, {
      outcome: "supports",
      kind: "supported_performance",
      confidence: "limited",
      reasons
    });
  }

  let kind = requirement.claimSupported;

  if (requirement.minimumDelayMs !== undefined) {
    const delay = attempt.sourceEvidenceAt
      ? Date.parse(attempt.respondedAt) - Date.parse(attempt.sourceEvidenceAt)
      : 0;

    if (delay < requirement.minimumDelayMs) {
      reasons.push("minimum_delay_not_met");
      kind = "independent_performance";
    }
  }

  if (requirement.requiresVariedContext === true && !attempt.variedContext) {
    reasons.push("variation_requirement_not_met");
    kind = "independent_performance";
  }

  return buildEvidence(attempt, requirement, {
    outcome: "supports",
    kind,
    confidence: confidenceFor(kind),
    reasons
  });
}

function buildEvidence(
  attempt: AttemptRecord,
  requirement: EvidenceRequirement,
  result: {
    outcome: EvidenceRecord["outcome"];
    kind: EvidenceKind | null;
    confidence: Confidence;
    reasons: string[];
  }
): EvidenceRecord {
  return {
    id: `evidence:${attempt.id}:${requirement.id}`,
    attemptId: attempt.id,
    objective: attempt.objective,
    requirementId: requirement.id,
    observedAt: attempt.respondedAt,
    outcome: result.outcome,
    kind: result.kind,
    confidence: result.confidence,
    supportLevel: attempt.supportLevel,
    quality: attempt.observations,
    claimCeiling: result.kind,
    reasons: result.reasons,
    contentVersion: attempt.contentVersion,
    policyVersion: attempt.policyVersion
  };
}

function confidenceFor(kind: EvidenceKind): Confidence {
  if (kind === "retained_performance" || kind === "transfer") {
    return "strong";
  }

  if (kind === "independent_performance") {
    return "moderate";
  }

  return "limited";
}
