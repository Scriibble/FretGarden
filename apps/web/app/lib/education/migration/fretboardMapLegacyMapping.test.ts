import type { EvidenceRecord } from "@pocket-practice/education-engine";
import { describe, expect, it } from "vitest";
import type { HistoricalEducationRecord } from "./contracts";
import { fretboardMapLegacyFixtures } from "./fixtures/fretboardMapLegacyFixtures";
import {
  inspectFretboardMapLegacySources,
  mapFretboardMapLegacyHistory
} from "./fretboardMapLegacyMapping";

describe("fretboard-map legacy migration fixtures", () => {
  it.each(fretboardMapLegacyFixtures)(
    "$id maps only attributable historical context",
    (fixture) => {
      const snapshot = inspectFretboardMapLegacySources(fixture.input);
      const result = mapFretboardMapLegacyHistory(snapshot);
      const diagnosticCodes = result.diagnostics.map(({ code }) => code);

      expect(result.records).toHaveLength(fixture.expectedRecordCount);
      expect(result.records.map(({ category }) => category)).toEqual(
        fixture.expectedCategories
      );
      for (const code of fixture.expectedDiagnostics) {
        expect(diagnosticCodes).toContain(code);
      }
      expect(result.records).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ attemptId: expect.any(String) })
        ])
      );
    }
  );

  it("preserves deterministic identity, ordering, and replay output", () => {
    const fixture = fretboardMapLegacyFixtures.find(({ id }) => id === "LM-020")!;
    const snapshot = inspectFretboardMapLegacySources(fixture.input);
    const first = mapFretboardMapLegacyHistory(snapshot);
    const second = mapFretboardMapLegacyHistory(snapshot);

    expect(second).toEqual(first);
    expect(first.records.map(({ category }) => category)).toEqual([
      "participation",
      "practice_summary"
    ]);
    expect(first.records.map(({ id }) => id)).toEqual([
      "legacy:fretboard-map:learning:2026-06-01T10:00:00.000Z",
      "legacy:fretboard-map:practice:2026-06-01T10:18:00.000Z"
    ]);
  });

  it("retains required unknown conditions without creating evidence", () => {
    const fixture = fretboardMapLegacyFixtures.find(({ id }) => id === "LM-007")!;
    const result = mapFretboardMapLegacyHistory(
      inspectFretboardMapLegacySources(fixture.input)
    );
    const practice = result.records[0]!;

    expect(practice.unknownConditions).toEqual(
      expect.arrayContaining([
        "support_level_unknown",
        "answer_revelation_unknown",
        "prompt_variation_unknown",
        "delay_condition_unknown",
        "task_validity_unknown",
        "content_version_unknown",
        "policy_version_unknown"
      ])
    );
    expect(practice.educationalLimit).toContain("does not prove the skill");
  });

  it("keeps malformed and unattributed sources explicit", () => {
    const snapshot = inspectFretboardMapLegacySources({
      learningProgressRaw: "{broken",
      lessonProgressRaw: JSON.stringify({ version: 1, progress: [{ broken: true }] }),
      noteHistoryRaw: JSON.stringify([{ id: "global-session" }])
    });
    const result = mapFretboardMapLegacyHistory(snapshot);

    expect(result.records).toEqual([]);
    expect(result.sourceStates).toEqual({
      learning_progress: "malformed_json",
      practice_progress: "valid",
      note_history: "valid"
    });
    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "malformed_envelope" }),
        expect.objectContaining({ code: "omitted_record", count: 1 }),
        expect.objectContaining({ code: "unattributed_session", count: 1 })
      ])
    );
  });

  it("does not make historical records structurally assignable to evidence", () => {
    type HistoricalIsEvidence = HistoricalEducationRecord extends EvidenceRecord
      ? true
      : false;
    const historicalIsEvidence: HistoricalIsEvidence = false;

    expect(historicalIsEvidence).toBe(false);
  });
});
