"use client";

import { useMemo, useState } from "react";
import {
  evaluateCoordinateSet,
  evaluateNoteSet,
  type CoordinatePrompt,
  type CoordinateResponse,
  type NotePrompt,
  type PilotEvaluationResult
} from "../../lib/education/pilotRuntime";
import styles from "./educationPilot.module.css";

interface FretboardTaskProps {
  kind: "coordinate" | "note";
  prompts: Array<CoordinatePrompt | NotePrompt>;
  sessionId: string;
  outcome: PilotEvaluationResult | null;
  reviewSourceAt?: string;
  onComplete: (result: PilotEvaluationResult) => void;
  onContinue: () => void;
  onRetry: () => void;
}

export function FretboardTask({
  kind,
  prompts,
  sessionId,
  outcome,
  reviewSourceAt,
  onComplete,
  onContinue,
  onRetry
}: FretboardTaskProps) {
  const [attemptNumber, setAttemptNumber] = useState(0);
  const orderedPrompts = useMemo(
    () => rotate(prompts, attemptNumber % Math.max(prompts.length, 1)),
    [attemptNumber, prompts]
  );
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<CoordinateResponse[]>([]);
  const [control, setControl] = useState<"grid" | "explicit">("grid");
  const [selectedString, setSelectedString] = useState<5 | 6>(6);
  const [selectedFret, setSelectedFret] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const prompt = orderedPrompts[index];

  if (!prompt) {
    return null;
  }
  const activePrompt = prompt;

  const isNote = "note" in activePrompt;
  const expectedLabel = isNote
    ? `${activePrompt.note} on string ${activePrompt.string}`
    : activePrompt.label;
  const passed = outcome?.evidence.kind === "independent_performance" || outcome?.evidence.kind === "retained_performance";

  function answer(string: 5 | 6, fret: number): void {
    if (feedback) {
      return;
    }
    const correct = string === activePrompt.string && fret === activePrompt.fret;
    const response: CoordinateResponse = {
      promptId: activePrompt.id,
      selectedString: string,
      selectedFret: fret,
      correct,
      supportLevel: revealed ? "prompted" : "independent",
      answerRevealed: revealed,
      responseControl: control
    };
    setResponses((current) => [...current, response]);
    setFeedback(
      correct
        ? `Yes: string ${activePrompt.string}, fret ${activePrompt.fret}.`
        : `This one is string ${activePrompt.string}, fret ${activePrompt.fret}.`
    );
  }

  function next(): void {
    const nextIndex = index + 1;
    if (nextIndex < orderedPrompts.length) {
      setIndex(nextIndex);
      setFeedback(null);
      setRevealed(false);
      if (kind === "note" && nextIndex === orderedPrompts.length - 1) {
        setControl("explicit");
      }
      return;
    }
    const now = new Date().toISOString();
    const result =
      kind === "coordinate"
        ? evaluateCoordinateSet({ responses, sessionId, now })
        : evaluateNoteSet({
            responses,
            sessionId: `${sessionId}:set-${attemptNumber}`,
            now,
            ...(reviewSourceAt === undefined ? {} : { review: true, sourceEvidenceAt: reviewSourceAt })
          });
    onComplete(result);
  }

  function retry(): void {
    onRetry();
    setAttemptNumber((current) => current + 1);
    setIndex(0);
    setResponses([]);
    setFeedback(null);
    setRevealed(false);
    setControl("grid");
  }

  return (
    <section className={styles.lessonBand} aria-labelledby="fretboard-task-title">
      <div className={styles.bandHeading}>
        <p className={styles.eyebrow}>{kind === "coordinate" ? "Placement and readiness" : reviewSourceAt ? "Delayed retrieval" : "Fade, retrieve, vary"}</p>
        <h2 id="fretboard-task-title">
          {kind === "coordinate" ? "Show the coordinate before moving on." : reviewSourceAt ? "Retrieve the same region after a delay." : "Find each note without an answer cue."}
        </h2>
        <p>
          {kind === "coordinate"
            ? "Valid prior knowledge can satisfy this prerequisite directly."
            : "The last prompt uses the equivalent coordinate controls so the context changes without changing the capability."}
        </p>
      </div>

      {!outcome ? (
        <div className={styles.fretWorkspace}>
          <div className={styles.promptRow}>
            <div>
              <span>Prompt {index + 1} of {orderedPrompts.length}</span>
              <strong>{isNote ? `Find ${expectedLabel}` : `Select ${expectedLabel}`}</strong>
            </div>
            <div className={styles.modeSwitch} aria-label="Response control">
              <button aria-pressed={control === "grid"} onClick={() => setControl("grid")} type="button">Fretboard</button>
              <button aria-pressed={control === "explicit"} onClick={() => setControl("explicit")} type="button">Coordinates</button>
            </div>
          </div>

          {control === "grid" ? (
            <div className={styles.fretboard} role="grid" aria-label="Strings 6 and 5, open through fret 5">
              <span className={styles.corner} aria-hidden="true">String</span>
              {[0, 1, 2, 3, 4, 5].map((fret) => <span className={styles.fretNumber} key={fret}>{fret === 0 ? "Open" : fret}</span>)}
              {([6, 5] as const).map((string) => (
                <div className={styles.stringRow} key={string} role="row">
                  <span className={styles.stringNumber}>String {string}</span>
                  {[0, 1, 2, 3, 4, 5].map((fret) => (
                    <button
                      aria-label={`String ${string}, fret ${fret}`}
                      className={styles.fretCell}
                      key={fret}
                      onClick={() => answer(string, fret)}
                      role="gridcell"
                      type="button"
                    >
                      <span aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.explicitControls}>
              <label>
                <span>String</span>
                <select value={selectedString} onChange={(event) => setSelectedString(Number(event.target.value) as 5 | 6)}>
                  <option value={6}>String 6</option>
                  <option value={5}>String 5</option>
                </select>
              </label>
              <label>
                <span>Fret</span>
                <select value={selectedFret} onChange={(event) => setSelectedFret(Number(event.target.value))}>
                  {[0, 1, 2, 3, 4, 5].map((fret) => <option key={fret} value={fret}>{fret === 0 ? "Open" : `Fret ${fret}`}</option>)}
                </select>
              </label>
              <button className={styles.primaryButton} onClick={() => answer(selectedString, selectedFret)} type="button">Submit coordinate</button>
            </div>
          )}

          <div className={styles.feedbackRow} aria-live="polite">
            {feedback ? <strong>{feedback}</strong> : <span>Choose one location.</span>}
            <div className={styles.actionRow}>
              {!feedback ? (
                <button className={styles.hintButton} onClick={() => setRevealed(true)} type="button">
                  {revealed ? `Answer: string ${activePrompt.string}, fret ${activePrompt.fret}` : "Show answer"}
                </button>
              ) : null}
              {feedback ? (
                <button className={styles.primaryButton} onClick={next} type="button">
                  {index + 1 === orderedPrompts.length ? "Evaluate this set" : "Next prompt"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className={passed ? styles.feedbackSuccess : styles.feedbackNeedsWork} role="status">
          <strong>{passed ? (outcome.evidence.kind === "retained_performance" ? "Retrieved after a delay" : "Shown independently") : outcome.evidence.kind === "correction" ? "Corrected with support" : "Not yet demonstrated"}</strong>
          <p>{passed ? "The set met its support, coverage, validity, and variation requirements." : outcome.remediation.nextAction}</p>
          {passed ? (
            <button className={styles.primaryButton} onClick={onContinue} type="button">Continue</button>
          ) : (
            <button className={styles.secondaryButton} onClick={retry} type="button">Try a fresh set</button>
          )}
        </div>
      )}
    </section>
  );
}

function rotate<T>(items: T[], count: number): T[] {
  return [...items.slice(count), ...items.slice(0, count)];
}
