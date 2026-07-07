import {
  getNoteAtFret,
  type FretPosition,
  type GuitarStringNumber
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

export type OctaveShape = "C" | "A" | "G" | "E" | "D";
export type OctaveShapeFocus = OctaveShape | "mixed";
export type OctaveShapeStringFocus = GuitarStringNumber | "all";
export type OctaveShapePromptOrder = "fixed" | "random";
export type OctaveShapeReviewMode = "full" | "missed";
export type OctaveShapeSessionLength = 6 | 10 | 20;

export interface OctaveShapePrompt {
  shape: OctaveShape;
  sourceNote: NoteName;
  sourceString: GuitarStringNumber;
  sourceFret: number;
  targetString: GuitarStringNumber;
  targetFret: number;
}

export interface OctaveShapeAttempt extends OctaveShapePrompt {
  promptIndex: number;
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
  isCorrect: boolean;
}

export interface MissedOctaveShapePrompt extends OctaveShapePrompt {
  targetNote: NoteName;
  selectedNote: NoteName;
  selectedString: GuitarStringNumber;
  selectedFret: number;
}

export interface OctaveShapeSessionSettings {
  sessionLength: OctaveShapeSessionLength;
  shapeFocus: OctaveShapeFocus;
  stringFocus: OctaveShapeStringFocus;
  promptOrder: OctaveShapePromptOrder;
  reviewMode: OctaveShapeReviewMode;
}

export interface OctaveShapeSessionPreset {
  id: string;
  label: string;
  settings: OctaveShapeSessionSettings;
}

export type OctaveShapeSummary = DrillSummary;
export type OctaveShapePerformanceCategory =
  | "shape"
  | "note"
  | "sourceString"
  | "targetString";

export interface OctaveShapeSession
  extends DrillSession<MissedOctaveShapePrompt> {
  attempts: OctaveShapeAttempt[];
}

export interface OctaveShapePerformanceStat {
  id: string;
  label: string;
  category: OctaveShapePerformanceCategory;
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
}

export interface OctaveShapePerformanceSummary {
  attempted: number;
  shapeStats: OctaveShapePerformanceStat[];
  noteStats: OctaveShapePerformanceStat[];
  sourceStringStats: OctaveShapePerformanceStat[];
  targetStringStats: OctaveShapePerformanceStat[];
  weakSpots: OctaveShapePerformanceStat[];
}

export const OCTAVE_SHAPE_PROMPTS = [
  {
    shape: "C",
    sourceNote: "C",
    sourceString: 5,
    sourceFret: 3,
    targetString: 2,
    targetFret: 1
  },
  {
    shape: "A",
    sourceNote: "D",
    sourceString: 5,
    sourceFret: 5,
    targetString: 3,
    targetFret: 7
  },
  {
    shape: "G",
    sourceNote: "G",
    sourceString: 6,
    sourceFret: 3,
    targetString: 1,
    targetFret: 3
  },
  {
    shape: "E",
    sourceNote: "A",
    sourceString: 6,
    sourceFret: 5,
    targetString: 4,
    targetFret: 7
  },
  {
    shape: "D",
    sourceNote: "G",
    sourceString: 4,
    sourceFret: 5,
    targetString: 2,
    targetFret: 8
  },
  {
    shape: "C",
    sourceNote: "D",
    sourceString: 5,
    sourceFret: 5,
    targetString: 2,
    targetFret: 3
  },
  {
    shape: "A",
    sourceNote: "E",
    sourceString: 5,
    sourceFret: 7,
    targetString: 3,
    targetFret: 9
  },
  {
    shape: "G",
    sourceNote: "A",
    sourceString: 6,
    sourceFret: 5,
    targetString: 1,
    targetFret: 5
  },
  {
    shape: "E",
    sourceNote: "G",
    sourceString: 6,
    sourceFret: 3,
    targetString: 4,
    targetFret: 5
  },
  {
    shape: "D",
    sourceNote: "A",
    sourceString: 4,
    sourceFret: 7,
    targetString: 2,
    targetFret: 10
  }
] as const satisfies readonly OctaveShapePrompt[];

export const OCTAVE_SHAPE_HISTORY_LIMIT = 5;
export const DEFAULT_OCTAVE_SHAPE_SESSION_SETTINGS: OctaveShapeSessionSettings = {
  sessionLength: 10,
  shapeFocus: "mixed",
  stringFocus: "all",
  promptOrder: "fixed",
  reviewMode: "full"
};
export const OCTAVE_SHAPE_SESSION_PRESETS = [
  {
    id: "quick-warmup",
    label: "Quick warmup",
    settings: {
      sessionLength: 6,
      shapeFocus: "mixed",
      stringFocus: "all",
      promptOrder: "fixed",
      reviewMode: "full"
    }
  },
  {
    id: "weak-spots",
    label: "Weak spots",
    settings: {
      sessionLength: 10,
      shapeFocus: "mixed",
      stringFocus: "all",
      promptOrder: "random",
      reviewMode: "missed"
    }
  },
  {
    id: "low-string-shapes",
    label: "Low-string shapes",
    settings: {
      sessionLength: 10,
      shapeFocus: "E",
      stringFocus: 6,
      promptOrder: "random",
      reviewMode: "full"
    }
  },
  {
    id: "a-shape-focus",
    label: "A-shape focus",
    settings: {
      sessionLength: 10,
      shapeFocus: "A",
      stringFocus: 5,
      promptOrder: "random",
      reviewMode: "full"
    }
  }
] as const satisfies readonly OctaveShapeSessionPreset[];

export function buildOctaveShapeAttempt(
  promptIndex: number,
  prompt: OctaveShapePrompt,
  position: FretPosition
): OctaveShapeAttempt {
  if (!isOctaveShapeAnswerPosition(position)) {
    throw new Error("Open strings are not valid octave-shape answers.");
  }

  const targetNote = getTargetOctaveShapeNote(prompt);

  return {
    promptIndex,
    shape: prompt.shape,
    sourceNote: prompt.sourceNote,
    sourceString: prompt.sourceString,
    sourceFret: prompt.sourceFret,
    targetString: prompt.targetString,
    targetFret: prompt.targetFret,
    targetNote,
    selectedNote: position.note,
    selectedString: position.string,
    selectedFret: position.fret,
    isCorrect: isOctaveShapeCorrectPosition(prompt, position)
  };
}

export function summarizeOctaveShapeRecognition(
  attempts: OctaveShapeAttempt[],
  promptCount: number = OCTAVE_SHAPE_PROMPTS.length
): OctaveShapeSummary {
  return summarizeDrill(attempts, promptCount);
}

export function buildOctaveShapeSession(
  attempts: OctaveShapeAttempt[],
  completedAt = new Date().toISOString(),
  promptCount: number = OCTAVE_SHAPE_PROMPTS.length
): OctaveShapeSession {
  return {
    ...buildDrillSession({
      attempts,
      completedAt,
      idPrefix: "octave-shape",
      missedPrompts: getMissedOctaveShapePrompts(attempts),
      promptCount
    }),
    attempts
  };
}

export function appendOctaveShapeSession(
  history: OctaveShapeSession[],
  session: OctaveShapeSession,
  limit = OCTAVE_SHAPE_HISTORY_LIMIT
): OctaveShapeSession[] {
  return appendDrillSession(history, session, limit);
}

export function getMissedOctaveShapePrompts(
  attempts: OctaveShapeAttempt[]
): MissedOctaveShapePrompt[] {
  return attempts
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => ({
      shape: attempt.shape,
      sourceNote: attempt.sourceNote,
      sourceString: attempt.sourceString,
      sourceFret: attempt.sourceFret,
      targetString: attempt.targetString,
      targetFret: attempt.targetFret,
      targetNote: attempt.targetNote,
      selectedNote: attempt.selectedNote,
      selectedString: attempt.selectedString,
      selectedFret: attempt.selectedFret
    }));
}

export function buildOctaveShapePerformanceSummary(
  sessions: readonly OctaveShapeSession[]
): OctaveShapePerformanceSummary {
  const attempts = sessions.flatMap((session) => session.attempts ?? []);
  const shapeStats = buildOctaveShapeStats(
    attempts,
    "shape",
    (attempt) => attempt.shape,
    (attempt) => `${attempt.shape}-shape octaves`
  );
  const noteStats = buildOctaveShapeStats(
    attempts,
    "note",
    (attempt) => attempt.sourceNote,
    (attempt) => `${attempt.sourceNote} octaves`
  );
  const sourceStringStats = buildOctaveShapeStats(
    attempts,
    "sourceString",
    (attempt) => String(attempt.sourceString),
    (attempt) => `Source string ${attempt.sourceString}`
  );
  const targetStringStats = buildOctaveShapeStats(
    attempts,
    "targetString",
    (attempt) => String(attempt.targetString),
    (attempt) => `Target string ${attempt.targetString}`
  );

  return {
    attempted: attempts.length,
    shapeStats,
    noteStats,
    sourceStringStats,
    targetStringStats,
    weakSpots: [
      ...shapeStats,
      ...noteStats,
      ...sourceStringStats,
      ...targetStringStats
    ]
      .filter((stat) => stat.missed > 0)
      .sort(compareOctaveShapeWeakSpots)
      .slice(0, 3)
  };
}

export function getCurrentOctaveShapePrompt(
  promptIndex: number,
  prompts: readonly OctaveShapePrompt[] = OCTAVE_SHAPE_PROMPTS
): OctaveShapePrompt {
  return getCurrentDrillPrompt(promptIndex, prompts) as OctaveShapePrompt;
}

export function buildOctaveShapePromptSession(
  settings: OctaveShapeSessionSettings = DEFAULT_OCTAVE_SHAPE_SESSION_SETTINGS,
  missedPrompts: readonly MissedOctaveShapePrompt[] = [],
  random: () => number = Math.random
): OctaveShapePrompt[] {
  const reviewPrompts =
    settings.reviewMode === "missed" && missedPrompts.length > 0
      ? missedPrompts
      : OCTAVE_SHAPE_PROMPTS;
  const filteredPrompts = filterOctaveShapePrompts(reviewPrompts, settings);
  const sourcePrompts =
    filteredPrompts.length > 0 ? filteredPrompts : [...OCTAVE_SHAPE_PROMPTS];
  const orderedPrompts =
    settings.promptOrder === "random"
      ? shuffleOctaveShapePrompts(sourcePrompts, random)
      : sourcePrompts;

  return cycleOctaveShapePrompts(orderedPrompts, settings.sessionLength);
}

export function getSourceOctaveShapePosition(
  prompt: OctaveShapePrompt
): FretPosition {
  return getNoteAtFret(prompt.sourceString, prompt.sourceFret);
}

export function getTargetOctaveShapePosition(
  prompt: OctaveShapePrompt
): FretPosition {
  return getNoteAtFret(prompt.targetString, prompt.targetFret);
}

export function getTargetOctaveShapeNote(
  prompt: OctaveShapePrompt
): NoteName {
  return getTargetOctaveShapePosition(prompt).note;
}

export function isOctaveShapeAnswerPosition(
  position: Pick<FretPosition, "fret">
): boolean {
  return position.fret > 0;
}

export function isOctaveShapeCorrectPosition(
  prompt: OctaveShapePrompt,
  position: FretPosition
): boolean {
  return (
    isOctaveShapeAnswerPosition(position) &&
    position.string === prompt.targetString &&
    position.fret === prompt.targetFret &&
    getPitchClass(position.note) === getPitchClass(getTargetOctaveShapeNote(prompt))
  );
}

export function getOctaveShapeName(shape: OctaveShape): string {
  return `${shape}-shape`;
}

function filterOctaveShapePrompts(
  prompts: readonly OctaveShapePrompt[],
  settings: OctaveShapeSessionSettings
): OctaveShapePrompt[] {
  return prompts.filter(
    (prompt) =>
      matchesShapeFocus(prompt, settings.shapeFocus) &&
      matchesStringFocus(prompt, settings.stringFocus)
  );
}

function matchesShapeFocus(
  prompt: OctaveShapePrompt,
  shapeFocus: OctaveShapeFocus
): boolean {
  return shapeFocus === "mixed" || prompt.shape === shapeFocus;
}

function matchesStringFocus(
  prompt: OctaveShapePrompt,
  stringFocus: OctaveShapeStringFocus
): boolean {
  return stringFocus === "all" || prompt.sourceString === stringFocus;
}

function shuffleOctaveShapePrompts(
  prompts: readonly OctaveShapePrompt[],
  random: () => number
): OctaveShapePrompt[] {
  const shuffledPrompts = [...prompts];

  for (let index = shuffledPrompts.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const prompt = shuffledPrompts[index]!;

    shuffledPrompts[index] = shuffledPrompts[swapIndex]!;
    shuffledPrompts[swapIndex] = prompt;
  }

  return shuffledPrompts;
}

function cycleOctaveShapePrompts(
  prompts: readonly OctaveShapePrompt[],
  sessionLength: OctaveShapeSessionLength
): OctaveShapePrompt[] {
  return Array.from(
    { length: sessionLength },
    (_, index) => toOctaveShapePrompt(prompts[index % prompts.length]!)
  );
}

function toOctaveShapePrompt(prompt: OctaveShapePrompt): OctaveShapePrompt {
  return {
    shape: prompt.shape,
    sourceNote: prompt.sourceNote,
    sourceString: prompt.sourceString,
    sourceFret: prompt.sourceFret,
    targetString: prompt.targetString,
    targetFret: prompt.targetFret
  };
}

function buildOctaveShapeStats(
  attempts: readonly OctaveShapeAttempt[],
  category: OctaveShapePerformanceCategory,
  getId: (attempt: OctaveShapeAttempt) => string,
  getLabel: (attempt: OctaveShapeAttempt) => string
): OctaveShapePerformanceStat[] {
  const statsById = new Map<string, OctaveShapePerformanceStat>();

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

  return [...statsById.values()].sort(compareOctaveShapeStats);
}

function compareOctaveShapeStats(
  left: OctaveShapePerformanceStat,
  right: OctaveShapePerformanceStat
): number {
  return left.label.localeCompare(right.label);
}

function compareOctaveShapeWeakSpots(
  left: OctaveShapePerformanceStat,
  right: OctaveShapePerformanceStat
): number {
  return (
    left.accuracy - right.accuracy ||
    right.missed - left.missed ||
    right.attempted - left.attempted ||
    left.label.localeCompare(right.label)
  );
}
