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

export type ChordTone = 1 | 3 | 5;
export type ChordToneQualityFocus = TriadQuality | "both";
export type ChordToneToneFocus = "root" | "third" | "fifth" | "mixed";
export type ChordTonePromptOrder = "fixed" | "random";
export type ChordToneReviewMode = "full" | "missed";
export type ChordToneSessionLength = 6 | 12 | 20;

export interface ChordTonePrompt {
  rootNote: NoteName;
  quality: TriadQuality;
  targetTone: ChordTone;
}

export interface ChordToneAttempt extends ChordTonePrompt {
  promptIndex: number;
  selectedNote: NoteName;
  targetNote: NoteName;
  isCorrect: boolean;
}

export interface MissedChordTonePrompt extends ChordTonePrompt {
  selectedNote: NoteName;
  targetNote: NoteName;
}

export interface ChordToneSessionSettings {
  sessionLength: ChordToneSessionLength;
  qualityFocus: ChordToneQualityFocus;
  toneFocus: ChordToneToneFocus;
  promptOrder: ChordTonePromptOrder;
  reviewMode: ChordToneReviewMode;
}

export interface ChordToneSessionPreset {
  id: string;
  label: string;
  settings: ChordToneSessionSettings;
}

export type ChordToneSummary = DrillSummary;
export type ChordTonePerformanceCategory = "tone" | "quality" | "root";

export interface ChordToneSession extends DrillSession<MissedChordTonePrompt> {
  attempts: ChordToneAttempt[];
}

export interface ChordTonePerformanceStat {
  id: string;
  label: string;
  category: ChordTonePerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface ChordTonePerformanceSummary {
  attempted: number;
  toneStats: ChordTonePerformanceStat[];
  qualityStats: ChordTonePerformanceStat[];
  rootStats: ChordTonePerformanceStat[];
  weakSpots: ChordTonePerformanceStat[];
}

export const CHORD_TONE_PROMPTS = [
  { rootNote: "C", quality: "major", targetTone: 1 },
  { rootNote: "G", quality: "major", targetTone: 3 },
  { rootNote: "A", quality: "minor", targetTone: 5 },
  { rootNote: "E", quality: "minor", targetTone: 3 },
  { rootNote: "D", quality: "major", targetTone: 1 },
  { rootNote: "F", quality: "major", targetTone: 5 },
  { rootNote: "Bb", quality: "major", targetTone: 3 },
  { rootNote: "D", quality: "minor", targetTone: 5 },
  { rootNote: "E", quality: "major", targetTone: 3 },
  { rootNote: "C", quality: "minor", targetTone: 1 },
  { rootNote: "A", quality: "major", targetTone: 5 },
  { rootNote: "G", quality: "minor", targetTone: 3 }
] as const satisfies readonly ChordTonePrompt[];

export const CHORD_TONE_HISTORY_LIMIT = 5;
export const DEFAULT_CHORD_TONE_SESSION_SETTINGS: ChordToneSessionSettings = {
  sessionLength: 12,
  qualityFocus: "both",
  toneFocus: "mixed",
  promptOrder: "fixed",
  reviewMode: "full"
};
export const CHORD_TONE_SESSION_PRESETS = [
  {
    id: "quick-warmup",
    label: "Quick warmup",
    settings: {
      sessionLength: 6,
      qualityFocus: "both",
      toneFocus: "mixed",
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
      toneFocus: "mixed",
      promptOrder: "random",
      reviewMode: "missed"
    }
  },
  {
    id: "thirds-focus",
    label: "3rds focus",
    settings: {
      sessionLength: 12,
      qualityFocus: "both",
      toneFocus: "third",
      promptOrder: "random",
      reviewMode: "full"
    }
  },
  {
    id: "minor-triads",
    label: "Minor triads",
    settings: {
      sessionLength: 12,
      qualityFocus: "minor",
      toneFocus: "mixed",
      promptOrder: "random",
      reviewMode: "full"
    }
  }
] as const satisfies readonly ChordToneSessionPreset[];

export function buildChordToneAttempt(
  promptIndex: number,
  prompt: ChordTonePrompt,
  selectedNote: NoteName
): ChordToneAttempt {
  const targetNote = getTargetChordToneNote(prompt);

  return {
    promptIndex,
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    targetTone: prompt.targetTone,
    selectedNote,
    targetNote,
    isCorrect: isChordToneCorrectNote(prompt, selectedNote)
  };
}

export function summarizeChordToneRecognition(
  attempts: ChordToneAttempt[],
  promptCount: number = CHORD_TONE_PROMPTS.length
): ChordToneSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildChordToneSession(
  attempts: ChordToneAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = CHORD_TONE_PROMPTS.length
): ChordToneSession {
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "chord-tone",
      missedPrompts: getMissedChordTonePrompts(attempts),
      promptCount
    }),
    attempts
  };
}

export function appendChordToneSession(
  history: ChordToneSession[],
  session: ChordToneSession,
  limit = CHORD_TONE_HISTORY_LIMIT
): ChordToneSession[] {
  return appendDrillSession(history, session, limit);
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
      targetNote: attempt.targetNote
    }));
}

export function buildChordTonePerformanceSummary(
  sessions: readonly ChordToneSession[]
): ChordTonePerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const toneStats = buildChordToneStats(
    attempts,
    "tone",
    (attempt) => String(attempt.targetTone),
    (attempt) => `${getChordToneName(attempt.targetTone)}s`
  );
  const qualityStats = buildChordToneStats(
    attempts,
    "quality",
    (attempt) => attempt.quality,
    (attempt) => `${attempt.quality} chords`
  );
  const rootStats = buildChordToneStats(
    attempts,
    "root",
    (attempt) => attempt.rootNote,
    (attempt) => `${attempt.rootNote} chords`
  );

  return {
    attempted: attempts.length,
    toneStats,
    qualityStats,
    rootStats,
    weakSpots: [...toneStats, ...qualityStats, ...rootStats]
      .filter((stat) => stat.missed > 0)
      .sort(compareChordToneWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentChordTonePrompt(
  promptIndex: number,
  prompts: readonly ChordTonePrompt[] = CHORD_TONE_PROMPTS
): ChordTonePrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as ChordTonePrompt;
}

export function buildChordTonePromptSession(
  settings: ChordToneSessionSettings = DEFAULT_CHORD_TONE_SESSION_SETTINGS,
  missedPrompts: readonly MissedChordTonePrompt[] = [],
  random: () => number = Math.random
): ChordTonePrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : CHORD_TONE_PROMPTS;
  const filteredPrompts = filterChordTonePrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0 ? filteredPrompts : [...CHORD_TONE_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleChordTonePrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleChordTonePrompts(orderedPrompts, settings.sessionLength);
}

export function getTargetChordToneNote(prompt: ChordTonePrompt): NoteName {
  const chord = getChord(prompt.rootNote, prompt.quality);
  const chordToneIndex = prompt.targetTone === 1 ? 0 : prompt.targetTone === 3 ? 1 : 2;

  return chord.notes[chordToneIndex] as NoteName;
}

export function getChordToneAnswerOptions(prompt: ChordTonePrompt): NoteName[] {
  return [...getChord(prompt.rootNote, prompt.quality).notes] as NoteName[];
}

export function isChordToneCorrectNote(
  prompt: ChordTonePrompt,
  selectedNote: NoteName
): boolean {
  return (
    getPitchClass(selectedNote) === getPitchClass(getTargetChordToneNote(prompt))
  );
}

function filterChordTonePrompts(
  prompts: readonly ChordTonePrompt[],
  settings: ChordToneSessionSettings
): ChordTonePrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesQualityFocus(prompt, settings.qualityFocus) &&
      matchesToneFocus(prompt, settings.toneFocus)
  );
}

function matchesQualityFocus(
  prompt: ChordTonePrompt,
  qualityFocus: ChordToneQualityFocus
): boolean {
  return qualityFocus === "both" || prompt.quality === qualityFocus;
}

function matchesToneFocus(
  prompt: ChordTonePrompt,
  toneFocus: ChordToneToneFocus
): boolean {
  if (toneFocus === "mixed") {
    return true;
  }

  const targetTone =
    toneFocus === "root" ? 1 : toneFocus === "third" ? 3 : 5;

  return prompt.targetTone === targetTone;
}

function shuffleChordTonePrompts(
  prompts: readonly ChordTonePrompt[],
  random: () => number
): ChordTonePrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleChordTonePrompts(
  prompts: readonly ChordTonePrompt[],
  sessionLength: ChordToneSessionLength
): ChordTonePrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toChordTonePrompt(prompts[index % prompts.length]!)
  );
}

function toChordTonePrompt(prompt: ChordTonePrompt): ChordTonePrompt {
  return {
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    targetTone: prompt.targetTone
  };
}

function buildChordToneStats(
  attempts: readonly ChordToneAttempt[],
  category: ChordTonePerformanceCategory,
  getId: (attempt: ChordToneAttempt) => string,
  getLabel: (attempt: ChordToneAttempt) => string
): ChordTonePerformanceStat[] {
  const statsById = new Map<string, ChordTonePerformanceStat>();

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

  return [...statsById.values()].sort(compareChordToneStats);
}

function compareChordToneStats(
  left: ChordTonePerformanceStat,
  right: ChordTonePerformanceStat
): number {
  return left.label.localeCompare(right.label);
}

function compareChordToneWeakSpots(
  left: ChordTonePerformanceStat,
  right: ChordTonePerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}

function getChordToneName(chordTone: ChordTone): string {
  if (chordTone === 1) {
    return "root";
  }

  return chordTone === 3 ? "3rd" : "5th";
}
