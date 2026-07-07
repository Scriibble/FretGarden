export type AccidentalPreference = "sharp" | "flat";
export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";
export type ScaleQuality = "major" | "minor";
export type TriadQuality = "major" | "minor";

export interface Scale {
  root: NoteName;
  quality: ScaleQuality;
  notes: NoteName[];
}

export interface Chord {
  root: NoteName;
  quality: TriadQuality;
  notes: NoteName[];
}

export interface Interval {
  from: NoteName;
  to: NoteName;
  semitones: number;
  name: string;
}

const SHARP_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
] as const;

const FLAT_NOTES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B"
] as const;

const NOTE_TO_PITCH_CLASS = new Map<NoteName, number>([
  ["C", 0],
  ["C#", 1],
  ["Db", 1],
  ["D", 2],
  ["D#", 3],
  ["Eb", 3],
  ["E", 4],
  ["F", 5],
  ["F#", 6],
  ["Gb", 6],
  ["G", 7],
  ["G#", 8],
  ["Ab", 8],
  ["A", 9],
  ["A#", 10],
  ["Bb", 10],
  ["B", 11]
]);

const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11] as const;
const MINOR_SCALE_STEPS = [0, 2, 3, 5, 7, 8, 10] as const;
const MAJOR_TRIAD_STEPS = [0, 4, 7] as const;
const MINOR_TRIAD_STEPS = [0, 3, 7] as const;

const INTERVAL_NAMES = new Map<number, string>([
  [0, "perfect unison"],
  [1, "minor second"],
  [2, "major second"],
  [3, "minor third"],
  [4, "major third"],
  [5, "perfect fourth"],
  [6, "tritone"],
  [7, "perfect fifth"],
  [8, "minor sixth"],
  [9, "major sixth"],
  [10, "minor seventh"],
  [11, "major seventh"]
]);

const FLAT_MAJOR_KEYS = new Set<NoteName>(["F", "Bb", "Eb", "Ab", "Db", "Gb"]);
const FLAT_MINOR_KEYS = new Set<NoteName>(["D", "G", "C", "F", "Bb"]);

export function getPitchClass(note: NoteName): number {
  const pitchClass = NOTE_TO_PITCH_CLASS.get(note);

  if (pitchClass === undefined) {
    throw new Error(`Unsupported note: ${note}`);
  }

  return pitchClass;
}

export function getNoteName(
  pitchClass: number,
  accidentalPreference: AccidentalPreference = "sharp"
): NoteName {
  const normalizedPitchClass = normalizePitchClass(pitchClass);
  const notes = accidentalPreference === "flat" ? FLAT_NOTES : SHARP_NOTES;

  return notes[normalizedPitchClass] as NoteName;
}

export function getEnharmonicNotes(note: NoteName): NoteName[] {
  const pitchClass = getPitchClass(note);
  const enharmonics = [SHARP_NOTES[pitchClass], FLAT_NOTES[pitchClass]];

  return [...new Set(enharmonics)] as NoteName[];
}

export function getScale(root: NoteName, quality: ScaleQuality): Scale {
  const rootPitchClass = getPitchClass(root);
  const steps = quality === "major" ? MAJOR_SCALE_STEPS : MINOR_SCALE_STEPS;
  const accidentalPreference = getKeyAccidentalPreference(root, quality);

  return {
    root,
    quality,
    notes: steps.map((step) =>
      getNoteName(rootPitchClass + step, accidentalPreference)
    )
  };
}

export function getChord(root: NoteName, quality: TriadQuality): Chord {
  const rootPitchClass = getPitchClass(root);
  const steps = quality === "major" ? MAJOR_TRIAD_STEPS : MINOR_TRIAD_STEPS;
  const accidentalPreference = getKeyAccidentalPreference(root, quality);

  return {
    root,
    quality,
    notes: steps.map((step) =>
      getNoteName(rootPitchClass + step, accidentalPreference)
    )
  };
}

export function getInterval(from: NoteName, to: NoteName): Interval {
  const semitones = normalizePitchClass(getPitchClass(to) - getPitchClass(from));

  return {
    from,
    to,
    semitones,
    name: INTERVAL_NAMES.get(semitones) ?? "unknown interval"
  };
}

export function transpose(
  note: NoteName,
  semitones: number,
  accidentalPreference: AccidentalPreference = "sharp"
): NoteName {
  return getNoteName(getPitchClass(note) + semitones, accidentalPreference);
}

function getKeyAccidentalPreference(
  root: NoteName,
  quality: ScaleQuality | TriadQuality
): AccidentalPreference {
  if (root.includes("b")) {
    return "flat";
  }

  if (root.includes("#")) {
    return "sharp";
  }

  if (quality === "major" && FLAT_MAJOR_KEYS.has(root)) {
    return "flat";
  }

  if (quality === "minor" && FLAT_MINOR_KEYS.has(root)) {
    return "flat";
  }

  return "sharp";
}

function normalizePitchClass(pitchClass: number): number {
  return ((pitchClass % 12) + 12) % 12;
}
