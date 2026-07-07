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

export type IntervalLandmark =
  | "minorSecond"
  | "majorSecond"
  | "minorThird"
  | "majorThird"
  | "perfectFourth"
  | "perfectFifth"
  | "minorSixth"
  | "majorSixth"
  | "minorSeventh"
  | "majorSeventh";
export type IntervalLandmarkFamilyFocus =
  | "mixed"
  | "seconds"
  | "thirds"
  | "fourths"
  | "fifths"
  | "sixths"
  | "sevenths";
export type IntervalLandmarkStringFocus = GuitarStringNumber | "all";
export type IntervalLandmarkPromptOrder = "fixed" | "random";
export type IntervalLandmarkReviewMode = "full" | "missed";
export type IntervalLandmarkSessionLength = 6 | 12 | 20;

export interface IntervalLandmarkPrompt {
  rootNote: NoteName;
  targetInterval: IntervalLandmark;
  targetString: GuitarStringNumber;
}

export interface IntervalLandmarkAttempt extends IntervalLandmarkPrompt {
  promptIndex: number;
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
  isCorrect: boolean;
}

export interface MissedIntervalLandmarkPrompt
  extends IntervalLandmarkPrompt {
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export interface IntervalLandmarkSessionSettings {
  sessionLength: IntervalLandmarkSessionLength;
  familyFocus: IntervalLandmarkFamilyFocus;
  stringFocus: IntervalLandmarkStringFocus;
  promptOrder: IntervalLandmarkPromptOrder;
  reviewMode: IntervalLandmarkReviewMode;
}

export interface IntervalLandmarkSessionPreset {
  id: string;
  label: string;
  settings: IntervalLandmarkSessionSettings;
}

export type IntervalLandmarkSummary = DrillSummary;
export type IntervalLandmarkPerformanceCategory =
  | "interval"
  | "family"
  | "root"
  | "string";

export interface IntervalLandmarkSession
  extends DrillSession<MissedIntervalLandmarkPrompt> {
  attempts: IntervalLandmarkAttempt[];
}

export interface IntervalLandmarkPerformanceStat {
  id: string;
  label: string;
  category: IntervalLandmarkPerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface IntervalLandmarkPerformanceSummary {
  attempted: number;
  intervalStats: IntervalLandmarkPerformanceStat[];
  familyStats: IntervalLandmarkPerformanceStat[];
  rootStats: IntervalLandmarkPerformanceStat[];
  stringStats: IntervalLandmarkPerformanceStat[];
  weakSpots: IntervalLandmarkPerformanceStat[];
}

export const INTERVAL_LANDMARK_PROMPTS = [
  { rootNote: "C", targetInterval: "majorThird", targetString: 5 },
  { rootNote: "G", targetInterval: "perfectFifth", targetString: 6 },
  { rootNote: "A", targetInterval: "minorThird", targetString: 4 },
  { rootNote: "E", targetInterval: "majorSecond", targetString: 3 },
  { rootNote: "D", targetInterval: "perfectFourth", targetString: 2 },
  { rootNote: "F", targetInterval: "majorSixth", targetString: 1 },
  { rootNote: "C", targetInterval: "minorSeventh", targetString: 3 },
  { rootNote: "G", targetInterval: "majorThird", targetString: 2 },
  { rootNote: "A", targetInterval: "perfectFifth", targetString: 6 },
  { rootNote: "E", targetInterval: "minorThird", targetString: 4 },
  { rootNote: "D", targetInterval: "majorSixth", targetString: 5 },
  { rootNote: "F", targetInterval: "majorSecond", targetString: 3 }
] as const satisfies readonly IntervalLandmarkPrompt[];

export const INTERVAL_LANDMARK_HISTORY_LIMIT = 5;
export const DEFAULT_INTERVAL_LANDMARK_SESSION_SETTINGS: IntervalLandmarkSessionSettings = {
  sessionLength: 12,
  familyFocus: "mixed",
  stringFocus: "all",
  promptOrder: "fixed",
  reviewMode: "full"
};
export const INTERVAL_LANDMARK_SESSION_PRESETS = [
  {
    id: "quick-warmup",
    label: "Quick warmup",
    settings: {
      sessionLength: 6,
      familyFocus: "mixed",
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
      familyFocus: "mixed",
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
      familyFocus: "thirds",
      stringFocus: "all",
      promptOrder: "random",
      reviewMode: "full"
    }
  },
  {
    id: "fifths-focus",
    label: "5ths focus",
    settings: {
      sessionLength: 12,
      familyFocus: "fifths",
      stringFocus: "all",
      promptOrder: "random",
      reviewMode: "full"
    }
  }
] as const satisfies readonly IntervalLandmarkSessionPreset[];

const chromaticNotes = [
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
] as const satisfies readonly NoteName[];

const intervalSemitones: Record<IntervalLandmark, number> = {
  minorSecond: 1,
  majorSecond: 2,
  minorThird: 3,
  majorThird: 4,
  perfectFourth: 5,
  perfectFifth: 7,
  minorSixth: 8,
  majorSixth: 9,
  minorSeventh: 10,
  majorSeventh: 11
};

export function buildIntervalLandmarkAttempt(
  promptIndex: number,
  prompt: IntervalLandmarkPrompt,
  position: FretPosition
): IntervalLandmarkAttempt {
  if (!isIntervalLandmarkAnswerPosition(position)) {
    throw new Error("Open strings are not valid interval-landmark answers.");
  }

  const targetNote = getTargetIntervalLandmarkNote(prompt);

  return {
    promptIndex,
    rootNote: prompt.rootNote,
    targetInterval: prompt.targetInterval,
    targetString: prompt.targetString,
    targetNote,
    selectedNote: position.note,
    selectedString: position.string,
    selectedFret: position.fret,
    isCorrect: isIntervalLandmarkCorrectPosition(prompt, position)
  };
}

export function summarizeIntervalLandmarkRecognition(
  attempts: IntervalLandmarkAttempt[],
  promptCount: number = INTERVAL_LANDMARK_PROMPTS.length
): IntervalLandmarkSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildIntervalLandmarkSession(
  attempts: IntervalLandmarkAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = INTERVAL_LANDMARK_PROMPTS.length
): IntervalLandmarkSession {
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "interval-landmark",
      missedPrompts: getMissedIntervalLandmarkPrompts(attempts),
      promptCount
    }),
    attempts
  };
}

export function appendIntervalLandmarkSession(
  history: IntervalLandmarkSession[],
  session: IntervalLandmarkSession,
  limit = INTERVAL_LANDMARK_HISTORY_LIMIT
): IntervalLandmarkSession[] {
  return appendDrillSession(history, session, limit);
}

export function getMissedIntervalLandmarkPrompts(
  attempts: IntervalLandmarkAttempt[]
): MissedIntervalLandmarkPrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      rootNote: attempt.rootNote,
      targetInterval: attempt.targetInterval,
      targetString: attempt.targetString,
      targetNote: attempt.targetNote,
      selectedNote: attempt.selectedNote,
      selectedString: attempt.selectedString,
      selectedFret: attempt.selectedFret
    }));
}

export function buildIntervalLandmarkPerformanceSummary(
  sessions: readonly IntervalLandmarkSession[]
): IntervalLandmarkPerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const intervalStats = buildIntervalLandmarkStats(
    attempts,
    "interval",
    (attempt) => attempt.targetInterval,
    (attempt) => getIntervalLandmarkPluralName(attempt.targetInterval)
  );
  const familyStats = buildIntervalLandmarkStats(
    attempts,
    "family",
    (attempt) => getIntervalLandmarkFamily(attempt.targetInterval),
    (attempt) => `${getIntervalLandmarkFamilyName(attempt.targetInterval)}`
  );
  const rootStats = buildIntervalLandmarkStats(
    attempts,
    "root",
    (attempt) => attempt.rootNote,
    (attempt) => `${attempt.rootNote} roots`
  );
  const stringStats = buildIntervalLandmarkStats(
    attempts,
    "string",
    (attempt) => String(attempt.targetString),
    (attempt) => `String ${attempt.targetString}`
  );

  return {
    attempted: attempts.length,
    intervalStats,
    familyStats,
    rootStats,
    stringStats,
    weakSpots: [...intervalStats, ...familyStats, ...rootStats, ...stringStats]
      .filter((stat) => stat.missed > 0)
      .sort(compareIntervalLandmarkWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentIntervalLandmarkPrompt(
  promptIndex: number,
  prompts: readonly IntervalLandmarkPrompt[] = INTERVAL_LANDMARK_PROMPTS
): IntervalLandmarkPrompt {
  return getCurrentDrillPrompt(
    promptIndex,
    prompts
  ) as IntervalLandmarkPrompt;
}

export function buildIntervalLandmarkPromptSession(
  settings: IntervalLandmarkSessionSettings = DEFAULT_INTERVAL_LANDMARK_SESSION_SETTINGS,
  missedPrompts: readonly MissedIntervalLandmarkPrompt[] = [],
  random: () => number = Math.random
): IntervalLandmarkPrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : INTERVAL_LANDMARK_PROMPTS;
  const filteredPrompts = filterIntervalLandmarkPrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0
      ? filteredPrompts
      : [...INTERVAL_LANDMARK_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleIntervalLandmarkPrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleIntervalLandmarkPrompts(orderedPrompts, settings.sessionLength);
}

export function getTargetIntervalLandmarkNote(
  prompt: IntervalLandmarkPrompt
): NoteName {
  const targetPitchClass =
    (getPitchClass(prompt.rootNote) +
      intervalSemitones[prompt.targetInterval]) %
    12;

  return chromaticNotes[targetPitchClass] as NoteName;
}

export function isIntervalLandmarkAnswerPosition(
  position: Pick<FretPosition, "fret">
): boolean {
  return position.fret > 0;
}

export function isIntervalLandmarkCorrectPosition(
  prompt: IntervalLandmarkPrompt,
  position: FretPosition
): boolean {
  return (
    isIntervalLandmarkAnswerPosition(position) &&
    position.string === prompt.targetString &&
    getPitchClass(position.note) ===
      getPitchClass(getTargetIntervalLandmarkNote(prompt))
  );
}

export function getIntervalLandmarkName(
  interval: IntervalLandmark
): string {
  const names: Record<IntervalLandmark, string> = {
    minorSecond: "minor 2nd",
    majorSecond: "major 2nd",
    minorThird: "minor 3rd",
    majorThird: "major 3rd",
    perfectFourth: "perfect 4th",
    perfectFifth: "perfect 5th",
    minorSixth: "minor 6th",
    majorSixth: "major 6th",
    minorSeventh: "minor 7th",
    majorSeventh: "major 7th"
  };

  return names[interval];
}

function filterIntervalLandmarkPrompts(
  prompts: readonly IntervalLandmarkPrompt[],
  settings: IntervalLandmarkSessionSettings
): IntervalLandmarkPrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesFamilyFocus(prompt, settings.familyFocus) &&
      matchesStringFocus(prompt, settings.stringFocus)
  );
}

function matchesFamilyFocus(
  prompt: IntervalLandmarkPrompt,
  familyFocus: IntervalLandmarkFamilyFocus
): boolean {
  if (familyFocus === "mixed") {
    return true;
  }

  return getIntervalLandmarkFamily(prompt.targetInterval) === familyFocus;
}

function matchesStringFocus(
  prompt: IntervalLandmarkPrompt,
  stringFocus: IntervalLandmarkStringFocus
): boolean {
  return stringFocus === "all" || prompt.targetString === stringFocus;
}

function shuffleIntervalLandmarkPrompts(
  prompts: readonly IntervalLandmarkPrompt[],
  random: () => number
): IntervalLandmarkPrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleIntervalLandmarkPrompts(
  prompts: readonly IntervalLandmarkPrompt[],
  sessionLength: IntervalLandmarkSessionLength
): IntervalLandmarkPrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toIntervalLandmarkPrompt(prompts[index % prompts.length]!)
  );
}

function toIntervalLandmarkPrompt(
  prompt: IntervalLandmarkPrompt
): IntervalLandmarkPrompt {
  return {
    rootNote: prompt.rootNote,
    targetInterval: prompt.targetInterval,
    targetString: prompt.targetString
  };
}

function buildIntervalLandmarkStats(
  attempts: readonly IntervalLandmarkAttempt[],
  category: IntervalLandmarkPerformanceCategory,
  getId: (attempt: IntervalLandmarkAttempt) => string,
  getLabel: (attempt: IntervalLandmarkAttempt) => string
): IntervalLandmarkPerformanceStat[] {
  const statsById = new Map<string, IntervalLandmarkPerformanceStat>();

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

  return [...statsById.values()].sort(compareIntervalLandmarkStats);
}

function compareIntervalLandmarkStats(
  left: IntervalLandmarkPerformanceStat,
  right: IntervalLandmarkPerformanceStat
): number {
  return left.label.localeCompare(right.label);
}

function compareIntervalLandmarkWeakSpots(
  left: IntervalLandmarkPerformanceStat,
  right: IntervalLandmarkPerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}

function getIntervalLandmarkFamily(
  interval: IntervalLandmark
): IntervalLandmarkFamilyFocus {
  if (interval === "minorSecond" || interval === "majorSecond") {
    return "seconds";
  }

  if (interval === "minorThird" || interval === "majorThird") {
    return "thirds";
  }

  if (interval === "perfectFourth") {
    return "fourths";
  }

  if (interval === "perfectFifth") {
    return "fifths";
  }

  if (interval === "minorSixth" || interval === "majorSixth") {
    return "sixths";
  }

  return "sevenths";
}

function getIntervalLandmarkPluralName(interval: IntervalLandmark): string {
  const names: Record<IntervalLandmark, string> = {
    minorSecond: "Minor 2nds",
    majorSecond: "Major 2nds",
    minorThird: "Minor 3rds",
    majorThird: "Major 3rds",
    perfectFourth: "Perfect 4ths",
    perfectFifth: "Perfect 5ths",
    minorSixth: "Minor 6ths",
    majorSixth: "Major 6ths",
    minorSeventh: "Minor 7ths",
    majorSeventh: "Major 7ths"
  };

  return names[interval];
}

function getIntervalLandmarkFamilyName(interval: IntervalLandmark): string {
  const family = getIntervalLandmarkFamily(interval);

  if (family === "mixed") {
    return "Mixed intervals";
  }

  return `${family[0]!.toUpperCase()}${family.slice(1)}`;
}
