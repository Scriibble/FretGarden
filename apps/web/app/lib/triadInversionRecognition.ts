import {
  getChord,
  getPitchClass,
  type NoteName,
  type TriadQuality
} from "@pocket-practice/music-theory-engine";
import {
  appendDrillSession,
  buildDrillSession,
  getCurrentDrillPrompt,
  summarizeDrill,
  type DrillSession,
  type DrillSummary
} from "./drillSession";

export type TriadInversion = "rootPosition" | "firstInversion" | "secondInversion";
export type TriadInversionQualityFocus = TriadQuality | "both";
export type TriadInversionFocus = TriadInversion | "mixed";
export type TriadInversionPromptOrder = "fixed" | "random";
export type TriadInversionReviewMode = "full" | "missed";
export type TriadInversionSessionLength = 6 | 12 | 20;
export type TriadInversionBassTone = 1 | 3 | 5;

export interface TriadInversionPrompt {
  rootNote: NoteName;
  quality: TriadQuality;
  inversion: TriadInversion;
}

export interface TriadInversionAttempt extends TriadInversionPrompt {
  promptIndex: number;
  selectedNote: NoteName;
  bassNote: NoteName;
  bassTone: TriadInversionBassTone;
  isCorrect: boolean;
}

export interface MissedTriadInversionPrompt extends TriadInversionPrompt {
  selectedNote: NoteName;
  bassNote: NoteName;
  bassTone: TriadInversionBassTone;
}

export interface TriadInversionSessionSettings {
  sessionLength: TriadInversionSessionLength;
  qualityFocus: TriadInversionQualityFocus;
  inversionFocus: TriadInversionFocus;
  promptOrder: TriadInversionPromptOrder;
  reviewMode: TriadInversionReviewMode;
}

export interface TriadInversionSessionPreset {
  id: string;
  label: string;
  settings: TriadInversionSessionSettings;
}

export type TriadInversionSummary = DrillSummary;
export type TriadInversionPerformanceCategory = "inversion" | "quality" | "root";

export interface TriadInversionSession
  extends DrillSession<MissedTriadInversionPrompt> {
  attempts: TriadInversionAttempt[];
}

export interface TriadInversionPerformanceStat {
  id: string;
  label: string;
  category: TriadInversionPerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface TriadInversionPerformanceSummary {
  attempted: number;
  inversionStats: TriadInversionPerformanceStat[];
  qualityStats: TriadInversionPerformanceStat[];
  rootStats: TriadInversionPerformanceStat[];
  weakSpots: TriadInversionPerformanceStat[];
}

export const TRIAD_INVERSION_PROMPTS = [
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
] as const satisfies readonly TriadInversionPrompt[];

export const TRIAD_INVERSION_HISTORY_LIMIT = 5;
export const DEFAULT_TRIAD_INVERSION_SESSION_SETTINGS: TriadInversionSessionSettings = {
  sessionLength: 12,
  qualityFocus: "both",
  inversionFocus: "mixed",
  promptOrder: "fixed",
  reviewMode: "full"
};
export const TRIAD_INVERSION_SESSION_PRESETS = [
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
] as const satisfies readonly TriadInversionSessionPreset[];

export function buildTriadInversionAttempt(
  promptIndex: number,
  prompt: TriadInversionPrompt,
  selectedNote: NoteName
): TriadInversionAttempt {
  const bassTone = getTriadInversionBassTone(prompt.inversion);
  const bassNote = getTriadInversionBassNote(prompt);

  return {
    promptIndex,
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    inversion: prompt.inversion,
    selectedNote,
    bassNote,
    bassTone,
    isCorrect: isTriadInversionCorrectNote(prompt, selectedNote)
  };
}

export function summarizeTriadInversionRecognition(
  attempts: TriadInversionAttempt[],
  promptCount: number = TRIAD_INVERSION_PROMPTS.length
): TriadInversionSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildTriadInversionSession(
  attempts: TriadInversionAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = TRIAD_INVERSION_PROMPTS.length
): TriadInversionSession {
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "triad-inversion",
      missedPrompts: getMissedTriadInversionPrompts(attempts),
      promptCount
    }),
    attempts
  };
}

export function appendTriadInversionSession(
  history: TriadInversionSession[],
  session: TriadInversionSession,
  limit = TRIAD_INVERSION_HISTORY_LIMIT
): TriadInversionSession[] {
  return appendDrillSession(history, session, limit);
}

export function getMissedTriadInversionPrompts(
  attempts: TriadInversionAttempt[]
): MissedTriadInversionPrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      rootNote: attempt.rootNote,
      quality: attempt.quality,
      inversion: attempt.inversion,
      selectedNote: attempt.selectedNote,
      bassNote: attempt.bassNote,
      bassTone: attempt.bassTone
    }));
}

export function buildTriadInversionPerformanceSummary(
  sessions: readonly TriadInversionSession[]
): TriadInversionPerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const inversionStats = buildTriadInversionStats(
    attempts,
    "inversion",
    (attempt) => attempt.inversion,
    (attempt) => `${getTriadInversionName(attempt.inversion)}s`
  );
  const qualityStats = buildTriadInversionStats(
    attempts,
    "quality",
    (attempt) => attempt.quality,
    (attempt) => `${attempt.quality} inversions`
  );
  const rootStats = buildTriadInversionStats(
    attempts,
    "root",
    (attempt) => attempt.rootNote,
    (attempt) => `${attempt.rootNote} inversions`
  );

  return {
    attempted: attempts.length,
    inversionStats,
    qualityStats,
    rootStats,
    weakSpots: [...inversionStats, ...qualityStats, ...rootStats]
      .filter((stat) => stat.missed > 0)
      .sort(compareTriadInversionWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentTriadInversionPrompt(
  promptIndex: number,
  prompts: readonly TriadInversionPrompt[] = TRIAD_INVERSION_PROMPTS
): TriadInversionPrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as TriadInversionPrompt;
}

export function buildTriadInversionPromptSession(
  settings: TriadInversionSessionSettings = DEFAULT_TRIAD_INVERSION_SESSION_SETTINGS,
  missedPrompts: readonly MissedTriadInversionPrompt[] = [],
  random: () => number = Math.random
): TriadInversionPrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : TRIAD_INVERSION_PROMPTS;
  const filteredPrompts = filterTriadInversionPrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0 ? filteredPrompts : [...TRIAD_INVERSION_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleTriadInversionPrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleTriadInversionPrompts(orderedPrompts, settings.sessionLength);
}

export function getTriadInversionBassNote(
  prompt: TriadInversionPrompt
): NoteName {
  const chord = getChord(prompt.rootNote, prompt.quality);
  const bassTone = getTriadInversionBassTone(prompt.inversion);
  const bassIndex = bassTone === 1 ? 0 : bassTone === 3 ? 1 : 2;

  return chord.notes[bassIndex] as NoteName;
}

export function getTriadInversionAnswerOptions(
  prompt: TriadInversionPrompt
): NoteName[] {
  return [...getChord(prompt.rootNote, prompt.quality).notes] as NoteName[];
}

export function isTriadInversionCorrectNote(
  prompt: TriadInversionPrompt,
  selectedNote: NoteName
): boolean {
  return (
    getPitchClass(selectedNote) === getPitchClass(getTriadInversionBassNote(prompt))
  );
}

export function getTriadInversionBassTone(
  inversion: TriadInversion
): TriadInversionBassTone {
  if (inversion === "rootPosition") {
    return 1;
  }

  return inversion === "firstInversion" ? 3 : 5;
}

export function getTriadInversionName(inversion: TriadInversion): string {
  const names: Record<TriadInversion, string> = {
    rootPosition: "root position",
    firstInversion: "1st inversion",
    secondInversion: "2nd inversion"
  };

  return names[inversion];
}

export function getTriadInversionBassToneName(
  inversion: TriadInversion
): string {
  const bassTone = getTriadInversionBassTone(inversion);

  if (bassTone === 1) {
    return "root";
  }

  return bassTone === 3 ? "3rd" : "5th";
}

function filterTriadInversionPrompts(
  prompts: readonly TriadInversionPrompt[],
  settings: TriadInversionSessionSettings
): TriadInversionPrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesQualityFocus(prompt, settings.qualityFocus) &&
      matchesInversionFocus(prompt, settings.inversionFocus)
  );
}

function matchesQualityFocus(
  prompt: TriadInversionPrompt,
  qualityFocus: TriadInversionQualityFocus
): boolean {
  return qualityFocus === "both" || prompt.quality === qualityFocus;
}

function matchesInversionFocus(
  prompt: TriadInversionPrompt,
  inversionFocus: TriadInversionFocus
): boolean {
  return inversionFocus === "mixed" || prompt.inversion === inversionFocus;
}

function shuffleTriadInversionPrompts(
  prompts: readonly TriadInversionPrompt[],
  random: () => number
): TriadInversionPrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleTriadInversionPrompts(
  prompts: readonly TriadInversionPrompt[],
  sessionLength: TriadInversionSessionLength
): TriadInversionPrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toTriadInversionPrompt(prompts[index % prompts.length]!)
  );
}

function toTriadInversionPrompt(
  prompt: TriadInversionPrompt
): TriadInversionPrompt {
  return {
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    inversion: prompt.inversion
  };
}

function buildTriadInversionStats(
  attempts: readonly TriadInversionAttempt[],
  category: TriadInversionPerformanceCategory,
  getId: (attempt: TriadInversionAttempt) => string,
  getLabel: (attempt: TriadInversionAttempt) => string
): TriadInversionPerformanceStat[] {
  const statsById = new Map<string, TriadInversionPerformanceStat>();

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

  return [...statsById.values()].sort(compareTriadInversionStats);
}

function compareTriadInversionStats(
  left: TriadInversionPerformanceStat,
  right: TriadInversionPerformanceStat
): number {
  return left.label.localeCompare(right.label);
}

function compareTriadInversionWeakSpots(
  left: TriadInversionPerformanceStat,
  right: TriadInversionPerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}
