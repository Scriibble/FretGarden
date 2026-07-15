import type {
  EvidenceKind,
  EvidenceRecord,
  ReviewObligation
} from "@pocket-practice/education-engine";
import { describe, expect, it } from "vitest";
import { createEmptyPilotStore } from "../storage/educationPilotStorage";
import { fretboardMapLegacyFixtures } from "./fixtures/fretboardMapLegacyFixtures";
import {
  inspectFretboardMapLegacySources,
  mapFretboardMapLegacyHistory
} from "./fretboardMapLegacyMapping";
import { buildFretboardMapParallelReport } from "./fretboardMapParallelReport";

const now = "2026-07-14T12:00:00.000Z";

describe("fretboard-map parallel report", () => {
  it("keeps legacy completion separate from an independent claim", () => {
    const report = reportFor("LM-016", [
      evidence("independent", "independent_performance", "supports", "2026-07-14T10:00:00.000Z")
    ]);

    expect(report.legacy.summary).toMatchObject({
      learningStatus: "complete",
      practiceStatus: "complete"
    });
    expect(noteClaim(report).state).toBe("independent_once");
    expect(report.legacy.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "combined_sources", count: 1 })
      ])
    );
    expect(report.explanation).toContain("does not strengthen");
  });

  it("does not let legacy completion override newer contradictory evidence", () => {
    const report = reportFor("LM-017", [
      evidence("independent", "independent_performance", "supports", "2026-07-14T09:00:00.000Z"),
      evidence("contradiction", null, "contradicts", "2026-07-14T11:00:00.000Z")
    ]);

    expect(noteClaim(report).state).toBe("needs_refresh");
    expect(report.legacy.records).toHaveLength(2);
    expect(report.currentEducation.nextAction).toContain("due current-system review");
  });

  it("shows transfer only in current evidence when legacy history is absent", () => {
    const report = reportFor("LM-018", [
      evidence("transfer", "transfer", "supports", "2026-07-14T11:00:00.000Z")
    ]);

    expect(report.legacy.records).toEqual([]);
    expect(noteClaim(report).state).toBe("applied");
    expect(report.currentEducation.evidenceCounts).toContainEqual({
      kind: "transfer",
      count: 1
    });
  });

  it("uses the injected clock for due review state and claim state", () => {
    const store = createEmptyPilotStore(now);
    store.evidence = [
      evidence("independent", "independent_performance", "supports", "2026-07-13T10:00:00.000Z")
    ];
    store.reviews = [review("2026-07-14T11:00:00.000Z")];
    const historical = mapFretboardMapLegacyHistory(
      inspectFretboardMapLegacySources({
        learningProgressRaw: null,
        lessonProgressRaw: null,
        noteHistoryRaw: null
      })
    );
    const report = buildFretboardMapParallelReport({
      historical,
      educationStore: store,
      educationStoreState: "valid",
      now
    });

    expect(report.currentEducation.reviews[0]?.state).toBe("due");
    expect(noteClaim(report).state).toBe("review_due");
    expect(report.generatedAt).toBe(now);
  });

  it("is deterministic and does not mutate either input", () => {
    const fixture = fretboardMapLegacyFixtures.find(({ id }) => id === "LM-020")!;
    const historical = mapFretboardMapLegacyHistory(
      inspectFretboardMapLegacySources(fixture.input)
    );
    const store = createEmptyPilotStore(now);
    const historicalBefore = structuredClone(historical);
    const storeBefore = structuredClone(store);
    const first = buildFretboardMapParallelReport({
      historical,
      educationStore: store,
      educationStoreState: "absent",
      now
    });
    const second = buildFretboardMapParallelReport({
      historical,
      educationStore: store,
      educationStoreState: "absent",
      now
    });

    expect(second).toEqual(first);
    expect(historical).toEqual(historicalBefore);
    expect(store).toEqual(storeBefore);
  });

  it("filters evidence and reviews outside the two approved objectives", () => {
    const store = createEmptyPilotStore(now);
    store.evidence = [
      {
        ...evidence("other", "transfer", "supports", now),
        objective: { id: "rhythm.external-pulse.basic", version: 1 }
      }
    ];
    store.reviews = [
      {
        ...review(now),
        objective: { id: "rhythm.external-pulse.basic", version: 1 }
      }
    ];
    const report = reportWithStore(store);

    expect(report.currentEducation.evidenceCounts).toEqual([]);
    expect(report.currentEducation.reviews).toEqual([]);
    expect(report.currentEducation.claims.every(({ state }) => state === "not_observed")).toBe(true);
  });
});

function reportFor(
  fixtureId: string,
  evidenceRecords: EvidenceRecord[]
) {
  const fixture = fretboardMapLegacyFixtures.find(({ id }) => id === fixtureId)!;
  const store = createEmptyPilotStore(now);
  store.evidence = evidenceRecords;
  const historical = mapFretboardMapLegacyHistory(
    inspectFretboardMapLegacySources(fixture.input)
  );
  return buildFretboardMapParallelReport({
    historical,
    educationStore: store,
    educationStoreState: "valid",
    now
  });
}

function reportWithStore(store: ReturnType<typeof createEmptyPilotStore>) {
  return buildFretboardMapParallelReport({
    historical: mapFretboardMapLegacyHistory(
      inspectFretboardMapLegacySources({
        learningProgressRaw: null,
        lessonProgressRaw: null,
        noteHistoryRaw: null
      })
    ),
    educationStore: store,
    educationStoreState: "valid",
    now
  });
}

function noteClaim(report: ReturnType<typeof reportFor>) {
  return report.currentEducation.claims.find(
    ({ objective }) => objective.id === "fretboard.natural-notes.region-1"
  )!;
}

function evidence(
  id: string,
  kind: EvidenceKind | null,
  outcome: EvidenceRecord["outcome"],
  observedAt: string
): EvidenceRecord {
  return {
    id: `evidence:${id}`,
    attemptId: `attempt:${id}`,
    objective: { id: "fretboard.natural-notes.region-1", version: 1 },
    requirementId: id,
    observedAt,
    outcome,
    kind,
    confidence: kind === "transfer" ? "strong" : "moderate",
    supportLevel: "independent",
    quality: [],
    claimCeiling: kind,
    reasons: [],
    contentVersion: "pilot-1",
    policyVersion: "pilot-1"
  };
}

function review(dueAt: string): ReviewObligation {
  return {
    id: "review:note",
    objective: { id: "fretboard.natural-notes.region-1", version: 1 },
    sourceEvidenceId: "evidence:independent",
    sequenceIndex: 0,
    dueAt,
    dueWindowEndsAt: "2026-07-15T11:00:00.000Z",
    state: "scheduled",
    policy: { id: "pilot-review", version: 1 }
  };
}
