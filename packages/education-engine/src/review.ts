import type { EvidenceRecord, ReviewObligation, ReviewPolicy } from "./contracts";

export function scheduleNextReview(
  source: EvidenceRecord,
  policy: ReviewPolicy,
  sequenceIndex = 0
): ReviewObligation | null {
  const delay = policy.delaysMs[sequenceIndex];

  if (delay === undefined || source.outcome !== "supports" || source.kind === null) {
    return null;
  }

  const dueAtMs = Date.parse(source.observedAt) + delay;

  return {
    id: `review:${source.id}:${sequenceIndex}`,
    objective: source.objective,
    sourceEvidenceId: source.id,
    sequenceIndex,
    dueAt: new Date(dueAtMs).toISOString(),
    dueWindowEndsAt: new Date(dueAtMs + policy.dueWindowMs).toISOString(),
    state: "scheduled",
    policy: { id: policy.id, version: policy.version }
  };
}

export function getReviewState(
  obligation: ReviewObligation,
  now: string
): ReviewObligation["state"] {
  if (obligation.state === "completed" || obligation.state === "lapsed") {
    return obligation.state;
  }

  return Date.parse(now) >= Date.parse(obligation.dueAt) ? "due" : "scheduled";
}

export function canSatisfyReview(obligation: ReviewObligation, attemptedAt: string): boolean {
  return Date.parse(attemptedAt) >= Date.parse(obligation.dueAt);
}
