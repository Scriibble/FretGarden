import { describe, expect, it } from "vitest";
import {
  appendDrillSession,
  buildDrillSession,
  getCurrentDrillPrompt,
  summarizeDrill
} from "./drillSession";

describe("drillSession", () => {
  it("summarizes progress and completion for any drill attempt shape", () => {
    expect(
      summarizeDrill([{ isCorrect: true }, { isCorrect: false }], 2)
    ).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
  });

  it("builds compact session records from shared summary data", () => {
    expect(
      buildDrillSession({
        attempts: [{ isCorrect: true }, { isCorrect: false }],
        completedAt: "2026-07-07T12:00:00.000Z",
        idPrefix: "sample-drill",
        missedPrompts: [{ prompt: "missed" }],
        promptCount: 2
      })
    ).toEqual({
      id: "sample-drill-2026-07-07T12:00:00.000Z",
      completedAt: "2026-07-07T12:00:00.000Z",
      promptCount: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      missedPrompts: [{ prompt: "missed" }]
    });
  });

  it("keeps the newest local sessions first and applies a history limit", () => {
    expect(appendDrillSession(["one", "two"], "three", 2)).toEqual([
      "three",
      "one"
    ]);
  });

  it("cycles prompt lookup safely", () => {
    expect(getCurrentDrillPrompt(3, ["first", "second", "third"])).toBe(
      "first"
    );
  });
});
