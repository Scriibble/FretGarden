import { describe, expect, it } from "vitest";
import {
  STANDARD_TUNING,
  findNotesOnFretboard,
  getFretboard,
  getNoteAtFret,
  getTuning,
  mapChordToFretboard,
  mapScaleToFretboard
} from "./index";

describe("fretboard-engine", () => {
  it("exposes standard guitar tuning from low string to high string", () => {
    expect(getTuning()).toEqual(STANDARD_TUNING);
    expect(STANDARD_TUNING).toEqual([
      { string: 6, openNote: "E" },
      { string: 5, openNote: "A" },
      { string: 4, openNote: "D" },
      { string: 3, openNote: "G" },
      { string: 2, openNote: "B" },
      { string: 1, openNote: "E" }
    ]);
  });

  it("builds a standard fretboard through the twelfth fret by default", () => {
    const fretboard = getFretboard();

    expect(fretboard.tuning).toBe("standard");
    expect(fretboard.frets).toBe(12);
    expect(fretboard.positions).toHaveLength(78);
    expect(fretboard.positions[0]).toMatchObject({
      string: 6,
      fret: 0,
      note: "E",
      pitchClass: 4
    });
    expect(fretboard.positions[12]).toMatchObject({
      string: 6,
      fret: 12,
      note: "E",
      pitchClass: 4
    });
  });

  it("gets note data for a single string and fret", () => {
    expect(getNoteAtFret(6, 0)).toMatchObject({
      string: 6,
      fret: 0,
      pitchClass: 4
    });
    expect(getNoteAtFret(6, 1)).toMatchObject({
      string: 6,
      fret: 1,
      note: "F",
      pitchClass: 5
    });
    expect(getNoteAtFret(1, 12)).toMatchObject({
      string: 1,
      fret: 12,
      pitchClass: 4
    });
  });

  it("finds matching notes by pitch class across the fretboard", () => {
    const cPositions = findNotesOnFretboard("C", { frets: 3 });

    expect(cPositions).toEqual([
      expect.objectContaining({ string: 5, fret: 3 }),
      expect.objectContaining({ string: 2, fret: 1 })
    ]);
  });

  it("maps scale tones to the fretboard with scale degrees", () => {
    const cMajor = mapScaleToFretboard("C", "major", { frets: 3 });

    expect(cMajor.scale.notes).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    expect(cMajor.positions).toContainEqual(
      expect.objectContaining({ string: 6, fret: 0, scaleDegree: 3 })
    );
    expect(cMajor.positions).toContainEqual(
      expect.objectContaining({ string: 5, fret: 3, scaleDegree: 1 })
    );
  });

  it("maps chord tones to the fretboard with triad labels", () => {
    const aMinor = mapChordToFretboard("A", "minor", { frets: 3 });

    expect(aMinor.chord.notes).toEqual(["A", "C", "E"]);
    expect(aMinor.positions).toContainEqual(
      expect.objectContaining({ string: 6, fret: 0, chordTone: 5 })
    );
    expect(aMinor.positions).toContainEqual(
      expect.objectContaining({ string: 5, fret: 0, chordTone: 1 })
    );
    expect(aMinor.positions).toContainEqual(
      expect.objectContaining({ string: 5, fret: 3, chordTone: 3 })
    );
  });

  it("rejects invalid fret values", () => {
    expect(() => getFretboard({ frets: -1 })).toThrow(
      "Fret count must be a non-negative integer"
    );
    expect(() => getNoteAtFret(6, 1.5)).toThrow(
      "Fret count must be a non-negative integer"
    );
  });
});
