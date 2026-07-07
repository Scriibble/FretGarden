import type {
  FretPosition,
  GuitarStringNumber
} from "@pocket-practice/fretboard-engine";
import {
  getPitchClass,
  getScale,
  type NoteName,
  type ScaleQuality
} from "@pocket-practice/music-theory-engine";
import {
  appendDrillSession,
  buildDrillSession,
  getCurrentDrillPrompt,
  summarizeDrill,
  type DrillSession,
  type DrillSummary
} from "./drillSession";

export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ScaleDegreeQualityFocus = ScaleQuality | "both";
export type ScaleDegreeDegreeFocus =
  | "root"
  | "second"
  | "third"
  | "fourth"
  | "fifth"
  | "sixth"
  | "seventh"
  | "mixed";
export type ScaleDegreeStringFocus = GuitarStringNumber | "all";
export type ScaleDegreePromptOrder = "fixed" | "random";
export type ScaleDegreeReviewMode = "full" | "missed";
export type ScaleDegreeSessionLength = 6 | 12 | 20;

export interface ScaleDegreePrompt {
  rootNote: NoteName;
  quality: ScaleQuality;
  targetDegree: ScaleDegree;
  targetString: GuitarStringNumber;
}

export interface ScaleDegreeAttempt extends ScaleDegreePrompt {
  promptIndex: number;
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
  isCorrect: boolean;
}

export interface MissedScaleDegreePrompt extends ScaleDegreePrompt {
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export interface ScaleDegreeSessionSettings {
  sessionLength: ScaleDegreeSessionLength;
  qualityFocus: ScaleDegreeQualityFocus;
  degreeFocus: ScaleDegreeDegreeFocus;
  stringFocus: ScaleDegreeStringFocus;
  promptOrder: ScaleDegreePromptOrder;
  reviewMode: ScaleDegreeReviewMode;
}

export interface ScaleDegreeSessionPreset {
  id: string;
  label: string;
  settings: ScaleDegreeSessionSettings;
}

export type ScaleDegreeSummary = DrillSummary;
export type ScaleDegreePerformanceCategory =
  | "degree"
  | "quality"
  | "root"
  | "string";

export interface ScaleDegreeSession
  extends DrillSession<MissedScaleDegreePrompt> {
  attempts: ScaleDegreeAttempt[];
}

export interface ScaleDegreePerformanceStat {
  id: string;
  label: string;
  category: ScaleDegreePerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface ScaleDegreePerformanceSummary {
  attempted: number;
  degreeStats: ScaleDegreePerformanceStat[];
  qualityStats: ScaleDegreePerformanceStat[];
  rootStats: ScaleDegreePerformanceStat[];
  stringStats: ScaleDegreePerformanceStat[];
  weakSpots: ScaleDegreePerformanceStat[];
}

export const SCALE_DEGREE_PROMPTS = [
  { rootNote: "C", quality: "major", targetDegree: 1, targetString: 5 },
  { rootNote: "G", quality: "major", targetDegree: 3, targetString: 2 },
  { rootNote: "A", quality: "minor", targetDegree: 5, targetString: 4 },
  { rootNote: "E", quality: "minor", targetDegree: 3, targetString: 3 },
  { rootNote: "D", quality: "major", targetDegree: 6, targetString: 2 },
  { rootNote: "F", quality: "major", targetDegree: 4, targetString: 6 },
  { rootNote: "Bb", quality: "major", targetDegree: 7, targetString: 3 },
  { rootNote: "D", quality: "minor", targetDegree: 2, targetString: 5 },
  { rootNote: "E", quality: "major", targetDegree: 3, targetString: 4 },
  { rootNote: "C", quality: "minor", targetDegree: 6, targetString: 2 },
  { rootNote: "A", quality: "major", targetDegree: 4, targetString: 1 },
  { rootNote: "G", quality: "minor", targetDegree: 5, targetString: 6 }
] as const satisfies readonly ScaleDegreePrompt[];

export const SCALE_DEGREE_HISTORY_LIMIT = 5;
export const DEFAULT_SCALE_DEGREE_SESSION_SETTINGS: ScaleDegreeSessionSettings = {
  sessionLength: 12,
  qualityFocus: "both",
  degreeFocus: "mixed",
  stringFocus: "all",
  promptOrder: "fixed",
  reviewMode: "full"
};
export const SCALE_DEGREE_SESSION_PRESETS = [
  {
    id: "quick-warmup",
    label: "Quick warmup",
    settings: {
      sessionLength: 6,
      qualityFocus: "both",
      degreeFocus: "mixed",
      stringFocus: "all",
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
      degreeFocus: "mixed",
      stringFocus: "all",
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
      degreeFocus: "third",
      stringFocus: "all",
      promptOrder: "random",
      reviewMode: "full"
    }
  },
  {
    id: "minor-scales",
    label: "Minor scales",
    settings: {
      sessionLength: 12,
      qualityFocus: "minor",
      degreeFocus: "mixed",
      stringFocus: "all",
      promptOrder: "random",
      reviewMode: "full"
    }
  }
] as const satisfies readonly ScaleDegreeSessionPreset[];

export function buildScaleDegreeAttempt(
  promptIndex: number,
  prompt: ScaleDegreePrompt,
  position: FretPosition
): ScaleDegreeAttempt {
  if (!isScaleDegreeAnswerPosition(position)) {
    throw new Error("Open strings are not valid scale-degree answers.");
  }

  const targetNote = getTargetScaleDegreeNote(prompt);

  return {
    promptIndex,
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    targetDegree: prompt.targetDegree,
    targetString: prompt.targetString,
    targetNote,
    selectedNote: position.note,
    selectedString: position.string,
    selectedFret: position.fret,
    isCorrect: isScaleDegreeCorrectPosition(prompt, position)
  };
}

export function summarizeScaleDegreeRecognition(
  attempts: ScaleDegreeAttempt[],
  promptCount: number = SCALE_DEGREE_PROMPTS.length
): ScaleDegreeSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildScaleDegreeSession(
  attempts: ScaleDegreeAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = SCALE_DEGREE_PROMPTS.length
): ScaleDegreeSession {
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "scale-degree",
      missedPrompts: getMissedScaleDegreePrompts(attempts),
      promptCount
    }),
    attempts
  };
}

export function appendScaleDegreeSession(
  history: ScaleDegreeSession[],
  session: ScaleDegreeSession,
  limit = SCALE_DEGREE_HISTORY_LIMIT
): ScaleDegreeSession[] {
  return appendDrillSession(history, session, limit);
}

export function getMissedScaleDegreePrompts(
  attempts: ScaleDegreeAttempt[]
): MissedScaleDegreePrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      rootNote: attempt.rootNote,
      quality: attempt.quality,
      targetDegree: attempt.targetDegree,
      targetString: attempt.targetString,
      targetNote: attempt.targetNote,
      selectedNote: attempt.selectedNote,
      selectedString: attempt.selectedString,
      selectedFret: attempt.selectedFret
    }));
}

export function buildScaleDegreePerformanceSummary(
  sessions: readonly ScaleDegreeSession[]
): ScaleDegreePerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const degreeStats = buildScaleDegreeStats(
    attempts,
    "degree",
    (attempt) => String(attempt.targetDegree),
    (attempt) => `${getScaleDegreeName(attempt.targetDegree)}s`
  );
  const qualityStats = buildScaleDegreeStats(
    attempts,
    "quality",
    (attempt) => attempt.quality,
    (attempt) => `${attempt.quality} scales`
  );
  const rootStats = buildScaleDegreeStats(
    attempts,
    "root",
    (attempt) => attempt.rootNote,
    (attempt) => `${attempt.rootNote} scales`
  );
  const stringStats = buildScaleDegreeStats(
    attempts,
    "string",
    (attempt) => String(attempt.targetString),
    (attempt) => `String ${attempt.targetString}`
  );

  return {
    attempted: attempts.length,
    degreeStats,
    qualityStats,
    rootStats,
    stringStats,
    weakSpots: [...degreeStats, ...qualityStats, ...rootStats, ...stringStats]
      .filter((stat) => stat.missed > 0)
      .sort(compareScaleDegreeWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentScaleDegreePrompt(
  promptIndex: number,
  prompts: readonly ScaleDegreePrompt[] = SCALE_DEGREE_PROMPTS
): ScaleDegreePrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as ScaleDegreePrompt;
}

export function buildScaleDegreePromptSession(
  settings: ScaleDegreeSessionSettings = DEFAULT_SCALE_DEGREE_SESSION_SETTINGS,
  missedPrompts: readonly MissedScaleDegreePrompt[] = [],
  random: () => number = Math.random
): ScaleDegreePrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : SCALE_DEGREE_PROMPTS;
  const filteredPrompts = filterScaleDegreePrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0 ? filteredPrompts : [...SCALE_DEGREE_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleScaleDegreePrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleScaleDegreePrompts(orderedPrompts, settings.sessionLength);
}

export function getTargetScaleDegreeNote(
  prompt: ScaleDegreePrompt
): NoteName {
  return getScale(prompt.rootNote, prompt.quality).notes[
    prompt.targetDegree - 1
  ] as NoteName;
}

export function isScaleDegreeAnswerPosition(
  position: Pick<FretPosition, "fret">
): boolean {
  return position.fret > 0;
}

export function isScaleDegreeCorrectPosition(
  prompt: ScaleDegreePrompt,
  position: FretPosition
): boolean {
  return (
    isScaleDegreeAnswerPosition(position) &&
    position.string === prompt.targetString &&
    getPitchClass(position.note) === getPitchClass(getTargetScaleDegreeNote(prompt))
  );
}

export function getScaleDegreeName(degree: ScaleDegree): string {
  if (degree === 1) {
    return "root";
  }

  if (degree === 2) {
    return "2nd";
  }

  if (degree === 3) {
    return "3rd";
  }

  return `${degree}th`;
}

function filterScaleDegreePrompts(
  prompts: readonly ScaleDegreePrompt[],
  settings: ScaleDegreeSessionSettings
): ScaleDegreePrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesQualityFocus(prompt, settings.qualityFocus) &&
      matchesDegreeFocus(prompt, settings.degreeFocus) &&
      matchesStringFocus(prompt, settings.stringFocus)
  );
}

function matchesQualityFocus(
  prompt: ScaleDegreePrompt,
  qualityFocus: ScaleDegreeQualityFocus
): boolean {
  return qualityFocus === "both" || prompt.quality === qualityFocus;
}

function matchesDegreeFocus(
  prompt: ScaleDegreePrompt,
  degreeFocus: ScaleDegreeDegreeFocus
): boolean {
  if (degreeFocus === "mixed") {
    return true;
  }

  return prompt.targetDegree === degreeFocusToDegree(degreeFocus);
}

function matchesStringFocus(
  prompt: ScaleDegreePrompt,
  stringFocus: ScaleDegreeStringFocus
): boolean {
  return stringFocus === "all" || prompt.targetString === stringFocus;
}

function degreeFocusToDegree(
  degreeFocus: Exclude<ScaleDegreeDegreeFocus, "mixed">
): ScaleDegree {
  const degreeByFocus: Record<
    Exclude<ScaleDegreeDegreeFocus, "mixed">,
    ScaleDegree
  > = {
    root: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7
  };

  return degreeByFocus[degreeFocus];
}

function shuffleScaleDegreePrompts(
  prompts: readonly ScaleDegreePrompt[],
  random: () => number
): ScaleDegreePrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleScaleDegreePrompts(
  prompts: readonly ScaleDegreePrompt[],
  sessionLength: ScaleDegreeSessionLength
): ScaleDegreePrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toScaleDegreePrompt(prompts[index % prompts.length]!)
  );
}

function toScaleDegreePrompt(prompt: ScaleDegreePrompt): ScaleDegreePrompt {
  return {
    rootNote: prompt.rootNote,
    quality: prompt.quality,
    targetDegree: prompt.targetDegree,
    targetString: prompt.targetString
  };
}

function buildScaleDegreeStats(
  attempts: readonly ScaleDegreeAttempt[],
  category: ScaleDegreePerformanceCategory,
  getId: (attempt: ScaleDegreeAttempt) => string,
  getLabel: (attempt: ScaleDegreeAttempt) => string
): ScaleDegreePerformanceStat[] {
  const statsById = new Map<string, ScaleDegreePerformanceStat>();

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

  return [...statsById.values()].sort(compareScaleDegreeStats);
}

function compareScaleDegreeStats(
  left: ScaleDegreePerformanceStat,
  right: ScaleDegreePerformanceStat
): number {
  if (left.category === "degree" && right.category === "degree") {
    return Number(left.id) - Number(right.id);
  }

  return left.label.localeCompare(right.label);
}

function compareScaleDegreeWeakSpots(
  left: ScaleDegreePerformanceStat,
  right: ScaleDegreePerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}
