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

export type NoteRecognitionNoteFocus = NoteName | "all";
export type NoteRecognitionStringFocus = GuitarStringNumber | "all";
export type NoteRecognitionPromptOrder = "fixed" | "random";
export type NoteRecognitionReviewMode = "full" | "missed";
export type NoteRecognitionSessionLength = 6 | 10 | 20;

export interface MissedNoteRecognitionPrompt extends NoteRecognitionPrompt {
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export interface NoteRecognitionSessionSettings {
  sessionLength: NoteRecognitionSessionLength;
  noteFocus: NoteRecognitionNoteFocus;
  stringFocus: NoteRecognitionStringFocus;
  promptOrder: NoteRecognitionPromptOrder;
  reviewMode: NoteRecognitionReviewMode;
}

export type NoteRecognitionSummary = DrillSummary;
export type NoteRecognitionPerformanceCategory = "note" | "string";

export interface NoteRecognitionSession
  extends DrillSession<MissedNoteRecognitionPrompt> {
  attempts: NoteRecognitionAttempt[];
}

export interface NoteRecognitionPerformanceStat {
  id: string;
  label: string;
  category: NoteRecognitionPerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface NoteRecognitionPerformanceSummary {
  attempted: number;
  noteStats: NoteRecognitionPerformanceStat[];
  stringStats: NoteRecognitionPerformanceStat[];
  weakSpots: NoteRecognitionPerformanceStat[];
}

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
export const DEFAULT_NOTE_RECOGNITION_SESSION_SETTINGS: NoteRecognitionSessionSettings = {
  sessionLength: 10,
  noteFocus: "all",
  stringFocus: "all",
  promptOrder: "fixed",
  reviewMode: "full"
};

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
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "note-recognition",
      missedPrompts: getMissedNoteRecognitionPrompts(attempts),
      promptCount
    }),
    attempts
  };
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

export function buildNoteRecognitionPerformanceSummary(
  sessions: readonly NoteRecognitionSession[]
): NoteRecognitionPerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const noteStats = buildNoteRecognitionStats(
    attempts,
    "note",
    (attempt) => attempt.targetNote,
    (attempt) => `${attempt.targetNote} notes`
  );
  const stringStats = buildNoteRecognitionStats(
    attempts,
    "string",
    (attempt) => String(attempt.targetString),
    (attempt) => `String ${attempt.targetString}`
  );

  return {
    attempted: attempts.length,
    noteStats,
    stringStats,
    weakSpots: [...noteStats, ...stringStats]
      .filter((stat) => stat.missed > 0)
      .sort(compareNoteRecognitionWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentPrompt(
  promptIndex: number,
  prompts: readonly NoteRecognitionPrompt[] = NOTE_RECOGNITION_PROMPTS
): NoteRecognitionPrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as NoteRecognitionPrompt;
}

export function buildNoteRecognitionPromptSession(
  settings: NoteRecognitionSessionSettings = DEFAULT_NOTE_RECOGNITION_SESSION_SETTINGS,
  missedPrompts: readonly MissedNoteRecognitionPrompt[] = [],
  random: () => number = Math.random
): NoteRecognitionPrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : NOTE_RECOGNITION_PROMPTS;
  const filteredPrompts = filterNoteRecognitionPrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0 ? filteredPrompts : [...NOTE_RECOGNITION_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleNoteRecognitionPrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleNoteRecognitionPrompts(orderedPrompts, settings.sessionLength);
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

function buildNoteRecognitionStats(
  attempts: readonly NoteRecognitionAttempt[],
  category: NoteRecognitionPerformanceCategory,
  getId: (attempt: NoteRecognitionAttempt) => string,
  getLabel: (attempt: NoteRecognitionAttempt) => string
): NoteRecognitionPerformanceStat[] {
  const statsById = new Map<string, NoteRecognitionPerformanceStat>();

  attempts.forEach((attempt) => {
    const id = getId(attempt);
    const existingStat = statsById.get(id);
    const nextStat = existingStat ?? {
      id,
      label: getLabel(attempt),
      category,
      attempted: 0,
      correct: 0,
      missed: 0,
      accuracy: 0
    };

    nextStat.attempted += 1;
    nextStat.correct += attempt.isCorrect ? 1 : 0;
    nextStat.missed += attempt.isCorrect ? 0 : 1;
    nextStat.accuracy = Math.round(
      (nextStat.correct / nextStat.attempted) * 100
    );
    statsById.set(id, nextStat);
  });

  return [...statsById.values()].sort(compareNoteRecognitionStats);
}

function compareNoteRecognitionStats(
  left: NoteRecognitionPerformanceStat,
  right: NoteRecognitionPerformanceStat
): number {
  return left.label.localeCompare(right.label);
}

function compareNoteRecognitionWeakSpots(
  left: NoteRecognitionPerformanceStat,
  right: NoteRecognitionPerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}

function filterNoteRecognitionPrompts(
  prompts: readonly NoteRecognitionPrompt[],
  settings: NoteRecognitionSessionSettings
): NoteRecognitionPrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesNoteFocus(prompt, settings.noteFocus) &&
      matchesStringFocus(prompt, settings.stringFocus)
  );
}

function matchesNoteFocus(
  prompt: NoteRecognitionPrompt,
  noteFocus: NoteRecognitionNoteFocus
): boolean {
  return noteFocus === "all" || prompt.targetNote === noteFocus;
}

function matchesStringFocus(
  prompt: NoteRecognitionPrompt,
  stringFocus: NoteRecognitionStringFocus
): boolean {
  return stringFocus === "all" || prompt.targetString === stringFocus;
}

function shuffleNoteRecognitionPrompts(
  prompts: readonly NoteRecognitionPrompt[],
  random: () => number
): NoteRecognitionPrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleNoteRecognitionPrompts(
  prompts: readonly NoteRecognitionPrompt[],
  sessionLength: NoteRecognitionSessionLength
): NoteRecognitionPrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toNoteRecognitionPrompt(prompts[index % prompts.length]!)
  );
}

function toNoteRecognitionPrompt(
  prompt: NoteRecognitionPrompt
): NoteRecognitionPrompt {
  return {
    targetNote: prompt.targetNote,
    targetString: prompt.targetString
  };
}
