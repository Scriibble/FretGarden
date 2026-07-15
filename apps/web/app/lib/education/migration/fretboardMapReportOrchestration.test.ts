import { describe, expect, it } from "vitest";
import { EDUCATION_SCHEMA_VERSION } from "@pocket-practice/education-engine";
import { createEmptyPilotStore } from "../storage/educationPilotStorage";
import { createFretboardMapParallelReport } from "./fretboardMapReportOrchestration";

const now = "2026-07-14T12:00:00.000Z";

describe("fretboard-map report orchestration", () => {
  it("is deterministic and leaves raw source values unchanged", () => {
    const raw = {
      learningProgressRaw: JSON.stringify({
        version: 1,
        progress: [
          {
            slug: "fretboard-map",
            status: "complete",
            startedAt: "2026-07-13T10:00:00.000Z",
            completedAt: "2026-07-13T10:10:00.000Z",
            completedCheckpoints: ["read", "play", "write"]
          }
        ]
      }),
      lessonProgressRaw: null,
      noteHistoryRaw: null,
      educationPilotRaw: JSON.stringify(createEmptyPilotStore(now)),
      educationPilotRecoveryRaw: "preserved-recovery"
    };
    const before = structuredClone(raw);

    const first = createFretboardMapParallelReport({ raw, now });
    const second = createFretboardMapParallelReport({ raw, now });

    expect(second).toEqual(first);
    expect(raw).toEqual(before);
    expect(first.legacy.summary.learningStatus).toBe("complete");
    expect(first.currentEducation.claims.every(({ state }) => state === "not_observed")).toBe(true);
  });

  it("does not turn legacy completion into current evidence", () => {
    const report = createFretboardMapParallelReport({
      now,
      raw: {
        learningProgressRaw: JSON.stringify([
          {
            slug: "fretboard-map",
            status: "complete",
            startedAt: now,
            completedCheckpoints: ["read", "play", "write"]
          }
        ]),
        lessonProgressRaw: JSON.stringify([
          {
            slug: "fretboard-map",
            drill: "note",
            status: "complete",
            startedAt: now,
            lastAttemptedAt: now,
            lastAccuracy: 100,
            lastPromptCount: 10
          }
        ]),
        noteHistoryRaw: null,
        educationPilotRaw: null,
        educationPilotRecoveryRaw: null
      }
    });

    expect(report.legacy.records).toHaveLength(2);
    expect(report.currentEducation.evidenceCounts).toEqual([]);
    expect(report.currentEducation.claims.every(({ state }) => state === "not_observed")).toBe(true);
  });

  it("classifies malformed sources without writing a recovery record", () => {
    const report = createFretboardMapParallelReport({
      now,
      raw: {
        learningProgressRaw: "{bad-learning",
        lessonProgressRaw: JSON.stringify({ unsupported: [] }),
        noteHistoryRaw: "{bad-history",
        educationPilotRaw: JSON.stringify({ schemaVersion: EDUCATION_SCHEMA_VERSION + 1 }),
        educationPilotRecoveryRaw: null
      }
    });

    expect(report.currentEducation.storeState).toBe("unknown_schema");
    expect(report.legacy.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "malformed_envelope" })
      ])
    );
  });
});
