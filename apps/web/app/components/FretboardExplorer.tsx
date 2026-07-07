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
  ProgressDashboard,
  type PracticeWeakSpot,
  type RecentPracticeSession
} from "./ProgressDashboard";
import {
  getLesson,
  type Lesson,
  type LessonPracticeDrill
} from "../lib/lessons";
import {
  LESSON_PROGRESS_STORAGE_KEY,
  doesLessonPracticeMeetCriteria,
  markLessonPracticed,
  markLessonStarted,
  parseLessonProgress,
  serializeLessonProgress
} from "../lib/lessonProgress";
import {
  CHORD_TONE_HISTORY_LIMIT,
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
  DEFAULT_NOTE_RECOGNITION_SESSION_SETTINGS,
  NOTE_RECOGNITION_HISTORY_LIMIT,
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
  DEFAULT_SCALE_DEGREE_SESSION_SETTINGS,
  SCALE_DEGREE_HISTORY_LIMIT,
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

type DisplayMode = "practice" | "notes" | "find" | "scale" | "chord";
type PracticeDrill = "note" | "chordTone" | "scaleDegree";
type ActiveVariant = "note" | "root" | "scale" | "chord" | "answer" | "miss";
type PerformanceStat =
  | ChordTonePerformanceStat
  | NoteRecognitionPerformanceStat
  | ScaleDegreePerformanceStat;
type PracticePreset =
  | ChordToneSessionPreset
  | NoteRecognitionSessionPreset
  | ScaleDegreeSessionPreset;

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

interface PracticeReviewContent {
  metrics: PracticeReviewMetric[];
  missedPrompts: PracticeReviewItem[];
  weakSpots: PracticeReviewItem[];
  breakdowns: PracticeReviewSection[];
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

const NOTE_RECOGNITION_HISTORY_STORAGE_KEY =
  "pocket-practice:note-recognition-history";
const CHORD_TONE_HISTORY_STORAGE_KEY = "pocket-practice:chord-tone-history";
const SCALE_DEGREE_HISTORY_STORAGE_KEY =
  "pocket-practice:scale-degree-history";
const NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:note-recognition-custom-preset";
const CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:chord-tone-custom-preset";
const SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:scale-degree-custom-preset";

export function FretboardExplorer() {
  const [mode, setMode] = useState<DisplayMode>("practice");
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
  const [completedSession, setCompletedSession] =
    useState<NoteRecognitionSession | null>(null);
  const [completedChordSession, setCompletedChordSession] =
    useState<ChordToneSession | null>(null);
  const [completedScaleDegreeSession, setCompletedScaleDegreeSession] =
    useState<ScaleDegreeSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<
    NoteRecognitionSession[]
  >([]);
  const [chordSessionHistory, setChordSessionHistory] = useState<
    ChordToneSession[]
  >([]);
  const [scaleDegreeSessionHistory, setScaleDegreeSessionHistory] = useState<
    ScaleDegreeSession[]
  >([]);
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
        currentScaleDegreeAttempt
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
      currentScaleDegreeAttempt
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
        notePromptQueue.length,
        chordPromptQueue.length,
        scaleDegreePromptQueue.length
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
      notePromptQueue.length,
      chordPromptQueue.length,
      scaleDegreePromptQueue.length
    ]
  );
  const selectedActive = selectedPosition
    ? activePositions.get(positionKey(selectedPosition))
    : undefined;
  const activeDrillSummary = getActiveDrillSummary(
    practiceDrill,
    drillSummary,
    chordDrillSummary,
    scaleDegreeDrillSummary
  );
  const activeDrillAttempt = getActiveDrillAttempt(
    practiceDrill,
    currentAttempt,
    currentChordAttempt,
    currentScaleDegreeAttempt
  );
  const activePromptCount = getActivePromptCount(
    practiceDrill,
    notePromptQueue.length,
    chordPromptQueue.length,
    scaleDegreePromptQueue.length
  );
  const latestSession = getLatestSession(
    practiceDrill,
    sessionHistory,
    chordSessionHistory,
    scaleDegreeSessionHistory
  );
  const chordMissedReviewCount = chordReviewPrompts.length;
  const noteMissedReviewCount = noteReviewPrompts.length;
  const scaleDegreeMissedReviewCount = scaleDegreeReviewPrompts.length;
  const notePresetOptions = customNotePreset
    ? [...NOTE_RECOGNITION_SESSION_PRESETS, customNotePreset]
    : NOTE_RECOGNITION_SESSION_PRESETS;
  const chordPresetOptions = customChordPreset
    ? [...CHORD_TONE_SESSION_PRESETS, customChordPreset]
    : CHORD_TONE_SESSION_PRESETS;
  const scaleDegreePresetOptions = customScaleDegreePreset
    ? [...SCALE_DEGREE_SESSION_PRESETS, customScaleDegreePreset]
    : SCALE_DEGREE_SESSION_PRESETS;
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
  const practiceRecommendation = buildPracticeHubRecommendation(
    notePerformance,
    chordPerformance,
    scaleDegreePerformance,
    recommendedNotePreset,
    recommendedChordPreset,
    recommendedScaleDegreePreset
  );
  const recentPracticeSessions = useMemo(
    () =>
      buildRecentPracticeSessions(
        sessionHistory,
        chordSessionHistory,
        scaleDegreeSessionHistory
      ),
    [sessionHistory, chordSessionHistory, scaleDegreeSessionHistory]
  );
  const dashboardWeakSpots = useMemo(
    () =>
      buildDashboardWeakSpots(
        notePerformance.weakSpots,
        chordPerformance.weakSpots,
        scaleDegreePerformance.weakSpots
      ),
    [
      notePerformance.weakSpots,
      chordPerformance.weakSpots,
      scaleDegreePerformance.weakSpots
    ]
  );
  const activeLesson = useMemo(
    () => (activeLessonSlug ? getLesson(activeLessonSlug) ?? null : null),
    [activeLessonSlug]
  );
  const activeLessonOutcome = useMemo(
    () =>
      activeLesson && activeDrillSummary.isComplete
        ? buildLessonReviewOutcome(activeLesson, activeDrillSummary)
        : null,
    [activeLesson, activeDrillSummary]
  );
  const reviewContent = useMemo(
    () =>
      buildPracticeReviewContent(
        practiceDrill,
        activeDrillSummary,
        missedPrompts,
        missedChordPrompts,
        missedScaleDegreePrompts,
        notePerformance,
        chordPerformance,
        scaleDegreePerformance
      ),
    [
      activeDrillSummary,
      chordPerformance,
      missedChordPrompts,
      missedPrompts,
      missedScaleDegreePrompts,
      notePerformance,
      practiceDrill,
      scaleDegreePerformance
    ]
  );

  useEffect(() => {
    setSessionHistory(
      readStoredSessionHistory<NoteRecognitionSession>(
        NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
        NOTE_RECOGNITION_HISTORY_LIMIT
      )
    );
    setChordSessionHistory(
      readStoredSessionHistory<ChordToneSession>(
        CHORD_TONE_HISTORY_STORAGE_KEY,
        CHORD_TONE_HISTORY_LIMIT
      )
    );
    setScaleDegreeSessionHistory(
      readStoredSessionHistory<ScaleDegreeSession>(
        SCALE_DEGREE_HISTORY_STORAGE_KEY,
        SCALE_DEGREE_HISTORY_LIMIT
      )
    );
    setCustomNotePreset(
      readStoredPreset<NoteRecognitionSessionPreset>(
        NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY
      )
    );
    setCustomChordPreset(
      readStoredPreset<ChordToneSessionPreset>(
        CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY
      )
    );
    setCustomScaleDegreePreset(
      readStoredPreset<ScaleDegreeSessionPreset>(
        SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY
      )
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

    if (requestedDrill === "chordTone") {
      resetChordToneDrill();
    } else if (requestedDrill === "scaleDegree") {
      resetScaleDegreeDrill();
    } else {
      resetNoteRecognitionDrill();
    }

    if (requestedLesson) {
      markStoredLessonStarted(requestedLesson.slug, requestedLesson.drill);
    }

    scrollPracticeSessionIntoView();
  }, []);

  useEffect(() => {
    if (!drillSummary.isComplete || completedSession !== null) {
      return;
    }

    const nextSession = buildNoteRecognitionSession(
      attempts,
      undefined,
      notePromptQueue.length
    );

    setCompletedSession(nextSession);
    setSessionHistory((previousHistory) => {
      const nextHistory = appendNoteRecognitionSession(
        previousHistory,
        nextSession
      );
      writeStoredSessionHistory(
        NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
        nextHistory
      );

      return nextHistory;
    });
    recordActiveLessonSession("note", nextSession);
  }, [
    activeLessonSlug,
    attempts,
    completedSession,
    drillSummary.isComplete,
    notePromptQueue.length
  ]);

  useEffect(() => {
    if (!chordDrillSummary.isComplete || completedChordSession !== null) {
      return;
    }

    const nextSession = buildChordToneSession(
      chordAttempts,
      undefined,
      chordPromptQueue.length
    );

    setCompletedChordSession(nextSession);
    setChordSessionHistory((previousHistory) => {
      const nextHistory = appendChordToneSession(previousHistory, nextSession);
      writeStoredSessionHistory(CHORD_TONE_HISTORY_STORAGE_KEY, nextHistory);

      return nextHistory;
    });
    recordActiveLessonSession("chordTone", nextSession);
  }, [
    activeLessonSlug,
    chordAttempts,
    chordDrillSummary.isComplete,
    chordPromptQueue.length,
    completedChordSession
  ]);

  useEffect(() => {
    if (
      !scaleDegreeDrillSummary.isComplete ||
      completedScaleDegreeSession !== null
    ) {
      return;
    }

    const nextSession = buildScaleDegreeSession(
      scaleAttempts,
      undefined,
      scaleDegreePromptQueue.length
    );

    setCompletedScaleDegreeSession(nextSession);
    setScaleDegreeSessionHistory((previousHistory) => {
      const nextHistory = appendScaleDegreeSession(
        previousHistory,
        nextSession
      );
      writeStoredSessionHistory(SCALE_DEGREE_HISTORY_STORAGE_KEY, nextHistory);

      return nextHistory;
    });
    recordActiveLessonSession("scaleDegree", nextSession);
  }, [
    activeLessonSlug,
    completedScaleDegreeSession,
    scaleAttempts,
    scaleDegreeDrillSummary.isComplete,
    scaleDegreePromptQueue.length
  ]);

  function handleModeChange(nextMode: DisplayMode): void {
    setMode(nextMode);
    setSelectedPosition(null);
  }

  function recordActiveLessonSession(
    completedDrill: PracticeDrill,
    session: NoteRecognitionSession | ChordToneSession | ScaleDegreeSession
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

    setSelectedPosition(position);

    if (mode !== "practice") {
      return;
    }

    if (practiceDrill === "chordTone") {
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

  function handleNoteSessionSettingsChange(
    nextSettings: Partial<NoteRecognitionSessionSettings>
  ): void {
    setNoteSessionSettings((previousSettings) => ({
      ...previousSettings,
      ...nextSettings
    }));
    resetNoteRecognitionDrill();
  }

  function handleNotePresetSelect(preset: NoteRecognitionSessionPreset): void {
    setNoteSessionSettings(preset.settings);
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

    handleStartNotePreset(recommendation.preset as NoteRecognitionSessionPreset);
  }

  function handleSaveNotePreset(): void {
    const nextPreset = {
      id: "custom",
      label: "Custom",
      settings: noteSessionSettings
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

    if (practiceDrill === "chordTone") {
      setChordPromptIndex((previousPromptIndex) => previousPromptIndex + 1);
      return;
    }

    if (practiceDrill === "scaleDegree") {
      setScalePromptIndex((previousPromptIndex) => previousPromptIndex + 1);
      return;
    }

    setPromptIndex((previousPromptIndex) => previousPromptIndex + 1);
  }

  function handleRestartDrill(): void {
    if (practiceDrill === "chordTone") {
      resetChordToneDrill();
    } else if (practiceDrill === "scaleDegree") {
      resetScaleDegreeDrill();
    } else {
      resetNoteRecognitionDrill();
    }
  }

  function handlePracticeMisses(): void {
    if (activeDrillSummary.missed === 0) {
      return;
    }

    if (practiceDrill === "chordTone") {
      setChordSessionSettings((previousSettings) => ({
        ...previousSettings,
        promptOrder: "fixed",
        reviewMode: "missed"
      }));
      resetChordToneDrill();
      return;
    }

    if (practiceDrill === "scaleDegree") {
      setScaleDegreeSessionSettings((previousSettings) => ({
        ...previousSettings,
        promptOrder: "fixed",
        reviewMode: "missed"
      }));
      resetScaleDegreeDrill();
      return;
    }

    setNoteSessionSettings((previousSettings) => ({
      ...previousSettings,
      promptOrder: "fixed",
      reviewMode: "missed"
    }));
    resetNoteRecognitionDrill();
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Pocket.Practice</p>
          <h1>Fretboard Practice</h1>
          <p>
            Explore standard tuning, find notes, and map chord or scale tones
            across the first twelve frets.
          </p>
        </div>
        <div className="status-panel" aria-label="Current fretboard setup">
          <span>Guitar</span>
          <strong>Standard tuning</strong>
          <small>E A D G B E · Frets 0-12</small>
        </div>
      </header>

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
        recommendationTitle={practiceRecommendation.title}
        recommendationDescription={practiceRecommendation.description}
        onStartRecommendation={() =>
          handleStartRecommendation(practiceRecommendation)
        }
      />

      <ProgressDashboard
        recommendationTitle={practiceRecommendation.title}
        recommendationDescription={practiceRecommendation.description}
        onStartRecommendation={() =>
          handleStartRecommendation(practiceRecommendation)
        }
        recentSessions={recentPracticeSessions}
        weakSpots={dashboardWeakSpots}
      />

      <section
        id="practice"
        className="practice-layout"
        aria-label="Fretboard explorer"
        ref={practiceLayoutRef}
      >
        <aside className="controls-panel" aria-label="Fretboard controls">
          <div className="control-group">
            <span className="control-label">Mode</span>
            <div className="segmented-control">
              {modes.map((option) => (
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

          {mode === "practice" ? (
            <div className="control-group">
              <span className="control-label">Drill</span>
              <div className="segmented-control option-grid three">
                {([
                  { id: "note", label: "Note drill" },
                  { id: "chordTone", label: "Chord drill" },
                  { id: "scaleDegree", label: "Scale drill" }
                ] as const).map((option) => (
                  <button
                    className={option.id === practiceDrill ? "is-selected" : ""}
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
          ) : null}

          {mode === "practice" ? (
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
            />
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

          <div className="summary-panel">
            <span>{summary.badge}</span>
            <strong>{mode === "practice" ? "Practice session" : summary.title}</strong>
            <p>
              {mode === "practice"
                ? "Read the active prompt beneath the fretboard, then answer from the board or answer controls."
                : summary.description}
            </p>
            <div className="tone-list" aria-label="Current tones">
              {(mode === "practice"
                ? [
                    getPracticeDrillLabel(practiceDrill),
                    `${activeDrillSummary.attempted}/${activePromptCount} complete`
                  ]
                : summary.tones
              ).map((tone) => (
                <span key={tone}>{tone}</span>
              ))}
            </div>
          </div>

          {mode === "practice" && practiceDrill === "chordTone" ? (
            <div className="control-group chord-answer-panel">
              <span className="control-label">Answer</span>
              <div className="note-grid chord-answer-grid">
                {getChordToneAnswerOptions(currentChordPrompt).map((note) => {
                  const isSelected = currentChordAttempt?.selectedNote === note;
                  const isCorrectAnswer =
                    currentChordAttempt !== null &&
                    currentChordAttempt.targetNote === note;
                  const isMissedSelection =
                    isSelected && currentChordAttempt?.isCorrect === false;

                  return (
                    <button
                      className={buildChordAnswerClassName(
                        isSelected,
                        isCorrectAnswer,
                        isMissedSelection
                      )}
                      data-testid={`chord-answer-${formatNoteTestId(note)}`}
                      disabled={
                        currentChordAttempt !== null ||
                        chordDrillSummary.isComplete
                      }
                      key={note}
                      onClick={() => handleChordToneAnswer(note)}
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
                aria-label={`${activeDrillSummary.attempted} of ${activePromptCount} prompts complete`}
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
            <div className="last-session-panel" data-testid="last-session">
              <span className="control-label">Last session</span>
              {latestSession ? (
                <>
                  <strong>
                    {latestSession.correct}/{latestSession.promptCount} correct
                  </strong>
                  <p>
                    {latestSession.accuracy}% accuracy ·{" "}
                    {formatSessionDate(latestSession.completedAt)}
                  </p>
                </>
              ) : (
                <p>Finish a session to save your first local result.</p>
              )}
            </div>
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
                      currentScaleDegreePrompt
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
                          !isScaleDegreeAnswerPosition(position)));
                    const isTargetString =
                      mode === "practice" &&
                      ((practiceDrill === "note" &&
                        position.string === currentPrompt.targetString) ||
                        (practiceDrill === "scaleDegree" &&
                          position.string ===
                            currentScaleDegreePrompt.targetString));
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

          <PracticePromptPanel
            practicePrompt={
              mode === "practice"
                ? {
                    label: activeDrillSummary.isComplete
                      ? "Session complete"
                      : "Prompt",
                    title: summary.title,
                    status: getPracticePromptStatus(
                      practiceDrill,
                      activeDrillSummary,
                      activeDrillAttempt
                    ),
                    description: summary.description,
                    canGoNext:
                      activeDrillAttempt !== null &&
                      !activeDrillSummary.isComplete,
                    onNextPrompt: handleNextPrompt,
                    onReset: handleRestartDrill
                  }
                : null
            }
            referencePrompt={{
              title: selectedPosition
                ? `String ${selectedPosition.string}, fret ${selectedPosition.fret}: ${selectedPosition.note}`
                : "Choose any fret",
              status: selectedActive?.descriptor ?? "No active role",
              description: "Choose any fret to inspect its note and role."
            }}
          />

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
  currentScaleDegreeAttempt: ScaleDegreeAttempt | null
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
  notePromptCount: number,
  chordPromptCount: number,
  scaleDegreePromptCount: number
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
          description: `You found ${chordDrillSummary.correct} of ${chordDrillSummary.attempted} chord-tone prompts.`,
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
          description: `You found ${scaleDegreeDrillSummary.correct} of ${scaleDegreeDrillSummary.attempted} scale-degree prompts.`,
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

    const targetStringName = getStringDisplayName(drillPrompt.targetString);

    if (drillSummary.isComplete) {
      return {
        title: "Note recognition complete",
        description: `You found ${drillSummary.correct} of ${drillSummary.attempted} prompts.`,
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
  scaleDegreePrompt: ScaleDegreePrompt
): string {
  return [
    "string-label",
    isPracticeTargetString(mode, practiceDrill, string, drillPrompt, scaleDegreePrompt)
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

  return mode === "practice" ? "" : position.note;
}

function isPracticeTargetString(
  mode: DisplayMode,
  practiceDrill: PracticeDrill,
  string: GuitarStringNumber,
  drillPrompt: NoteRecognitionPrompt,
  scaleDegreePrompt: ScaleDegreePrompt
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

  return false;
}

function positionKey(position: FretPosition): string {
  return `${position.string}-${position.fret}`;
}

function getStringDisplayName(string: GuitarStringNumber): string {
  return stringDisplayNames[string];
}

function getPracticeDrillLabel(practiceDrill: PracticeDrill): string {
  if (practiceDrill === "chordTone") {
    return "Chord tones";
  }

  if (practiceDrill === "scaleDegree") {
    return "Scale degrees";
  }

  return "Note recognition";
}

function parsePracticeDrillParam(value: string | null): PracticeDrill | null {
  if (
    value === "note" ||
    value === "chordTone" ||
    value === "scaleDegree"
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
  session: NoteRecognitionSession | ChordToneSession | ScaleDegreeSession,
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

  return "Note recognition complete";
}

function buildLessonReviewOutcome(
  lesson: Lesson,
  summary: NoteRecognitionSummary | ChordToneSummary | ScaleDegreeSummary
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
      description: `${lesson.title} is complete. You met the lesson target with ${summary.accuracy}% accuracy across ${summary.attempted} prompts.`,
      criteriaLabel
    };
  }

  return {
    status: "in-progress",
    title: "Keep this lesson in progress",
    description: `${lesson.title} needs ${criteriaLabel.toLowerCase()}. This session reached ${summary.accuracy}% accuracy across ${summary.attempted} prompts.`,
    criteriaLabel
  };
}

function buildPracticeReviewContent(
  practiceDrill: PracticeDrill,
  summary: NoteRecognitionSummary | ChordToneSummary | ScaleDegreeSummary,
  noteMisses: readonly MissedNoteRecognitionPrompt[],
  chordMisses: readonly MissedChordTonePrompt[],
  scaleDegreeMisses: readonly MissedScaleDegreePrompt[],
  notePerformance: ReturnType<typeof buildNoteRecognitionPerformanceSummary>,
  chordPerformance: ReturnType<typeof buildChordTonePerformanceSummary>,
  scaleDegreePerformance: ReturnType<typeof buildScaleDegreePerformanceSummary>
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

function toPerformanceReviewItem(stat: PerformanceStat): PracticeReviewItem {
  return {
    id: `${stat.category}-${stat.id}`,
    title: stat.label,
    detail: formatPerformanceStat(stat)
  };
}

function formatLessonCriteria(promptCount: number, minAccuracy: number): string {
  return `${promptCount} prompts at ${minAccuracy}%+`;
}

function getPracticePromptStatus(
  practiceDrill: PracticeDrill,
  summary: NoteRecognitionSummary | ChordToneSummary | ScaleDegreeSummary,
  attempt: NoteRecognitionAttempt | ChordToneAttempt | ScaleDegreeAttempt | null
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

  return practiceDrill === "chordTone" ? "Choose a note" : "Choose a fret";
}

function getActiveDrillSummary(
  practiceDrill: PracticeDrill,
  noteSummary: NoteRecognitionSummary,
  chordSummary: ChordToneSummary,
  scaleDegreeSummary: ScaleDegreeSummary
): NoteRecognitionSummary | ChordToneSummary | ScaleDegreeSummary {
  if (practiceDrill === "chordTone") {
    return chordSummary;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeSummary;
  }

  return noteSummary;
}

function getActiveDrillAttempt(
  practiceDrill: PracticeDrill,
  noteAttempt: NoteRecognitionAttempt | null,
  chordAttempt: ChordToneAttempt | null,
  scaleDegreeAttempt: ScaleDegreeAttempt | null
): NoteRecognitionAttempt | ChordToneAttempt | ScaleDegreeAttempt | null {
  if (practiceDrill === "chordTone") {
    return chordAttempt;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeAttempt;
  }

  return noteAttempt;
}

function getActivePromptCount(
  practiceDrill: PracticeDrill,
  notePromptCount: number,
  chordPromptCount: number,
  scaleDegreePromptCount: number
): number {
  if (practiceDrill === "chordTone") {
    return chordPromptCount;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreePromptCount;
  }

  return notePromptCount;
}

function getLatestSession(
  practiceDrill: PracticeDrill,
  noteHistory: readonly NoteRecognitionSession[],
  chordHistory: readonly ChordToneSession[],
  scaleDegreeHistory: readonly ScaleDegreeSession[]
): NoteRecognitionSession | ChordToneSession | ScaleDegreeSession | null {
  if (practiceDrill === "chordTone") {
    return chordHistory[0] ?? null;
  }

  if (practiceDrill === "scaleDegree") {
    return scaleDegreeHistory[0] ?? null;
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
  session: ChordToneSession | NoteRecognitionSession | ScaleDegreeSession | null
): string {
  return session ? `${session.accuracy}% last session` : "No sessions yet";
}

function buildRecentPracticeSessions(
  noteSessions: readonly NoteRecognitionSession[],
  chordSessions: readonly ChordToneSession[],
  scaleSessions: readonly ScaleDegreeSession[]
): RecentPracticeSession[] {
  return [
    ...noteSessions.map((session) => ({
      session,
      drillLabel: "Note recognition"
    })),
    ...chordSessions.map((session) => ({
      session,
      drillLabel: "Chord tones"
    })),
    ...scaleSessions.map((session) => ({
      session,
      drillLabel: "Scale degrees"
    }))
  ]
    .sort(
      (left, right) =>
        new Date(right.session.completedAt).getTime() -
        new Date(left.session.completedAt).getTime()
    )
    .slice(0, 5)
    .map(({ session, drillLabel }) =>
      toRecentPracticeSession(session, drillLabel)
    );
}

function toRecentPracticeSession(
  session: NoteRecognitionSession | ChordToneSession | ScaleDegreeSession,
  drillLabel: string
): RecentPracticeSession {
  return {
    id: `${drillLabel}-${session.id}`,
    drillLabel,
    accuracy: session.accuracy,
    correct: session.correct,
    promptCount: session.promptCount,
    completedAtLabel: formatSessionDate(session.completedAt)
  };
}

function buildDashboardWeakSpots(
  noteWeakSpots: readonly NoteRecognitionPerformanceStat[],
  chordWeakSpots: readonly ChordTonePerformanceStat[],
  scaleWeakSpots: readonly ScaleDegreePerformanceStat[]
): PracticeWeakSpot[] {
  return [
    ...noteWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Note recognition")),
    ...chordWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Chord tones")),
    ...scaleWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Scale degrees"))
  ]
    .sort(
      (left, right) =>
        left.accuracy - right.accuracy ||
        right.missed - left.missed ||
        right.attempted - left.attempted ||
        left.label.localeCompare(right.label)
    )
    .slice(0, 6);
}

function toPracticeWeakSpot(
  stat: PerformanceStat,
  drillLabel: string
): PracticeWeakSpot {
  return {
    id: `${drillLabel}-${stat.category}-${stat.id}`,
    drillLabel,
    label: stat.label,
    accuracy: stat.accuracy,
    missed: stat.missed,
    attempted: stat.attempted
  };
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

function buildPracticeHubRecommendation(
  notePerformance: ReturnType<typeof buildNoteRecognitionPerformanceSummary>,
  chordPerformance: ReturnType<typeof buildChordTonePerformanceSummary>,
  scaleDegreePerformance: ReturnType<typeof buildScaleDegreePerformanceSummary>,
  notePreset: NoteRecognitionSessionPreset,
  chordPreset: ChordToneSessionPreset,
  scaleDegreePreset: ScaleDegreeSessionPreset
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

  weakestSpots.sort(
    (left, right) =>
      left.stat.accuracy - right.stat.accuracy ||
      right.stat.missed - left.stat.missed ||
      left.stat.label.localeCompare(right.stat.label)
  );

  const weakestSpot = weakestSpots[0] ?? null;

  if (weakestSpot) {
    return {
      drill: weakestSpot.drill,
      title: `Review ${weakestSpot.stat.label}`,
      description: `${weakestSpot.stat.label} are at ${weakestSpot.stat.accuracy}% across tracked ${weakestSpot.sessionLabel} sessions. Start ${weakestSpot.preset.label.toLowerCase()} to reinforce it.`,
      preset: weakestSpot.preset
    };
  }

  return {
    drill: "note",
    title: "Start with a quick warmup",
    description:
      "No weak spots yet. Begin with a short note session, then Pocket.Practice can recommend more targeted work.",
    preset: notePreset
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

function formatSessionDate(completedAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(completedAt));
}

function readStoredSessionHistory<Session>(
  storageKey: string,
  limit: number
): Session[] {
  try {
    const storedHistory = window.localStorage.getItem(storageKey);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory) as Session[];

    return Array.isArray(parsedHistory) ? parsedHistory.slice(0, limit) : [];
  } catch {
    return [];
  }
}

function writeStoredSessionHistory<Session>(
  storageKey: string,
  history: Session[]
): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(history));
  } catch {
    // Local progress is a convenience; the drill should keep working if storage is unavailable.
  }
}

function readStoredLessonProgress() {
  return parseLessonProgress(
    window.localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY)
  );
}

function writeStoredLessonProgress(
  progress: ReturnType<typeof parseLessonProgress>
): void {
  try {
    window.localStorage.setItem(
      LESSON_PROGRESS_STORAGE_KEY,
      serializeLessonProgress(progress)
    );
  } catch {
    // Lesson progress is a convenience; practice should keep working if storage is unavailable.
  }
}

function readStoredPreset<Preset>(storageKey: string): Preset | null {
  try {
    const storedPreset = window.localStorage.getItem(storageKey);

    return storedPreset ? (JSON.parse(storedPreset) as Preset) : null;
  } catch {
    return null;
  }
}

function writeStoredPreset<Preset>(storageKey: string, preset: Preset): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(preset));
  } catch {
    // Custom presets are a convenience; the drill should still work without storage.
  }
}
