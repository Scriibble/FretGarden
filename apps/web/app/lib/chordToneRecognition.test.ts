import { describe, expect, it } from "vitest";
import {
  CHORD_TONE_PROMPTS,
  CHORD_TONE_SESSION_PRESETS,
  appendChordToneSession,
  buildChordToneAttempt,
  buildChordTonePerformanceSummary,
  buildChordTonePromptSession,
  buildChordToneSession,
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
      { rootNote: "F", quality: "major", targetTone: 5 },
      { rootNote: "Bb", quality: "major", targetTone: 3 },
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "E", quality: "major", targetTone: 3 },
      { rootNote: "C", quality: "minor", targetTone: 1 },
      { rootNote: "A", quality: "major", targetTone: 5 },
      { rootNote: "G", quality: "minor", targetTone: 3 }
    ]);
  });

  it("defines reusable beginner chord-tone presets", () => {
    expect(CHORD_TONE_SESSION_PRESETS).toEqual([
      {
        id: "quick-warmup",
        label: "Quick warmup",
        settings: {
          sessionLength: 6,
          qualityFocus: "both",
          toneFocus: "mixed",
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
          toneFocus: "mixed",
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
          toneFocus: "third",
          promptOrder: "random",
          reviewMode: "full"
        }
      },
      {
        id: "minor-triads",
        label: "Minor triads",
        settings: {
          sessionLength: 12,
          qualityFocus: "minor",
          toneFocus: "mixed",
          promptOrder: "random",
          reviewMode: "full"
        }
      }
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

  it("builds configurable fixed prompt sessions", () => {
    expect(
      buildChordTonePromptSession({
        sessionLength: 6,
        qualityFocus: "major",
        toneFocus: "third",
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      { rootNote: "G", quality: "major", targetTone: 3 },
      { rootNote: "Bb", quality: "major", targetTone: 3 },
      { rootNote: "E", quality: "major", targetTone: 3 },
      { rootNote: "G", quality: "major", targetTone: 3 },
      { rootNote: "Bb", quality: "major", targetTone: 3 },
      { rootNote: "E", quality: "major", targetTone: 3 }
    ]);
  });

  it("cycles configurable prompt sessions to the requested length", () => {
    const prompts = buildChordTonePromptSession({
      sessionLength: 20,
      qualityFocus: "minor",
      toneFocus: "root",
      promptOrder: "fixed",
      reviewMode: "full"
    });

    expect(prompts).toHaveLength(20);
    expect(prompts.slice(0, 3)).toEqual([
      { rootNote: "C", quality: "minor", targetTone: 1 },
      { rootNote: "C", quality: "minor", targetTone: 1 },
      { rootNote: "C", quality: "minor", targetTone: 1 }
    ]);
  });

  it("uses missed prompts when review mode has misses", () => {
    expect(
      buildChordTonePromptSession(
        {
          sessionLength: 6,
          qualityFocus: "both",
          toneFocus: "mixed",
          promptOrder: "fixed",
          reviewMode: "missed"
        },
        [
          {
            rootNote: "D",
            quality: "minor",
            targetTone: 5,
            selectedNote: "D",
            targetNote: "A"
          }
        ]
      )
    ).toEqual([
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "D", quality: "minor", targetTone: 5 },
      { rootNote: "D", quality: "minor", targetTone: 5 }
    ]);
  });

  it("falls back to the full prompt queue when missed review has no misses", () => {
    expect(
      buildChordTonePromptSession({
        sessionLength: 6,
        qualityFocus: "both",
        toneFocus: "mixed",
        promptOrder: "fixed",
        reviewMode: "missed"
      })
    ).toEqual(CHORD_TONE_PROMPTS.slice(0, 6));
  });

  it("can randomize prompt order with an injected random source", () => {
    expect(
      buildChordTonePromptSession(
        {
          sessionLength: 6,
          qualityFocus: "major",
          toneFocus: "third",
          promptOrder: "random",
          reviewMode: "full"
        },
        [],
        () => 0
      )
    ).toEqual([
      { rootNote: "Bb", quality: "major", targetTone: 3 },
      { rootNote: "E", quality: "major", targetTone: 3 },
      { rootNote: "G", quality: "major", targetTone: 3 },
      { rootNote: "Bb", quality: "major", targetTone: 3 },
      { rootNote: "E", quality: "major", targetTone: 3 },
      { rootNote: "G", quality: "major", targetTone: 3 }
    ]);
  });

  it("offers the chord notes as deterministic answer options", () => {
    expect(
      getChordToneAnswerOptions({
        rootNote: "A",
        quality: "minor",
        targetTone: 5
      })
    ).toEqual(["A", "C", "E"]);
    expect(
      getChordToneAnswerOptions({
        rootNote: "Bb",
        quality: "major",
        targetTone: 3
      })
    ).toEqual(["Bb", "D", "F"]);
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

  it("builds a compact completed chord-tone session record", () => {
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

    expect(
      buildChordToneSession(attempts, "2026-07-07T12:00:00.000Z", 2)
    ).toEqual({
      id: "chord-tone-2026-07-07T12:00:00.000Z",
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
          targetTone: 3,
          selectedNote: "G",
          targetNote: "B"
        }
      ]
    });
  });

  it("summarizes chord-tone performance by tone, quality, and root", () => {
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
      }, "G"),
      buildChordToneAttempt(2, {
        rootNote: "A",
        quality: "minor",
        targetTone: 5
      }, "A")
    ];
    const summary = buildChordTonePerformanceSummary([
      buildChordToneSession(attempts, "2026-07-07T12:00:00.000Z", 3)
    ]);

    expect(summary.attempted).toBe(3);
    expect(summary.toneStats).toEqual([
      {
        id: "3",
        label: "3rds",
        category: "tone",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "5",
        label: "5ths",
        category: "tone",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "1",
        label: "roots",
        category: "tone",
        attempted: 1,
        correct: 1,
        missed: 0,
        accuracy: 100
      }
    ]);
    expect(summary.qualityStats).toEqual([
      {
        id: "major",
        label: "major chords",
        category: "quality",
        attempted: 2,
        correct: 1,
        missed: 1,
        accuracy: 50
      },
      {
        id: "minor",
        label: "minor chords",
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
        label: "A chords",
        category: "root",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      },
      {
        id: "C",
        label: "C chords",
        category: "root",
        attempted: 1,
        correct: 1,
        missed: 0,
        accuracy: 100
      },
      {
        id: "G",
        label: "G chords",
        category: "root",
        attempted: 1,
        correct: 0,
        missed: 1,
        accuracy: 0
      }
    ]);
    expect(summary.weakSpots.map((stat) => stat.label)).toEqual([
      "3rds",
      "5ths",
      "A chords"
    ]);
  });

  it("keeps the newest chord-tone sessions first and applies a history limit", () => {
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

    expect(appendChordToneSession(sessions, sessions[2]!, 2)).toEqual([
      sessions[2]!,
      sessions[0]!
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
