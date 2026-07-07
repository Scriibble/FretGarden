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
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CHORD_TONE_HISTORY_LIMIT,
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
  type ChordTonePrompt,
  type ChordTonePromptOrder,
  type ChordTonePerformanceStat,
  type ChordToneQualityFocus,
  type ChordToneReviewMode,
  type ChordToneSession,
  type ChordToneSessionLength,
  type ChordToneSessionSettings,
  type ChordToneToneFocus,
  type ChordToneSummary
} from "../lib/chordToneRecognition";
import {
  NOTE_RECOGNITION_PROMPTS,
  NOTE_RECOGNITION_HISTORY_LIMIT,
  appendNoteRecognitionSession,
  buildNoteRecognitionPerformanceSummary,
  buildNoteRecognitionSession,
  buildNoteRecognitionAttempt,
  getCurrentPrompt,
  getMissedNoteRecognitionPrompts,
  isNoteRecognitionAnswerPosition,
  isNoteRecognitionCorrectPosition,
  summarizeNoteRecognition,
  type NoteRecognitionAttempt,
  type NoteRecognitionPerformanceStat,
  type NoteRecognitionPrompt,
  type NoteRecognitionSession,
  type NoteRecognitionSummary
} from "../lib/noteRecognition";

type DisplayMode = "practice" | "notes" | "find" | "scale" | "chord";
type PracticeDrill = "note" | "chordTone";
type ActiveVariant = "note" | "root" | "scale" | "chord" | "answer" | "miss";
type PerformanceStat =
  | ChordTonePerformanceStat
  | NoteRecognitionPerformanceStat;

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
const chordSessionLengthOptions = [6, 12, 20] as const satisfies readonly ChordToneSessionLength[];
const chordQualityFocusOptions = [
  { id: "both", label: "Both" },
  { id: "major", label: "Major" },
  { id: "minor", label: "Minor" }
] as const satisfies ReadonlyArray<{
  id: ChordToneQualityFocus;
  label: string;
}>;
const chordToneFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "root", label: "Root" },
  { id: "third", label: "3rd" },
  { id: "fifth", label: "5th" }
] as const satisfies ReadonlyArray<{
  id: ChordToneToneFocus;
  label: string;
}>;
const chordPromptOrderOptions = [
  { id: "fixed", label: "Fixed" },
  { id: "random", label: "Random" }
] as const satisfies ReadonlyArray<{
  id: ChordTonePromptOrder;
  label: string;
}>;
const chordReviewModeOptions = [
  { id: "full", label: "Full set" },
  { id: "missed", label: "Missed only" }
] as const satisfies ReadonlyArray<{
  id: ChordToneReviewMode;
  label: string;
}>;

export function FretboardExplorer() {
  const [mode, setMode] = useState<DisplayMode>("practice");
  const [practiceDrill, setPracticeDrill] = useState<PracticeDrill>("note");
  const [rootNote, setRootNote] = useState<NoteName>("C");
  const [scaleQuality, setScaleQuality] = useState<ScaleQuality>("major");
  const [chordQuality, setChordQuality] = useState<TriadQuality>("major");
  const [promptIndex, setPromptIndex] = useState(0);
  const [attempts, setAttempts] = useState<NoteRecognitionAttempt[]>([]);
  const [chordPromptIndex, setChordPromptIndex] = useState(0);
  const [chordAttempts, setChordAttempts] = useState<ChordToneAttempt[]>([]);
  const [chordSessionSettings, setChordSessionSettings] =
    useState<ChordToneSessionSettings>(DEFAULT_CHORD_TONE_SESSION_SETTINGS);
  const [chordSessionNonce, setChordSessionNonce] = useState(0);
  const [completedSession, setCompletedSession] =
    useState<NoteRecognitionSession | null>(null);
  const [completedChordSession, setCompletedChordSession] =
    useState<ChordToneSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<
    NoteRecognitionSession[]
  >([]);
  const [chordSessionHistory, setChordSessionHistory] = useState<
    ChordToneSession[]
  >([]);
  const [selectedPosition, setSelectedPosition] = useState<FretPosition | null>(
    null
  );

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
  const latestChordMissedPrompts = useMemo(
    () => chordSessionHistory[0]?.missedPrompts ?? [],
    [chordSessionHistory]
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
  const chordPromptQueue = useMemo(
    () =>
      buildChordTonePromptSession(
        chordSessionSettings,
        latestChordMissedPrompts
      ),
    [chordSessionSettings, chordSessionNonce, latestChordMissedPrompts]
  );
  const currentPrompt = getCurrentPrompt(promptIndex);
  const currentAttempt =
    attempts.find((attempt) => attempt.promptIndex === promptIndex) ?? null;
  const currentChordPrompt = getCurrentChordTonePrompt(
    chordPromptIndex,
    chordPromptQueue
  );
  const currentChordAttempt =
    chordAttempts.find((attempt) => attempt.promptIndex === chordPromptIndex) ??
    null;
  const drillSummary = useMemo(
    () => summarizeNoteRecognition(attempts),
    [attempts]
  );
  const chordDrillSummary = useMemo(
    () => summarizeChordToneRecognition(chordAttempts, chordPromptQueue.length),
    [chordAttempts, chordPromptQueue.length]
  );
  const missedPrompts = useMemo(
    () => getMissedNoteRecognitionPrompts(attempts),
    [attempts]
  );
  const missedChordPrompts = useMemo(
    () => getMissedChordTonePrompts(chordAttempts),
    [chordAttempts]
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
        currentChordAttempt
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
      currentChordAttempt
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
        chordPromptQueue.length
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
      chordPromptQueue.length
    ]
  );
  const selectedActive = selectedPosition
    ? activePositions.get(positionKey(selectedPosition))
    : undefined;
  const activeDrillSummary =
    practiceDrill === "note" ? drillSummary : chordDrillSummary;
  const activeDrillAttempt =
    practiceDrill === "note" ? currentAttempt : currentChordAttempt;
  const activePromptCount =
    practiceDrill === "note"
      ? NOTE_RECOGNITION_PROMPTS.length
      : chordPromptQueue.length;
  const latestSession =
    practiceDrill === "note"
      ? (sessionHistory[0] ?? null)
      : (chordSessionHistory[0] ?? null);
  const chordMissedReviewCount = latestChordMissedPrompts.length;

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
  }, []);

  useEffect(() => {
    if (!drillSummary.isComplete || completedSession !== null) {
      return;
    }

    const nextSession = buildNoteRecognitionSession(attempts);

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
  }, [attempts, completedSession, drillSummary.isComplete]);

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
  }, [
    chordAttempts,
    chordDrillSummary.isComplete,
    chordPromptQueue.length,
    completedChordSession
  ]);

  function handleModeChange(nextMode: DisplayMode): void {
    setMode(nextMode);
    setSelectedPosition(null);
  }

  function handlePositionClick(position: FretPosition): void {
    if (
      mode === "practice" &&
      practiceDrill === "note" &&
      !isNoteRecognitionAnswerPosition(position)
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

  function resetChordToneDrill(): void {
    setChordPromptIndex(0);
    setChordAttempts([]);
    setCompletedChordSession(null);
    setSelectedPosition(null);
    setChordSessionNonce((previousNonce) => previousNonce + 1);
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

    setPromptIndex((previousPromptIndex) => previousPromptIndex + 1);
  }

  function handleRestartDrill(): void {
    if (practiceDrill === "chordTone") {
      resetChordToneDrill();
    } else {
      setPromptIndex(0);
      setAttempts([]);
      setCompletedSession(null);
      setSelectedPosition(null);
    }
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

      <section className="practice-layout" aria-label="Fretboard explorer">
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
              <div className="segmented-control compact">
                {([
                  { id: "note", label: "Note drill" },
                  { id: "chordTone", label: "Chord drill" }
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

          {mode === "practice" && practiceDrill === "chordTone" ? (
            <div className="session-setup-panel">
              <span className="control-label">Session setup</span>

              <div className="setup-field">
                <span>Length</span>
                <div className="segmented-control option-grid three">
                  {chordSessionLengthOptions.map((sessionLength) => (
                    <button
                      className={
                        chordSessionSettings.sessionLength === sessionLength
                          ? "is-selected"
                          : ""
                      }
                      data-testid={`chord-length-${sessionLength}`}
                      key={sessionLength}
                      onClick={() =>
                        handleChordSessionSettingsChange({ sessionLength })
                      }
                      type="button"
                    >
                      {sessionLength}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-field">
                <span>Quality</span>
                <div className="segmented-control option-grid three">
                  {chordQualityFocusOptions.map((option) => (
                    <button
                      className={
                        chordSessionSettings.qualityFocus === option.id
                          ? "is-selected"
                          : ""
                      }
                      data-testid={`chord-quality-${option.id}`}
                      key={option.id}
                      onClick={() =>
                        handleChordSessionSettingsChange({
                          qualityFocus: option.id
                        })
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-field">
                <span>Tone</span>
                <div className="segmented-control option-grid four">
                  {chordToneFocusOptions.map((option) => (
                    <button
                      className={
                        chordSessionSettings.toneFocus === option.id
                          ? "is-selected"
                          : ""
                      }
                      data-testid={`chord-tone-${option.id}`}
                      key={option.id}
                      onClick={() =>
                        handleChordSessionSettingsChange({
                          toneFocus: option.id
                        })
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-field">
                <span>Order</span>
                <div className="segmented-control compact">
                  {chordPromptOrderOptions.map((option) => (
                    <button
                      className={
                        chordSessionSettings.promptOrder === option.id
                          ? "is-selected"
                          : ""
                      }
                      data-testid={`chord-order-${option.id}`}
                      key={option.id}
                      onClick={() =>
                        handleChordSessionSettingsChange({
                          promptOrder: option.id
                        })
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-field">
                <span>Review</span>
                <div className="segmented-control compact">
                  {chordReviewModeOptions.map((option) => (
                    <button
                      className={
                        chordSessionSettings.reviewMode === option.id
                          ? "is-selected"
                          : ""
                      }
                      data-testid={`chord-review-${option.id}`}
                      key={option.id}
                      onClick={() =>
                        handleChordSessionSettingsChange({
                          reviewMode: option.id
                        })
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {chordSessionSettings.reviewMode === "missed" &&
                chordMissedReviewCount === 0 ? (
                  <small>No missed chord prompts yet, using the full set.</small>
                ) : chordSessionSettings.reviewMode === "missed" ? (
                  <small>
                    Reviewing {chordMissedReviewCount} missed chord prompt
                    {chordMissedReviewCount === 1 ? "" : "s"}.
                  </small>
                ) : null}
              </div>
            </div>
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
            <strong>{summary.title}</strong>
            <p>{summary.description}</p>
            <div className="tone-list" aria-label="Current tones">
              {summary.tones.map((tone) => (
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
              <div className="drill-actions">
                <button
                  data-testid="drill-next"
                  disabled={
                    activeDrillAttempt === null ||
                    activeDrillSummary.isComplete
                  }
                  onClick={handleNextPrompt}
                  type="button"
                >
                  Next prompt
                </button>
                <button
                  data-testid="drill-restart"
                  onClick={handleRestartDrill}
                  type="button"
                >
                  Restart
                </button>
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
              <h2 id="fretboard-title">{summary.title}</h2>
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
                      currentPrompt
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
                      practiceDrill === "note" &&
                      !isNoteRecognitionAnswerPosition(position);
                    const isTargetString =
                      mode === "practice" &&
                      practiceDrill === "note" &&
                      position.string === currentPrompt.targetString;
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

          <div className="detail-strip" aria-live="polite">
            {mode === "practice" ? (
              <>
                <div>
                  <span className="control-label">
                    {activeDrillSummary.isComplete
                      ? "Session complete"
                      : "Prompt"}
                  </span>
                  <p>
                    {practiceDrill === "note"
                      ? buildPracticeDetail(currentPrompt, currentAttempt)
                      : buildChordPracticeDetail(
                          currentChordPrompt,
                          currentChordAttempt
                        )}
                  </p>
                </div>
                <strong>
                  {activeDrillSummary.isComplete
                    ? `${activeDrillSummary.accuracy}% accuracy`
                    : activeDrillAttempt?.isCorrect
                      ? "Correct"
                      : activeDrillAttempt
                        ? "Review the highlighted answer"
                        : practiceDrill === "chordTone"
                          ? "Choose a note"
                          : "Choose a fret"}
                </strong>
              </>
            ) : (
              <>
                <div>
                  <span className="control-label">Selected position</span>
                  {selectedPosition ? (
                    <p>
                      String {selectedPosition.string}, fret{" "}
                      {selectedPosition.fret}: {selectedPosition.note}
                    </p>
                  ) : (
                    <p>Choose any fret to inspect its note and role.</p>
                  )}
                </div>
                <strong>{selectedActive?.descriptor ?? "No active role"}</strong>
              </>
            )}
          </div>

          {mode === "practice" && activeDrillSummary.isComplete ? (
            <section
              className="completion-panel"
              data-testid="session-summary"
              aria-labelledby="session-summary-title"
            >
              <div className="completion-heading">
                <div>
                  <p className="eyebrow">Session Summary</p>
                  <h3 id="session-summary-title">
                    {practiceDrill === "note"
                      ? "Note recognition complete"
                      : "Chord tone drill complete"}
                  </h3>
                </div>
                <button onClick={handleRestartDrill} type="button">
                  Practice again
                </button>
              </div>

              <div className="summary-metrics" aria-label="Session metrics">
                <div>
                  <span className="control-label">Correct</span>
                  <strong>
                    {activeDrillSummary.correct}/{activeDrillSummary.attempted}
                  </strong>
                </div>
                <div>
                  <span className="control-label">Missed</span>
                  <strong>{activeDrillSummary.missed}</strong>
                </div>
                <div>
                  <span className="control-label">Accuracy</span>
                  <strong>{activeDrillSummary.accuracy}%</strong>
                </div>
              </div>

              <div className="missed-prompts">
                <span className="control-label">Missed prompts</span>
                {practiceDrill === "note" && missedPrompts.length > 0 ? (
                  <ul>
                    {missedPrompts.map((missedPrompt) => (
                      <li
                        key={`${missedPrompt.targetNote}-${missedPrompt.targetString}-${missedPrompt.selectedString}-${missedPrompt.selectedFret}`}
                      >
                        <strong>{formatPromptTarget(missedPrompt)}</strong>
                        <span>
                          You chose {missedPrompt.selectedNote} on the{" "}
                          {getStringDisplayName(missedPrompt.selectedString)}{" "}
                          string, fret {missedPrompt.selectedFret}.
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : practiceDrill === "chordTone" &&
                  missedChordPrompts.length > 0 ? (
                  <ul>
                    {missedChordPrompts.map((missedPrompt) => (
                      <li
                        key={`${missedPrompt.rootNote}-${missedPrompt.quality}-${missedPrompt.targetTone}-${missedPrompt.selectedNote}`}
                      >
                        <strong>{formatChordPromptTarget(missedPrompt)}</strong>
                        <span>
                          You chose {missedPrompt.selectedNote}; correct answer
                          was {missedPrompt.targetNote}.{" "}
                          {formatChordSpelling(missedPrompt)}.
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No missed prompts. Clean run.</p>
                )}
              </div>

              {practiceDrill === "note" && notePerformance.attempted > 0 ? (
                <div className="performance-panel">
                  <div className="performance-section">
                    <span className="control-label">Weak spots</span>
                    {notePerformance.weakSpots.length > 0 ? (
                      <div className="performance-card-list">
                        {notePerformance.weakSpots.map((stat) => (
                          <div
                            className="performance-card"
                            key={`${stat.category}-${stat.id}`}
                          >
                            <strong>{stat.label}</strong>
                            <span>{formatPerformanceStat(stat)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No weak spots yet. Every tracked category is clean.</p>
                    )}
                  </div>

                  <div className="performance-section">
                    <span className="control-label">Target note breakdown</span>
                    <div className="performance-chip-list">
                      {notePerformance.noteStats.map((stat) => (
                        <span key={`${stat.category}-${stat.id}`}>
                          {formatPerformanceChip(stat)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="performance-section">
                    <span className="control-label">String breakdown</span>
                    <div className="performance-chip-list">
                      {notePerformance.stringStats.map((stat) => (
                        <span key={`${stat.category}-${stat.id}`}>
                          {formatPerformanceChip(stat)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : practiceDrill === "chordTone" &&
                chordPerformance.attempted > 0 ? (
                <div className="performance-panel">
                  <div className="performance-section">
                    <span className="control-label">Weak spots</span>
                    {chordPerformance.weakSpots.length > 0 ? (
                      <div className="performance-card-list">
                        {chordPerformance.weakSpots.map((stat) => (
                          <div
                            className="performance-card"
                            key={`${stat.category}-${stat.id}`}
                          >
                            <strong>{stat.label}</strong>
                            <span>{formatPerformanceStat(stat)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No weak spots yet. Every tracked category is clean.</p>
                    )}
                  </div>

                  <div className="performance-section">
                    <span className="control-label">Tone breakdown</span>
                    <div className="performance-chip-list">
                      {chordPerformance.toneStats.map((stat) => (
                        <span key={`${stat.category}-${stat.id}`}>
                          {formatPerformanceChip(stat)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="performance-section">
                    <span className="control-label">Quality breakdown</span>
                    <div className="performance-chip-list">
                      {chordPerformance.qualityStats.map((stat) => (
                        <span key={`${stat.category}-${stat.id}`}>
                          {formatPerformanceChip(stat)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="performance-section">
                    <span className="control-label">Root trouble spots</span>
                    {chordPerformance.rootStats.some(
                      (stat) => stat.missed > 0
                    ) ? (
                      <div className="performance-chip-list">
                        {chordPerformance.rootStats
                          .filter((stat) => stat.missed > 0)
                          .map((stat) => (
                            <span key={`${stat.category}-${stat.id}`}>
                              {formatPerformanceChip(stat)}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <p>No root-specific misses yet.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </section>
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
  currentChordAttempt: ChordToneAttempt | null
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
  chordPromptCount: number
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
      badge: `${drillSummary.attempted + 1}/${NOTE_RECOGNITION_PROMPTS.length}`,
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
  drillPrompt: NoteRecognitionPrompt
): string {
  return [
    "string-label",
    mode === "practice" &&
    practiceDrill === "note" &&
    string === drillPrompt.targetString
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

  return mode === "practice" ? "" : position.note;
}

function buildPracticeDetail(
  prompt: NoteRecognitionPrompt,
  currentAttempt: NoteRecognitionAttempt | null
): string {
  const targetStringName = getStringDisplayName(prompt.targetString);

  if (currentAttempt === null) {
    return `Find the ${prompt.targetNote} note on the ${targetStringName} string.`;
  }

  if (currentAttempt.isCorrect) {
    return `Correct: string ${currentAttempt.selectedString}, fret ${currentAttempt.selectedFret} is ${prompt.targetNote} on the ${targetStringName} string.`;
  }

  return `Not quite: string ${currentAttempt.selectedString}, fret ${currentAttempt.selectedFret} is ${currentAttempt.selectedNote} on the ${getStringDisplayName(
    currentAttempt.selectedString
  )} string.`;
}

function buildChordPracticeDetail(
  prompt: ChordTonePrompt,
  currentAttempt: ChordToneAttempt | null
): string {
  const chordName = formatChordName(prompt.rootNote, prompt.quality);
  const targetToneName = getChordToneName(prompt.targetTone);
  const targetNote = getTargetChordToneNote(prompt);

  if (currentAttempt === null) {
    return `What note is the ${targetToneName} of ${chordName}?`;
  }

  if (currentAttempt.isCorrect) {
    return `Correct: ${formatChordSpelling(prompt)}, so ${targetNote} is the ${targetToneName}.`;
  }

  return `Not quite: you chose ${currentAttempt.selectedNote}. ${formatChordSpelling(
    prompt
  )}, so ${targetNote} is the ${targetToneName}.`;
}

function positionKey(position: FretPosition): string {
  return `${position.string}-${position.fret}`;
}

function getStringDisplayName(string: GuitarStringNumber): string {
  return stringDisplayNames[string];
}

function formatPromptTarget(prompt: NoteRecognitionPrompt): string {
  return `${prompt.targetNote} on the ${getStringDisplayName(
    prompt.targetString
  )} string`;
}

function formatChordPromptTarget(prompt: ChordTonePrompt): string {
  return `${getChordToneName(prompt.targetTone)} of ${formatChordName(
    prompt.rootNote,
    prompt.quality
  )}`;
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
