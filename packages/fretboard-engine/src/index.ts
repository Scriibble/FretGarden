import {
  getChord,
  getNoteName,
  getPitchClass,
  getScale,
  type Chord,
  type NoteName,
  type Scale,
  type ScaleQuality,
  type TriadQuality
} from "@pocket-practice/music-theory-engine";

export type TuningName = "standard";
export type GuitarStringNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface FretboardOptions {
  tuning?: TuningName;
  frets?: number;
}

export interface StringTuning {
  string: GuitarStringNumber;
  openNote: NoteName;
}

export interface FretPosition {
  string: GuitarStringNumber;
  fret: number;
  note: NoteName;
  pitchClass: number;
}

export interface Fretboard {
  tuning: TuningName;
  frets: number;
  strings: StringTuning[];
  positions: FretPosition[];
}

export interface ScaleFretPosition extends FretPosition {
  scaleDegree: number;
}

export interface ChordFretPosition extends FretPosition {
  chordTone: 1 | 3 | 5;
}

export interface ScaleFretboardMap {
  scale: Scale;
  positions: ScaleFretPosition[];
}

export interface ChordFretboardMap {
  chord: Chord;
  positions: ChordFretPosition[];
}

const DEFAULT_FRET_COUNT = 12;

export const STANDARD_TUNING: StringTuning[] = [
  { string: 6, openNote: "E" },
  { string: 5, openNote: "A" },
  { string: 4, openNote: "D" },
  { string: 3, openNote: "G" },
  { string: 2, openNote: "B" },
  { string: 1, openNote: "E" }
];

export function getTuning(tuning: TuningName = "standard"): StringTuning[] {
  if (tuning !== "standard") {
    throw new Error(`Unsupported tuning: ${tuning}`);
  }

  return STANDARD_TUNING;
}

export function getFretboard(options: FretboardOptions = {}): Fretboard {
  const tuning = options.tuning ?? "standard";
  const frets = options.frets ?? DEFAULT_FRET_COUNT;

  assertValidFretCount(frets);

  const strings = getTuning(tuning);

  return {
    tuning,
    frets,
    strings,
    positions: strings.flatMap((stringTuning) =>
      getStringPositions(stringTuning, frets)
    )
  };
}

export function getNoteAtFret(
  string: GuitarStringNumber,
  fret: number,
  tuning: TuningName = "standard"
): FretPosition {
  assertValidFretCount(fret);

  const stringTuning = getTuning(tuning).find(
    (candidate) => candidate.string === string
  );

  if (!stringTuning) {
    throw new Error(`Unsupported guitar string: ${string}`);
  }

  return getStringPosition(stringTuning, fret);
}

export function findNotesOnFretboard(
  note: NoteName,
  options: FretboardOptions = {}
): FretPosition[] {
  const pitchClass = getPitchClass(note);

  return getFretboard(options).positions.filter(
    (position) => position.pitchClass === pitchClass
  );
}

export function mapScaleToFretboard(
  root: NoteName,
  quality: ScaleQuality,
  options: FretboardOptions = {}
): ScaleFretboardMap {
  const scale = getScale(root, quality);
  const pitchClassToDegree = buildIndexedPitchClassMap(
    scale.notes.map((note) => getPitchClass(note))
  );

  return {
    scale,
    positions: getFretboard(options).positions.flatMap((position) => {
      const scaleDegree = pitchClassToDegree.get(position.pitchClass);

      return scaleDegree === undefined ? [] : [{ ...position, scaleDegree }];
    })
  };
}

export function mapChordToFretboard(
  root: NoteName,
  quality: TriadQuality,
  options: FretboardOptions = {}
): ChordFretboardMap {
  const chord = getChord(root, quality);
  const chordToneLabels = [1, 3, 5] as const;
  const pitchClassToTone = new Map<number, 1 | 3 | 5>(
    chord.notes.map((note, index) => [
      getPitchClass(note),
      chordToneLabels[index] as 1 | 3 | 5
    ])
  );

  return {
    chord,
    positions: getFretboard(options).positions.flatMap((position) => {
      const chordTone = pitchClassToTone.get(position.pitchClass);

      return chordTone === undefined ? [] : [{ ...position, chordTone }];
    })
  };
}

function getStringPositions(
  stringTuning: StringTuning,
  frets: number
): FretPosition[] {
  return Array.from({ length: frets + 1 }, (_, fret) =>
    getStringPosition(stringTuning, fret)
  );
}

function getStringPosition(
  stringTuning: StringTuning,
  fret: number
): FretPosition {
  const pitchClass = (getPitchClass(stringTuning.openNote) + fret) % 12;

  return {
    string: stringTuning.string,
    fret,
    note: getNoteName(pitchClass),
    pitchClass
  };
}

function buildIndexedPitchClassMap(pitchClasses: number[]): Map<number, number> {
  return new Map(
    pitchClasses.map((pitchClass, index) => [pitchClass, index + 1])
  );
}

function assertValidFretCount(frets: number): void {
  if (!Number.isInteger(frets) || frets < 0) {
    throw new Error(`Fret count must be a non-negative integer: ${frets}`);
  }
}
