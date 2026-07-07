import { describe, expect, it } from "vitest";
import {
  CHORD_TONE_PROMPTS,
  buildChordToneAttempt,
  getCurrentChordTonePrompt,
  getMissedChordTonePrompts,
  getTargetChordToneNote,
  isChordToneAnswerPosition,
  isChordToneCorrectPosition,
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

  it("builds a correct attempt when the selected pitch matches the requested chord tone", () => {
    expect(
      buildChordToneAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetTone: 1
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      })
    ).toEqual({
      promptIndex: 0,
      rootNote: "C",
      quality: "major",
      targetTone: 1,
      selectedNote: "C",
      selectedString: 5,
      selectedFret: 3,
      isCorrect: true
    });
  });

  it("builds a missed attempt when the selected pitch is another chord tone", () => {
    expect(
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, {
        string: 6,
        fret: 3,
        note: "G",
        pitchClass: 7
      }).isCorrect
    ).toBe(false);
  });

  it("rejects open strings as chord-tone answers", () => {
    expect(isChordToneAnswerPosition({ fret: 0 })).toBe(false);
    expect(isChordToneAnswerPosition({ fret: 1 })).toBe(true);
    expect(() =>
      buildChordToneAttempt(0, {
        rootNote: "E",
        quality: "minor",
        targetTone: 1
      }, {
        string: 6,
        fret: 0,
        note: "E",
        pitchClass: 4
      })
    ).toThrow("Open strings are not valid chord-tone answers.");
  });

  it("checks correct positions against the requested chord tone", () => {
    expect(
      isChordToneCorrectPosition(
        { rootNote: "F", quality: "major", targetTone: 5 },
        {
          string: 2,
          fret: 1,
          note: "C",
          pitchClass: 0
        }
      )
    ).toBe(true);
    expect(
      isChordToneCorrectPosition(
        { rootNote: "F", quality: "major", targetTone: 5 },
        {
          string: 1,
          fret: 1,
          note: "F",
          pitchClass: 5
        }
      )
    ).toBe(false);
  });

  it("summarizes progress and completion", () => {
    const attempts = [
      buildChordToneAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetTone: 1
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, {
        string: 6,
        fret: 3,
        note: "G",
        pitchClass: 7
      })
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
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildChordToneAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetTone: 3
      }, {
        string: 6,
        fret: 3,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(getMissedChordTonePrompts(attempts)).toEqual([
      {
        rootNote: "G",
        quality: "major",
        targetTone: 3,
        selectedNote: "G",
        selectedString: 6,
        selectedFret: 3
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
