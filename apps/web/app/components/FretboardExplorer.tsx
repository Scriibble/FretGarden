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
  CHORD_TONE_PROMPTS,
  buildChordToneAttempt,
  getChordToneAnswerOptions,
  getCurrentChordTonePrompt,
  getMissedChordTonePrompts,
  getTargetChordToneNote,
  summarizeChordToneRecognition,
  type ChordTone,
  type ChordToneAttempt,
  type ChordTonePrompt,
  type ChordToneSummary
} from "../lib/chordToneRecognition";
import {
  NOTE_RECOGNITION_PROMPTS,
  NOTE_RECOGNITION_HISTORY_LIMIT,
  appendNoteRecognitionSession,
  buildNoteRecognitionSession,
  buildNoteRecognitionAttempt,
  getCurrentPrompt,
  getMissedNoteRecognitionPrompts,
  isNoteRecognitionAnswerPosition,
  isNoteRecognitionCorrectPosition,
  summarizeNoteRecognition,
  type NoteRecognitionAttempt,
  type NoteRecognitionPrompt,
  type NoteRecognitionSession,
  type NoteRecognitionSummary
} from "../lib/noteRecognition";

type DisplayMode = "practice" | "notes" | "find" | "scale" | "chord";
type PracticeDrill = "note" | "chordTone";
type ActiveVariant = "note" | "root" | "scale" | "chord" | "answer" | "miss";

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
  const [completedSession, setCompletedSession] =
    useState<NoteRecognitionSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<
    NoteRecognitionSession[]
  >([]);
  const [selectedPosition, setSelectedPosition] = useState<FretPosition | null>(
    null
  );

  const currentPrompt = getCurrentPrompt(promptIndex);
  const currentAttempt =
    attempts.find((attempt) => attempt.promptIndex === promptIndex) ?? null;
  const currentChordPrompt = getCurrentChordTonePrompt(chordPromptIndex);
  const currentChordAttempt =
    chordAttempts.find((attempt) => attempt.promptIndex === chordPromptIndex) ??
    null;
  const drillSummary = useMemo(
    () => summarizeNoteRecognition(attempts),
    [attempts]
  );
  const chordDrillSummary = useMemo(
    () => summarizeChordToneRecognition(chordAttempts),
    [chordAttempts]
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
        chordDrillSummary
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
      chordDrillSummary
    ]
  );
  const selectedActive = selectedPosition
    ? activePositions.get(positionKey(selectedPosition))
    : undefined;
  const latestSession = sessionHistory[0] ?? null;
  const activeDrillSummary =
    practiceDrill === "note" ? drillSummary : chordDrillSummary;
  const activeDrillAttempt =
    practiceDrill === "note" ? currentAttempt : currentChordAttempt;
  const activePromptCount =
    practiceDrill === "note"
      ? NOTE_RECOGNITION_PROMPTS.length
      : CHORD_TONE_PROMPTS.length;

  useEffect(() => {
    setSessionHistory(readStoredSessionHistory());
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
      writeStoredSessionHistory(nextHistory);

      return nextHistory;
    });
  }, [attempts, completedSession, drillSummary.isComplete]);

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
      setChordPromptIndex(0);
      setChordAttempts([]);
    } else {
      setPromptIndex(0);
      setAttempts([]);
      setCompletedSession(null);
    }

    setSelectedPosition(null);
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
                          was {missedPrompt.targetNote}.
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No missed prompts. Clean run.</p>
                )}
              </div>
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
          label: position.note,
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
            label: position.note,
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
  chordDrillSummary: ChordToneSummary
): ModeSummary {
  if (mode === "practice") {
    if (practiceDrill === "chordTone") {
      const chordName = formatChordName(chordPrompt.rootNote, chordPrompt.quality);
      const targetToneName = getChordToneName(chordPrompt.targetTone);
      const targetNote = getTargetChordToneNote(chordPrompt);

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
              ? `Correct. ${targetNote} is the ${targetToneName} of ${chordName}, now highlighted across the fretboard.`
              : `You chose ${currentChordAttempt.selectedNote}. ${targetNote} is the ${targetToneName} of ${chordName}, now highlighted across the fretboard.`,
        badge: `${chordDrillSummary.attempted + 1}/${CHORD_TONE_PROMPTS.length}`,
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
    return `Correct: ${targetNote} is the ${targetToneName} of ${chordName}.`;
  }

  return `Not quite: you chose ${currentAttempt.selectedNote}. ${targetNote} is the ${targetToneName} of ${chordName}.`;
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

function formatSessionDate(completedAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(completedAt));
}

function readStoredSessionHistory(): NoteRecognitionSession[] {
  try {
    const storedHistory = window.localStorage.getItem(
      NOTE_RECOGNITION_HISTORY_STORAGE_KEY
    );

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory) as NoteRecognitionSession[];

    return Array.isArray(parsedHistory)
      ? parsedHistory.slice(0, NOTE_RECOGNITION_HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function writeStoredSessionHistory(history: NoteRecognitionSession[]): void {
  try {
    window.localStorage.setItem(
      NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
      JSON.stringify(history.slice(0, NOTE_RECOGNITION_HISTORY_LIMIT))
    );
  } catch {
    // Local progress is a convenience; the drill should keep working if storage is unavailable.
  }
}
