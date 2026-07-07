import type {
  FretPosition,
  GuitarStringNumber
} from "@pocket-practice/fretboard-engine";
import {
  getChord,
  getPitchClass,
  type NoteName,
  type TriadQuality
} from "@pocket-practice/music-theory-engine";

export type ChordTone = 1 | 3 | 5;

export interface ChordTonePrompt {
  rootNote: NoteName;
  quality: TriadQuality;
  targetTone: ChordTone;
}

export interface ChordToneAttempt extends ChordTonePrompt {
  promptIndex: number;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
  isCorrect: boolean;
}

export interface MissedChordTonePrompt extends ChordTonePrompt {
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export interface ChordToneSummary {
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
  isComplete: boolean;
}

export const CHORD_TONE_PROMPTS = [
  { rootNote: "C", quality: "major", targetTone: 1 },
  { rootNote: "G", quality: "major", targetTone: 3 },
  { rootNote: "A", quality: "minor", targetTone: 5 },
  { rootNote: "E", quality: "minor", targetTone: 3 },
  { rootNote: "D", quality: "major", targetTone: 1 },
  { rootNote: "F", quality: "major", targetTone: 5 }
] as const satisfies readonly ChordTonePrompt[];

export function buildChordToneAttempt(
  promptIndex: number,
  prompt: ChordTonePrompt,
  position: FretPosition
): ChordToneAttempt {
  if (!isChordToneAnswerPosition(position)) {
    throw new Error("Open strings are not valid chord-tone answers.");
  }

  return {
    promptIndex,
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    targetTone: prompt.targetTone,
    selectedNote: position.note,
    selectedString: position.string,
    selectedFret: position.fret,
    isCorrect: isChordToneCorrectPosition(prompt, position)
  };
}

export function summarizeChordToneRecognition(
  attempts: ChordToneAttempt[],
  promptCount: number = CHORD_TONE_PROMPTS.length
): ChordToneSummary {
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const attempted = attempts.length;

  return {
    attempted,
    correct,
    missed: attempted - correct,
    accuracy: attempted === 0 ? 0 : Math.round((correct / attempted) * 100),
    isComplete: attempted >= promptCount
  };
}

export function getMissedChordTonePrompts(
  attempts: ChordToneAttempt[]
): MissedChordTonePrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      rootNote: attempt.rootNote,
      quality: attempt.quality,
      targetTone: attempt.targetTone,
      selectedNote: attempt.selectedNote,
      selectedString: attempt.selectedString,
      selectedFret: attempt.selectedFret
    }));
}

export function getCurrentChordTonePrompt(
  promptIndex: number,
  prompts: readonly ChordTonePrompt[] = CHORD_TONE_PROMPTS
): ChordTonePrompt {
  return prompts[promptIndex % prompts.length] as ChordTonePrompt;
}

export function getTargetChordToneNote(prompt: ChordTonePrompt): NoteName {
  const chord = getChord(prompt.rootNote, prompt.quality);
  const chordToneIndex = prompt.targetTone === 1 ? 0 : prompt.targetTone === 3 ? 1 : 2;

  return chord.notes[chordToneIndex] as NoteName;
}

export function isChordToneAnswerPosition(
  position: Pick<FretPosition, "fret">
): boolean {
  return position.fret > 0;
}

export function isChordToneCorrectPosition(
  prompt: ChordTonePrompt,
  position: FretPosition
): boolean {
  return (
    isChordToneAnswerPosition(position) &&
    getPitchClass(position.note) === getPitchClass(getTargetChordToneNote(prompt))
  );
}
