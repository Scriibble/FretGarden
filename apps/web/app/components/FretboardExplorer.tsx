"use client";

import {
  findNotesOnFretboard,
  getFretboard,
  mapChordToFretboard,
  mapScaleToFretboard,
  type FretPosition,
  type GuitarStringNumber
} from "@pocket-practice/fretboard-engine";
import type {
  NoteName,
  ScaleQuality,
  TriadQuality
} from "@pocket-practice/music-theory-engine";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AppNavigation } from "./AppNavigation";
import { PracticeHub } from "./PracticeHub";
import { PracticePromptPanel } from "./PracticePromptPanel";
import {
  PracticeReviewPanel,
  type LessonReviewOutcome,
  type PracticeReviewItem,
  type PracticeReviewMetric,
  type PracticeReviewSection
} from "./PracticeReviewPanel";
import { PracticeSessionSettings } from "./PracticeSessionSettings";
import {
  getLesson,
  getNextLesson,
  lessons,
  type Lesson,
  type LessonPracticeDrill
} from "../lib/lessons";
import {
  readStoredLessonLearningProgress,
  readStoredLessonProgress,
  writeStoredLessonProgress,
  writeStoredPreset,
} from "../lib/browserStorage";
import { completePracticeSession } from "../lib/practiceSessionCompletion";
import {
  CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY,
  CHORD_TONE_HISTORY_STORAGE_KEY,
  INTERVAL_LANDMARK_CUSTOM_PRESET_STORAGE_KEY,
  INTERVAL_LANDMARK_HISTORY_STORAGE_KEY,
  NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY,
  NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
  OCTAVE_SHAPE_CUSTOM_PRESET_STORAGE_KEY,
  OCTAVE_SHAPE_HISTORY_STORAGE_KEY,
  SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY,
  SCALE_DEGREE_HISTORY_STORAGE_KEY,
  TRIAD_INVERSION_CUSTOM_PRESET_STORAGE_KEY,
  TRIAD_INVERSION_HISTORY_STORAGE_KEY,
  readStoredPracticeData
} from "../lib/practiceStorage";
import {
  doesLessonPracticeMeetCriteria,
  markLessonPracticed,
  markLessonStarted,
  type LessonProgressRecord
} from "../lib/lessonProgress";
import {
  buildLearningCourseProgress,
  type LessonLearningProgressRecord
} from "../lib/lessonLearningProgress";
import { formatSessionDate } from "../lib/practiceHistory";
import {
  CHORD_TONE_SESSION_PRESETS,
  DEFAULT_CHORD_TONE_SESSION_SETTINGS,
  appendChordToneSession,
  buildChordToneAttempt,
  buildChordTonePerformanceSummary,
  buildChordTonePromptSession,
  buildChordToneSession,
  getChordToneAnswerOptions,
  getCurrentChordTonePrompt,
  getMissedChordTonePrompts,
  getTargetChordToneNote,
  summarizeChordToneRecognition,
  type ChordTone,
  type ChordToneAttempt,
  type MissedChordTonePrompt,
  type ChordTonePrompt,
  type ChordTonePerformanceStat,
  type ChordToneSession,
  type ChordToneSessionPreset,
  type ChordToneSessionSettings,
  type ChordToneSummary
} from "../lib/chordToneRecognition";
import {
  DEFAULT_INTERVAL_LANDMARK_SESSION_SETTINGS,
  INTERVAL_LANDMARK_SESSION_PRESETS,
  appendIntervalLandmarkSession,
  buildIntervalLandmarkAttempt,
  buildIntervalLandmarkPerformanceSummary,
  buildIntervalLandmarkPromptSession,
  buildIntervalLandmarkSession,
  getCurrentIntervalLandmarkPrompt,
  getIntervalLandmarkName,
  getMissedIntervalLandmarkPrompts,
  getTargetIntervalLandmarkNote,
  isIntervalLandmarkAnswerPosition,
  isIntervalLandmarkCorrectPosition,
  summarizeIntervalLandmarkRecognition,
  type IntervalLandmarkAttempt,
  type IntervalLandmarkPerformanceStat,
  type IntervalLandmarkPrompt,
  type IntervalLandmarkSession,
  type IntervalLandmarkSessionPreset,
  type IntervalLandmarkSessionSettings,
  type IntervalLandmarkSummary,
  type MissedIntervalLandmarkPrompt
} from "../lib/intervalLandmarkRecognition";
import {
  DEFAULT_NOTE_RECOGNITION_SESSION_SETTINGS,
  NOTE_RECOGNITION_SESSION_PRESETS,
  appendNoteRecognitionSession,
  buildNoteRecognitionPerformanceSummary,
  buildNoteRecognitionPromptSession,
  buildNoteRecognitionSession,
  buildNoteRecognitionAttempt,
  getCurrentPrompt,
  getMissedNoteRecognitionPrompts,
  isNoteRecognitionAnswerPosition,
  isNoteRecognitionCorrectPosition,
  summarizeNoteRecognition,
  type NoteRecognitionAttempt,
  type MissedNoteRecognitionPrompt,
  type NoteRecognitionPerformanceStat,
  type NoteRecognitionPrompt,
  type NoteRecognitionSession,
  type NoteRecognitionSessionPreset,
  type NoteRecognitionSessionSettings,
  type NoteRecognitionSummary
} from "../lib/noteRecognition";
import {
  DEFAULT_OCTAVE_SHAPE_SESSION_SETTINGS,
  OCTAVE_SHAPE_SESSION_PRESETS,
  appendOctaveShapeSession,
  buildOctaveShapeAttempt,
  buildOctaveShapePerformanceSummary,
  buildOctaveShapePromptSession,
  buildOctaveShapeSession,
  getCurrentOctaveShapePrompt,
  getMissedOctaveShapePrompts,
  getOctaveShapeName,
  getSourceOctaveShapePosition,
  getTargetOctaveShapeNote,
  getTargetOctaveShapePosition,
  isOctaveShapeAnswerPosition,
  isOctaveShapeCorrectPosition,
  summarizeOctaveShapeRecognition,
  type MissedOctaveShapePrompt,
  type OctaveShapeAttempt,
  type OctaveShapePerformanceStat,
  type OctaveShapePrompt,
  type OctaveShapeSession,
  type OctaveShapeSessionPreset,
  type OctaveShapeSessionSettings,
  type OctaveShapeSummary
} from "../lib/octaveShapeRecognition";
import {
  DEFAULT_SCALE_DEGREE_SESSION_SETTINGS,
  SCALE_DEGREE_SESSION_PRESETS,
  appendScaleDegreeSession,
  buildScaleDegreeAttempt,
  buildScaleDegreePerformanceSummary,
  buildScaleDegreePromptSession,
  buildScaleDegreeSession,
  getCurrentScaleDegreePrompt,
  getMissedScaleDegreePrompts,
  getScaleDegreeName,
  getTargetScaleDegreeNote,
  isScaleDegreeAnswerPosition,
  isScaleDegreeCorrectPosition,
  summarizeScaleDegreeRecognition,
  type MissedScaleDegreePrompt,
  type ScaleDegree,
  type ScaleDegreeAttempt,
  type ScaleDegreePerformanceStat,
  type ScaleDegreePrompt,
  type ScaleDegreeSession,
  type ScaleDegreeSessionPreset,
  type ScaleDegreeSessionSettings,
  type ScaleDegreeSummary
} from "../lib/scaleDegreeRecognition";
import {
  DEFAULT_TRIAD_INVERSION_SESSION_SETTINGS,
  TRIAD_INVERSION_SESSION_PRESETS,
  appendTriadInversionSession,
  buildTriadInversionAttempt,
  buildTriadInversionPerformanceSummary,
  buildTriadInversionPromptSession,
  buildTriadInversionSession,
  getCurrentTriadInversionPrompt,
  getMissedTriadInversionPrompts,
  getTriadInversionAnswerOptions,
  getTriadInversionBassNote,
  getTriadInversionBassToneName,
  getTriadInversionName,
  summarizeTriadInversionRecognition,
  type MissedTriadInversionPrompt,
  type TriadInversionAttempt,
  type TriadInversionPerformanceStat,
  type TriadInversionPrompt,
  type TriadInversionSession,
  type TriadInversionSessionPreset,
  type TriadInversionSessionSettings,
  type TriadInversionSummary
} from "../lib/triadInversionRecognition";

type DisplayMode = "practice" | "notes" | "find" | "scale" | "chord";
type PracticeDrill =
  | "note"
  | "chordTone"
  | "scaleDegree"
  | "interval"
  | "octaveShape"
  | "triadInversion";
type PracticeDrillActions<Action> = Record<PracticeDrill, Action>;
type ActiveVariant = "note" | "root" | "scale" | "chord" | "answer" | "miss";
type PerformanceStat =
  | ChordTonePerformanceStat
  | IntervalLandmarkPerformanceStat
  | NoteRecognitionPerformanceStat
  | OctaveShapePerformanceStat
  | ScaleDegreePerformanceStat
  | TriadInversionPerformanceStat;
type PracticePreset =
  | ChordToneSessionPreset
  | IntervalLandmarkSessionPreset
  | NoteRecognitionSessionPreset
  | OctaveShapeSessionPreset
  | ScaleDegreeSessionPreset
  | TriadInversionSessionPreset;

interface PracticeHubRecommendation {
  drill: PracticeDrill;
  title: string;
  description: string;
  preset: PracticePreset;
}

interface ActivePosition {
  label: string;
  variant: ActiveVariant;
  descriptor: string;
}

interface ModeSummary {
  title: string;
  description: string;
  badge: string;
  tones: string[];
}

interface FretboardExplorerProps {
  experience?: "practice" | "explore";
}

interface PracticeReviewContent {
  metrics: PracticeReviewMetric[];
  missedPrompts: PracticeReviewItem[];
  weakSpots: PracticeReviewItem[];
  breakdowns: PracticeReviewSection[];
}

function getPracticeDrillAction<Action>(
  practiceDrill: PracticeDrill,
  actions: PracticeDrillActions<Action>
): Action {
  return actions[practiceDrill];
}

const fretboard = getFretboard({ frets: 12 });
const frets = Array.from({ length: fretboard.frets + 1 }, (_, fret) => fret);
const displayStrings = [...fretboard.strings].sort(
  (left, right) => left.string - right.string
);
const positionsByKey = new Map(
  fretboard.positions.map((position) => [positionKey(position), position])
);
const stringDisplayNames: Record<GuitarStringNumber, string> = {
  1: "high E",
  2: "B",
  3: "G",
  4: "D",
  5: "A",
  6: "low E"
};

const notes = [
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

const modes: Array<{ id: DisplayMode; label: string }> = [
  { id: "practice", label: "Practice" },
  { id: "notes", label: "All notes" },
  { id: "find", label: "Find note" },
  { id: "scale", label: "Scale" },
  { id: "chord", label: "Chord" }
];

export function FretboardExplorer({
  experience = "practice"
}: FretboardExplorerProps) {
  const isPracticeExperience = experience === "practice";
  const [mode, setMode] = useState<DisplayMode>(
    isPracticeExperience ? "practice" : "notes"
  );
  const [practiceDrill, setPracticeDrill] = useState<PracticeDrill>("note");
  const [rootNote, setRootNote] = useState<NoteName>("C");
  const [scaleQuality, setScaleQuality] = useState<ScaleQuality>("major");
  const [chordQuality, setChordQuality] = useState<TriadQuality>("major");
  const [promptIndex, setPromptIndex] = useState(0);
  const [attempts, setAttempts] = useState<NoteRecognitionAttempt[]>([]);
  const [noteSessionSettings, setNoteSessionSettings] =
    useState<NoteRecognitionSessionSettings>(
      DEFAULT_NOTE_RECOGNITION_SESSION_SETTINGS
    );
  const [noteSessionNonce, setNoteSessionNonce] = useState(0);
  const [customNotePreset, setCustomNotePreset] =
    useState<NoteRecognitionSessionPreset | null>(null);
  const [chordPromptIndex, setChordPromptIndex] = useState(0);
  const [chordAttempts, setChordAttempts] = useState<ChordToneAttempt[]>([]);
  const [chordSessionSettings, setChordSessionSettings] =
    useState<ChordToneSessionSettings>(DEFAULT_CHORD_TONE_SESSION_SETTINGS);
  const [chordSessionNonce, setChordSessionNonce] = useState(0);
  const [customChordPreset, setCustomChordPreset] =
    useState<ChordToneSessionPreset | null>(null);
  const [scalePromptIndex, setScalePromptIndex] = useState(0);
  const [scaleAttempts, setScaleAttempts] = useState<ScaleDegreeAttempt[]>([]);
  const [scaleDegreeSessionSettings, setScaleDegreeSessionSettings] =
    useState<ScaleDegreeSessionSettings>(
      DEFAULT_SCALE_DEGREE_SESSION_SETTINGS
    );
  const [scaleDegreeSessionNonce, setScaleDegreeSessionNonce] = useState(0);
  const [customScaleDegreePreset, setCustomScaleDegreePreset] =
    useState<ScaleDegreeSessionPreset | null>(null);
  const [intervalPromptIndex, setIntervalPromptIndex] = useState(0);
  const [intervalAttempts, setIntervalAttempts] = useState<
    IntervalLandmarkAttempt[]
  >([]);
  const [intervalSessionSettings, setIntervalSessionSettings] =
    useState<IntervalLandmarkSessionSettings>(
      DEFAULT_INTERVAL_LANDMARK_SESSION_SETTINGS
    );
  const [intervalSessionNonce, setIntervalSessionNonce] = useState(0);
  const [customIntervalPreset, setCustomIntervalPreset] =
    useState<IntervalLandmarkSessionPreset | null>(null);
  const [octavePromptIndex, setOctavePromptIndex] = useState(0);
  const [octaveAttempts, setOctaveAttempts] = useState<OctaveShapeAttempt[]>(
    []
  );
  const [octaveSessionSettings, setOctaveSessionSettings] =
    useState<OctaveShapeSessionSettings>(
      DEFAULT_OCTAVE_SHAPE_SESSION_SETTINGS
    );
  const [octaveSessionNonce, setOctaveSessionNonce] = useState(0);
  const [customOctavePreset, setCustomOctavePreset] =
    useState<OctaveShapeSessionPreset | null>(null);
  const [triadInversionPromptIndex, setTriadInversionPromptIndex] = useState(0);
  const [triadInversionAttempts, setTriadInversionAttempts] = useState<
    TriadInversionAttempt[]
  >([]);
  const [triadInversionSessionSettings, setTriadInversionSessionSettings] =
    useState<TriadInversionSessionSettings>(
      DEFAULT_TRIAD_INVERSION_SESSION_SETTINGS
    );
  const [triadInversionSessionNonce, setTriadInversionSessionNonce] =
    useState(0);
  const [customTriadInversionPreset, setCustomTriadInversionPreset] =
    useState<TriadInversionSessionPreset | null>(null);
  const [completedSession, setCompletedSession] =
    useState<NoteRecognitionSession | null>(null);
  const [completedChordSession, setCompletedChordSession] =
    useState<ChordToneSession | null>(null);
  const [completedScaleDegreeSession, setCompletedScaleDegreeSession] =
    useState<ScaleDegreeSession | null>(null);
  const [completedIntervalSession, setCompletedIntervalSession] =
    useState<IntervalLandmarkSession | null>(null);
  const [completedOctaveSession, setCompletedOctaveSession] =
    useState<OctaveShapeSession | null>(null);
  const [completedTriadInversionSession, setCompletedTriadInversionSession] =
    useState<TriadInversionSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<
    NoteRecognitionSession[]
  >([]);
  const [chordSessionHistory, setChordSessionHistory] = useState<
    ChordToneSession[]
  >([]);
  const [scaleDegreeSessionHistory, setScaleDegreeSessionHistory] = useState<
    ScaleDegreeSession[]
  >([]);
  const [intervalSessionHistory, setIntervalSessionHistory] = useState<
    IntervalLandmarkSession[]
  >([]);
  const [octaveSessionHistory, setOctaveSessionHistory] = useState<
    OctaveShapeSession[]
  >([]);
  const [triadInversionSessionHistory, setTriadInversionSessionHistory] =
    useState<TriadInversionSession[]>([]);
  const [lessonProgressRecords, setLessonProgressRecords] = useState<
    LessonProgressRecord[]
  >([]);
  const [lessonLearningProgressRecords, setLessonLearningProgressRecords] =
    useState<LessonLearningProgressRecord[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<FretPosition | null>(
    null
  );
  const [activeLessonSlug, setActiveLessonSlug] = useState<string | null>(null);
  const practiceLayoutRef = useRef<HTMLElement | null>(null);

  const notePerformanceSessions = useMemo(() => {
    if (completedSession === null) {
      return sessionHistory;
    }

    return [
      completedSession,
      ...sessionHistory.filter((session) => session.id !== completedSession.id)
    ];
  }, [sessionHistory, completedSession]);
  const notePerformance = useMemo(
    () => buildNoteRecognitionPerformanceSummary(notePerformanceSessions),
    [notePerformanceSessions]
  );
  const noteReviewPrompts = useMemo(
    () => collectNoteReviewPrompts(notePerformanceSessions),
    [notePerformanceSessions]
  );
  const notePromptQueue = useMemo(
    () =>
      buildNoteRecognitionPromptSession(
        noteSessionSettings,
        noteReviewPrompts
      ),
    [noteSessionSettings, noteSessionNonce, noteReviewPrompts]
  );
  const chordPerformanceSessions = useMemo(() => {
    if (completedChordSession === null) {
      return chordSessionHistory;
    }

    return [
      completedChordSession,
      ...chordSessionHistory.filter(
        (session) => session.id !== completedChordSession.id
      )
    ];
  }, [chordSessionHistory, completedChordSession]);
  const chordPerformance = useMemo(
    () => buildChordTonePerformanceSummary(chordPerformanceSessions),
    [chordPerformanceSessions]
  );
  const chordReviewPrompts = useMemo(
    () => collectChordReviewPrompts(chordPerformanceSessions),
    [chordPerformanceSessions]
  );
  const chordPromptQueue = useMemo(
    () =>
      buildChordTonePromptSession(
        chordSessionSettings,
        chordReviewPrompts
      ),
    [chordSessionSettings, chordSessionNonce, chordReviewPrompts]
  );
  const scaleDegreePerformanceSessions = useMemo(() => {
    if (completedScaleDegreeSession === null) {
      return scaleDegreeSessionHistory;
    }

    return [
      completedScaleDegreeSession,
      ...scaleDegreeSessionHistory.filter(
        (session) => session.id !== completedScaleDegreeSession.id
      )
    ];
  }, [scaleDegreeSessionHistory, completedScaleDegreeSession]);
  const scaleDegreePerformance = useMemo(
    () => buildScaleDegreePerformanceSummary(scaleDegreePerformanceSessions),
    [scaleDegreePerformanceSessions]
  );
  const scaleDegreeReviewPrompts = useMemo(
    () => collectScaleDegreeReviewPrompts(scaleDegreePerformanceSessions),
    [scaleDegreePerformanceSessions]
  );
  const scaleDegreePromptQueue = useMemo(
    () =>
      buildScaleDegreePromptSession(
        scaleDegreeSessionSettings,
        scaleDegreeReviewPrompts
      ),
    [
      scaleDegreeSessionSettings,
      scaleDegreeSessionNonce,
      scaleDegreeReviewPrompts
    ]
  );
  const intervalPerformanceSessions = useMemo(() => {
    if (completedIntervalSession === null) {
      return intervalSessionHistory;
    }

    return [
      completedIntervalSession,
      ...intervalSessionHistory.filter(
        (session) => session.id !== completedIntervalSession.id
      )
    ];
  }, [intervalSessionHistory, completedIntervalSession]);
  const intervalPerformance = useMemo(
    () => buildIntervalLandmarkPerformanceSummary(intervalPerformanceSessions),
    [intervalPerformanceSessions]
  );
  const intervalReviewPrompts = useMemo(
    () => collectIntervalReviewPrompts(intervalPerformanceSessions),
    [intervalPerformanceSessions]
  );
  const intervalPromptQueue = useMemo(
    () =>
      buildIntervalLandmarkPromptSession(
        intervalSessionSettings,
        intervalReviewPrompts
      ),
    [intervalSessionSettings, intervalSessionNonce, intervalReviewPrompts]
  );
  const octavePerformanceSessions = useMemo(() => {
    if (completedOctaveSession === null) {
      return octaveSessionHistory;
    }

    return [
      completedOctaveSession,
      ...octaveSessionHistory.filter(
        (session) => session.id !== completedOctaveSession.id
      )
    ];
  }, [octaveSessionHistory, completedOctaveSession]);
  const octavePerformance = useMemo(
    () => buildOctaveShapePerformanceSummary(octavePerformanceSessions),
    [octavePerformanceSessions]
  );
  const octaveReviewPrompts = useMemo(
    () => collectOctaveReviewPrompts(octavePerformanceSessions),
    [octavePerformanceSessions]
  );
  const octavePromptQueue = useMemo(
    () =>
      buildOctaveShapePromptSession(
        octaveSessionSettings,
        octaveReviewPrompts
      ),
    [octaveSessionSettings, octaveSessionNonce, octaveReviewPrompts]
  );
  const triadInversionPerformanceSessions = useMemo(() => {
    if (completedTriadInversionSession === null) {
      return triadInversionSessionHistory;
    }

    return [
      completedTriadInversionSession,
      ...triadInversionSessionHistory.filter(
        (session) => session.id !== completedTriadInversionSession.id
      )
    ];
  }, [triadInversionSessionHistory, completedTriadInversionSession]);
  const triadInversionPerformance = useMemo(
    () =>
      buildTriadInversionPerformanceSummary(triadInversionPerformanceSessions),
    [triadInversionPerformanceSessions]
  );
  const triadInversionReviewPrompts = useMemo(
    () => collectTriadInversionReviewPrompts(triadInversionPerformanceSessions),
    [triadInversionPerformanceSessions]
  );
  const triadInversionPromptQueue = useMemo(
    () =>
      buildTriadInversionPromptSession(
        triadInversionSessionSettings,
        triadInversionReviewPrompts
      ),
    [
      triadInversionSessionSettings,
      triadInversionSessionNonce,
      triadInversionReviewPrompts
    ]
  );
  const currentPrompt = getCurrentPrompt(promptIndex, notePromptQueue);
  const currentAttempt =
    attempts.find((attempt) => attempt.promptIndex === promptIndex) ?? null;
  const currentChordPrompt = getCurrentChordTonePrompt(
    chordPromptIndex,
    chordPromptQueue
  );
  const currentChordAttempt =
    chordAttempts.find((attempt) => attempt.promptIndex === chordPromptIndex) ??
    null;
  const currentScaleDegreePrompt = getCurrentScaleDegreePrompt(
    scalePromptIndex,
    scaleDegreePromptQueue
  );
  const currentScaleDegreeAttempt =
    scaleAttempts.find((attempt) => attempt.promptIndex === scalePromptIndex) ??
    null;
  const currentIntervalPrompt = getCurrentIntervalLandmarkPrompt(
    intervalPromptIndex,
    intervalPromptQueue
  );
  const currentIntervalAttempt =
    intervalAttempts.find(
      (attempt) => attempt.promptIndex === intervalPromptIndex
    ) ?? null;
  const currentOctavePrompt = getCurrentOctaveShapePrompt(
    octavePromptIndex,
    octavePromptQueue
  );
  const currentOctaveAttempt =
    octaveAttempts.find(
      (attempt) => attempt.promptIndex === octavePromptIndex
    ) ?? null;
  const currentTriadInversionPrompt = getCurrentTriadInversionPrompt(
    triadInversionPromptIndex,
    triadInversionPromptQueue
  );
  const currentTriadInversionAttempt =
    triadInversionAttempts.find(
      (attempt) => attempt.promptIndex === triadInversionPromptIndex
    ) ?? null;
  const drillSummary = useMemo(
    () => summarizeNoteRecognition(attempts, notePromptQueue.length),
    [attempts, notePromptQueue.length]
  );
  const chordDrillSummary = useMemo(
    () => summarizeChordToneRecognition(chordAttempts, chordPromptQueue.length),
    [chordAttempts, chordPromptQueue.length]
  );
  const scaleDegreeDrillSummary = useMemo(
    () =>
      summarizeScaleDegreeRecognition(
        scaleAttempts,
        scaleDegreePromptQueue.length
      ),
    [scaleAttempts, scaleDegreePromptQueue.length]
  );
  const intervalDrillSummary = useMemo(
    () =>
      summarizeIntervalLandmarkRecognition(
        intervalAttempts,
        intervalPromptQueue.length
      ),
    [intervalAttempts, intervalPromptQueue.length]
  );
  const octaveDrillSummary = useMemo(
    () =>
      summarizeOctaveShapeRecognition(
        octaveAttempts,
        octavePromptQueue.length
      ),
    [octaveAttempts, octavePromptQueue.length]
  );
  const triadInversionDrillSummary = useMemo(
    () =>
      summarizeTriadInversionRecognition(
        triadInversionAttempts,
        triadInversionPromptQueue.length
      ),
    [triadInversionAttempts, triadInversionPromptQueue.length]
  );
  const missedPrompts = useMemo(
    () => getMissedNoteRecognitionPrompts(attempts),
    [attempts]
  );
  const missedChordPrompts = useMemo(
    () => getMissedChordTonePrompts(chordAttempts),
    [chordAttempts]
  );
  const missedScaleDegreePrompts = useMemo(
    () => getMissedScaleDegreePrompts(scaleAttempts),
    [scaleAttempts]
  );
  const missedIntervalPrompts = useMemo(
    () => getMissedIntervalLandmarkPrompts(intervalAttempts),
    [intervalAttempts]
  );
  const missedOctavePrompts = useMemo(
    () => getMissedOctaveShapePrompts(octaveAttempts),
    [octaveAttempts]
  );
  const missedTriadInversionPrompts = useMemo(
    () => getMissedTriadInversionPrompts(triadInversionAttempts),
    [triadInversionAttempts]
  );
  const activePositions = useMemo(
    () =>
      buildActivePositions(
        mode,
        practiceDrill,
        rootNote,
        scaleQuality,
        chordQuality,
        currentPrompt,
        currentAttempt,
        currentChordPrompt,
        currentChordAttempt,
        currentScaleDegreePrompt,
        currentScaleDegreeAttempt,
        currentIntervalPrompt,
        currentIntervalAttempt,
        currentOctavePrompt,
        currentOctaveAttempt,
        currentTriadInversionPrompt,
        currentTriadInversionAttempt
      ),
    [
      mode,
      practiceDrill,
      rootNote,
      scaleQuality,
      chordQuality,
      currentPrompt,
      currentAttempt,
      currentChordPrompt,
      currentChordAttempt,
      currentScaleDegreePrompt,
      currentScaleDegreeAttempt,
      currentIntervalPrompt,
      currentIntervalAttempt,
      currentOctavePrompt,
      currentOctaveAttempt,
      currentTriadInversionPrompt,
      currentTriadInversionAttempt
    ]
  );
  const summary = useMemo(
    () =>
      buildModeSummary(
        mode,
        practiceDrill,
        rootNote,
        scaleQuality,
        chordQuality,
        currentPrompt,
        currentAttempt,
        drillSummary,
        currentChordPrompt,
        currentChordAttempt,
        chordDrillSummary,
        currentScaleDegreePrompt,
        currentScaleDegreeAttempt,
        scaleDegreeDrillSummary,
        currentIntervalPrompt,
        currentIntervalAttempt,
        intervalDrillSummary,
        currentOctavePrompt,
        currentOctaveAttempt,
        octaveDrillSummary,
        currentTriadInversionPrompt,
        currentTriadInversionAttempt,
        triadInversionDrillSummary,
        notePromptQueue.length,
        chordPromptQueue.length,
        scaleDegreePromptQueue.length,
        intervalPromptQueue.length,
        octavePromptQueue.length,
        triadInversionPromptQueue.length
      ),
    [
      mode,
      practiceDrill,
      rootNote,
      scaleQuality,
      chordQuality,
      currentPrompt,
      currentAttempt,
      drillSummary,
      currentChordPrompt,
      currentChordAttempt,
      chordDrillSummary,
      currentScaleDegreePrompt,
      currentScaleDegreeAttempt,
      scaleDegreeDrillSummary,
      currentIntervalPrompt,
      currentIntervalAttempt,
      intervalDrillSummary,
      currentOctavePrompt,
      currentOctaveAttempt,
      octaveDrillSummary,
      currentTriadInversionPrompt,
      currentTriadInversionAttempt,
      triadInversionDrillSummary,
      notePromptQueue.length,
      chordPromptQueue.length,
      scaleDegreePromptQueue.length,
      intervalPromptQueue.length,
      octavePromptQueue.length,
      triadInversionPromptQueue.length
    ]
  );
  const selectedActive = selectedPosition
    ? activePositions.get(positionKey(selectedPosition))
    : undefined;
  const activeDrillSummary = getActiveDrillSummary(
    practiceDrill,
    drillSummary,
    chordDrillSummary,
    scaleDegreeDrillSummary,
    intervalDrillSummary,
    octaveDrillSummary,
    triadInversionDrillSummary
  );
  const activeDrillAttempt = getActiveDrillAttempt(
    practiceDrill,
    currentAttempt,
    currentChordAttempt,
    currentScaleDegreeAttempt,
    currentIntervalAttempt,
    currentOctaveAttempt,
    currentTriadInversionAttempt
  );
  const activePromptCount = getActivePromptCount(
    practiceDrill,
    notePromptQueue.length,
    chordPromptQueue.length,
    scaleDegreePromptQueue.length,
    intervalPromptQueue.length,
    octavePromptQueue.length,
    triadInversionPromptQueue.length
  );
  const latestSession = getLatestSession(
    practiceDrill,
    sessionHistory,
    chordSessionHistory,
    scaleDegreeSessionHistory,
    intervalSessionHistory,
    octaveSessionHistory,
    triadInversionSessionHistory
  );
  const chordMissedReviewCount = chordReviewPrompts.length;
  const noteMissedReviewCount = noteReviewPrompts.length;
  const scaleDegreeMissedReviewCount = scaleDegreeReviewPrompts.length;
  const intervalMissedReviewCount = intervalReviewPrompts.length;
  const octaveMissedReviewCount = octaveReviewPrompts.length;
  const triadInversionMissedReviewCount = triadInversionReviewPrompts.length;
  const notePresetOptions = customNotePreset
    ? [...NOTE_RECOGNITION_SESSION_PRESETS, customNotePreset]
    : NOTE_RECOGNITION_SESSION_PRESETS;
  const chordPresetOptions = customChordPreset
    ? [...CHORD_TONE_SESSION_PRESETS, customChordPreset]
    : CHORD_TONE_SESSION_PRESETS;
  const scaleDegreePresetOptions = customScaleDegreePreset
    ? [...SCALE_DEGREE_SESSION_PRESETS, customScaleDegreePreset]
    : SCALE_DEGREE_SESSION_PRESETS;
  const intervalPresetOptions = customIntervalPreset
    ? [...INTERVAL_LANDMARK_SESSION_PRESETS, customIntervalPreset]
    : INTERVAL_LANDMARK_SESSION_PRESETS;
  const octavePresetOptions = customOctavePreset
    ? [...OCTAVE_SHAPE_SESSION_PRESETS, customOctavePreset]
    : OCTAVE_SHAPE_SESSION_PRESETS;
  const triadInversionPresetOptions = customTriadInversionPreset
    ? [...TRIAD_INVERSION_SESSION_PRESETS, customTriadInversionPreset]
    : TRIAD_INVERSION_SESSION_PRESETS;
  const recommendedNotePreset = getRecommendedNotePreset(
    notePerformance,
    notePresetOptions
  );
  const recommendedChordPreset = getRecommendedChordPreset(
    chordPerformance,
    chordPresetOptions
  );
  const recommendedScaleDegreePreset = getRecommendedScaleDegreePreset(
    scaleDegreePerformance,
    scaleDegreePresetOptions
  );
  const recommendedIntervalPreset = getRecommendedIntervalPreset(
    intervalPerformance,
    intervalPresetOptions
  );
  const recommendedOctavePreset = getRecommendedOctavePreset(
    octavePerformance,
    octavePresetOptions
  );
  const recommendedTriadInversionPreset = getRecommendedTriadInversionPreset(
    triadInversionPerformance,
    triadInversionPresetOptions
  );
  const courseProgress = useMemo(
    () => buildLearningCourseProgress(lessons, lessonLearningProgressRecords),
    [lessonLearningProgressRecords]
  );
  const practiceRecommendation = buildPracticeHubRecommendation(
    notePerformance,
    chordPerformance,
    scaleDegreePerformance,
    intervalPerformance,
    octavePerformance,
    triadInversionPerformance,
    recommendedNotePreset,
    recommendedChordPreset,
    recommendedScaleDegreePreset,
    recommendedIntervalPreset,
    recommendedOctavePreset,
    recommendedTriadInversionPreset,
    courseProgress
  );
  const activeLesson = useMemo(
    () => (activeLessonSlug ? getLesson(activeLessonSlug) ?? null : null),
    [activeLessonSlug]
  );
  const nextCourseLesson = useMemo(
    () => (activeLesson ? getNextLesson(activeLesson.slug) ?? null : null),
    [activeLesson]
  );
  const activeLessonOutcome = useMemo(
    () =>
      activeLesson && activeDrillSummary.isComplete
        ? buildLessonReviewOutcome(
            activeLesson,
            activeDrillSummary,
            nextCourseLesson
          )
        : null,
    [activeLesson, activeDrillSummary, nextCourseLesson]
  );
  const reviewContent = useMemo(
    () =>
      buildPracticeReviewContent(
        practiceDrill,
        activeDrillSummary,
        missedPrompts,
        missedChordPrompts,
        missedScaleDegreePrompts,
        missedIntervalPrompts,
        missedOctavePrompts,
        missedTriadInversionPrompts,
        notePerformance,
        chordPerformance,
        scaleDegreePerformance,
        intervalPerformance,
        octavePerformance,
        triadInversionPerformance
      ),
    [
      activeDrillSummary,
      chordPerformance,
      missedChordPrompts,
      missedIntervalPrompts,
      missedOctavePrompts,
      missedPrompts,
      missedScaleDegreePrompts,
      missedTriadInversionPrompts,
      notePerformance,
      octavePerformance,
      practiceDrill,
      scaleDegreePerformance,
      intervalPerformance,
      triadInversionPerformance
    ]
  );

  useEffect(() => {
    const storedPracticeData = readStoredPracticeData();

    setSessionHistory(storedPracticeData.noteSessionHistory);
    setChordSessionHistory(storedPracticeData.chordSessionHistory);
    setScaleDegreeSessionHistory(
      storedPracticeData.scaleDegreeSessionHistory
    );
    setIntervalSessionHistory(storedPracticeData.intervalSessionHistory);
    setOctaveSessionHistory(storedPracticeData.octaveSessionHistory);
    setTriadInversionSessionHistory(
      storedPracticeData.triadInversionSessionHistory
    );
    setLessonProgressRecords(storedPracticeData.lessonProgressRecords);
    setLessonLearningProgressRecords(
      storedPracticeData.lessonLearningProgressRecords
    );
    setCustomNotePreset(
      storedPracticeData.customNotePreset
        ? normalizeNotePreset(storedPracticeData.customNotePreset)
        : null
    );
    setCustomChordPreset(storedPracticeData.customChordPreset);
    setCustomScaleDegreePreset(storedPracticeData.customScaleDegreePreset);
    setCustomIntervalPreset(storedPracticeData.customIntervalPreset);
    setCustomOctavePreset(storedPracticeData.customOctavePreset);
    setCustomTriadInversionPreset(
      storedPracticeData.customTriadInversionPreset
    );
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedDrill = parsePracticeDrillParam(
      searchParams.get("drill")
    );
    const requestedLesson = parseLessonPracticeRequest(
      searchParams.get("lesson"),
      requestedDrill
    );

    if (!requestedDrill) {
      return;
    }

    setMode("practice");
    setPracticeDrill(requestedDrill);
    setActiveLessonSlug(requestedLesson?.slug ?? null);

    resetPracticeDrill(requestedDrill);

    if (requestedLesson) {
      markStoredLessonStarted(requestedLesson.slug, requestedLesson.drill);
      setLessonProgressRecords(readStoredLessonProgress());
    }

    scrollPracticeSessionIntoView();
  }, []);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendNoteRecognitionSession,
      attempts,
      buildSession: buildNoteRecognitionSession,
      completedSession,
      isComplete: drillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("note", nextSession);
      },
      promptCount: notePromptQueue.length,
      setCompletedSession,
      setSessionHistory,
      storageKey: NOTE_RECOGNITION_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    attempts,
    completedSession,
    drillSummary.isComplete,
    notePromptQueue.length
  ]);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendChordToneSession,
      attempts: chordAttempts,
      buildSession: buildChordToneSession,
      completedSession: completedChordSession,
      isComplete: chordDrillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("chordTone", nextSession);
      },
      promptCount: chordPromptQueue.length,
      setCompletedSession: setCompletedChordSession,
      setSessionHistory: setChordSessionHistory,
      storageKey: CHORD_TONE_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    chordAttempts,
    chordDrillSummary.isComplete,
    chordPromptQueue.length,
    completedChordSession
  ]);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendScaleDegreeSession,
      attempts: scaleAttempts,
      buildSession: buildScaleDegreeSession,
      completedSession: completedScaleDegreeSession,
      isComplete: scaleDegreeDrillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("scaleDegree", nextSession);
      },
      promptCount: scaleDegreePromptQueue.length,
      setCompletedSession: setCompletedScaleDegreeSession,
      setSessionHistory: setScaleDegreeSessionHistory,
      storageKey: SCALE_DEGREE_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    completedScaleDegreeSession,
    scaleAttempts,
    scaleDegreeDrillSummary.isComplete,
    scaleDegreePromptQueue.length
  ]);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendIntervalLandmarkSession,
      attempts: intervalAttempts,
      buildSession: buildIntervalLandmarkSession,
      completedSession: completedIntervalSession,
      isComplete: intervalDrillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("interval", nextSession);
      },
      promptCount: intervalPromptQueue.length,
      setCompletedSession: setCompletedIntervalSession,
      setSessionHistory: setIntervalSessionHistory,
      storageKey: INTERVAL_LANDMARK_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    completedIntervalSession,
    intervalAttempts,
    intervalDrillSummary.isComplete,
    intervalPromptQueue.length
  ]);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendOctaveShapeSession,
      attempts: octaveAttempts,
      buildSession: buildOctaveShapeSession,
      completedSession: completedOctaveSession,
      isComplete: octaveDrillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("octaveShape", nextSession);
      },
      promptCount: octavePromptQueue.length,
      setCompletedSession: setCompletedOctaveSession,
      setSessionHistory: setOctaveSessionHistory,
      storageKey: OCTAVE_SHAPE_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    completedOctaveSession,
    octaveAttempts,
    octaveDrillSummary.isComplete,
    octavePromptQueue.length
  ]);

  useEffect(() => {
    completePracticeSession({
      appendSession: appendTriadInversionSession,
      attempts: triadInversionAttempts,
      buildSession: buildTriadInversionSession,
      completedSession: completedTriadInversionSession,
      isComplete: triadInversionDrillSummary.isComplete,
      onComplete: (nextSession) => {
        recordActiveLessonSession("triadInversion", nextSession);
      },
      promptCount: triadInversionPromptQueue.length,
      setCompletedSession: setCompletedTriadInversionSession,
      setSessionHistory: setTriadInversionSessionHistory,
      storageKey: TRIAD_INVERSION_HISTORY_STORAGE_KEY
    });
  }, [
    activeLessonSlug,
    completedTriadInversionSession,
    triadInversionAttempts,
    triadInversionDrillSummary.isComplete,
    triadInversionPromptQueue.length
  ]);

  function handleModeChange(nextMode: DisplayMode): void {
    setMode(nextMode);
    setSelectedPosition(null);
  }

  function recordActiveLessonSession(
    completedDrill: PracticeDrill,
    session:
      | NoteRecognitionSession
      | ChordToneSession
      | ScaleDegreeSession
      | IntervalLandmarkSession
      | OctaveShapeSession
      | TriadInversionSession
  ): void {
    if (!activeLessonSlug) {
      return;
    }

    const activeLesson = getLesson(activeLessonSlug);

    if (!activeLesson || activeLesson.practice.drill !== completedDrill) {
      return;
    }

    markStoredLessonPracticed(
      activeLesson.slug,
      activeLesson.practice.drill,
      session,
      activeLesson.practice.criteria
    );
    setLessonProgressRecords(readStoredLessonProgress());
  }

  function handlePositionClick(position: FretPosition): void {
    if (
      mode === "practice" &&
      practiceDrill === "note" &&
      !isNoteRecognitionAnswerPosition(position)
    ) {
      return;
    }

    if (
      mode === "practice" &&
      practiceDrill === "scaleDegree" &&
      !isScaleDegreeAnswerPosition(position)
    ) {
      return;
    }

    if (
      mode === "practice" &&
      practiceDrill === "interval" &&
      !isIntervalLandmarkAnswerPosition(position)
    ) {
      return;
    }

    if (
      mode === "practice" &&
      practiceDrill === "octaveShape" &&
      !isOctaveShapeAnswerPosition(position)
    ) {
      return;
    }

    setSelectedPosition(position);

    if (mode !== "practice") {
      return;
    }

    if (practiceDrill === "chordTone" || practiceDrill === "triadInversion") {
      return;
    }

    if (practiceDrill === "scaleDegree") {
      if (
        scaleDegreeDrillSummary.isComplete ||
        currentScaleDegreeAttempt !== null
      ) {
        return;
      }

      const nextAttempt = buildScaleDegreeAttempt(
        scalePromptIndex,
        currentScaleDegreePrompt,
        position
      );

      setScaleAttempts((previousAttempts) =>
        previousAttempts.some(
          (attempt) => attempt.promptIndex === scalePromptIndex
        )
          ? previousAttempts
          : [...previousAttempts, nextAttempt]
      );
      return;
    }

    if (practiceDrill === "interval") {
      if (
        intervalDrillSummary.isComplete ||
        currentIntervalAttempt !== null
      ) {
        return;
      }

      const nextAttempt = buildIntervalLandmarkAttempt(
        intervalPromptIndex,
        currentIntervalPrompt,
        position
      );

      setIntervalAttempts((previousAttempts) =>
        previousAttempts.some(
          (attempt) => attempt.promptIndex === intervalPromptIndex
        )
          ? previousAttempts
          : [...previousAttempts, nextAttempt]
      );
      return;
    }

    if (practiceDrill === "octaveShape") {
      if (octaveDrillSummary.isComplete || currentOctaveAttempt !== null) {
        return;
      }

      const nextAttempt = buildOctaveShapeAttempt(
        octavePromptIndex,
        currentOctavePrompt,
        position
      );

      setOctaveAttempts((previousAttempts) =>
        previousAttempts.some(
          (attempt) => attempt.promptIndex === octavePromptIndex
        )
          ? previousAttempts
          : [...previousAttempts, nextAttempt]
      );
      return;
    }

    if (drillSummary.isComplete || currentAttempt !== null) {
      return;
    }

    const nextAttempt = buildNoteRecognitionAttempt(
      promptIndex,
      currentPrompt,
      position
    );

    setAttempts((previousAttempts) =>
      previousAttempts.some((attempt) => attempt.promptIndex === promptIndex)
        ? previousAttempts
        : [...previousAttempts, nextAttempt]
    );
  }

  function handleChordToneAnswer(selectedNote: NoteName): void {
    if (chordDrillSummary.isComplete || currentChordAttempt !== null) {
      return;
    }

    const nextAttempt = buildChordToneAttempt(
      chordPromptIndex,
      currentChordPrompt,
      selectedNote
    );

    setChordAttempts((previousAttempts) =>
      previousAttempts.some((attempt) => attempt.promptIndex === chordPromptIndex)
        ? previousAttempts
        : [...previousAttempts, nextAttempt]
    );
  }

  function handleTriadInversionAnswer(selectedNote: NoteName): void {
    if (
      triadInversionDrillSummary.isComplete ||
      currentTriadInversionAttempt !== null
    ) {
      return;
    }

    const nextAttempt = buildTriadInversionAttempt(
      triadInversionPromptIndex,
      currentTriadInversionPrompt,
      selectedNote
    );

    setTriadInversionAttempts((previousAttempts) =>
      previousAttempts.some(
        (attempt) => attempt.promptIndex === triadInversionPromptIndex
      )
        ? previousAttempts
        : [...previousAttempts, nextAttempt]
    );
  }

  function handleChordSessionSettingsChange(
    nextSettings: Partial<ChordToneSessionSettings>
  ): void {
    setChordSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetChordToneDrill();
  }

  function handleChordPresetSelect(preset: ChordToneSessionPreset): void {
    setChordSessionSettings(preset.settings);
    resetChordToneDrill();
  }

  function handleStartChordPreset(preset: ChordToneSessionPreset): void {
    setMode("practice");
    setPracticeDrill("chordTone");
    handleChordPresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleSaveChordPreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: chordSessionSettings
    } satisfies ChordToneSessionPreset;

    setCustomChordPreset(nextPreset);
    writeStoredPreset(CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function handleScaleDegreeSessionSettingsChange(
    nextSettings: Partial<ScaleDegreeSessionSettings>
  ): void {
    setScaleDegreeSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetScaleDegreeDrill();
  }

  function handleScaleDegreePresetSelect(
    preset: ScaleDegreeSessionPreset
  ): void {
    setScaleDegreeSessionSettings(preset.settings);
    resetScaleDegreeDrill();
  }

  function handleStartScaleDegreePreset(
    preset: ScaleDegreeSessionPreset
  ): void {
    setMode("practice");
    setPracticeDrill("scaleDegree");
    handleScaleDegreePresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleSaveScaleDegreePreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: scaleDegreeSessionSettings
    } satisfies ScaleDegreeSessionPreset;

    setCustomScaleDegreePreset(nextPreset);
    writeStoredPreset(SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function handleIntervalSessionSettingsChange(
    nextSettings: Partial<IntervalLandmarkSessionSettings>
  ): void {
    setIntervalSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetIntervalLandmarkDrill();
  }

  function handleIntervalPresetSelect(
    preset: IntervalLandmarkSessionPreset
  ): void {
    setIntervalSessionSettings(preset.settings);
    resetIntervalLandmarkDrill();
  }

  function handleStartIntervalPreset(
    preset: IntervalLandmarkSessionPreset
  ): void {
    setMode("practice");
    setPracticeDrill("interval");
    handleIntervalPresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleSaveIntervalPreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: intervalSessionSettings
    } satisfies IntervalLandmarkSessionPreset;

    setCustomIntervalPreset(nextPreset);
    writeStoredPreset(INTERVAL_LANDMARK_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function handleOctaveSessionSettingsChange(
    nextSettings: Partial<OctaveShapeSessionSettings>
  ): void {
    setOctaveSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetOctaveShapeDrill();
  }

  function handleOctavePresetSelect(preset: OctaveShapeSessionPreset): void {
    setOctaveSessionSettings(preset.settings);
    resetOctaveShapeDrill();
  }

  function handleStartOctavePreset(preset: OctaveShapeSessionPreset): void {
    setMode("practice");
    setPracticeDrill("octaveShape");
    handleOctavePresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleSaveOctavePreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: octaveSessionSettings
    } satisfies OctaveShapeSessionPreset;

    setCustomOctavePreset(nextPreset);
    writeStoredPreset(OCTAVE_SHAPE_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function handleTriadInversionSessionSettingsChange(
    nextSettings: Partial<TriadInversionSessionSettings>
  ): void {
    setTriadInversionSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetTriadInversionDrill();
  }

  function handleTriadInversionPresetSelect(
    preset: TriadInversionSessionPreset
  ): void {
    setTriadInversionSessionSettings(preset.settings);
    resetTriadInversionDrill();
  }

  function handleStartTriadInversionPreset(
    preset: TriadInversionSessionPreset
  ): void {
    setMode("practice");
    setPracticeDrill("triadInversion");
    handleTriadInversionPresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleSaveTriadInversionPreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: triadInversionSessionSettings
    } satisfies TriadInversionSessionPreset;

    setCustomTriadInversionPreset(nextPreset);
    writeStoredPreset(TRIAD_INVERSION_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function handleNoteSessionSettingsChange(
    nextSettings: Partial<NoteRecognitionSessionSettings>
  ): void {
    setNoteSessionSettings((previousSettings) =>
      normalizeNoteSessionSettings({
        ...previousSettings,
        ...nextSettings
      })
    );
    resetNoteRecognitionDrill();
  }

  function handleNotePresetSelect(preset: NoteRecognitionSessionPreset): void {
    setNoteSessionSettings(normalizeNoteSessionSettings(preset.settings));
    resetNoteRecognitionDrill();
  }

  function handleStartNotePreset(preset: NoteRecognitionSessionPreset): void {
    setMode("practice");
    setPracticeDrill("note");
    handleNotePresetSelect(preset);
    scrollPracticeSessionIntoView();
  }

  function handleStartRecommendation(
    recommendation: PracticeHubRecommendation
  ): void {
    if (recommendation.drill === "chordTone") {
      handleStartChordPreset(recommendation.preset as ChordToneSessionPreset);
      return;
    }

    if (recommendation.drill === "scaleDegree") {
      handleStartScaleDegreePreset(
        recommendation.preset as ScaleDegreeSessionPreset
      );
      return;
    }

    if (recommendation.drill === "interval") {
      handleStartIntervalPreset(
        recommendation.preset as IntervalLandmarkSessionPreset
      );
      return;
    }

    if (recommendation.drill === "octaveShape") {
      handleStartOctavePreset(recommendation.preset as OctaveShapeSessionPreset);
      return;
    }

    if (recommendation.drill === "triadInversion") {
      handleStartTriadInversionPreset(
        recommendation.preset as TriadInversionSessionPreset
      );
      return;
    }

    handleStartNotePreset(recommendation.preset as NoteRecognitionSessionPreset);
  }

  function handleSaveNotePreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: normalizeNoteSessionSettings(noteSessionSettings)
    } satisfies NoteRecognitionSessionPreset;

    setCustomNotePreset(nextPreset);
    writeStoredPreset(NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY, nextPreset);
  }

  function resetNoteRecognitionDrill(): void {
    setPromptIndex(0);
    setAttempts([]);
    setCompletedSession(null);
    setSelectedPosition(null);
    setNoteSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetChordToneDrill(): void {
    setChordPromptIndex(0);
    setChordAttempts([]);
    setCompletedChordSession(null);
    setSelectedPosition(null);
    setChordSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetScaleDegreeDrill(): void {
    setScalePromptIndex(0);
    setScaleAttempts([]);
    setCompletedScaleDegreeSession(null);
    setSelectedPosition(null);
    setScaleDegreeSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetIntervalLandmarkDrill(): void {
    setIntervalPromptIndex(0);
    setIntervalAttempts([]);
    setCompletedIntervalSession(null);
    setSelectedPosition(null);
    setIntervalSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetOctaveShapeDrill(): void {
    setOctavePromptIndex(0);
    setOctaveAttempts([]);
    setCompletedOctaveSession(null);
    setSelectedPosition(null);
    setOctaveSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetTriadInversionDrill(): void {
    setTriadInversionPromptIndex(0);
    setTriadInversionAttempts([]);
    setCompletedTriadInversionSession(null);
    setSelectedPosition(null);
    setTriadInversionSessionNonce((previousNonce) => previousNonce + 1);
  }

  function resetPracticeDrill(nextPracticeDrill = practiceDrill): void {
    getPracticeDrillAction(nextPracticeDrill, {
      chordTone: resetChordToneDrill,
      interval: resetIntervalLandmarkDrill,
      note: resetNoteRecognitionDrill,
      octaveShape: resetOctaveShapeDrill,
      scaleDegree: resetScaleDegreeDrill,
      triadInversion: resetTriadInversionDrill
    })();
  }

  function scrollPracticeSessionIntoView(): void {
    window.setTimeout(() => {
      practiceLayoutRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 0);
  }

  function handleNextPrompt(): void {
    if (activeDrillAttempt === null || activeDrillSummary.isComplete) {
      return;
    }

    setSelectedPosition(null);

    getPracticeDrillAction(practiceDrill, {
      chordTone: () =>
        setChordPromptIndex((previousPromptIndex) => previousPromptIndex + 1),
      interval: () =>
        setIntervalPromptIndex(
          (previousPromptIndex) => previousPromptIndex + 1
        ),
      note: () =>
        setPromptIndex((previousPromptIndex) => previousPromptIndex + 1),
      octaveShape: () =>
        setOctavePromptIndex(
          (previousPromptIndex) => previousPromptIndex + 1
        ),
      scaleDegree: () =>
        setScalePromptIndex((previousPromptIndex) => previousPromptIndex + 1),
      triadInversion: () =>
        setTriadInversionPromptIndex(
          (previousPromptIndex) => previousPromptIndex + 1
        )
    })();
  }

  function handleRestartDrill(): void {
    resetPracticeDrill();
  }

  function handlePracticeMisses(): void {
    if (activeDrillSummary.missed === 0) {
      return;
    }

    getPracticeDrillAction(practiceDrill, {
      chordTone: () => {
        setChordSessionSettings((previousSettings) => ({
          ...previousSettings,
          promptOrder: "fixed",
          reviewMode: "missed"
        }));
        resetChordToneDrill();
      },
      interval: () => {
        setIntervalSessionSettings((previousSettings) => ({
          ...previousSettings,
          promptOrder: "fixed",
          reviewMode: "missed"
        }));
        resetIntervalLandmarkDrill();
      },
      note: () => {
        setNoteSessionSettings((previousSettings) =>
          normalizeNoteSessionSettings({
            ...previousSettings,
            promptOrder: "fixed",
            reviewMode: "missed"
          })
        );
        resetNoteRecognitionDrill();
      },
      octaveShape: () => {
        setOctaveSessionSettings((previousSettings) => ({
          ...previousSettings,
          promptOrder: "fixed",
          reviewMode: "missed"
        }));
        resetOctaveShapeDrill();
      },
      scaleDegree: () => {
        setScaleDegreeSessionSettings((previousSettings) => ({
          ...previousSettings,
          promptOrder: "fixed",
          reviewMode: "missed"
        }));
        resetScaleDegreeDrill();
      },
      triadInversion: () => {
        setTriadInversionSessionSettings((previousSettings) => ({
          ...previousSettings,
          promptOrder: "fixed",
          reviewMode: "missed"
        }));
        resetTriadInversionDrill();
      }
    })();
  }

  return (
    <main className="app-shell">
      <AppNavigation activePage={isPracticeExperience ? "practice" : "explore"} />
      <header className="app-header">
        <div>
          <p className="eyebrow">FretGarden</p>
          <h1>{isPracticeExperience ? "Fretboard Practice" : "Fretboard Explorer"}</h1>
          <p>
            {isPracticeExperience
              ? "Practice notes, chord tones, and scale degrees in focused fretboard drills."
              : "Explore standard tuning, find notes, and map chord or scale tones across the first twelve frets."}
          </p>
        </div>
        <div className="status-panel" aria-label="Current fretboard setup">
          <span>Guitar</span>
          <strong>Standard tuning</strong>
          <small>E A D G B E · Frets 0-12</small>
        </div>
      </header>

      {isPracticeExperience ? (
        <PracticeHub
          noteLastSessionLabel={formatHubAccuracy(sessionHistory[0] ?? null)}
          noteWeakSpotLabel={notePerformance.weakSpots[0]?.label ?? "No weak spots"}
          notePresetLabel={recommendedNotePreset.label}
          onStartNote={() => handleStartNotePreset(recommendedNotePreset)}
          chordLastSessionLabel={formatHubAccuracy(
            chordSessionHistory[0] ?? null
          )}
          chordWeakSpotLabel={
            chordPerformance.weakSpots[0]?.label ?? "No weak spots"
          }
          chordPresetLabel={recommendedChordPreset.label}
          onStartChord={() => handleStartChordPreset(recommendedChordPreset)}
          scaleLastSessionLabel={formatHubAccuracy(
            scaleDegreeSessionHistory[0] ?? null
          )}
          scaleWeakSpotLabel={
            scaleDegreePerformance.weakSpots[0]?.label ?? "No weak spots"
          }
          scalePresetLabel={recommendedScaleDegreePreset.label}
          onStartScale={() =>
            handleStartScaleDegreePreset(recommendedScaleDegreePreset)
          }
          intervalLastSessionLabel={formatHubAccuracy(
            intervalSessionHistory[0] ?? null
          )}
          intervalWeakSpotLabel={
            intervalPerformance.weakSpots[0]?.label ?? "No weak spots"
          }
          intervalPresetLabel={recommendedIntervalPreset.label}
          onStartInterval={() =>
            handleStartIntervalPreset(recommendedIntervalPreset)
          }
          octaveLastSessionLabel={formatHubAccuracy(
            octaveSessionHistory[0] ?? null
          )}
          octaveWeakSpotLabel={
            octavePerformance.weakSpots[0]?.label ?? "No weak spots"
          }
          octavePresetLabel={recommendedOctavePreset.label}
          onStartOctave={() => handleStartOctavePreset(recommendedOctavePreset)}
          triadInversionLastSessionLabel={formatHubAccuracy(
            triadInversionSessionHistory[0] ?? null
          )}
          triadInversionWeakSpotLabel={
            triadInversionPerformance.weakSpots[0]?.label ?? "No weak spots"
          }
          triadInversionPresetLabel={recommendedTriadInversionPreset.label}
          onStartTriadInversion={() =>
            handleStartTriadInversionPreset(recommendedTriadInversionPreset)
          }
          recommendationTitle={practiceRecommendation.title}
          recommendationDescription={practiceRecommendation.description}
          onStartRecommendation={() =>
            handleStartRecommendation(practiceRecommendation)
          }
        />
      ) : null}

      <section
        id="practice"
        className={
          mode === "practice"
            ? "practice-layout practice-layout-practice"
            : "practice-layout"
        }
        aria-label="Fretboard explorer"
        ref={practiceLayoutRef}
      >
        <aside className="controls-panel" aria-label="Fretboard controls">
          {!isPracticeExperience ? (
            <details className="control-disclosure" open>
              <summary>
                <span className="control-label">Explore mode</span>
                <strong>{getModeLabel(mode)}</strong>
              </summary>
              <div className="control-group">
                <div className="segmented-control">
                  {modes
                    .filter((option) => option.id !== "practice")
                    .map((option) => (
                      <button
                        className={option.id === mode ? "is-selected" : ""}
                        data-testid={`mode-${option.id}`}
                        key={option.id}
                        onClick={() => handleModeChange(option.id)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))}
                </div>
              </div>
            </details>
          ) : null}

          {mode === "practice" ? (
            <details className="control-disclosure">
              <summary>
                <span className="control-label">Drill</span>
                <strong>{getPracticeDrillLabel(practiceDrill)}</strong>
              </summary>
              <div className="control-group">
                <div className="segmented-control option-grid six">
                  {([
                    { id: "note", label: "Note drill" },
                    { id: "chordTone", label: "Chord drill" },
                    { id: "scaleDegree", label: "Scale drill" },
                    { id: "interval", label: "Interval drill" },
                    { id: "octaveShape", label: "Octave drill" },
                    { id: "triadInversion", label: "Inversion drill" }
                  ] as const).map((option) => (
                    <button
                      className={
                        option.id === practiceDrill ? "is-selected" : ""
                      }
                      data-testid={`drill-${option.id}`}
                      key={option.id}
                      onClick={() => {
                        setPracticeDrill(option.id);
                        setSelectedPosition(null);
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </details>
          ) : null}

          {mode === "practice" ? (
            <details
              className="control-disclosure"
              data-testid="session-setup-disclosure"
            >
              <summary>
                <span className="control-label">Session setup</span>
                <strong>{activePromptCount} questions</strong>
              </summary>
              <PracticeSessionSettings
                practiceDrill={practiceDrill}
                note={{
                  presetOptions: notePresetOptions,
                  settings: noteSessionSettings,
                  missedReviewCount: noteMissedReviewCount,
                  onPresetSelect: handleNotePresetSelect,
                  onSavePreset: handleSaveNotePreset,
                  onSettingsChange: handleNoteSessionSettingsChange
                }}
                chord={{
                  presetOptions: chordPresetOptions,
                  settings: chordSessionSettings,
                  missedReviewCount: chordMissedReviewCount,
                  onPresetSelect: handleChordPresetSelect,
                  onSavePreset: handleSaveChordPreset,
                  onSettingsChange: handleChordSessionSettingsChange
                }}
                scale={{
                  presetOptions: scaleDegreePresetOptions,
                  settings: scaleDegreeSessionSettings,
                  missedReviewCount: scaleDegreeMissedReviewCount,
                  onPresetSelect: handleScaleDegreePresetSelect,
                  onSavePreset: handleSaveScaleDegreePreset,
                  onSettingsChange: handleScaleDegreeSessionSettingsChange
                }}
                interval={{
                  presetOptions: intervalPresetOptions,
                  settings: intervalSessionSettings,
                  missedReviewCount: intervalMissedReviewCount,
                  onPresetSelect: handleIntervalPresetSelect,
                  onSavePreset: handleSaveIntervalPreset,
                  onSettingsChange: handleIntervalSessionSettingsChange
                }}
                octave={{
                  presetOptions: octavePresetOptions,
                  settings: octaveSessionSettings,
                  missedReviewCount: octaveMissedReviewCount,
                  onPresetSelect: handleOctavePresetSelect,
                  onSavePreset: handleSaveOctavePreset,
                  onSettingsChange: handleOctaveSessionSettingsChange
                }}
                triadInversion={{
                  presetOptions: triadInversionPresetOptions,
                  settings: triadInversionSessionSettings,
                  missedReviewCount: triadInversionMissedReviewCount,
                  onPresetSelect: handleTriadInversionPresetSelect,
                  onSavePreset: handleSaveTriadInversionPreset,
                  onSettingsChange: handleTriadInversionSessionSettingsChange
                }}
              />
            </details>
          ) : null}

          {mode !== "practice" ? (
            <div className="control-group">
              <span className="control-label">Root note</span>
              <div className="note-grid">
                {notes.map((note) => (
                  <button
                    className={note === rootNote ? "is-selected" : ""}
                    data-testid={`note-${note.replace("#", "sharp")}`}
                    key={note}
                    onClick={() => setRootNote(note)}
                    type="button"
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "scale" ? (
            <div className="control-group">
              <span className="control-label">Scale quality</span>
              <div className="segmented-control compact">
                {(["major", "minor"] as const).map((quality) => (
                  <button
                    className={quality === scaleQuality ? "is-selected" : ""}
                    key={quality}
                    onClick={() => setScaleQuality(quality)}
                    type="button"
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "chord" ? (
            <div className="control-group">
              <span className="control-label">Chord quality</span>
              <div className="segmented-control compact">
                {(["major", "minor"] as const).map((quality) => (
                  <button
                    className={quality === chordQuality ? "is-selected" : ""}
                    key={quality}
                    onClick={() => setChordQuality(quality)}
                    type="button"
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {mode !== "practice" ? (
            <div className="summary-panel">
              <span>{summary.badge}</span>
              <strong>{summary.title}</strong>
              <p>{summary.description}</p>
              <div className="tone-list" aria-label="Current tones">
                {summary.tones.map((tone) => (
                  <span key={tone}>{tone}</span>
                ))}
              </div>
            </div>
          ) : null}

          {mode === "practice" &&
          (practiceDrill === "chordTone" ||
            practiceDrill === "triadInversion") ? (
            <div className="control-group chord-answer-panel">
              <span className="control-label">Answer</span>
              <div className="note-grid chord-answer-grid">
                {getCurrentNoteAnswerOptions(
                  practiceDrill,
                  currentChordPrompt,
                  currentTriadInversionPrompt
                ).map((note) => {
                  const isSelected =
                    practiceDrill === "triadInversion"
                      ? currentTriadInversionAttempt?.selectedNote === note
                      : currentChordAttempt?.selectedNote === note;
                  const isCorrectAnswer =
                    practiceDrill === "triadInversion"
                      ? currentTriadInversionAttempt !== null &&
                        currentTriadInversionAttempt.bassNote === note
                      : currentChordAttempt !== null &&
                        currentChordAttempt.targetNote === note;
                  const isMissedSelection =
                    isSelected &&
                    (practiceDrill === "triadInversion"
                      ? currentTriadInversionAttempt?.isCorrect === false
                      : currentChordAttempt?.isCorrect === false);

                  return (
                    <button
                      className={buildChordAnswerClassName(
                        isSelected,
                        isCorrectAnswer,
                        isMissedSelection
                      )}
                      data-testid={`${getNoteAnswerTestIdPrefix(
                        practiceDrill
                      )}-answer-${formatNoteTestId(note)}`}
                      disabled={
                        practiceDrill === "triadInversion"
                          ? currentTriadInversionAttempt !== null ||
                            triadInversionDrillSummary.isComplete
                          : currentChordAttempt !== null ||
                            chordDrillSummary.isComplete
                      }
                      key={note}
                      onClick={() =>
                        practiceDrill === "triadInversion"
                          ? handleTriadInversionAnswer(note)
                          : handleChordToneAnswer(note)
                      }
                      type="button"
                    >
                      {note}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {mode === "practice" ? (
            <div className="drill-panel">
              <div className="drill-score">
                <span className="control-label">Session</span>
                <strong>
                  {activeDrillSummary.correct}/{activeDrillSummary.attempted}{" "}
                  correct
                </strong>
              </div>
              <div
                aria-label={`${activeDrillSummary.attempted} of ${activePromptCount} questions complete`}
                className="progress-track"
              >
                <span
                  style={{
                    width: `${(activeDrillSummary.attempted / activePromptCount) * 100}%`
                  }}
                />
              </div>
            </div>
          ) : null}

          {mode === "practice" ? (
            <PracticePromptPanel
              practicePrompt={{
                label: activeDrillSummary.isComplete
                  ? "Session complete"
                  : "Question",
                title: summary.title,
                status: getPracticePromptStatus(
                  practiceDrill,
                  activeDrillSummary,
                  activeDrillAttempt
                ),
                description: summary.description,
                canGoNext:
                  activeDrillAttempt !== null && !activeDrillSummary.isComplete,
                onNextPrompt: handleNextPrompt,
                onReset: handleRestartDrill
              }}
              referencePrompt={{
                title: selectedPosition
                  ? `String ${selectedPosition.string}, fret ${selectedPosition.fret}: ${selectedPosition.note}`
                  : "Choose any fret",
                status: selectedActive?.descriptor ?? "No active role",
                description: "Choose any fret to inspect its note and role."
              }}
            />
          ) : null}
        </aside>

        <section className="fretboard-panel" aria-labelledby="fretboard-title">
          <div className="fretboard-heading">
            <div>
              <p className="eyebrow">Interactive Map</p>
              <h2 id="fretboard-title">
                {mode === "practice" ? "Interactive Fretboard" : summary.title}
              </h2>
            </div>
            <div className="legend" aria-label="Fretboard legend">
              <span>
                <i className="legend-dot root" /> root
              </span>
              <span>
                <i className="legend-dot tone" /> tone
              </span>
            </div>
          </div>

          <p className="mobile-fretboard-hint">
            Swipe the fretboard sideways, then tap the highlighted string.
          </p>

          <div className="fretboard-scroll">
            <div
              aria-label="Interactive standard guitar fretboard"
              className="fretboard-grid"
              role="grid"
            >
              <div className="string-corner" />
              {frets.map((fret) => (
                <div className="fret-number" key={`fret-${fret}`}>
                  {fret}
                </div>
              ))}

              {displayStrings.map((stringTuning) => (
                <Fragment key={stringTuning.string}>
                  <div
                    className={buildStringLabelClassName(
                      mode,
                      practiceDrill,
                      stringTuning.string,
                      currentPrompt,
                      currentScaleDegreePrompt,
                      currentIntervalPrompt,
                      currentOctavePrompt
                    )}
                  >
                    <strong>{stringTuning.openNote}</strong>
                    <span>String {stringTuning.string}</span>
                  </div>

                  {frets.map((fret) => {
                    const position = getPosition(stringTuning.string, fret);
                    const active = activePositions.get(positionKey(position));
                    const isDisabled =
                      mode === "practice" &&
                      ((practiceDrill === "note" &&
                        !isNoteRecognitionAnswerPosition(position)) ||
                        (practiceDrill === "scaleDegree" &&
                          !isScaleDegreeAnswerPosition(position)) ||
                        (practiceDrill === "interval" &&
                          !isIntervalLandmarkAnswerPosition(position)) ||
                        (practiceDrill === "octaveShape" &&
                          !isOctaveShapeAnswerPosition(position)));
                    const isTargetString =
                      mode === "practice" &&
                      ((practiceDrill === "note" &&
                        position.string === currentPrompt.targetString) ||
                        (practiceDrill === "scaleDegree" &&
                          position.string ===
                            currentScaleDegreePrompt.targetString) ||
                        (practiceDrill === "interval" &&
                          position.string ===
                            currentIntervalPrompt.targetString) ||
                        (practiceDrill === "octaveShape" &&
                          (position.string ===
                            currentOctavePrompt.sourceString ||
                            position.string ===
                              currentOctavePrompt.targetString)));
                    const isSelected =
                      selectedPosition !== null &&
                      positionKey(selectedPosition) === positionKey(position);

                    return (
                      <button
                        aria-label={buildPositionLabel(
                          position,
                          active,
                          mode,
                          practiceDrill
                        )}
                        aria-pressed={isSelected}
                        className={buildFretClassName(
                          active,
                          isSelected,
                          isDisabled,
                          isTargetString
                        )}
                        data-testid={`fret-${stringTuning.string}-${fret}`}
                        disabled={isDisabled}
                        key={`${stringTuning.string}-${fret}`}
                        onClick={() => handlePositionClick(position)}
                        role="gridcell"
                        type="button"
                      >
                        <span>
                          {buildCellLabel(mode, practiceDrill, position, active)}
                        </span>
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          {mode === "practice" && latestSession ? (
            <div className="last-session-panel" data-testid="last-session">
              <span className="control-label">Last session</span>
              <strong>
                {latestSession.correct}/{latestSession.promptCount} correct
              </strong>
              <p>
                {latestSession.accuracy}% accuracy ·{" "}
                {formatSessionDate(latestSession.completedAt)}
              </p>
            </div>
          ) : mode !== "practice" ? (
            <PracticePromptPanel
              practicePrompt={null}
              referencePrompt={{
                title: selectedPosition
                  ? `String ${selectedPosition.string}, fret ${selectedPosition.fret}: ${selectedPosition.note}`
                  : "Choose any fret",
                status: selectedActive?.descriptor ?? "No active role",
                description: "Choose any fret to inspect its note and role."
              }}
            />
          ) : null}

          {mode === "practice" && activeDrillSummary.isComplete ? (
            <PracticeReviewPanel
              title={getCompletionTitle(practiceDrill)}
              metrics={reviewContent.metrics}
              missedPrompts={reviewContent.missedPrompts}
              weakSpots={reviewContent.weakSpots}
              breakdowns={reviewContent.breakdowns}
              lessonOutcome={activeLessonOutcome}
              canPracticeMisses={activeDrillSummary.missed > 0}
              onPracticeAgain={handleRestartDrill}
              onPracticeMisses={handlePracticeMisses}
            />
          ) : null}
        </section>
      </section>
    </main>
  );
}

function buildActivePositions(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  rootNote: NoteName,
  scaleQuality: ScaleQuality,
  chordQuality: TriadQuality,
  drillPrompt: NoteRecognitionPrompt,
  currentAttempt: NoteRecognitionAttempt | null,
  chordPrompt: ChordTonePrompt,
  currentChordAttempt: ChordToneAttempt | null,
  scaleDegreePrompt: ScaleDegreePrompt,
  currentScaleDegreeAttempt: ScaleDegreeAttempt | null,
  intervalPrompt: IntervalLandmarkPrompt,
  currentIntervalAttempt: IntervalLandmarkAttempt | null,
  octavePrompt: OctaveShapePrompt,
  currentOctaveAttempt: OctaveShapeAttempt | null,
  triadInversionPrompt: TriadInversionPrompt,
  currentTriadInversionAttempt: TriadInversionAttempt | null
): Map<string, ActivePosition> {
  const activePositions = new Map<string, ActivePosition>();

  if (mode === "practice") {
    if (practiceDrill === "chordTone") {
      if (currentChordAttempt === null) {
        return activePositions;
      }

      findNotesOnFretboard(currentChordAttempt.targetNote, {
        frets: fretboard.frets
      }).forEach((position) => {
        activePositions.set(positionKey(position), {
          label: currentChordAttempt.targetNote,
          variant: "answer",
          descriptor: `Correct ${getChordToneName(
            chordPrompt.targetTone
          )} of ${formatChordName(chordPrompt.rootNote, chordPrompt.quality)}`
        });
      });

      if (!currentChordAttempt.isCorrect) {
        findNotesOnFretboard(currentChordAttempt.selectedNote, {
          frets: fretboard.frets
        }).forEach((position) => {
          activePositions.set(positionKey(position), {
            label: currentChordAttempt.selectedNote,
            variant: "miss",
            descriptor: `Your answer: ${currentChordAttempt.selectedNote}`
          });
        });
      }

      return activePositions;
    }

    if (practiceDrill === "scaleDegree") {
      if (currentScaleDegreeAttempt === null) {
        return activePositions;
      }

      findNotesOnFretboard(currentScaleDegreeAttempt.targetNote, {
        frets: fretboard.frets
      }).forEach((position) => {
        if (!isScaleDegreeCorrectPosition(scaleDegreePrompt, position)) {
          return;
        }

        activePositions.set(positionKey(position), {
          label: String(scaleDegreePrompt.targetDegree),
          variant: "answer",
          descriptor: `Correct ${getScaleDegreeName(
            scaleDegreePrompt.targetDegree
          )} of ${formatScaleName(
            scaleDegreePrompt.rootNote,
            scaleDegreePrompt.quality
          )}`
        });
      });

      activePositions.set(
        `${currentScaleDegreeAttempt.selectedString}-${currentScaleDegreeAttempt.selectedFret}`,
        {
          label: currentScaleDegreeAttempt.isCorrect
            ? String(currentScaleDegreeAttempt.targetDegree)
            : currentScaleDegreeAttempt.selectedNote,
          variant: currentScaleDegreeAttempt.isCorrect ? "root" : "miss",
          descriptor: currentScaleDegreeAttempt.isCorrect
            ? `Correct ${getScaleDegreeName(
                scaleDegreePrompt.targetDegree
              )} answer`
            : `Your answer: ${
                currentScaleDegreeAttempt.selectedNote
              } on the ${getStringDisplayName(
                currentScaleDegreeAttempt.selectedString
              )} string`
        }
      );

      return activePositions;
    }

    if (practiceDrill === "interval") {
      if (currentIntervalAttempt === null) {
        return activePositions;
      }

      findNotesOnFretboard(currentIntervalAttempt.targetNote, {
        frets: fretboard.frets
      }).forEach((position) => {
        if (!isIntervalLandmarkCorrectPosition(intervalPrompt, position)) {
          return;
        }

        activePositions.set(positionKey(position), {
          label: currentIntervalAttempt.targetNote,
          variant: "answer",
          descriptor: `Correct ${getIntervalLandmarkName(
            intervalPrompt.targetInterval
          )} above ${intervalPrompt.rootNote}`
        });
      });

      activePositions.set(
        `${currentIntervalAttempt.selectedString}-${currentIntervalAttempt.selectedFret}`,
        {
          label: currentIntervalAttempt.selectedNote,
          variant: currentIntervalAttempt.isCorrect ? "root" : "miss",
          descriptor: currentIntervalAttempt.isCorrect
            ? `Correct ${getIntervalLandmarkName(
                intervalPrompt.targetInterval
              )} answer`
            : `Your answer: ${
                currentIntervalAttempt.selectedNote
              } on the ${getStringDisplayName(
                currentIntervalAttempt.selectedString
              )} string`
        }
      );

      return activePositions;
    }

    if (practiceDrill === "octaveShape") {
      const sourcePosition = getSourceOctaveShapePosition(octavePrompt);

      activePositions.set(positionKey(sourcePosition), {
        label: octavePrompt.sourceNote,
        variant: "root",
        descriptor: `${getOctaveShapeName(octavePrompt.shape)} source anchor`
      });

      if (currentOctaveAttempt === null) {
        return activePositions;
      }

      const targetPosition = getTargetOctaveShapePosition(octavePrompt);

      activePositions.set(positionKey(targetPosition), {
        label: currentOctaveAttempt.targetNote,
        variant: "answer",
        descriptor: `Correct ${getOctaveShapeName(
          octavePrompt.shape
        )} octave target`
      });

      if (!currentOctaveAttempt.isCorrect) {
        activePositions.set(
          `${currentOctaveAttempt.selectedString}-${currentOctaveAttempt.selectedFret}`,
          {
            label: currentOctaveAttempt.selectedNote,
            variant: "miss",
            descriptor: `Your answer: ${
              currentOctaveAttempt.selectedNote
            } on the ${getStringDisplayName(
              currentOctaveAttempt.selectedString
            )} string`
          }
        );
      }

      return activePositions;
    }

    if (practiceDrill === "triadInversion") {
      if (currentTriadInversionAttempt === null) {
        return activePositions;
      }

      findNotesOnFretboard(currentTriadInversionAttempt.bassNote, {
        frets: fretboard.frets
      }).forEach((position) => {
        activePositions.set(positionKey(position), {
          label: currentTriadInversionAttempt.bassNote,
          variant: "answer",
          descriptor: `Correct bass ${getTriadInversionBassToneName(
            triadInversionPrompt.inversion
          )} of ${formatChordName(
            triadInversionPrompt.rootNote,
            triadInversionPrompt.quality
          )}`
        });
      });

      if (!currentTriadInversionAttempt.isCorrect) {
        findNotesOnFretboard(currentTriadInversionAttempt.selectedNote, {
          frets: fretboard.frets
        }).forEach((position) => {
          activePositions.set(positionKey(position), {
            label: currentTriadInversionAttempt.selectedNote,
            variant: "miss",
            descriptor: `Your answer: ${currentTriadInversionAttempt.selectedNote}`
          });
        });
      }

      return activePositions;
    }

    if (currentAttempt === null) {
      return activePositions;
    }

    findNotesOnFretboard(drillPrompt.targetNote, { frets: fretboard.frets }).forEach(
      (position) => {
        if (!isNoteRecognitionCorrectPosition(drillPrompt, position)) {
          return;
        }

        activePositions.set(positionKey(position), {
          label: position.note,
          variant: "answer",
          descriptor: `Correct ${drillPrompt.targetNote} on the ${getStringDisplayName(
            drillPrompt.targetString
          )} string`
        });
      }
    );

    activePositions.set(
      `${currentAttempt.selectedString}-${currentAttempt.selectedFret}`,
      {
        label: currentAttempt.selectedNote,
        variant: currentAttempt.isCorrect ? "root" : "miss",
        descriptor: currentAttempt.isCorrect
          ? `Correct ${drillPrompt.targetNote} answer`
          : `Your answer: ${currentAttempt.selectedNote} on the ${getStringDisplayName(
              currentAttempt.selectedString
            )} string`
      }
    );

    return activePositions;
  }

  if (mode === "notes") {
    fretboard.positions.forEach((position) => {
      activePositions.set(positionKey(position), {
        label: position.note,
        variant: "note",
        descriptor: `${position.note} note`
      });
    });

    return activePositions;
  }

  if (mode === "find") {
    findNotesOnFretboard(rootNote, { frets: fretboard.frets }).forEach(
      (position) => {
        activePositions.set(positionKey(position), {
          label: position.note,
          variant: "root",
          descriptor: `${rootNote} position`
        });
      }
    );

    return activePositions;
  }

  if (mode === "scale") {
    mapScaleToFretboard(rootNote, scaleQuality, {
      frets: fretboard.frets
    }).positions.forEach((position) => {
      activePositions.set(positionKey(position), {
        label: String(position.scaleDegree),
        variant: position.scaleDegree === 1 ? "root" : "scale",
        descriptor: `Scale degree ${position.scaleDegree}`
      });
    });

    return activePositions;
  }

  mapChordToFretboard(rootNote, chordQuality, {
    frets: fretboard.frets
  }).positions.forEach((position) => {
    activePositions.set(positionKey(position), {
      label: String(position.chordTone),
      variant: position.chordTone === 1 ? "root" : "chord",
      descriptor: `Chord tone ${position.chordTone}`
    });
  });

  return activePositions;
}

function buildModeSummary(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  rootNote: NoteName,
  scaleQuality: ScaleQuality,
  chordQuality: TriadQuality,
  drillPrompt: NoteRecognitionPrompt,
  currentAttempt: NoteRecognitionAttempt | null,
  drillSummary: NoteRecognitionSummary,
  chordPrompt: ChordTonePrompt,
  currentChordAttempt: ChordToneAttempt | null,
  chordDrillSummary: ChordToneSummary,
  scaleDegreePrompt: ScaleDegreePrompt,
  currentScaleDegreeAttempt: ScaleDegreeAttempt | null,
  scaleDegreeDrillSummary: ScaleDegreeSummary,
  intervalPrompt: IntervalLandmarkPrompt,
  currentIntervalAttempt: IntervalLandmarkAttempt | null,
  intervalDrillSummary: IntervalLandmarkSummary,
  octavePrompt: OctaveShapePrompt,
  currentOctaveAttempt: OctaveShapeAttempt | null,
  octaveDrillSummary: OctaveShapeSummary,
  triadInversionPrompt: TriadInversionPrompt,
  currentTriadInversionAttempt: TriadInversionAttempt | null,
  triadInversionDrillSummary: TriadInversionSummary,
  notePromptCount: number,
  chordPromptCount: number,
  scaleDegreePromptCount: number,
  intervalPromptCount: number,
  octavePromptCount: number,
  triadInversionPromptCount: number
): ModeSummary {
  if (mode === "practice") {
    if (practiceDrill === "chordTone") {
      const chordName = formatChordName(chordPrompt.rootNote, chordPrompt.quality);
      const targetToneName = getChordToneName(chordPrompt.targetTone);
      const targetNote = getTargetChordToneNote(chordPrompt);
      const chordSpelling = formatChordSpelling(chordPrompt);

      if (chordDrillSummary.isComplete) {
        return {
          title: "Chord tone drill complete",
          description: `You found ${chordDrillSummary.correct} of ${chordDrillSummary.attempted} chord-tone questions.`,
          badge: `${chordDrillSummary.accuracy}% accuracy`,
          tones: [
            `${chordDrillSummary.correct} correct`,
            `${chordDrillSummary.missed} missed`
          ]
        };
      }

      return {
        title: `What is the ${targetToneName} of ${chordName}?`,
        description:
          currentChordAttempt === null
            ? `Choose the note that functions as the ${targetToneName} of ${chordName}. The fretboard will reveal the answer after you choose.`
            : currentChordAttempt.isCorrect
              ? `Correct. ${chordSpelling}, so ${targetNote} is the ${targetToneName}.`
              : `You chose ${currentChordAttempt.selectedNote}. ${chordSpelling}, so ${targetNote} is the ${targetToneName}.`,
        badge: `${chordDrillSummary.attempted + 1}/${chordPromptCount}`,
        tones:
          currentChordAttempt === null
            ? [chordName, targetToneName]
            : [chordName, targetToneName, targetNote]
      };
    }

    if (practiceDrill === "scaleDegree") {
      const scaleName = formatScaleName(
        scaleDegreePrompt.rootNote,
        scaleDegreePrompt.quality
      );
      const targetDegreeName = getScaleDegreeName(
        scaleDegreePrompt.targetDegree
      );
      const targetStringName = getStringDisplayName(
        scaleDegreePrompt.targetString
      );
      const targetNote = getTargetScaleDegreeNote(scaleDegreePrompt);

      if (scaleDegreeDrillSummary.isComplete) {
        return {
          title: "Scale degree drill complete",
          description: `You found ${scaleDegreeDrillSummary.correct} of ${scaleDegreeDrillSummary.attempted} scale-degree questions.`,
          badge: `${scaleDegreeDrillSummary.accuracy}% accuracy`,
          tones: [
            `${scaleDegreeDrillSummary.correct} correct`,
            `${scaleDegreeDrillSummary.missed} missed`
          ]
        };
      }

      return {
        title: `Find the ${targetDegreeName} of ${scaleName} on the ${targetStringName} string`,
        description:
          currentScaleDegreeAttempt === null
            ? `Click the fretted position for the ${targetDegreeName} of ${scaleName} on the ${targetStringName} string. Notes stay hidden until you answer.`
            : currentScaleDegreeAttempt.isCorrect
              ? `Correct. ${targetNote} is the ${targetDegreeName} of ${scaleName}.`
              : `You chose ${currentScaleDegreeAttempt.selectedNote} on the ${getStringDisplayName(
                  currentScaleDegreeAttempt.selectedString
                )} string. The correct ${targetDegreeName} is ${targetNote} on the ${targetStringName} string.`,
        badge: `${scaleDegreeDrillSummary.attempted + 1}/${scaleDegreePromptCount}`,
        tones: [scaleName, targetDegreeName, `${targetStringName} string`]
      };
    }

    if (practiceDrill === "interval") {
      const intervalName = getIntervalLandmarkName(
        intervalPrompt.targetInterval
      );
      const targetStringName = getStringDisplayName(
        intervalPrompt.targetString
      );
      const targetNote = getTargetIntervalLandmarkNote(intervalPrompt);

      if (intervalDrillSummary.isComplete) {
        return {
          title: "Interval landmark drill complete",
          description: `You found ${intervalDrillSummary.correct} of ${intervalDrillSummary.attempted} interval questions.`,
          badge: `${intervalDrillSummary.accuracy}% accuracy`,
          tones: [
            `${intervalDrillSummary.correct} correct`,
            `${intervalDrillSummary.missed} missed`
          ]
        };
      }

      return {
        title: `Find the ${intervalName} above ${intervalPrompt.rootNote} on the ${targetStringName} string`,
        description:
          currentIntervalAttempt === null
            ? `Click the fretted position for the ${intervalName} above ${intervalPrompt.rootNote} on the ${targetStringName} string. Notes stay hidden until you answer.`
            : currentIntervalAttempt.isCorrect
              ? `Correct. ${targetNote} is the ${intervalName} above ${intervalPrompt.rootNote}.`
              : `You chose ${currentIntervalAttempt.selectedNote} on the ${getStringDisplayName(
                  currentIntervalAttempt.selectedString
                )} string. The correct answer is ${targetNote} on the ${targetStringName} string.`,
        badge: `${intervalDrillSummary.attempted + 1}/${intervalPromptCount}`,
        tones: [
          intervalPrompt.rootNote,
          intervalName,
          `${targetStringName} string`
        ]
      };
    }

    if (practiceDrill === "octaveShape") {
      const sourceStringName = getStringDisplayName(octavePrompt.sourceString);
      const targetStringName = getStringDisplayName(octavePrompt.targetString);
      const shapeName = getOctaveShapeName(octavePrompt.shape);
      const targetNote = getTargetOctaveShapeNote(octavePrompt);

      if (octaveDrillSummary.isComplete) {
        return {
          title: "Octave shape drill complete",
          description: `You found ${octaveDrillSummary.correct} of ${octaveDrillSummary.attempted} octave-shape questions.`,
          badge: `${octaveDrillSummary.accuracy}% accuracy`,
          tones: [
            `${octaveDrillSummary.correct} correct`,
            `${octaveDrillSummary.missed} missed`
          ]
        };
      }

      return {
        title: `Find the ${shapeName} octave from ${octavePrompt.sourceNote} on the ${sourceStringName} string`,
        description:
          currentOctaveAttempt === null
            ? `Use the highlighted source at string ${octavePrompt.sourceString}, fret ${octavePrompt.sourceFret}. Click the matching octave on the ${targetStringName} string.`
            : currentOctaveAttempt.isCorrect
              ? `Correct. ${targetNote} at string ${octavePrompt.targetString}, fret ${octavePrompt.targetFret} completes the ${shapeName} octave.`
              : `You chose ${currentOctaveAttempt.selectedNote} on the ${getStringDisplayName(
                  currentOctaveAttempt.selectedString
                )} string. The ${shapeName} octave is ${targetNote} at string ${octavePrompt.targetString}, fret ${octavePrompt.targetFret}.`,
        badge: `${octaveDrillSummary.attempted + 1}/${octavePromptCount}`,
        tones: [
          shapeName,
          `${octavePrompt.sourceNote} anchor`,
          `${targetStringName} string`
        ]
      };
    }

    if (practiceDrill === "triadInversion") {
      const chordName = formatChordName(
        triadInversionPrompt.rootNote,
        triadInversionPrompt.quality
      );
      const inversionName = getTriadInversionName(
        triadInversionPrompt.inversion
      );
      const bassToneName = getTriadInversionBassToneName(
        triadInversionPrompt.inversion
      );
      const bassNote = getTriadInversionBassNote(triadInversionPrompt);
      const chordSpelling = formatTriadInversionSpelling(
        triadInversionPrompt
      );

      if (triadInversionDrillSummary.isComplete) {
        return {
          title: "Triad inversion drill complete",
          description: `You found ${triadInversionDrillSummary.correct} of ${triadInversionDrillSummary.attempted} inversion questions.`,
          badge: `${triadInversionDrillSummary.accuracy}% accuracy`,
          tones: [
            `${triadInversionDrillSummary.correct} correct`,
            `${triadInversionDrillSummary.missed} missed`
          ]
        };
      }

      return {
        title: `What note is in the bass of ${inversionName} ${chordName}?`,
        description:
          currentTriadInversionAttempt === null
            ? `Choose the chord note that sits in the bass. In ${inversionName}, the bass is the ${bassToneName}.`
            : currentTriadInversionAttempt.isCorrect
              ? `Correct. ${chordSpelling}, so ${bassNote} is the bass note in ${inversionName}.`
              : `You chose ${currentTriadInversionAttempt.selectedNote}. ${chordSpelling}, so ${bassNote} is the bass note in ${inversionName}.`,
        badge: `${triadInversionDrillSummary.attempted + 1}/${triadInversionPromptCount}`,
        tones:
          currentTriadInversionAttempt === null
            ? [chordName, inversionName, bassToneName]
            : [chordName, inversionName, bassNote]
      };
    }

    const targetStringName = getStringDisplayName(drillPrompt.targetString);

    if (drillSummary.isComplete) {
      return {
        title: "Note recognition complete",
        description: `You found ${drillSummary.correct} of ${drillSummary.attempted} questions.`,
        badge: `${drillSummary.accuracy}% accuracy`,
        tones: [
          `${drillSummary.correct} correct`,
          `${drillSummary.missed} missed`
        ]
      };
    }

    return {
      title: `Find ${drillPrompt.targetNote} on the ${targetStringName} string`,
      description:
        currentAttempt === null
          ? `Click the fretted ${drillPrompt.targetNote} on the ${targetStringName} string. Notes stay hidden until you answer.`
          : currentAttempt.isCorrect
            ? `Nice. String ${currentAttempt.selectedString}, fret ${currentAttempt.selectedFret} is ${drillPrompt.targetNote} on the ${targetStringName} string.`
            : `You chose ${currentAttempt.selectedNote} on the ${getStringDisplayName(
                currentAttempt.selectedString
              )} string. The correct ${drillPrompt.targetNote} on the ${targetStringName} string is highlighted.`,
      badge: `${drillSummary.attempted + 1}/${notePromptCount}`,
      tones: [drillPrompt.targetNote, `${targetStringName} string`]
    };
  }

  if (mode === "notes") {
    return {
      title: "All fretboard notes",
      description: "Every position shows its note name in standard tuning.",
      badge: "78 positions",
      tones: notes.map((note) => note)
    };
  }

  if (mode === "find") {
    const matches = findNotesOnFretboard(rootNote, {
      frets: fretboard.frets
    });

    return {
      title: `Find ${rootNote}`,
      description: `Highlight every ${rootNote} across strings 1-6.`,
      badge: `${matches.length} matches`,
      tones: [rootNote]
    };
  }

  if (mode === "scale") {
    const scale = mapScaleToFretboard(rootNote, scaleQuality, {
      frets: fretboard.frets
    }).scale;

    return {
      title: `${rootNote} ${scaleQuality} scale`,
      description: "Numbers show scale degrees from root through seventh.",
      badge: `${scale.notes.length} tones`,
      tones: scale.notes
    };
  }

  const chord = mapChordToFretboard(rootNote, chordQuality, {
    frets: fretboard.frets
  }).chord;

  return {
    title: `${rootNote} ${chordQuality} triad`,
    description: "Numbers show the root, third, and fifth of the chord.",
    badge: `${chord.notes.length} tones`,
    tones: chord.notes
  };
}

function getPosition(
  string: GuitarStringNumber,
  fret: number
): FretPosition {
  const position = positionsByKey.get(`${string}-${fret}`);

  if (!position) {
    throw new Error(`Missing fret position for string ${string}, fret ${fret}`);
  }

  return position;
}

function buildFretClassName(
  active: ActivePosition | undefined,
  isSelected: boolean,
  isDisabled = false,
  isTargetString = false
): string {
  return [
    "fret-cell",
    isDisabled ? "is-disabled" : "",
    isTargetString ? "is-target-string" : "",
    active ? "is-active" : "is-muted",
    active ? `variant-${active.variant}` : "",
    isSelected ? "is-selected" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildStringLabelClassName(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  string: GuitarStringNumber,
  drillPrompt: NoteRecognitionPrompt,
  scaleDegreePrompt: ScaleDegreePrompt,
  intervalPrompt: IntervalLandmarkPrompt,
  octavePrompt: OctaveShapePrompt
): string {
  return [
    "string-label",
    isPracticeTargetString(
      mode,
      practiceDrill,
      string,
      drillPrompt,
      scaleDegreePrompt,
      intervalPrompt,
      octavePrompt
    )
      ? "is-target-string"
      : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildPositionLabel(
  position: FretPosition,
  active: ActivePosition | undefined,
  mode: DisplayMode,
  practiceDrill: PracticeDrill
): string {
  if (mode === "practice") {
    if (
      practiceDrill === "note" &&
      !isNoteRecognitionAnswerPosition(position)
    ) {
      return `String ${position.string}, open string, unavailable in this drill`;
    }

    if (
      practiceDrill === "scaleDegree" &&
      !isScaleDegreeAnswerPosition(position)
    ) {
      return `String ${position.string}, open string, unavailable in this drill`;
    }

    if (
      practiceDrill === "interval" &&
      !isIntervalLandmarkAnswerPosition(position)
    ) {
      return `String ${position.string}, open string, unavailable in this drill`;
    }

    if (
      practiceDrill === "octaveShape" &&
      !isOctaveShapeAnswerPosition(position)
    ) {
      return `String ${position.string}, open string, unavailable in this drill`;
    }

    const practiceLabel = `String ${position.string}, fret ${position.fret}`;

    return active
      ? `${practiceLabel}, ${active.descriptor}`
      : practiceLabel;
  }

  const baseLabel = `String ${position.string}, fret ${position.fret}, ${position.note}`;

  return active ? `${baseLabel}, ${active.descriptor}` : baseLabel;
}

function buildCellLabel(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  position: FretPosition,
  active: ActivePosition | undefined
): string {
  if (active) {
    return active.label;
  }

  if (
    mode === "practice" &&
    practiceDrill === "note" &&
    !isNoteRecognitionAnswerPosition(position)
  ) {
    return "open";
  }

  if (
    mode === "practice" &&
    practiceDrill === "scaleDegree" &&
    !isScaleDegreeAnswerPosition(position)
  ) {
    return "open";
  }

  if (
    mode === "practice" &&
    practiceDrill === "interval" &&
    !isIntervalLandmarkAnswerPosition(position)
  ) {
    return "open";
  }

  if (
    mode === "practice" &&
    practiceDrill === "octaveShape" &&
    !isOctaveShapeAnswerPosition(position)
  ) {
    return "open";
  }

  return mode === "practice" ? "" : position.note;
}

function isPracticeTargetString(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  string: GuitarStringNumber,
  drillPrompt: NoteRecognitionPrompt,
  scaleDegreePrompt: ScaleDegreePrompt,
  intervalPrompt: IntervalLandmarkPrompt,
  octavePrompt: OctaveShapePrompt
): boolean {
  if (mode !== "practice") {
    return false;
  }

  if (practiceDrill === "note") {
    return string === drillPrompt.targetString;
  }

  if (practiceDrill === "scaleDegree") {
    return string === scaleDegreePrompt.targetString;
  }

  if (practiceDrill === "interval") {
    return string === intervalPrompt.targetString;
  }

  if (practiceDrill === "octaveShape") {
    return (
      string === octavePrompt.sourceString ||
      string === octavePrompt.targetString
    );
  }

  return false;
}

function positionKey(position: FretPosition): string {
  return `${position.string}-${position.fret}`;
}

function getStringDisplayName(string: GuitarStringNumber): string {
  return stringDisplayNames[string];
}

function getModeLabel(mode: DisplayMode): string {
  return modes.find((option) => option.id === mode)?.label ?? "Practice";
}

function getPracticeDrillLabel(practiceDrill: PracticeDrill): string {
  if (practiceDrill === "chordTone") {
    return "Chord tones";
  }

  if (practiceDrill === "scaleDegree") {
    return "Scale degrees";
  }

  if (practiceDrill === "interval") {
    return "Interval landmarks";
  }

  if (practiceDrill === "octaveShape") {
    return "Octave shapes";
  }

  if (practiceDrill === "triadInversion") {
    return "Triad inversions";
  }

  return "Note recognition";
}

function parsePracticeDrillParam(value: string | null): PracticeDrill | null {
  if (
    value === "note" ||
    value === "chordTone" ||
    value === "scaleDegree" ||
    value === "interval" ||
    value === "octaveShape" ||
    value === "triadInversion"
  ) {
    return value;
  }

  return null;
}

function parseLessonPracticeRequest(
  slug: string | null,
  requestedDrill: PracticeDrill | null
): { slug: string; drill: LessonPracticeDrill } | null {
  if (!slug || !requestedDrill) {
    return null;
  }

  const lesson = getLesson(slug);

  if (!lesson || lesson.practice.drill !== requestedDrill) {
    return null;
  }

  return {
    slug: lesson.slug,
    drill: lesson.practice.drill
  };
}

function normalizeNoteSessionSettings(
  settings: NoteRecognitionSessionSettings
): NoteRecognitionSessionSettings {
  return {
    ...settings,
    noteFocus: "all",
    stringFocus: "all"
  };
}

function normalizeNotePreset(
  preset: NoteRecognitionSessionPreset
): NoteRecognitionSessionPreset {
  return {
    ...preset,
    settings: normalizeNoteSessionSettings(preset.settings)
  };
}

function markStoredLessonStarted(
  slug: string,
  drill: LessonPracticeDrill
): void {
  writeStoredLessonProgress(
    markLessonStarted(readStoredLessonProgress(), slug, drill)
  );
}

function markStoredLessonPracticed(
  slug: string,
  drill: LessonPracticeDrill,
  session:
    | NoteRecognitionSession
    | ChordToneSession
    | ScaleDegreeSession
    | IntervalLandmarkSession
    | OctaveShapeSession
    | TriadInversionSession,
  criteria: Lesson["practice"]["criteria"]
): void {
  writeStoredLessonProgress(
    markLessonPracticed(
      readStoredLessonProgress(),
      slug,
      drill,
      {
        attemptedAt: session.completedAt,
        accuracy: session.accuracy,
        promptCount: session.promptCount
      },
      criteria
    )
  );
}

function getCompletionTitle(practiceDrill: PracticeDrill): string {
  if (practiceDrill === "chordTone") {
    return "Chord tone drill complete";
  }

  if (practiceDrill === "scaleDegree") {
    return "Scale degree drill complete";
  }

  if (practiceDrill === "interval") {
    return "Interval landmark drill complete";
  }

  if (practiceDrill === "octaveShape") {
    return "Octave shape drill complete";
  }

  if (practiceDrill === "triadInversion") {
    return "Triad inversion drill complete";
  }

  return "Note recognition complete";
}

function buildLessonReviewOutcome(
  lesson: Lesson,
  summary:
    | NoteRecognitionSummary
    | ChordToneSummary
    | ScaleDegreeSummary
    | IntervalLandmarkSummary
    | OctaveShapeSummary
    | TriadInversionSummary,
  nextLesson: Lesson | null
): LessonReviewOutcome {
  const criteria = lesson.practice.criteria;
  const didCompleteLesson = doesLessonPracticeMeetCriteria(
    {
      accuracy: summary.accuracy,
      promptCount: summary.attempted
    },
    criteria
  );
  const criteriaLabel = formatLessonCriteria(criteria.promptCount, criteria.minAccuracy);

  if (didCompleteLesson) {
    return {
      status: "complete",
      title: "Lesson complete",
      description: nextLesson
        ? `${lesson.title} is complete. Next up: ${nextLesson.title}.`
        : `${lesson.title} is complete. You finished every lesson in this course path.`,
      criteriaLabel,
      nextAction: nextLesson
        ? {
            href: `/lessons/${nextLesson.slug}`,
            label: "Open next lesson",
            title: nextLesson.title
          }
        : {
            href: "/lessons",
            label: "Review course path",
            title: "All lessons complete"
          }
    };
  }

  return {
    status: "in-progress",
    title: "Keep this lesson in progress",
    description: `${lesson.title} needs ${criteriaLabel.toLowerCase()}. This session reached ${summary.accuracy}% accuracy across ${summary.attempted} questions.`,
    criteriaLabel
  };
}

function buildPracticeReviewContent(
  practiceDrill: PracticeDrill,
  summary:
    | NoteRecognitionSummary
    | ChordToneSummary
    | ScaleDegreeSummary
    | IntervalLandmarkSummary
    | OctaveShapeSummary
    | TriadInversionSummary,
  noteMisses: readonly MissedNoteRecognitionPrompt[],
  chordMisses: readonly MissedChordTonePrompt[],
  scaleDegreeMisses: readonly MissedScaleDegreePrompt[],
  intervalMisses: readonly MissedIntervalLandmarkPrompt[],
  octaveMisses: readonly MissedOctaveShapePrompt[],
  triadInversionMisses: readonly MissedTriadInversionPrompt[],
  notePerformance: ReturnType<typeof buildNoteRecognitionPerformanceSummary>,
  chordPerformance: ReturnType<typeof buildChordTonePerformanceSummary>,
  scaleDegreePerformance: ReturnType<typeof buildScaleDegreePerformanceSummary>,
  intervalPerformance: ReturnType<typeof buildIntervalLandmarkPerformanceSummary>,
  octavePerformance: ReturnType<typeof buildOctaveShapePerformanceSummary>,
  triadInversionPerformance: ReturnType<typeof buildTriadInversionPerformanceSummary>
): PracticeReviewContent {
  const metrics = [
    {
      label: "Correct",
      value: `${summary.correct}/${summary.attempted}`
    },
    {
      label: "Missed",
      value: String(summary.missed)
    },
    {
      label: "Accuracy",
      value: `${summary.accuracy}%`
    }
  ];

  if (practiceDrill === "chordTone") {
    return {
      metrics,
      missedPrompts: chordMisses.map(toChordMissedReviewItem),
      weakSpots: chordPerformance.weakSpots.map(toPerformanceReviewItem),
      breakdowns: [
        {
          title: "Tone breakdown",
          emptyMessage: "No chord-tone attempts yet.",
          chips: chordPerformance.toneStats.map(formatPerformanceChip)
        },
        {
          title: "Quality breakdown",
          emptyMessage: "No chord-quality attempts yet.",
          chips: chordPerformance.qualityStats.map(formatPerformanceChip)
        },
        {
          title: "Root trouble spots",
          emptyMessage: "No root-specific misses yet.",
          chips: chordPerformance.rootStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        }
      ]
    };
  }

  if (practiceDrill === "scaleDegree") {
    return {
      metrics,
      missedPrompts: scaleDegreeMisses.map(toScaleDegreeMissedReviewItem),
      weakSpots: scaleDegreePerformance.weakSpots.map(toPerformanceReviewItem),
      breakdowns: [
        {
          title: "Degree breakdown",
          emptyMessage: "No scale-degree attempts yet.",
          chips: scaleDegreePerformance.degreeStats.map(formatPerformanceChip)
        },
        {
          title: "Quality breakdown",
          emptyMessage: "No scale-quality attempts yet.",
          chips: scaleDegreePerformance.qualityStats.map(formatPerformanceChip)
        },
        {
          title: "String trouble spots",
          emptyMessage: "No string-specific misses yet.",
          chips: scaleDegreePerformance.stringStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        }
      ]
    };
  }

  if (practiceDrill === "interval") {
    return {
      metrics,
      missedPrompts: intervalMisses.map(toIntervalMissedReviewItem),
      weakSpots: intervalPerformance.weakSpots.map(toPerformanceReviewItem),
      breakdowns: [
        {
          title: "Interval breakdown",
          emptyMessage: "No interval attempts yet.",
          chips: intervalPerformance.intervalStats.map(formatPerformanceChip)
        },
        {
          title: "Root breakdown",
          emptyMessage: "No interval roots attempted yet.",
          chips: intervalPerformance.rootStats.map(formatPerformanceChip)
        },
        {
          title: "String trouble spots",
          emptyMessage: "No string-specific misses yet.",
          chips: intervalPerformance.stringStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        }
      ]
    };
  }

  if (practiceDrill === "octaveShape") {
    return {
      metrics,
      missedPrompts: octaveMisses.map(toOctaveMissedReviewItem),
      weakSpots: octavePerformance.weakSpots.map(toPerformanceReviewItem),
      breakdowns: [
        {
          title: "Shape breakdown",
          emptyMessage: "No octave-shape attempts yet.",
          chips: octavePerformance.shapeStats.map(formatPerformanceChip)
        },
        {
          title: "Note breakdown",
          emptyMessage: "No octave-note attempts yet.",
          chips: octavePerformance.noteStats.map(formatPerformanceChip)
        },
        {
          title: "Source-string trouble spots",
          emptyMessage: "No source-string misses yet.",
          chips: octavePerformance.sourceStringStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        },
        {
          title: "Target-string trouble spots",
          emptyMessage: "No target-string misses yet.",
          chips: octavePerformance.targetStringStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        }
      ]
    };
  }

  if (practiceDrill === "triadInversion") {
    return {
      metrics,
      missedPrompts: triadInversionMisses.map(
        toTriadInversionMissedReviewItem
      ),
      weakSpots: triadInversionPerformance.weakSpots.map(
        toPerformanceReviewItem
      ),
      breakdowns: [
        {
          title: "Inversion breakdown",
          emptyMessage: "No inversion attempts yet.",
          chips: triadInversionPerformance.inversionStats.map(
            formatPerformanceChip
          )
        },
        {
          title: "Quality breakdown",
          emptyMessage: "No inversion qualities attempted yet.",
          chips: triadInversionPerformance.qualityStats.map(
            formatPerformanceChip
          )
        },
        {
          title: "Root trouble spots",
          emptyMessage: "No inversion root misses yet.",
          chips: triadInversionPerformance.rootStats
            .filter((stat) => stat.missed > 0)
            .map(formatPerformanceChip)
        }
      ]
    };
  }

  return {
    metrics,
    missedPrompts: noteMisses.map(toNoteMissedReviewItem),
    weakSpots: notePerformance.weakSpots.map(toPerformanceReviewItem),
    breakdowns: [
      {
        title: "Target note breakdown",
        emptyMessage: "No note-target attempts yet.",
        chips: notePerformance.noteStats.map(formatPerformanceChip)
      },
      {
        title: "String breakdown",
        emptyMessage: "No string attempts yet.",
        chips: notePerformance.stringStats.map(formatPerformanceChip)
      }
    ]
  };
}

function toNoteMissedReviewItem(
  missedPrompt: MissedNoteRecognitionPrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.targetNote}-${missedPrompt.targetString}-${missedPrompt.selectedString}-${missedPrompt.selectedFret}`,
    title: formatPromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote} on the ${getStringDisplayName(
      missedPrompt.selectedString
    )} string, fret ${missedPrompt.selectedFret}.`
  };
}

function toChordMissedReviewItem(
  missedPrompt: MissedChordTonePrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.rootNote}-${missedPrompt.quality}-${missedPrompt.targetTone}-${missedPrompt.selectedNote}`,
    title: formatChordPromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote}; correct answer was ${
      missedPrompt.targetNote
    }. ${formatChordSpelling(missedPrompt)}.`
  };
}

function toScaleDegreeMissedReviewItem(
  missedPrompt: MissedScaleDegreePrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.rootNote}-${missedPrompt.quality}-${missedPrompt.targetDegree}-${missedPrompt.targetString}-${missedPrompt.selectedString}-${missedPrompt.selectedFret}`,
    title: formatScaleDegreePromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote} on the ${getStringDisplayName(
      missedPrompt.selectedString
    )} string, fret ${missedPrompt.selectedFret}; correct note was ${
      missedPrompt.targetNote
    }.`
  };
}

function toIntervalMissedReviewItem(
  missedPrompt: MissedIntervalLandmarkPrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.rootNote}-${missedPrompt.targetInterval}-${missedPrompt.targetString}-${missedPrompt.selectedString}-${missedPrompt.selectedFret}`,
    title: formatIntervalPromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote} on the ${getStringDisplayName(
      missedPrompt.selectedString
    )} string, fret ${missedPrompt.selectedFret}; correct note was ${
      missedPrompt.targetNote
    }.`
  };
}

function toOctaveMissedReviewItem(
  missedPrompt: MissedOctaveShapePrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.shape}-${missedPrompt.sourceString}-${missedPrompt.sourceFret}-${missedPrompt.targetString}-${missedPrompt.targetFret}-${missedPrompt.selectedString}-${missedPrompt.selectedFret}`,
    title: formatOctavePromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote} on the ${getStringDisplayName(
      missedPrompt.selectedString
    )} string, fret ${missedPrompt.selectedFret}; correct target was ${
      missedPrompt.targetNote
    } on the ${getStringDisplayName(missedPrompt.targetString)} string, fret ${
      missedPrompt.targetFret
    }.`
  };
}

function toTriadInversionMissedReviewItem(
  missedPrompt: MissedTriadInversionPrompt
): PracticeReviewItem {
  return {
    id: `${missedPrompt.rootNote}-${missedPrompt.quality}-${missedPrompt.inversion}-${missedPrompt.selectedNote}`,
    title: formatTriadInversionPromptTarget(missedPrompt),
    detail: `You chose ${missedPrompt.selectedNote}; correct bass note was ${
      missedPrompt.bassNote
    }. ${formatTriadInversionSpelling(missedPrompt)}.`
  };
}

function toPerformanceReviewItem(stat: PerformanceStat): PracticeReviewItem {
  return {
    id: `${stat.category}-${stat.id}`,
    title: stat.label,
    detail: formatPerformanceStat(stat)
  };
}

function formatLessonCriteria(promptCount: number, minAccuracy: number): string {
  return `${promptCount} questions at ${minAccuracy}%+`;
}

function getPracticePromptStatus(
  practiceDrill: PracticeDrill,
  summary:
    | NoteRecognitionSummary
    | ChordToneSummary
    | ScaleDegreeSummary
    | IntervalLandmarkSummary
    | OctaveShapeSummary
    | TriadInversionSummary,
  attempt:
    | NoteRecognitionAttempt
    | ChordToneAttempt
    | ScaleDegreeAttempt
    | IntervalLandmarkAttempt
    | OctaveShapeAttempt
    | TriadInversionAttempt
    | null
): string {
  if (summary.isComplete) {
    return `${summary.accuracy}% accuracy`;
  }

  if (attempt?.isCorrect) {
    return "Correct";
  }

  if (attempt) {
    return "Review the highlighted answer";
  }

  return practiceDrill === "chordTone" || practiceDrill === "triadInversion"
    ? "Choose a note"
    : "Choose a fret";
}

function getActiveDrillSummary(
  practiceDrill: PracticeDrill,
  noteSummary: NoteRecognitionSummary,
  chordSummary: ChordToneSummary,
  scaleDegreeSummary: ScaleDegreeSummary,
  intervalSummary: IntervalLandmarkSummary,
  octaveSummary: OctaveShapeSummary,
  triadInversionSummary: TriadInversionSummary
):
  | NoteRecognitionSummary
  | ChordToneSummary
  | ScaleDegreeSummary
  | IntervalLandmarkSummary
  | OctaveShapeSummary
  | TriadInversionSummary {
  if (practiceDrill === "chordTone") {
    return chordSummary;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeSummary;
  }

  if (practiceDrill === "interval") {
    return intervalSummary;
  }

  if (practiceDrill === "octaveShape") {
    return octaveSummary;
  }

  if (practiceDrill === "triadInversion") {
    return triadInversionSummary;
  }

  return noteSummary;
}

function getActiveDrillAttempt(
  practiceDrill: PracticeDrill,
  noteAttempt: NoteRecognitionAttempt | null,
  chordAttempt: ChordToneAttempt | null,
  scaleDegreeAttempt: ScaleDegreeAttempt | null,
  intervalAttempt: IntervalLandmarkAttempt | null,
  octaveAttempt: OctaveShapeAttempt | null,
  triadInversionAttempt: TriadInversionAttempt | null
):
  | NoteRecognitionAttempt
  | ChordToneAttempt
  | ScaleDegreeAttempt
  | IntervalLandmarkAttempt
  | OctaveShapeAttempt
  | TriadInversionAttempt
  | null {
  if (practiceDrill === "chordTone") {
    return chordAttempt;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeAttempt;
  }

  if (practiceDrill === "interval") {
    return intervalAttempt;
  }

  if (practiceDrill === "octaveShape") {
    return octaveAttempt;
  }

  if (practiceDrill === "triadInversion") {
    return triadInversionAttempt;
  }

  return noteAttempt;
}

function getActivePromptCount(
  practiceDrill: PracticeDrill,
  notePromptCount: number,
  chordPromptCount: number,
  scaleDegreePromptCount: number,
  intervalPromptCount: number,
  octavePromptCount: number,
  triadInversionPromptCount: number
): number {
  if (practiceDrill === "chordTone") {
    return chordPromptCount;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreePromptCount;
  }

  if (practiceDrill === "interval") {
    return intervalPromptCount;
  }

  if (practiceDrill === "octaveShape") {
    return octavePromptCount;
  }

  if (practiceDrill === "triadInversion") {
    return triadInversionPromptCount;
  }

  return notePromptCount;
}

function getLatestSession(
  practiceDrill: PracticeDrill,
  noteHistory: readonly NoteRecognitionSession[],
  chordHistory: readonly ChordToneSession[],
  scaleDegreeHistory: readonly ScaleDegreeSession[],
  intervalHistory: readonly IntervalLandmarkSession[],
  octaveHistory: readonly OctaveShapeSession[],
  triadInversionHistory: readonly TriadInversionSession[]
):
  | NoteRecognitionSession
  | ChordToneSession
  | ScaleDegreeSession
  | IntervalLandmarkSession
  | OctaveShapeSession
  | TriadInversionSession
  | null {
  if (practiceDrill === "chordTone") {
    return chordHistory[0] ?? null;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeHistory[0] ?? null;
  }

  if (practiceDrill === "interval") {
    return intervalHistory[0] ?? null;
  }

  if (practiceDrill === "octaveShape") {
    return octaveHistory[0] ?? null;
  }

  if (practiceDrill === "triadInversion") {
    return triadInversionHistory[0] ?? null;
  }

  return noteHistory[0] ?? null;
}

function formatPromptTarget(prompt: NoteRecognitionPrompt): string {
  return `${prompt.targetNote} on the ${getStringDisplayName(
    prompt.targetString
  )} string`;
}

function formatScaleDegreePromptTarget(prompt: ScaleDegreePrompt): string {
  return `${getScaleDegreeName(prompt.targetDegree)} of ${formatScaleName(
    prompt.rootNote,
    prompt.quality
  )} on the ${getStringDisplayName(prompt.targetString)} string`;
}

function formatIntervalPromptTarget(prompt: IntervalLandmarkPrompt): string {
  return `${getIntervalLandmarkName(prompt.targetInterval)} above ${
    prompt.rootNote
  } on the ${getStringDisplayName(prompt.targetString)} string`;
}

function formatOctavePromptTarget(prompt: OctaveShapePrompt): string {
  return `${getOctaveShapeName(prompt.shape)} octave from ${
    prompt.sourceNote
  } on the ${getStringDisplayName(prompt.sourceString)} string, fret ${
    prompt.sourceFret
  }`;
}

function formatTriadInversionPromptTarget(
  prompt: TriadInversionPrompt
): string {
  return `${getTriadInversionName(prompt.inversion)} ${formatChordName(
    prompt.rootNote,
    prompt.quality
  )}`;
}

function formatChordPromptTarget(prompt: ChordTonePrompt): string {
  return `${getChordToneName(prompt.targetTone)} of ${formatChordName(
    prompt.rootNote,
    prompt.quality
  )}`;
}

function formatScaleName(rootNote: NoteName, quality: ScaleQuality): string {
  return `${rootNote} ${quality}`;
}

function formatChordName(rootNote: NoteName, quality: TriadQuality): string {
  return `${rootNote} ${quality}`;
}

function formatChordSpelling(prompt: ChordTonePrompt): string {
  return `${formatChordName(prompt.rootNote, prompt.quality)} = ${getChordToneAnswerOptions(
    prompt
  ).join(" ")}`;
}

function formatTriadInversionSpelling(prompt: TriadInversionPrompt): string {
  return `${formatChordName(prompt.rootNote, prompt.quality)} = ${getTriadInversionAnswerOptions(
    prompt
  ).join(" ")}`;
}

function getCurrentNoteAnswerOptions(
  practiceDrill: PracticeDrill,
  chordPrompt: ChordTonePrompt,
  triadInversionPrompt: TriadInversionPrompt
): NoteName[] {
  return practiceDrill === "triadInversion"
    ? getTriadInversionAnswerOptions(triadInversionPrompt)
    : getChordToneAnswerOptions(chordPrompt);
}

function getNoteAnswerTestIdPrefix(practiceDrill: PracticeDrill): string {
  return practiceDrill === "triadInversion" ? "triad-inversion" : "chord";
}

function getChordToneName(chordTone: ChordTone): string {
  if (chordTone === 1) {
    return "root";
  }

  return chordTone === 3 ? "3rd" : "5th";
}

function buildChordAnswerClassName(
  isSelected: boolean,
  isCorrectAnswer: boolean,
  isMissedSelection: boolean
): string {
  return [
    isSelected ? "is-selected" : "",
    isCorrectAnswer ? "is-correct" : "",
    isMissedSelection ? "is-miss" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function formatNoteTestId(note: NoteName): string {
  return note.replace("#", "sharp").replace("b", "flat");
}

function formatPerformanceStat(stat: PerformanceStat): string {
  return `${stat.accuracy}% accuracy · ${stat.missed}/${stat.attempted} missed`;
}

function formatPerformanceChip(stat: PerformanceStat): string {
  return `${stat.label}: ${stat.accuracy}% (${stat.correct}/${stat.attempted})`;
}

function formatHubAccuracy(
  session:
    | ChordToneSession
    | IntervalLandmarkSession
    | NoteRecognitionSession
    | OctaveShapeSession
    | ScaleDegreeSession
    | TriadInversionSession
    | null
): string {
  return session ? `${session.accuracy}% last session` : "No sessions yet";
}

function getRecommendedNotePreset(
  performance: ReturnType<typeof buildNoteRecognitionPerformanceSummary>,
  presets: readonly NoteRecognitionSessionPreset[]
): NoteRecognitionSessionPreset {
  return findPreset(
    presets,
    performance.weakSpots.length > 0 ? "weak-spots" : "quick-warmup"
  );
}

function getRecommendedChordPreset(
  performance: ReturnType<typeof buildChordTonePerformanceSummary>,
  presets: readonly ChordToneSessionPreset[]
): ChordToneSessionPreset {
  if (performance.weakSpots.length > 0) {
    const weakestSpot = performance.weakSpots[0];

    if (weakestSpot?.category === "tone" && weakestSpot.id === "3") {
      return findPreset(presets, "thirds-focus");
    }

    return findPreset(presets, "weak-spots");
  }

  return findPreset(presets, "quick-warmup");
}

function getRecommendedScaleDegreePreset(
  performance: ReturnType<typeof buildScaleDegreePerformanceSummary>,
  presets: readonly ScaleDegreeSessionPreset[]
): ScaleDegreeSessionPreset {
  if (performance.weakSpots.length > 0) {
    const weakestSpot = performance.weakSpots[0];

    if (weakestSpot?.category === "degree" && weakestSpot.id === "3") {
      return findPreset(presets, "thirds-focus");
    }

    if (weakestSpot?.category === "quality" && weakestSpot.id === "minor") {
      return findPreset(presets, "minor-scales");
    }

    return findPreset(presets, "weak-spots");
  }

  return findPreset(presets, "quick-warmup");
}

function getRecommendedIntervalPreset(
  performance: ReturnType<typeof buildIntervalLandmarkPerformanceSummary>,
  presets: readonly IntervalLandmarkSessionPreset[]
): IntervalLandmarkSessionPreset {
  if (performance.weakSpots.length > 0) {
    const weakestSpot = performance.weakSpots[0];

    if (weakestSpot?.category === "interval") {
      if (weakestSpot.id === "minorThird" || weakestSpot.id === "majorThird") {
        return findPreset(presets, "thirds-focus");
      }

      if (weakestSpot.id === "perfectFifth") {
        return findPreset(presets, "fifths-focus");
      }
    }

    return findPreset(presets, "weak-spots");
  }

  return findPreset(presets, "quick-warmup");
}

function getRecommendedOctavePreset(
  performance: ReturnType<typeof buildOctaveShapePerformanceSummary>,
  presets: readonly OctaveShapeSessionPreset[]
): OctaveShapeSessionPreset {
  if (performance.weakSpots.length > 0) {
    const weakestSpot = performance.weakSpots[0];

    if (weakestSpot?.category === "shape" && weakestSpot.id === "A") {
      return findPreset(presets, "a-shape-focus");
    }

    if (
      (weakestSpot?.category === "shape" && weakestSpot.id === "E") ||
      weakestSpot?.category === "sourceString"
    ) {
      return findPreset(presets, "low-string-shapes");
    }

    return findPreset(presets, "weak-spots");
  }

  return findPreset(presets, "quick-warmup");
}

function getRecommendedTriadInversionPreset(
  performance: ReturnType<typeof buildTriadInversionPerformanceSummary>,
  presets: readonly TriadInversionSessionPreset[]
): TriadInversionSessionPreset {
  if (performance.weakSpots.length > 0) {
    const weakestSpot = performance.weakSpots[0];

    if (
      weakestSpot?.category === "inversion" &&
      weakestSpot.id === "firstInversion"
    ) {
      return findPreset(presets, "first-inversions");
    }

    if (
      weakestSpot?.category === "inversion" &&
      weakestSpot.id === "secondInversion"
    ) {
      return findPreset(presets, "second-inversions");
    }

    return findPreset(presets, "weak-spots");
  }

  return findPreset(presets, "quick-warmup");
}

function buildPracticeHubRecommendation(
  notePerformance: ReturnType<typeof buildNoteRecognitionPerformanceSummary>,
  chordPerformance: ReturnType<typeof buildChordTonePerformanceSummary>,
  scaleDegreePerformance: ReturnType<typeof buildScaleDegreePerformanceSummary>,
  intervalPerformance: ReturnType<typeof buildIntervalLandmarkPerformanceSummary>,
  octavePerformance: ReturnType<typeof buildOctaveShapePerformanceSummary>,
  triadInversionPerformance: ReturnType<typeof buildTriadInversionPerformanceSummary>,
  notePreset: NoteRecognitionSessionPreset,
  chordPreset: ChordToneSessionPreset,
  scaleDegreePreset: ScaleDegreeSessionPreset,
  intervalPreset: IntervalLandmarkSessionPreset,
  octavePreset: OctaveShapeSessionPreset,
  triadInversionPreset: TriadInversionSessionPreset,
  courseProgress: ReturnType<typeof buildLearningCourseProgress>
): PracticeHubRecommendation {
  const weakestSpots: Array<{
    drill: PracticeDrill;
    stat: PerformanceStat;
    preset: PracticePreset;
    sessionLabel: string;
  }> = [];
  const weakestNoteSpot = notePerformance.weakSpots[0] ?? null;
  const weakestChordSpot = chordPerformance.weakSpots[0] ?? null;
  const weakestScaleDegreeSpot = scaleDegreePerformance.weakSpots[0] ?? null;
  const weakestIntervalSpot = intervalPerformance.weakSpots[0] ?? null;
  const weakestOctaveSpot = octavePerformance.weakSpots[0] ?? null;
  const weakestTriadInversionSpot =
    triadInversionPerformance.weakSpots[0] ?? null;

  if (weakestNoteSpot) {
    weakestSpots.push({
      drill: "note",
      stat: weakestNoteSpot,
      preset: notePreset,
      sessionLabel: "note"
    });
  }

  if (weakestChordSpot) {
    weakestSpots.push({
      drill: "chordTone",
      stat: weakestChordSpot,
      preset: chordPreset,
      sessionLabel: "chord"
    });
  }

  if (weakestScaleDegreeSpot) {
    weakestSpots.push({
      drill: "scaleDegree",
      stat: weakestScaleDegreeSpot,
      preset: scaleDegreePreset,
      sessionLabel: "scale"
    });
  }

  if (weakestIntervalSpot) {
    weakestSpots.push({
      drill: "interval",
      stat: weakestIntervalSpot,
      preset: intervalPreset,
      sessionLabel: "interval"
    });
  }

  if (weakestOctaveSpot) {
    weakestSpots.push({
      drill: "octaveShape",
      stat: weakestOctaveSpot,
      preset: octavePreset,
      sessionLabel: "octave"
    });
  }

  if (weakestTriadInversionSpot) {
    weakestSpots.push({
      drill: "triadInversion",
      stat: weakestTriadInversionSpot,
      preset: triadInversionPreset,
      sessionLabel: "triad inversion"
    });
  }

  weakestSpots.sort(
    (left, right) =>
      left.stat.accuracy - right.stat.accuracy ||
      right.stat.missed - left.stat.missed ||
      left.stat.label.localeCompare(right.stat.label)
  );

  const weakestSpot = weakestSpots[0] ?? null;
  const courseRecommendation = getCoursePracticeRecommendation(
    courseProgress,
    notePreset,
    chordPreset,
    scaleDegreePreset,
    intervalPreset,
    octavePreset,
    triadInversionPreset
  );

  if (weakestSpot && isStrongWeakSpot(weakestSpot.stat)) {
    return {
      drill: weakestSpot.drill,
      title: `Review ${weakestSpot.stat.label}`,
      description: `${weakestSpot.stat.label} are at ${weakestSpot.stat.accuracy}% across tracked ${weakestSpot.sessionLabel} sessions. Start ${weakestSpot.preset.label.toLowerCase()} for extra practice.`,
      preset: weakestSpot.preset
    };
  }

  if (courseRecommendation) {
    return courseRecommendation;
  }

  if (weakestSpot) {
    return {
      drill: weakestSpot.drill,
      title: `Review ${weakestSpot.stat.label}`,
      description: `${weakestSpot.stat.label} are the next visible weak spot in tracked ${weakestSpot.sessionLabel} sessions. Start ${weakestSpot.preset.label.toLowerCase()} for extra practice.`,
      preset: weakestSpot.preset
    };
  }

  return {
    drill: "note",
    title: "Start with a quick warmup",
    description:
      "No weak spots yet. Begin with a short note session, then FretGarden can recommend more targeted work.",
    preset: notePreset
  };
}

function isStrongWeakSpot(stat: PerformanceStat): boolean {
  return stat.accuracy < 80 || stat.missed >= 2;
}

function getCoursePracticeRecommendation(
  courseProgress: ReturnType<typeof buildLearningCourseProgress>,
  notePreset: NoteRecognitionSessionPreset,
  chordPreset: ChordToneSessionPreset,
  scaleDegreePreset: ScaleDegreeSessionPreset,
  intervalPreset: IntervalLandmarkSessionPreset,
  octavePreset: OctaveShapeSessionPreset,
  triadInversionPreset: TriadInversionSessionPreset
): PracticeHubRecommendation | null {
  const currentLesson = courseProgress.currentLesson;

  if (!currentLesson) {
    return null;
  }

  const presetByDrill: Record<PracticeDrill, PracticePreset> = {
    note: notePreset,
    chordTone: chordPreset,
    scaleDegree: scaleDegreePreset,
    interval: intervalPreset,
    octaveShape: octavePreset,
    triadInversion: triadInversionPreset
  };

  const preset = presetByDrill[currentLesson.practice.drill];

  return {
    drill: currentLesson.practice.drill,
    title: `Practice ${currentLesson.title}`,
    description: `After the guided lesson, start ${preset.label.toLowerCase()} and aim for ${formatLessonCriteria(
      currentLesson.practice.criteria.promptCount,
      currentLesson.practice.criteria.minAccuracy
    )}.`,
    preset
  };
}

function findPreset<Preset extends PracticePreset>(
  presets: readonly Preset[],
  id: string
): Preset {
  return presets.find((preset) => preset.id === id) ?? presets[0]!;
}

function collectNoteReviewPrompts(
  sessions: readonly NoteRecognitionSession[]
): MissedNoteRecognitionPrompt[] {
  const promptsByTarget = new Map<string, MissedNoteRecognitionPrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(`${prompt.targetNote}-${prompt.targetString}`, prompt);
    });
  });

  return [...promptsByTarget.values()];
}

function collectChordReviewPrompts(
  sessions: readonly ChordToneSession[]
): MissedChordTonePrompt[] {
  const promptsByTarget = new Map<string, MissedChordTonePrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(
        `${prompt.rootNote}-${prompt.quality}-${prompt.targetTone}`,
        prompt
      );
    });
  });

  return [...promptsByTarget.values()];
}

function collectScaleDegreeReviewPrompts(
  sessions: readonly ScaleDegreeSession[]
): MissedScaleDegreePrompt[] {
  const promptsByTarget = new Map<string, MissedScaleDegreePrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(
        `${prompt.rootNote}-${prompt.quality}-${prompt.targetDegree}-${prompt.targetString}`,
        prompt
      );
    });
  });

  return [...promptsByTarget.values()];
}

function collectIntervalReviewPrompts(
  sessions: readonly IntervalLandmarkSession[]
): MissedIntervalLandmarkPrompt[] {
  const promptsByTarget = new Map<string, MissedIntervalLandmarkPrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(
        `${prompt.rootNote}-${prompt.targetInterval}-${prompt.targetString}`,
        prompt
      );
    });
  });

  return [...promptsByTarget.values()];
}

function collectOctaveReviewPrompts(
  sessions: readonly OctaveShapeSession[]
): MissedOctaveShapePrompt[] {
  const promptsByTarget = new Map<string, MissedOctaveShapePrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(
        `${prompt.shape}-${prompt.sourceString}-${prompt.sourceFret}-${prompt.targetString}-${prompt.targetFret}`,
        prompt
      );
    });
  });

  return [...promptsByTarget.values()];
}

function collectTriadInversionReviewPrompts(
  sessions: readonly TriadInversionSession[]
): MissedTriadInversionPrompt[] {
  const promptsByTarget = new Map<string, MissedTriadInversionPrompt>();

  sessions.forEach((session) => {
    session.missedPrompts.forEach((prompt) => {
      promptsByTarget.set(
        `${prompt.rootNote}-${prompt.quality}-${prompt.inversion}`,
        prompt
      );
    });
  });

  return [...promptsByTarget.values()];
}
