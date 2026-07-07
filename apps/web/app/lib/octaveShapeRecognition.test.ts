import { describe, expect, it } from "vitest";
import {
  OCTAVE_SHAPE_PROMPTS,
  OCTAVE_SHAPE_SESSION_PRESETS,
  appendOctaveShapeSession,
  buildOctaveShapeAttempt,
  buildOctaveShapePerformanceSummary,
  buildOctaveShapePromptSession,
  buildOctaveShapeSession,
  getCurrentOctaveShapePrompt,
  getOctaveShapeName,
  getSourceOctaveShapePosition,
  getMissedOctaveShapePrompts,
  getTargetOctaveShapeNote,
  getTargetOctaveShapePosition,
  isOctaveShapeAnswerPosition,
  isOctaveShapeCorrectPosition,
  summarizeOctaveShapeRecognition
} from "./octaveShapeRecognition";

describe("octaveShapeRecognition", () => {
  it("uses a fixed CAGED octave-shape prompt queue", () => {
    expect(OCTAVE_SHAPE_PROMPTS).toEqual([
      {
        shape: "C",
        sourceNote: "C",
        sourceString: 5,
        sourceFret: 3,
        targetString: 2,
        targetFret: 1
      },
      {
        shape: "A",
        sourceNote: "D",
        sourceString: 5,
        sourceFret: 5,
        targetString: 3,
        targetFret: 7
      },
      {
        shape: "G",
        sourceNote: "G",
        sourceString: 6,
        sourceFret: 3,
        targetString: 1,
        targetFret: 3
      },
      {
        shape: "E",
        sourceNote: "A",
        sourceString: 6,
        sourceFret: 5,
        targetString: 4,
        targetFret: 7
      },
      {
        shape: "D",
        sourceNote: "G",
        sourceString: 4,
        sourceFret: 5,
        targetString: 2,
        targetFret: 8
      },
      {
        shape: "C",
        sourceNote: "D",
        sourceString: 5,
        sourceFret: 5,
        targetString: 2,
        targetFret: 3
      },
      {
        shape: "A",
        sourceNote: "E",
        sourceString: 5,
        sourceFret: 7,
        targetString: 3,
        targetFret: 9
      },
      {
        shape: "G",
        sourceNote: "A",
        sourceString: 6,
        sourceFret: 5,
        targetString: 1,
        targetFret: 5
      },
      {
        shape: "E",
        sourceNote: "G",
        sourceString: 6,
        sourceFret: 3,
        targetString: 4,
        targetFret: 5
      },
      {
        shape: "D",
        sourceNote: "A",
        sourceString: 4,
        sourceFret: 7,
        targetString: 2,
        targetFret: 10
      }
    ]);
  });

  it("defines reusable octave-shape presets", () => {
    expect(OCTAVE_SHAPE_SESSION_PRESETS).toEqual([
      {
        id: "quick-warmup",
        label: "Quick warmup",
        settings: {
          sessionLength: 6,
          shapeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "fixed",
          reviewMode: "full"
        }
      },
      {
        id: "weak-spots",
        label: "Weak spots",
        settings: {
          sessionLength: 10,
          shapeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "missed"
        }
      },
      {
        id: "low-string-shapes",
        label: "Low-string shapes",
        settings: {
          sessionLength: 10,
          shapeFocus: "E",
          stringFocus: 6,
          promptOrder: "random",
          reviewMode: "full"
        }
      },
      {
        id: "a-shape-focus",
        label: "A-shape focus",
        settings: {
          sessionLength: 10,
          shapeFocus: "A",
          stringFocus: 5,
          promptOrder: "random",
          reviewMode: "full"
        }
      }
    ]);
  });

  it("resolves source and target octave positions", () => {
    const prompt = OCTAVE_SHAPE_PROMPTS[0]!;

    expect(getSourceOctaveShapePosition(prompt)).toMatchObject({
      string: 5,
      fret: 3,
      note: "C"
    });
    expect(getTargetOctaveShapePosition(prompt)).toMatchObject({
      string: 2,
      fret: 1,
      note: "C"
    });
    expect(getTargetOctaveShapeNote(prompt)).toBe("C");
  });

  it("builds configurable fixed prompt sessions", () => {
    expect(
      buildOctaveShapePromptSession({
        sessionLength: 6,
        shapeFocus: "A",
        stringFocus: "all",
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      OCTAVE_SHAPE_PROMPTS[1],
      OCTAVE_SHAPE_PROMPTS[6],
      OCTAVE_SHAPE_PROMPTS[1],
      OCTAVE_SHAPE_PROMPTS[6],
      OCTAVE_SHAPE_PROMPTS[1],
      OCTAVE_SHAPE_PROMPTS[6]
    ]);
  });

  it("uses missed prompts when review mode has misses", () => {
    expect(
      buildOctaveShapePromptSession(
        {
          sessionLength: 6,
          shapeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "fixed",
          reviewMode: "missed"
        },
        [
          {
            ...OCTAVE_SHAPE_PROMPTS[0]!,
            targetNote: "C",
            selectedNote: "D",
            selectedString: 2,
            selectedFret: 3
          }
        ]
      )
    ).toEqual([
      OCTAVE_SHAPE_PROMPTS[0],
      OCTAVE_SHAPE_PROMPTS[0],
      OCTAVE_SHAPE_PROMPTS[0],
      OCTAVE_SHAPE_PROMPTS[0],
      OCTAVE_SHAPE_PROMPTS[0],
      OCTAVE_SHAPE_PROMPTS[0]
    ]);
  });

  it("builds a correct attempt when the exact octave target matches", () => {
    expect(
      buildOctaveShapeAttempt(0, OCTAVE_SHAPE_PROMPTS[0]!, {
        string: 2,
        fret: 1,
        note: "C",
        pitchClass: 0
      })
    ).toEqual({
      promptIndex: 0,
      shape: "C",
      sourceNote: "C",
      sourceString: 5,
      sourceFret: 3,
      targetString: 2,
      targetFret: 1,
      targetNote: "C",
      selectedNote: "C",
      selectedString: 2,
      selectedFret: 1,
      isCorrect: true
    });
  });

  it("rejects open strings as octave-shape answers", () => {
    expect(isOctaveShapeAnswerPosition({ fret: 0 })).toBe(false);
    expect(isOctaveShapeAnswerPosition({ fret: 1 })).toBe(true);
    expect(() =>
      buildOctaveShapeAttempt(0, OCTAVE_SHAPE_PROMPTS[0]!, {
        string: 3,
        fret: 0,
        note: "G",
        pitchClass: 7
      })
    ).toThrow("Open strings are not valid octave-shape answers.");
  });

  it("checks correct positions by exact string and fret", () => {
    const prompt = OCTAVE_SHAPE_PROMPTS[1]!;

    expect(
      isOctaveShapeCorrectPosition(prompt, {
        string: 3,
        fret: 7,
        note: "D",
        pitchClass: 2
      })
    ).toBe(true);
    expect(
      isOctaveShapeCorrectPosition(prompt, {
        string: 2,
        fret: 3,
        note: "D",
        pitchClass: 2
      })
    ).toBe(false);
  });

  it("summarizes sessions, misses, and performance", () => {
    const correctAttempt = buildOctaveShapeAttempt(0, OCTAVE_SHAPE_PROMPTS[0]!, {
      string: 2,
      fret: 1,
      note: "C",
      pitchClass: 0
    });
    const missedAttempt = buildOctaveShapeAttempt(1, OCTAVE_SHAPE_PROMPTS[1]!, {
      string: 3,
      fret: 5,
      note: "C",
      pitchClass: 0
    });
    const session = buildOctaveShapeSession(
      [correctAttempt, missedAttempt],
      "2026-07-07T12:00:00.000Z",
      2
    );

    expect(summarizeOctaveShapeRecognition(session.attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
    expect(getMissedOctaveShapePrompts(session.attempts)).toEqual([
      {
        ...OCTAVE_SHAPE_PROMPTS[1]!,
        targetNote: "D",
        selectedNote: "C",
        selectedString: 3,
        selectedFret: 5
      }
    ]);
    expect(appendOctaveShapeSession([], session)).toEqual([session]);
    expect(
      buildOctaveShapePerformanceSummary([session]).shapeStats.find(
        (stat) => stat.id === "A"
      )?.label
    ).toBe("A-shape octaves");
  });

  it("reads current prompts and shape labels", () => {
    expect(getCurrentOctaveShapePrompt(0)).toBe(OCTAVE_SHAPE_PROMPTS[0]);
    expect(getOctaveShapeName("E")).toBe("E-shape");
  });
});
