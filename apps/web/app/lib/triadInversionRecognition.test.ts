import { describe, expect, it } from "vitest";
import {
  TRIAD_INVERSION_PROMPTS,
  TRIAD_INVERSION_SESSION_PRESETS,
  appendTriadInversionSession,
  buildTriadInversionAttempt,
  buildTriadInversionPerformanceSummary,
  buildTriadInversionPromptSession,
  buildTriadInversionSession,
  getCurrentTriadInversionPrompt,
  getMissedTriadInversionPrompts,
  getTriadInversionAnswerOptions,
  getTriadInversionBassNote,
  getTriadInversionBassTone,
  getTriadInversionBassToneName,
  getTriadInversionName,
  isTriadInversionCorrectNote,
  summarizeTriadInversionRecognition
} from "./triadInversionRecognition";

describe("triadInversionRecognition", () => {
  it("uses a fixed triad inversion prompt queue", () => {
    expect(TRIAD_INVERSION_PROMPTS).toEqual([
      { rootNote: "C", quality: "major", inversion: "rootPosition" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "secondInversion" },
      { rootNote: "A", quality: "minor", inversion: "rootPosition" },
      { rootNote: "A", quality: "minor", inversion: "firstInversion" },
      { rootNote: "A", quality: "minor", inversion: "secondInversion" },
      { rootNote: "G", quality: "major", inversion: "firstInversion" },
      { rootNote: "D", quality: "minor", inversion: "secondInversion" },
      { rootNote: "F", quality: "major", inversion: "rootPosition" },
      { rootNote: "E", quality: "minor", inversion: "firstInversion" },
      { rootNote: "Bb", quality: "major", inversion: "secondInversion" },
      { rootNote: "D", quality: "major", inversion: "firstInversion" }
    ]);
  });

  it("defines reusable inversion presets", () => {
    expect(TRIAD_INVERSION_SESSION_PRESETS).toEqual([
      {
        id: "quick-warmup",
        label: "Quick warmup",
        settings: {
          sessionLength: 6,
          qualityFocus: "both",
          inversionFocus: "mixed",
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
          inversionFocus: "mixed",
          promptOrder: "random",
          reviewMode: "missed"
        }
      },
      {
        id: "first-inversions",
        label: "1st inversions",
        settings: {
          sessionLength: 12,
          qualityFocus: "both",
          inversionFocus: "firstInversion",
          promptOrder: "random",
          reviewMode: "full"
        }
      },
      {
        id: "second-inversions",
        label: "2nd inversions",
        settings: {
          sessionLength: 12,
          qualityFocus: "both",
          inversionFocus: "secondInversion",
          promptOrder: "random",
          reviewMode: "full"
        }
      }
    ]);
  });

  it("resolves inversion bass tones and bass notes", () => {
    expect(getTriadInversionBassTone("rootPosition")).toBe(1);
    expect(getTriadInversionBassTone("firstInversion")).toBe(3);
    expect(getTriadInversionBassTone("secondInversion")).toBe(5);
    expect(
      getTriadInversionBassNote({
        rootNote: "C",
        quality: "major",
        inversion: "firstInversion"
      })
    ).toBe("E");
    expect(
      getTriadInversionBassNote({
        rootNote: "A",
        quality: "minor",
        inversion: "secondInversion"
      })
    ).toBe("E");
  });

  it("builds configurable fixed prompt sessions", () => {
    expect(
      buildTriadInversionPromptSession({
        sessionLength: 6,
        qualityFocus: "both",
        inversionFocus: "firstInversion",
        promptOrder: "fixed",
        reviewMode: "full"
      })
    ).toEqual([
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "A", quality: "minor", inversion: "firstInversion" },
      { rootNote: "G", quality: "major", inversion: "firstInversion" },
      { rootNote: "E", quality: "minor", inversion: "firstInversion" },
      { rootNote: "D", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" }
    ]);
  });

  it("uses missed prompts when review mode has misses", () => {
    expect(
      buildTriadInversionPromptSession(
        {
          sessionLength: 6,
          qualityFocus: "both",
          inversionFocus: "mixed",
          promptOrder: "fixed",
          reviewMode: "missed"
        },
        [
          {
            rootNote: "C",
            quality: "major",
            inversion: "firstInversion",
            selectedNote: "C",
            bassNote: "E",
            bassTone: 3
          }
        ]
      )
    ).toEqual([
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      { rootNote: "C", quality: "major", inversion: "firstInversion" }
    ]);
  });

  it("offers chord notes as inversion answer options", () => {
    expect(
      getTriadInversionAnswerOptions({
        rootNote: "Bb",
        quality: "major",
        inversion: "secondInversion"
      })
    ).toEqual(["Bb", "D", "F"]);
  });

  it("builds attempts against the requested inversion bass note", () => {
    expect(
      buildTriadInversionAttempt(
        0,
        {
          rootNote: "C",
          quality: "major",
          inversion: "firstInversion"
        },
        "E"
      )
    ).toEqual({
      promptIndex: 0,
      rootNote: "C",
      quality: "major",
      inversion: "firstInversion",
      selectedNote: "E",
      bassNote: "E",
      bassTone: 3,
      isCorrect: true
    });
  });

  it("checks selected notes against inversion bass note", () => {
    expect(
      isTriadInversionCorrectNote(
        { rootNote: "F", quality: "major", inversion: "secondInversion" },
        "C"
      )
    ).toBe(true);
    expect(
      isTriadInversionCorrectNote(
        { rootNote: "F", quality: "major", inversion: "secondInversion" },
        "A"
      )
    ).toBe(false);
  });

  it("summarizes sessions, misses, and performance", () => {
    const correctAttempt = buildTriadInversionAttempt(
      0,
      { rootNote: "C", quality: "major", inversion: "firstInversion" },
      "E"
    );
    const missedAttempt = buildTriadInversionAttempt(
      1,
      { rootNote: "A", quality: "minor", inversion: "secondInversion" },
      "A"
    );
    const session = buildTriadInversionSession(
      [correctAttempt, missedAttempt],
      "2026-07-07T12:00:00.000Z",
      2
    );

    expect(summarizeTriadInversionRecognition(session.attempts, 2)).toEqual({
      attempted: 2,
      correct: 1,
      missed: 1,
      accuracy: 50,
      isComplete: true
    });
    expect(getMissedTriadInversionPrompts(session.attempts)).toEqual([
      {
        rootNote: "A",
        quality: "minor",
        inversion: "secondInversion",
        selectedNote: "A",
        bassNote: "E",
        bassTone: 5
      }
    ]);
    expect(appendTriadInversionSession([], session)).toEqual([session]);
    expect(
      buildTriadInversionPerformanceSummary([session]).inversionStats.find(
        (stat) => stat.id === "secondInversion"
      )?.label
    ).toBe("2nd inversions");
  });

  it("reads current prompts and inversion labels", () => {
    expect(getCurrentTriadInversionPrompt(0)).toBe(TRIAD_INVERSION_PROMPTS[0]);
    expect(getTriadInversionName("rootPosition")).toBe("root position");
    expect(getTriadInversionBassToneName("firstInversion")).toBe("3rd");
  });
});
