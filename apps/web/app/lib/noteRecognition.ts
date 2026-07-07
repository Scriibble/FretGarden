import type {
  FretPosition,
  GuitarStringNumber
} from "@pocket-practice/fretboard-engine";
import {
  getPitchClass,
  type NoteName
} from "@pocket-practice/music-theory-engine";
import {
  appendDrillSession,
  buildDrillSession,
  getCurrentDrillPrompt,
  summarizeDrill,
  type DrillSession,
  type DrillSummary
} from "./drillSession";

export interface NoteRecognitionAttempt {
  promptIndex: number;
  targetNote: NoteName;
  targetString: GuitarStringNumber;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
  isCorrect: boolean;
}

export interface NoteRecognitionPrompt {
  targetNote: NoteName;
  targetString: GuitarStringNumber;
}

export interface MissedNoteRecognitionPrompt extends NoteRecognitionPrompt {
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export type NoteRecognitionSummary = DrillSummary;
export type NoteRecognitionSession =
  DrillSession<MissedNoteRecognitionPrompt>;

export const NOTE_RECOGNITION_PROMPTS = [
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
] as const satisfies readonly NoteRecognitionPrompt[];

export const NOTE_RECOGNITION_HISTORY_LIMIT = 5;

export function buildNoteRecognitionAttempt(
  promptIndex: number,
  prompt: NoteRecognitionPrompt,
  position: FretPosition
): NoteRecognitionAttempt {
  if (!isNoteRecognitionAnswerPosition(position)) {
    throw new Error("Open strings are not valid note-recognition answers.");
  }

  return {
    promptIndex,
    targetNote: prompt.targetNote,
    targetString: prompt.targetString,
    selectedNote: position.note,
    selectedString: position.string,
    selectedFret: position.fret,
    isCorrect: isNoteRecognitionCorrectPosition(prompt, position)
  };
}

export function summarizeNoteRecognition(
  attempts: NoteRecognitionAttempt[],
  promptCount: number = NOTE_RECOGNITION_PROMPTS.length
): NoteRecognitionSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildNoteRecognitionSession(
  attempts: NoteRecognitionAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = NOTE_RECOGNITION_PROMPTS.length
): NoteRecognitionSession {
  return buildDrillSession({
    attempts,
    completedAt,
    idPrefix: "note-recognition",
    missedPrompts: getMissedNoteRecognitionPrompts(attempts),
    promptCount
  });
}

export function appendNoteRecognitionSession(
  history: NoteRecognitionSession[],
  session: NoteRecognitionSession,
  limit = NOTE_RECOGNITION_HISTORY_LIMIT
): NoteRecognitionSession[] {
  return appendDrillSession(history, session, limit);
}

export function getMissedNoteRecognitionPrompts(
  attempts: NoteRecognitionAttempt[]
): MissedNoteRecognitionPrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      targetNote: attempt.targetNote,
      targetString: attempt.targetString,
      selectedNote: attempt.selectedNote,
      selectedString: attempt.selectedString,
      selectedFret: attempt.selectedFret
    }));
}

export function getCurrentPrompt(
  promptIndex: number,
  prompts: readonly NoteRecognitionPrompt[] = NOTE_RECOGNITION_PROMPTS
): NoteRecognitionPrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as NoteRecognitionPrompt;
}

export function isNoteRecognitionAnswerPosition(
  position: Pick<FretPosition, "fret">
): boolean {
  return position.fret > 0;
}

export function isNoteRecognitionCorrectPosition(
  prompt: NoteRecognitionPrompt,
  position: FretPosition
): boolean {
  return (
    isNoteRecognitionAnswerPosition(position) &&
    position.string === prompt.targetString &&
    getPitchClass(position.note) === getPitchClass(prompt.targetNote)
  );
}
