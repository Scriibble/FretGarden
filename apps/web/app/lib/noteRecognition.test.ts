import { describe, expect, it } from "vitest";
import {
  NOTE_RECOGNITION_PROMPTS,
  appendNoteRecognitionSession,
  buildNoteRecognitionSession,
  buildNoteRecognitionAttempt,
  getCurrentPrompt,
  getMissedNoteRecognitionPrompts,
  isNoteRecognitionAnswerPosition,
  isNoteRecognitionCorrectPosition,
  summarizeNoteRecognition
} from "./noteRecognition";

describe("noteRecognition", () => {
  it("uses a fixed beginner-friendly prompt queue", () => {
    expect(NOTE_RECOGNITION_PROMPTS).toEqual([
      { targetNote: "D", targetString: 5 },
      { targetNote: "G", targetString: 6 },
      { targetNote: "C", targetString: 2 },
      { targetNote: "A", targetString: 3 },
      { targetNote: "E", targetString: 4 },
      { targetNote: "F", targetString: 6 },
      { targetNote: "B", targetString: 5 },
      { targetNote: "C", targetString: 3 },
      { targetNote: "A", targetString: 4 },
      { targetNote: "G", targetString: 1 }
    ]);
  });

  it("builds a correct attempt when the selected pitch and string match the target", () => {
    expect(
      buildNoteRecognitionAttempt(0, { targetNote: "D", targetString: 5 }, {
        string: 5,
        fret: 5,
        note: "D",
        pitchClass: 2
      })
    ).toEqual({
      promptIndex: 0,
      targetNote: "D",
      targetString: 5,
      selectedNote: "D",
      selectedString: 5,
      selectedFret: 5,
      isCorrect: true
    });
  });

  it("builds a missed attempt when the selected pitch does not match", () => {
    expect(
      buildNoteRecognitionAttempt(1, { targetNote: "G", targetString: 6 }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }).isCorrect
    ).toBe(false);
  });

  it("builds a missed attempt when the note matches on the wrong string", () => {
    expect(
      buildNoteRecognitionAttempt(0, { targetNote: "D", targetString: 5 }, {
        string: 3,
        fret: 7,
        note: "D",
        pitchClass: 2
      }).isCorrect
    ).toBe(false);
  });

  it("checks correct positions against both target note and target string", () => {
    expect(
      isNoteRecognitionCorrectPosition(
        { targetNote: "D", targetString: 5 },
        {
          string: 5,
          fret: 5,
          note: "D",
          pitchClass: 2
        }
      )
    ).toBe(true);
    expect(
      isNoteRecognitionCorrectPosition(
        { targetNote: "D", targetString: 5 },
        {
          string: 4,
          fret: 0,
          note: "D",
          pitchClass: 2
        }
      )
    ).toBe(false);
  });

  it("rejects open strings as drill answers", () => {
    expect(
      isNoteRecognitionAnswerPosition({
        fret: 0
      })
    ).toBe(false);
    expect(
      isNoteRecognitionAnswerPosition({
        fret: 1
      })
    ).toBe(true);
    expect(() =>
      buildNoteRecognitionAttempt(0, { targetNote: "E", targetString: 6 }, {
        string: 6,
        fret: 0,
        note: "E",
        pitchClass: 4
      })
    ).toThrow("Open strings are not valid note-recognition answers.");
  });

  it("summarizes progress and completion", () => {
    const attempts = [
      buildNoteRecognitionAttempt(0, { targetNote: "C", targetString: 5 }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      }),
      buildNoteRecognitionAttempt(1, { targetNote: "G", targetString: 6 }, {
        string: 5,
        fret: 3,
        note: "C",
        pitchClass: 0
      })
    ];

    expect(summarizeNoteRecognition(attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
  });

  it("extracts missed prompts for session review", () => {
    const attempts = [
      buildNoteRecognitionAttempt(0, { targetNote: "D", targetString: 5 }, {
        string: 5,
        fret: 5,
        note: "D",
        pitchClass: 2
      }),
      buildNoteRecognitionAttempt(1, { targetNote: "G", targetString: 6 }, {
        string: 1,
        fret: 3,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(getMissedNoteRecognitionPrompts(attempts)).toEqual([
      {
        targetNote: "G",
        targetString: 6,
        selectedNote: "G",
        selectedString: 1,
        selectedFret: 3
      }
    ]);
  });

  it("builds a compact completed session record", () => {
    const attempts = [
      buildNoteRecognitionAttempt(0, { targetNote: "D", targetString: 5 }, {
        string: 5,
        fret: 5,
        note: "D",
        pitchClass: 2
      }),
      buildNoteRecognitionAttempt(1, { targetNote: "G", targetString: 6 }, {
        string: 1,
        fret: 3,
        note: "G",
        pitchClass: 7
      })
    ];

    expect(
      buildNoteRecognitionSession(attempts, "2026-07-07T12:00:00.000Z", 2)
    ).toEqual({
      id: "note-recognition-2026-07-07T12:00:00.000Z",
      completedAt: "2026-07-07T12:00:00.000Z",
      promptCount: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      missedPrompts: [
        {
          targetNote: "G",
          targetString: 6,
          selectedNote: "G",
          selectedString: 1,
          selectedFret: 3
        }
      ]
    });
  });

  it("keeps the newest local sessions first and applies a history limit", () => {
    const sessions = ["one", "two", "three"].map((label) => ({
      id: label,
      completedAt: label,
      promptCount: 10,
      correct: 10,
      missed: 0,
      accuracy: 100,
      missedPrompts: []
    }));

    expect(appendNoteRecognitionSession(sessions, sessions[2]!, 2)).toEqual([
      sessions[2]!,
      sessions[0]!
    ]);
  });

  it("cycles prompt lookup safely", () => {
    expect(getCurrentPrompt(0)).toEqual({ targetNote: "D", targetString: 5 });
    expect(getCurrentPrompt(NOTE_RECOGNITION_PROMPTS.length)).toEqual({
      targetNote: "D",
      targetString: 5
    });
  });
});
