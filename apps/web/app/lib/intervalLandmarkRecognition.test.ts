import { describe, expect, it } from "vitest";
import {
  INTERVAL_LANDMARK_PROMPTS,
  INTERVAL_LANDMARK_SESSION_PRESETS,
  appendIntervalLandmarkSession,
  buildIntervalLandmarkAttempt,
  buildIntervalLandmarkPerformanceSummary,
  buildIntervalLandmarkPromptSession,
  buildIntervalLandmarkSession,
  getCurrentIntervalLandmarkPrompt,
  getIntervalLandmarkName,
  getMissedIntervalLandmarkPrompts,
  getTargetIntervalLandmarkNote,
  isIntervalLandmarkAnswerPosition,
  isIntervalLandmarkCorrectPosition,
  summarizeIntervalLandmarkRecognition
} from "./intervalLandmarkRecognition";

describe("intervalLandmarkRecognition", () => {
  it("uses a fixed interval landmark prompt queue", () => {
    expect(INTERVAL_LANDMARK_PROMPTS).toEqual([
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "G", targetInterval: "perfectFifth", targetString: 6 },
      { rootNote: "A", targetInterval: "minorThird", targetString: 4 },
      { rootNote: "E", targetInterval: "majorSecond", targetString: 3 },
      { rootNote: "D", targetInterval: "perfectFourth", targetString: 2 },
      { rootNote: "F", targetInterval: "majorSixth", targetString: 1 },
      { rootNote: "C", targetInterval: "minorSeventh", targetString: 3 },
      { rootNote: "G", targetInterval: "majorThird", targetString: 2 },
      { rootNote: "A", targetInterval: "perfectFifth", targetString: 6 },
      { rootNote: "E", targetInterval: "minorThird", targetString: 4 },
      { rootNote: "D", targetInterval: "majorSixth", targetString: 5 },
      { rootNote: "F", targetInterval: "majorSecond", targetString: 3 }
    ]);
  });

  it("defines reusable interval presets", () => {
    expect(INTERVAL_LANDMARK_SESSION_PRESETS).toEqual([
      {
        id: "quick-warmup",
        label: "Quick warmup",
        settings: {
          sessionLength: 6,
          familyFocus: "mixed",
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
          familyFocus: "mixed",
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
          familyFocus: "thirds",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "full"
        }
      },
      {
        id: "fifths-focus",
        label: "5ths focus",
        settings: {
          sessionLength: 12,
          familyFocus: "fifths",
          stringFocus: "all",
          promptOrder: "random",
          reviewMode: "full"
        }
      }
    ]);
  });

  it("resolves target interval notes", () => {
    expect(
      getTargetIntervalLandmarkNote({
        rootNote: "C",
        targetInterval: "majorThird",
        targetString: 5
      })
    ).toBe("E");
    expect(
      getTargetIntervalLandmarkNote({
        rootNote: "A",
        targetInterval: "minorThird",
        targetString: 4
      })
    ).toBe("C");
  });

  it("builds configurable fixed prompt sessions", () => {
    expect(
      buildIntervalLandmarkPromptSession({
        sessionLength: 6,
        familyFocus: "thirds",
        stringFocus: "all",
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "A", targetInterval: "minorThird", targetString: 4 },
      { rootNote: "G", targetInterval: "majorThird", targetString: 2 },
      { rootNote: "E", targetInterval: "minorThird", targetString: 4 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "A", targetInterval: "minorThird", targetString: 4 }
    ]);
  });

  it("uses missed prompts when review mode has misses", () => {
    expect(
      buildIntervalLandmarkPromptSession(
        {
          sessionLength: 6,
          familyFocus: "mixed",
          stringFocus: "all",
          promptOrder: "fixed",
          reviewMode: "missed"
        },
        [
          {
            rootNote: "C",
            targetInterval: "majorThird",
            targetString: 5,
            targetNote: "E",
            selectedNote: "F",
            selectedString: 5,
            selectedFret: 8
          }
        ]
      )
    ).toEqual([
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
      { rootNote: "C", targetInterval: "majorThird", targetString: 5 }
    ]);
  });

  it("builds a correct attempt when interval note and string match", () => {
    expect(
      buildIntervalLandmarkAttempt(
        0,
        {
          rootNote: "C",
          targetInterval: "majorThird",
          targetString: 5
        },
        {
          string: 5,
          fret: 7,
          note: "E",
          pitchClass: 4
        }
      )
    ).toEqual({
      promptIndex: 0,
      rootNote: "C",
      targetInterval: "majorThird",
      targetString: 5,
      targetNote: "E",
      selectedNote: "E",
      selectedString: 5,
      selectedFret: 7,
      isCorrect: true
    });
  });

  it("rejects open strings as interval answers", () => {
    expect(isIntervalLandmarkAnswerPosition({ fret: 0 })).toBe(false);
    expect(isIntervalLandmarkAnswerPosition({ fret: 1 })).toBe(true);
    expect(() =>
      buildIntervalLandmarkAttempt(
        0,
        {
          rootNote: "E",
          targetInterval: "minorThird",
          targetString: 4
        },
        {
          string: 4,
          fret: 0,
          note: "D",
          pitchClass: 2
        }
      )
    ).toThrow("Open strings are not valid interval-landmark answers.");
  });

  it("checks correct positions against target interval and string", () => {
    const prompt = {
      rootNote: "C",
      targetInterval: "majorThird",
      targetString: 5
    } as const;

    expect(
      isIntervalLandmarkCorrectPosition(prompt, {
        string: 5,
        fret: 7,
        note: "E",
        pitchClass: 4
      })
    ).toBe(true);
    expect(
      isIntervalLandmarkCorrectPosition(prompt, {
        string: 4,
        fret: 2,
        note: "E",
        pitchClass: 4
      })
    ).toBe(false);
  });

  it("summarizes sessions, misses, and performance", () => {
    const correctAttempt = buildIntervalLandmarkAttempt(
      0,
      {
        rootNote: "C",
        targetInterval: "majorThird",
        targetString: 5
      },
      {
        string: 5,
        fret: 7,
        note: "E",
        pitchClass: 4
      }
    );
    const missedAttempt = buildIntervalLandmarkAttempt(
      1,
      {
        rootNote: "G",
        targetInterval: "perfectFifth",
        targetString: 6
      },
      {
        string: 6,
        fret: 6,
        note: "A#",
        pitchClass: 10
      }
    );
    const session = buildIntervalLandmarkSession(
      [correctAttempt, missedAttempt],
      "2026-07-07T12:00:00.000Z",
      2
    );

    expect(summarizeIntervalLandmarkRecognition(session.attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
    expect(getMissedIntervalLandmarkPrompts(session.attempts)).toEqual([
      {
        rootNote: "G",
        targetInterval: "perfectFifth",
        targetString: 6,
        targetNote: "D",
        selectedNote: "A#",
        selectedString: 6,
        selectedFret: 6
      }
    ]);
    expect(appendIntervalLandmarkSession([], session)).toEqual([session]);
    expect(
      buildIntervalLandmarkPerformanceSummary([session]).intervalStats.find(
        (stat) => stat.id === "perfectFifth"
      )?.label
    ).toBe("Perfect 5ths");
  });

  it("reads current prompts and interval labels", () => {
    expect(getCurrentIntervalLandmarkPrompt(0)).toBe(
      INTERVAL_LANDMARK_PROMPTS[0]
    );
    expect(getIntervalLandmarkName("majorSeventh")).toBe("major 7th");
  });
});
