import type {
  CapabilityClaim,
  CapabilityState
} from "@pocket-practice/education-engine";
import { describe, expect, it } from "vitest";
import type { FretboardMapParallelReport } from "./contracts";
import {
  buildFretboardMapLearnerProgress,
  formatCapabilityState
} from "./fretboardMapLearnerProgress";

const labels: Record<CapabilityState, string> = {
  not_observed: "No counted try yet",
  developing: "Practiced with help",
  insufficient_evidence: "Keep practicing this",
  independent_once: "Done without help",
  review_due: "Ready to review",
  retained: "Remembered after a break",
  applied: "Used it in a new pattern",
  needs_refresh: "Needs a quick refresh"
};

describe("fretboard-map learner progress", () => {
  it.each(Object.entries(labels) as Array<[CapabilityState, string]>)
  ("maps %s to approved learner language", (state, label) => {
    expect(formatCapabilityState(state)).toBe(label);
  });

  it("keeps historical completion separate from current capability", () => {
    const progress = buildFretboardMapLearnerProgress(
      report([claim("fretboard.coordinates.basic", "not_observed"), claim("fretboard.natural-notes.region-1", "independent_once")])
    );

    expect(progress.lessonHistory).toMatchObject({
      status: "complete",
      label: "Complete"
    });
    expect(progress.practiceHistory.detail).toBe(
      "Last recorded drill: 90% across 10 prompts."
    );
    expect(progress.capabilities[0]).toMatchObject({
      label: "Fretboard coordinates",
      statusLabel: "No counted try yet"
    });
    expect(progress.explanation).toContain("tap, click, or choose");
  });

  it.each([
    [["review_due", "applied"], "Do the current review"],
    [["needs_refresh", "retained"], "Do the current review"],
    [["not_observed", "retained"], "Start guided practice"],
    [["developing", "retained"], "Continue guided practice"],
    [["insufficient_evidence", "applied"], "Continue guided practice"],
    [["independent_once", "retained"], "Come back for review"],
    [["retained", "applied"], "Practice this segment again"]
  ] as Array<[CapabilityState[], string]>)
  ("chooses a deterministic action for %j", (states, expectedLabel) => {
    const progress = buildFretboardMapLearnerProgress(
      report(states.map((state, index) => claim(`objective-${index}`, state)))
    );

    expect(progress.primaryAction).toMatchObject({
      href: "/education-pilot",
      label: expectedLabel
    });
  });

  it("flags malformed legacy or pilot sources without exposing raw values", () => {
    const malformed = report([claim("fretboard.coordinates.basic", "not_observed")]);
    malformed.currentEducation.storeState = "invalid_json";
    malformed.legacy.diagnostics = [
      {
        code: "malformed_envelope",
        source: "learning_progress",
        count: 1,
        message: "unreadable"
      }
    ];

    expect(buildFretboardMapLearnerProgress(malformed).hasUnreadableSources).toBe(true);
  });
});

function claim(objectiveId: string, state: CapabilityState): CapabilityClaim {
  return {
    objective: { id: objectiveId, version: 1 },
    state,
    strongestKind: null,
    confidence: "limited",
    supportingEvidenceIds: [],
    contradictingEvidenceIds: [],
    rationale: `Rationale for ${state}.`,
    policyVersion: "pilot-1"
  };
}

function report(claims: CapabilityClaim[]): FretboardMapParallelReport {
  return {
    reportVersion: 1,
    segmentId: "fretboard-map",
    generatedAt: "2026-07-14T12:00:00.000Z",
    explanation: "Legacy and current systems stay separate.",
    legacy: {
      summary: {
        learningStatus: "complete",
        completedCheckpoints: ["read", "play", "write"],
        practiceStatus: "complete",
        lastAttemptedAt: "2026-07-13T10:10:00.000Z",
        lastAccuracy: 90,
        lastPromptCount: 10
      },
      records: [
        {
          id: "legacy:fretboard-map:learning",
          segmentId: "fretboard-map",
          category: "participation",
          occurredAt: "2026-07-13T10:00:00.000Z",
          source: {
            storageKey: "learning",
            storageVersion: 1,
            sourceSlug: "fretboard-map"
          },
          relatedObjectives: [],
          facts: [],
          unknownConditions: [],
          educationalLimit: "Historical only."
        }
      ],
      diagnostics: []
    },
    currentEducation: {
      storeState: "valid",
      claims,
      evidenceCounts: [],
      reviews: [],
      nextAction: "Continue."
    }
  };
}
