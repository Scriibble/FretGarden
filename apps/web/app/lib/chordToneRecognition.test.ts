import { describe, expect, it } from "vitest";
import {
  CHORD_TONE_PROMPTS,
  buildChordToneAttempt,
  getChordToneAnswerOptions,
  getCurrentChordTonePrompt,
  getMissedChordTonePrompts,
  getTargetChordToneNote,
  isChordToneCorrectNote,
  summarizeChordToneRecognition
} from "./chordToneRecognition";

describe("chordToneRecognition", () => {
  it("uses a fixed beginner-friendly prompt queue", () => {
    expect(CHORD_TONE_PROMPTS).toEqual([
      { rootNote: "C", quality: "major", targetTone: 1 },
      { rootNote: "G", quality: "major", targetTone: 3 },
      { rootNote: "A", quality: "minor", targetTone: 5 },
      { rootNote: "E", quality: "minor", targetTone: 3 },
      { rootNote: "D", quality: "major", targetTone: 1 },
      { rootNote: "F", quality: "major", targetTone: 5 }
    ]);
  });

  it("resolves the requested chord-tone note", () => {
    expect(
      getTargetChordToneNote({
        rootNote: "G",
        quality: "major",
        targetTone: 3
      })
    ).toBe("B");
    expect(
      getTargetChordToneNote({
        rootNote: "A",
        quality: "minor",
        targetTone: 5
      })
    ).toBe("E");
  });

  it("offers the chord notes as deterministic answer options", () => {
    expect(
      getChordToneAnswerOptions({
        rootNote: "A",
        quality: "minor",
        targetTone: 5
      })
    ).toEqual(["A", "C", "E"]);
  });

  it("builds a correct attempt when the selected note matches the requested chord tone", () => {
    expect(
      buildChordToneAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetTone: 1
      }, "C")
    ).toEqual({
      promptIndex: 0,
      rootNote: "C",
      quality: "major",
      targetTone: 1,
      selectedNote: "C",
      targetNote: "C",
      isCorrect: true
    });
  });

  it("builds a missed attempt when the selected note is another chord tone", () => {
    expect(
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, "G")
    ).toEqual(
      expect.objectContaining({
        selectedNote: "G",
        targetNote: "B",
        isCorrect: false
      })
    );
  });

  it("checks selected notes against the requested chord tone", () => {
    expect(
      isChordToneCorrectNote(
        { rootNote: "F", quality: "major", targetTone: 5 },
        "C"
      )
    ).toBe(true);
    expect(
      isChordToneCorrectNote(
        { rootNote: "F", quality: "major", targetTone: 5 },
        "F"
      )
    ).toBe(false);
  });

  it("summarizes progress and completion", () => {
    const attempts = [
      buildChordToneAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetTone: 1
      }, "C"),
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, "G")
    ];

    expect(summarizeChordToneRecognition(attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
  });

  it("extracts missed prompts for session review", () => {
    const attempts = [
      buildChordToneAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetTone: 1
      }, "C"),
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, "G")
    ];

    expect(getMissedChordTonePrompts(attempts)).toEqual([
      {
        rootNote: "G",
        quality: "major",
        targetTone: 3,
        selectedNote: "G",
        targetNote: "B"
      }
    ]);
  });

  it("cycles prompt lookup safely", () => {
    expect(getCurrentChordTonePrompt(0)).toEqual({
      rootNote: "C",
      quality: "major",
      targetTone: 1
    });
    expect(getCurrentChordTonePrompt(CHORD_TONE_PROMPTS.length)).toEqual({
      rootNote: "C",
      quality: "major",
      targetTone: 1
    });
  });
});
