import { describe, expect, it } from "vitest";
import {
  getChord,
  getEnharmonicNotes,
  getInterval,
  getNoteName,
  getPitchClass,
  getScale,
  transpose
} from "./index";

describe("music-theory-engine", () => {
  it("maps supported note names to pitch classes", () => {
    expect(getPitchClass("C")).toBe(0);
    expect(getPitchClass("C#")).toBe(1);
    expect(getPitchClass("Db")).toBe(1);
    expect(getPitchClass("B")).toBe(11);
  });

  it("gets note names with a deterministic accidental preference", () => {
    expect(getNoteName(1)).toBe("C#");
    expect(getNoteName(1, "flat")).toBe("Db");
    expect(getNoteName(13, "flat")).toBe("Db");
    expect(getNoteName(-1)).toBe("B");
  });

  it("returns unique enharmonic spellings", () => {
    expect(getEnharmonicNotes("C")).toEqual(["C"]);
    expect(getEnharmonicNotes("F#")).toEqual(["F#", "Gb"]);
    expect(getEnharmonicNotes("Bb")).toEqual(["A#", "Bb"]);
  });

  it("builds major scales", () => {
    expect(getScale("C", "major").notes).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B"
    ]);
    expect(getScale("F", "major").notes).toEqual([
      "F",
      "G",
      "A",
      "Bb",
      "C",
      "D",
      "E"
    ]);
  });

  it("builds natural minor scales", () => {
    expect(getScale("A", "minor").notes).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ]);
    expect(getScale("D", "minor").notes).toEqual([
      "D",
      "E",
      "F",
      "G",
      "A",
      "Bb",
      "C"
    ]);
  });

  it("builds major and minor triads", () => {
    expect(getChord("C", "major").notes).toEqual(["C", "E", "G"]);
    expect(getChord("A", "minor").notes).toEqual(["A", "C", "E"]);
    expect(getChord("Bb", "major").notes).toEqual(["Bb", "D", "F"]);
  });

  it("calculates ascending simple intervals within an octave", () => {
    expect(getInterval("C", "C")).toMatchObject({
      semitones: 0,
      name: "perfect unison"
    });
    expect(getInterval("C", "G")).toMatchObject({
      semitones: 7,
      name: "perfect fifth"
    });
    expect(getInterval("E", "C")).toMatchObject({
      semitones: 8,
      name: "minor sixth"
    });
  });

  it("transposes notes by semitone distance", () => {
    expect(transpose("C", 7)).toBe("G");
    expect(transpose("C", 1, "flat")).toBe("Db");
    expect(transpose("A", -2)).toBe("G");
  });
});

