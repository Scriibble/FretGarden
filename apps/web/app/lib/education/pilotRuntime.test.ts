import { describe, expect, it } from "vitest";
import {
  analyzePulseTaps,
  applicationPrompts,
  coordinatePrompts,
  evaluateApplicationSet,
  evaluateCoordinateSet,
  evaluateNoteSet,
  evaluatePracticePlan,
  evaluatePulseTaps,
  notePrompts,
  type CoordinateResponse
} from "./pilotRuntime";

const now = "2026-07-13T12:00:00.000Z";

describe("education pilot runtime", () => {
  it("records a sustainable practice plan without inferring attention quality", () => {
    const result = evaluatePracticePlan({
      sessionId: "session-1",
      now,
      response: {
        target: "Find F and G",
        durationMinutes: 5,
        nextAction: "Review tomorrow",
        reducedLoad: true
      }
    });
    expect(result.evidence.kind).toBe("supported_performance");
    expect(result.attempt.observations.map(({ dimension }) => dimension)).not.toContain(
      "attention_quality"
    );
    expect(result.review).toBeNull();
  });

  it("allows coordinate placement to satisfy the prerequisite", () => {
    const responses = coordinatePrompts.map<CoordinateResponse>((prompt, index) => ({
      promptId: prompt.id,
      selectedString: prompt.string,
      selectedFret: prompt.fret,
      correct: true,
      supportLevel: "independent",
      answerRevealed: false,
      responseControl: index === 3 ? "explicit" : "grid"
    }));
    const result = evaluateCoordinateSet({ responses, sessionId: "session-1", now });
    expect(result.evidence.kind).toBe("independent_performance");
    expect(result.review).toBeNull();
  });

  it("requires note coverage, independence, and varied controls", () => {
    const responses = notePrompts.map<CoordinateResponse>((prompt, index) => ({
      promptId: prompt.id,
      selectedString: prompt.string,
      selectedFret: prompt.fret,
      correct: true,
      supportLevel: "independent",
      answerRevealed: false,
      responseControl: index === notePrompts.length - 1 ? "explicit" : "grid"
    }));
    const result = evaluateNoteSet({ responses, sessionId: "session-1", now });
    expect(result.evidence.kind).toBe("independent_performance");
    expect(result.review?.dueAt).toBe("2026-07-14T12:00:00.000Z");
  });

  it("caps a set containing a revealed answer", () => {
    const responses = notePrompts.map<CoordinateResponse>((prompt, index) => ({
      promptId: prompt.id,
      selectedString: prompt.string,
      selectedFret: prompt.fret,
      correct: true,
      supportLevel: index === 0 ? "prompted" : "independent",
      answerRevealed: index === 0,
      responseControl: index === notePrompts.length - 1 ? "explicit" : "grid"
    }));
    const result = evaluateNoteSet({ responses, sessionId: "session-1", now });
    expect(result.evidence.kind).toBe("correction");
    expect(result.review).toBeNull();
  });

  it("measures pulse offset and variability from monotonic taps", () => {
    const taps = [1000, 2005, 2995, 4010, 5000, 5990, 7005, 8000];
    const timing = analyzePulseTaps({
      tapsMs: taps,
      pulseStartedAtMs: 0,
      intervalMs: 1000
    });
    expect(timing.valid).toBe(true);
    expect(timing.medianAbsoluteOffsetMs).toBeLessThanOrEqual(10);
    expect(timing.timingVariabilityMs).toBeLessThanOrEqual(10);
  });

  it("invalidates pulse evidence when the document became hidden", () => {
    const result = evaluatePulseTaps({
      tapsMs: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
      pulseStartedAtMs: 0,
      intervalMs: 1000,
      sessionId: "session-1",
      now,
      documentHidden: true
    });
    expect(result.evidence.outcome).toBe("invalid");
    expect(result.remediation.route).toBe("retry_equivalent_input");
  });

  it("only grants retained evidence after the real delay", () => {
    const responses = notePrompts.slice(0, 5).map<CoordinateResponse>((prompt, index) => ({
      promptId: prompt.id,
      selectedString: prompt.string,
      selectedFret: prompt.fret,
      correct: true,
      supportLevel: "independent",
      answerRevealed: false,
      responseControl: index === 4 ? "explicit" : "grid"
    }));
    const early = evaluateNoteSet({
      responses,
      sessionId: "early",
      now,
      sourceEvidenceAt: "2026-07-13T11:00:00.000Z",
      review: true
    });
    const delayed = evaluateNoteSet({
      responses,
      sessionId: "delayed",
      now: "2026-07-14T12:00:00.000Z",
      sourceEvidenceAt: now,
      review: true
    });
    expect(early.evidence.kind).toBe("independent_performance");
    expect(early.review).toBeNull();
    expect(delayed.evidence.kind).toBe("retained_performance");
  });

  it("requires both ordered patterns before granting transfer evidence", () => {
    const responses = applicationPrompts.map((prompt) => ({
      promptId: prompt.id,
      selectedFirstFret: prompt.firstFret,
      selectedSecondFret: prompt.secondFret,
      correct: true,
      supportLevel: "independent" as const,
      answerRevealed: false
    }));
    const result = evaluateApplicationSet({
      responses,
      sessionId: "application",
      now
    });
    expect(result.evidence.kind).toBe("transfer");
    expect(result.attempt.variedContext).toBe(true);
    expect(result.review).toBeNull();
  });

  it("caps a revealed application pattern below transfer", () => {
    const responses = applicationPrompts.map((prompt, index) => ({
      promptId: prompt.id,
      selectedFirstFret: prompt.firstFret,
      selectedSecondFret: prompt.secondFret,
      correct: true,
      supportLevel: index === 0 ? ("prompted" as const) : ("independent" as const),
      answerRevealed: index === 0
    }));
    const result = evaluateApplicationSet({
      responses,
      sessionId: "application-supported",
      now
    });
    expect(result.evidence.kind).toBe("correction");
    expect(result.review).toBeNull();
  });

  it("supports a real delayed pulse review without registering a duplicate review", () => {
    const delayed = evaluatePulseTaps({
      tapsMs: [857, 1714, 2571, 3428, 4285, 5142, 5999, 6856],
      pulseStartedAtMs: 0,
      intervalMs: 857,
      sessionId: "pulse-review",
      now: "2026-07-14T12:00:00.000Z",
      sourceEvidenceAt: now,
      tempoBpm: 70,
      sourceTempoBpm: 60
    });
    expect(delayed.evidence.kind).toBe("retained_performance");
    expect(delayed.attempt.variedContext).toBe(true);
    expect(delayed.review).toBeNull();
  });

  it("caps delayed pulse evidence when the tempo context is unchanged", () => {
    const unchanged = evaluatePulseTaps({
      tapsMs: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
      pulseStartedAtMs: 0,
      intervalMs: 1000,
      sessionId: "pulse-review-same-tempo",
      now: "2026-07-14T12:00:00.000Z",
      sourceEvidenceAt: now,
      tempoBpm: 60,
      sourceTempoBpm: 60
    });
    expect(unchanged.evidence.kind).toBe("independent_performance");
    expect(unchanged.evidence.reasons).toContain("variation_requirement_not_met");
    expect(unchanged.remediation.route).toBe("vary_context_then_retrieve");
    expect(unchanged.review).toBeNull();
  });
});
