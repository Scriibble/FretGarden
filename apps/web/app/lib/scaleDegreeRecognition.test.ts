import { describe, expect, it } from "vitest";
import {
  SCALE_DEGREE_PROMPTS,
  SCALE_DEGREE_SESSION_PRESETS,
  appendScaleDegreeSession,
  buildScaleDegreeAttempt,
  buildScaleDegreePerformanceSummary,
  buildScaleDegreePromptSession,
  buildScaleDegreeSession,
  getCurrentScaleDegreePrompt,
  getMissedScaleDegreePrompts,
  getScaleDegreeName,
  getTargetScaleDegreeNote,
  isScaleDegreeAnswerPosition,
  isScaleDegreeCorrectPosition,
  summarizeScaleDegreeRecognition
} from "./scaleDegreeRecognition";

describe("scaleDegreeRecognition", () => {
  it("uses a fixed beginner-friendly prompt queue", () => {
    expect(SCALE_DEGREE_PROMPTS).toEqual([
      { rootNote: "C", quality: "major", targetDegree: 1, targetString: 5 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "A", quality: "minor", targetDegree: 5, targetString: 4 },
      { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
      { rootNote: "D", quality: "major", targetDegree: 6, targetString: 2 },
      { rootNote: "F", quality: "major", targetDegree: 4, targetString: 6 },
      { rootNote: "Bb", quality: "major", targetDegree: 7, targetString: 3 },
      { rootNote: "D", quality: "minor", targetDegree: 2, targetString: 5 },
      { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 },
      { rootNote: "C", quality: "minor", targetDegree: 6, targetString: 2 },
      { rootNote: "A", quality: "major", targetDegree: 4, targetString: 1 },
      { rootNote: "G", quality: "minor", targetDegree: 5, targetString: 6 }
    ]);
  });

  it("defines reusable beginner scale-degree presets", () => {
    expect(SCALE_DEGREE_SESSION_PRESETS).toEqual([
      {
        id: "quick-warmup",
        label: "Quick warmup",
        settings: {
          sessionLength: 6,
          qualityFocus: "both",
          degreeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "fixed",
          reviewMode: "full"
        }
      },
      {
        id: "weak-spots",
        label: "Weak spots",
        settings: {
          sessionLength: 12,
          qualityFocus: "both",
          degreeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "missed"
        }
      },
      {
        id: "thirds-focus",
        label: "3rds focus",
        settings: {
          sessionLength: 12,
          qualityFocus: "both",
          degreeFocus: "third",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "full"
        }
      },
      {
        id: "minor-scales",
        label: "Minor scales",
        settings: {
          sessionLength: 12,
          qualityFocus: "minor",
          degreeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "full"
        }
      }
    ]);
  });

  it("resolves the requested scale-degree note", () => {
    expect(
      getTargetScaleDegreeNote({
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      })
    ).toBe("B");
    expect(
      getTargetScaleDegreeNote({
        rootNote: "C",
        quality: "minor",
        targetDegree: 6,
        targetString: 2
      })
    ).toBe("Ab");
  });

  it("builds configurable fixed prompt sessions", () => {
    expect(
      buildScaleDegreePromptSession({
        sessionLength: 6,
        qualityFocus: "both",
        degreeFocus: "third",
        stringFocus: "all",
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
      { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
      { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 }
    ]);
  });

  it("filters configurable sessions by target string", () => {
    expect(
      buildScaleDegreePromptSession({
        sessionLength: 6,
        qualityFocus: "both",
        degreeFocus: "mixed",
        stringFocus: 6,
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      { rootNote: "F", quality: "major", targetDegree: 4, targetString: 6 },
      { rootNote: "G", quality: "minor", targetDegree: 5, targetString: 6 },
      { rootNote: "F", quality: "major", targetDegree: 4, targetString: 6 },
      { rootNote: "G", quality: "minor", targetDegree: 5, targetString: 6 },
      { rootNote: "F", quality: "major", targetDegree: 4, targetString: 6 },
      { rootNote: "G", quality: "minor", targetDegree: 5, targetString: 6 }
    ]);
  });

  it("uses missed prompts when review mode has misses", () => {
    expect(
      buildScaleDegreePromptSession(
        {
          sessionLength: 6,
          qualityFocus: "both",
          degreeFocus: "mixed",
          stringFocus: "all",
          promptOrder: "fixed",
          reviewMode: "missed"
        },
        [
          {
            rootNote: "G",
            quality: "major",
            targetDegree: 3,
            targetString: 2,
            targetNote: "B",
            selectedNote: "G",
            selectedString: 2,
            selectedFret: 8
          }
        ]
      )
    ).toEqual([
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 }
    ]);
  });

  it("falls back to the full prompt queue when missed review has no misses", () => {
    expect(
      buildScaleDegreePromptSession({
        sessionLength: 6,
        qualityFocus: "both",
        degreeFocus: "mixed",
        stringFocus: "all",
        promptOrder: "fixed",
        reviewMode: "missed"
      })
    ).toEqual(SCALE_DEGREE_PROMPTS.slice(0, 6));
  });

  it("can randomize prompt order with an injected random source", () => {
    expect(
      buildScaleDegreePromptSession(
        {
          sessionLength: 6,
          qualityFocus: "both",
          degreeFocus: "third",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "full"
        },
        [],
        () => 0
      )
    ).toEqual([
      { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
      { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
      { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
      { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 },
      { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 }
    ]);
  });

  it("builds a correct attempt when the selected string and degree note match", () => {
    expect(
      buildScaleDegreeAttempt(0, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 2,
        fret: 12,
        note: "B",
        pitchClass: 11
      })
    ).toEqual({
      promptIndex: 0,
      rootNote: "G",
      quality: "major",
      targetDegree: 3,
      targetString: 2,
      targetNote: "B",
      selectedNote: "B",
      selectedString: 2,
      selectedFret: 12,
      isCorrect: true
    });
  });

  it("builds a missed attempt when the note matches on the wrong string", () => {
    expect(
      buildScaleDegreeAttempt(0, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 3,
        fret: 4,
        note: "B",
        pitchClass: 11
      }).isCorrect
    ).toBe(false);
  });

  it("rejects open strings as drill answers", () => {
    expect(isScaleDegreeAnswerPosition({ fret: 0 })).toBe(false);
    expect(isScaleDegreeAnswerPosition({ fret: 1 })).toBe(true);
    expect(() =>
      buildScaleDegreeAttempt(0, {
        rootNote: "E",
        quality: "minor",
        targetDegree: 3,
        targetString: 3
      }, {
        string: 3,
        fret: 0,
        note: "G",
        pitchClass: 7
      })
    ).toThrow("Open strings are not valid scale-degree answers.");
  });

  it("checks correct positions against target degree and string", () => {
    expect(
      isScaleDegreeCorrectPosition(
        {
          rootNote: "C",
          quality: "major",
          targetDegree: 1,
          targetString: 5
        },
        {
          string: 5,
          fret: 3,
          note: "C",
          pitchClass: 0
        }
      )
    ).toBe(true);
    expect(
      isScaleDegreeCorrectPosition(
        {
          rootNote: "C",
          quality: "major",
          targetDegree: 1,
          targetString: 5
        },
        {
          string: 2,
          fret: 1,
          note: "C",
          pitchClass: 0
        }
      )
    ).toBe(false);
  });

  it("summarizes progress and completion", () => {
    const attempts = [
      buildScaleDegreeAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetDegree: 1,
        targetString: 5
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildScaleDegreeAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 2,
        fret: 8,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(summarizeScaleDegreeRecognition(attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
  });

  it("extracts missed prompts for session review", () => {
    const attempts = [
      buildScaleDegreeAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetDegree: 1,
        targetString: 5
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildScaleDegreeAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 2,
        fret: 8,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(getMissedScaleDegreePrompts(attempts)).toEqual([
      {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2,
        targetNote: "B",
        selectedNote: "G",
        selectedString: 2,
        selectedFret: 8
      }
    ]);
  });

  it("builds a compact completed scale-degree session record", () => {
    const attempts = [
      buildScaleDegreeAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetDegree: 1,
        targetString: 5
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildScaleDegreeAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 2,
        fret: 8,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(
      buildScaleDegreeSession(attempts, "2026-07-07T12:00:00.000Z", 2)
    ).toEqual({
      id: "scale-degree-2026-07-07T12:00:00.000Z",
      completedAt: "2026-07-07T12:00:00.000Z",
      promptCount: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      attempts,
      missedPrompts: [
        {
          rootNote: "G",
          quality: "major",
          targetDegree: 3,
          targetString: 2,
          targetNote: "B",
          selectedNote: "G",
          selectedString: 2,
          selectedFret: 8
        }
      ]
    });
  });

  it("summarizes scale-degree performance by degree, quality, root, and string", () => {
    const attempts = [
      buildScaleDegreeAttempt(0, {
        rootNote: "C",
        quality: "major",
        targetDegree: 1,
        targetString: 5
      }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildScaleDegreeAttempt(1, {
        rootNote: "G",
        quality: "major",
        targetDegree: 3,
        targetString: 2
      }, {
        string: 2,
        fret: 8,
        note: "G",
        pitchClass: 7
      }),
      buildScaleDegreeAttempt(2, {
        rootNote: "A",
        quality: "minor",
        targetDegree: 5,
        targetString: 4
      }, {
        string: 4,
        fret: 3,
        note: "F",
        pitchClass: 5
      })
    ];
    const summary = buildScaleDegreePerformanceSummary([
      buildScaleDegreeSession(attempts, "2026-07-07T12:00:00.000Z", 3)
    ]);

    expect(summary.attempted).toBe(3);
    expect(summary.degreeStats).toEqual([
      {
        id: "1",
        label: "roots",
        category: "degree",
        attempted: 1,
        correct: 1,
        missed: 0,
        accuracy: 100
      },
      {
        id: "3",
        label: "3rds",
        category: "degree",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "5",
        label: "5ths",
        category: "degree",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      }
    ]);
    expect(summary.qualityStats).toEqual([
      {
        id: "major",
        label: "major scales",
        category: "quality",
        attempted: 2,
        correct: 1,
        missed: 1,
        accuracy: 50
      },
      {
        id: "minor",
        label: "minor scales",
        category: "quality",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      }
    ]);
    expect(summary.rootStats).toEqual([
      {
        id: "A",
        label: "A scales",
        category: "root",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "C",
        label: "C scales",
        category: "root",
        attempted: 1,
        correct: 1,
        missed: 0,
        accuracy: 100
      },
      {
        id: "G",
        label: "G scales",
        category: "root",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      }
    ]);
    expect(summary.stringStats).toEqual([
      {
        id: "2",
        label: "String 2",
        category: "string",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "4",
        label: "String 4",
        category: "string",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "5",
        label: "String 5",
        category: "string",
        attempted: 1,
        correct: 1,
        missed: 0,
        accuracy: 100
      }
    ]);
    expect(summary.weakSpots.map((stat) => stat.label)).toEqual([
      "3rds",
      "5ths",
      "A scales"
    ]);
  });

  it("names scale degrees for prompts and summaries", () => {
    expect(getScaleDegreeName(1)).toBe("root");
    expect(getScaleDegreeName(2)).toBe("2nd");
    expect(getScaleDegreeName(3)).toBe("3rd");
    expect(getScaleDegreeName(7)).toBe("7th");
  });

  it("keeps the newest scale-degree sessions first and applies a history limit", () => {
    const sessions = ["one", "two", "three"].map((label) => ({
      id: label,
      completedAt: label,
      promptCount: 12,
      correct: 12,
      missed: 0,
      accuracy: 100,
      attempts: [],
      missedPrompts: []
    }));

    expect(appendScaleDegreeSession(sessions, sessions[2]!, 2)).toEqual([
      sessions[2]!,
      sessions[0]!
    ]);
  });

  it("cycles prompt lookup safely", () => {
    expect(getCurrentScaleDegreePrompt(0)).toEqual({
      rootNote: "C",
      quality: "major",
      targetDegree: 1,
      targetString: 5
    });
    expect(getCurrentScaleDegreePrompt(SCALE_DEGREE_PROMPTS.length)).toEqual({
      rootNote: "C",
      quality: "major",
      targetDegree: 1,
      targetString: 5
    });
  });
});
