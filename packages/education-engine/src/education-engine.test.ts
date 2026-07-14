import { describe, expect, it } from "vitest";
import {
  EDUCATION_POLICY_VERSION,
  canSatisfyReview,
  composeSession,
  deriveCapabilityClaim,
  evaluateReadiness,
  interpretAttempt,
  scheduleNextReview,
  selectRemediation,
  type AttemptRecord,
  type EvidenceRequirement
} from "./index";

const objective = { id: "fretboard.note-retrieval.natural-region-1", version: 1 };
const requirement: EvidenceRequirement = {
  id: "note-exit",
  objective,
  claimSupported: "independent_performance",
  qualityDimensions: ["correctness", "scope"],
  maxSupportLevel: "independent"
};

function attempt(overrides: Partial<AttemptRecord> = {}): AttemptRecord {
  return {
    id: "attempt-1",
    sessionId: "session-1",
    taskId: "note-1",
    objective,
    contentVersion: "pilot-1",
    policyVersion: EDUCATION_POLICY_VERSION,
    startedAt: "2026-07-13T12:00:00.000Z",
    respondedAt: "2026-07-13T12:00:05.000Z",
    response: { string: 6, fret: 1 },
    supportLevel: "independent",
    supportsUsed: [],
    correctionState: "none",
    valid: true,
    variedContext: false,
    observations: [
      { dimension: "correctness", passed: true },
      { dimension: "scope", passed: true }
    ],
    ...overrides
  };
}

describe("constitutional education invariants", () => {
  it("does not create evidence from visiting or completing screens", () => {
    const claim = deriveCapabilityClaim({
      objective,
      evidence: [],
      now: "2026-07-13T12:00:00.000Z"
    });
    expect(claim.state).toBe("not_observed");
    expect(claim.strongestKind).toBeNull();
  });

  it("caps hinted success at supported performance", () => {
    const evidence = interpretAttempt(
      attempt({ supportLevel: "prompted", supportsUsed: ["location_hint"] }),
      requirement
    );
    expect(evidence.kind).toBe("supported_performance");
    expect(evidence.reasons).toContain("support_limits_claim");
  });

  it("records corrected success without claiming independence", () => {
    const evidence = interpretAttempt(
      attempt({ correctionState: "corrected_reattempt" }),
      requirement
    );
    expect(evidence.kind).toBe("correction");
  });

  it("keeps invalid tasks out of learner evidence", () => {
    const evidence = interpretAttempt(
      attempt({ valid: false, invalidReason: "input_cancelled" }),
      requirement
    );
    expect(evidence.outcome).toBe("invalid");
    expect(evidence.kind).toBeNull();
  });

  it("requires every quality dimension instead of accuracy alone", () => {
    const evidence = interpretAttempt(
      attempt({ observations: [{ dimension: "correctness", passed: true }] }),
      requirement
    );
    expect(evidence.outcome).toBe("contradicts");
  });

  it("does not count an early review as retained performance", () => {
    const delayedRequirement: EvidenceRequirement = {
      ...requirement,
      claimSupported: "retained_performance",
      minimumDelayMs: 24 * 60 * 60 * 1000
    };
    const evidence = interpretAttempt(
      attempt({ sourceEvidenceAt: "2026-07-13T11:00:00.000Z" }),
      delayedRequirement
    );
    expect(evidence.kind).toBe("independent_performance");
    expect(evidence.reasons).toContain("minimum_delay_not_met");
  });

  it("preserves history while a newer independent lapse requests refresh", () => {
    const support = interpretAttempt(attempt(), requirement);
    const lapse = interpretAttempt(
      attempt({
        id: "attempt-2",
        respondedAt: "2026-07-14T13:00:00.000Z",
        observations: [
          { dimension: "correctness", passed: false },
          { dimension: "scope", passed: true }
        ]
      }),
      requirement
    );
    const claim = deriveCapabilityClaim({
      objective,
      evidence: [support, lapse],
      now: "2026-07-14T13:00:00.000Z"
    });
    expect(claim.state).toBe("needs_refresh");
    expect(claim.supportingEvidenceIds).toContain(support.id);
  });

  it("allows valid evidence to satisfy prerequisites without lesson completion", () => {
    const support = interpretAttempt(attempt(), requirement);
    const claim = deriveCapabilityClaim({
      objective,
      evidence: [support],
      now: support.observedAt
    });
    const readiness = evaluateReadiness({
      target: { id: "next-objective", version: 1 },
      prerequisites: [
        {
          objective,
          relationship: "required",
          minimumKind: "independent_performance"
        }
      ],
      claims: [claim],
      now: support.observedAt
    });
    expect(readiness.decision).toBe("ready");
  });

  it("offers placement when required evidence is missing", () => {
    const readiness = evaluateReadiness({
      target: { id: "next-objective", version: 1 },
      prerequisites: [
        {
          objective,
          relationship: "required",
          minimumKind: "independent_performance"
        }
      ],
      claims: [],
      now: "2026-07-13T12:00:00.000Z"
    });
    expect(readiness.decision).toBe("not_yet_demonstrated");
    expect(readiness.nextAction).toBe(`placement:${objective.id}`);
  });

  it("changes the instructional response after repeated errors", () => {
    expect(selectRemediation(["incorrect_response", "incorrect_response"]).route).toBe(
      "remodel_then_novel_retrieval"
    );
    expect(selectRemediation(["coordinate_confusion"]).route).toBe(
      "coordinate_orientation"
    );
  });

  it("registers delayed review and prevents early satisfaction", () => {
    const evidence = interpretAttempt(attempt(), requirement);
    const obligation = scheduleNextReview(evidence, {
      id: "pilot-review",
      version: 1,
      delaysMs: [24 * 60 * 60 * 1000],
      dueWindowMs: 24 * 60 * 60 * 1000
    });
    expect(obligation?.dueAt).toBe("2026-07-14T12:00:05.000Z");
    expect(
      obligation && canSatisfyReview(obligation, "2026-07-13T13:00:00.000Z")
    ).toBe(false);
  });

  it("keeps review within forty percent of a mixed session", () => {
    const session = composeSession({
      availableMinutes: 10,
      candidates: [
        { id: "review-a", kind: "review", estimatedMinutes: 3, priority: 10 },
        { id: "review-b", kind: "review", estimatedMinutes: 3, priority: 9 },
        { id: "new-a", kind: "new", estimatedMinutes: 5, priority: 8 }
      ]
    });
    expect(session.map(({ id }) => id)).toEqual(["review-a", "new-a"]);
  });
});
