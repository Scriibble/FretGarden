"use client";

import { useMemo, useState } from "react";
import {
  evaluateApplicationSet,
  type ApplicationPrompt,
  type ApplicationResponse,
  type PilotEvaluationResult
} from "../../lib/education/pilotRuntime";
import styles from "./educationPilot.module.css";

interface ApplicationTaskProps {
  prompts: ApplicationPrompt[];
  sessionId: string;
  outcome: PilotEvaluationResult | null;
  onComplete: (result: PilotEvaluationResult) => void;
  onContinue: () => void;
  onRetry: () => void;
}

export function ApplicationTask({
  prompts,
  sessionId,
  outcome,
  onComplete,
  onContinue,
  onRetry
}: ApplicationTaskProps) {
  const [attemptNumber, setAttemptNumber] = useState(0);
  const orderedPrompts = useMemo(
    () => rotate(prompts, attemptNumber % Math.max(prompts.length, 1)),
    [attemptNumber, prompts]
  );
  const [index, setIndex] = useState(0);
  const [firstFret, setFirstFret] = useState<number | null>(null);
  const [secondFret, setSecondFret] = useState<number | null>(null);
  const [responses, setResponses] = useState<ApplicationResponse[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const prompt = orderedPrompts[index];

  if (!prompt) {
    return null;
  }
  const activePrompt = prompt;

  const passed = outcome?.evidence.kind === "transfer";

  function submit(): void {
    if (feedback || firstFret === null || secondFret === null) {
      return;
    }
    const correct =
      firstFret === activePrompt.firstFret && secondFret === activePrompt.secondFret;
    setResponses((current) => [
      ...current,
      {
        promptId: activePrompt.id,
        selectedFirstFret: firstFret,
        selectedSecondFret: secondFret,
        correct,
        supportLevel: revealed ? "prompted" : "independent",
        answerRevealed: revealed
      }
    ]);
    setFeedback(
      correct
        ? `Yes: ${activePrompt.firstNote} is fret ${activePrompt.firstFret} and ${activePrompt.secondNote} is fret ${activePrompt.secondFret}.`
        : `This pattern starts at fret ${activePrompt.firstFret} and ends at fret ${activePrompt.secondFret}.`
    );
  }

  function next(): void {
    if (index + 1 < orderedPrompts.length) {
      setIndex((current) => current + 1);
      setFirstFret(null);
      setSecondFret(null);
      setRevealed(false);
      setFeedback(null);
      return;
    }
    onComplete(
      evaluateApplicationSet({
        responses,
        sessionId: `${sessionId}:application-${attemptNumber}`,
        now: new Date().toISOString()
      })
    );
  }

  function retry(): void {
    onRetry();
    setAttemptNumber((current) => current + 1);
    setIndex(0);
    setFirstFret(null);
    setSecondFret(null);
    setResponses([]);
    setRevealed(false);
    setFeedback(null);
  }

  return (
    <section className={styles.lessonBand} aria-labelledby="application-task-title">
      <div className={styles.bandHeading}>
        <p className={styles.eyebrow}>Use it in a pattern</p>
        <h2 id="application-task-title">Turn two landmarks into one playable move.</h2>
        <p>
          Find the notes in order. Play the short move on your guitar if you can.
          FretGarden checks the two frets you choose, not how the guitar sounds.
        </p>
      </div>

      {!outcome ? (
        <div className={styles.applicationWorkspace}>
          <div className={styles.promptRow}>
            <div>
              <span>
                Pattern {index + 1} of {orderedPrompts.length}
              </span>
              <strong>
                String {activePrompt.string}: {activePrompt.firstNote} to {activePrompt.secondNote}
              </strong>
            </div>
          </div>

          <div className={styles.patternControls}>
            <FretChoice
              label={`First note: ${activePrompt.firstNote}`}
              selected={firstFret}
              onSelect={setFirstFret}
            />
            <FretChoice
              label={`Second note: ${activePrompt.secondNote}`}
              selected={secondFret}
              onSelect={setSecondFret}
            />
          </div>

          <div className={styles.feedbackRow} aria-live="polite">
            {feedback ? <strong>{feedback}</strong> : <span>Choose both frets in order.</span>}
            <div className={styles.actionRow}>
              {!feedback ? (
                <button
                  className={styles.hintButton}
                  onClick={() => {
                    setFirstFret(activePrompt.firstFret);
                    setSecondFret(activePrompt.secondFret);
                    setRevealed(true);
                  }}
                  type="button"
                >
                  {revealed
                    ? `Pattern: frets ${activePrompt.firstFret} to ${activePrompt.secondFret}`
                    : "Show pattern"}
                </button>
              ) : null}
              {!feedback ? (
                <button
                  className={styles.primaryButton}
                  disabled={firstFret === null || secondFret === null}
                  onClick={submit}
                  type="button"
                >
                  Check pattern
                </button>
              ) : (
                <button className={styles.primaryButton} onClick={next} type="button">
                  {index + 1 === orderedPrompts.length
                    ? "Check this set"
                    : "Next pattern"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={passed ? styles.feedbackSuccess : styles.feedbackNeedsWork} role="status">
          <strong>{passed ? "Used it in a new pattern" : "Try a new pattern next"}</strong>
          <p>
            {passed
              ? "You found both patterns without hints on strings 6 and 5."
              : outcome.remediation.nextAction}
          </p>
          {passed ? (
            <button className={styles.primaryButton} onClick={onContinue} type="button">
              Continue
            </button>
          ) : (
            <button className={styles.secondaryButton} onClick={retry} type="button">
              Try changed patterns
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function FretChoice({
  label,
  selected,
  onSelect
}: {
  label: string;
  selected: number | null;
  onSelect: (fret: number) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div className={styles.segmented}>
        {[0, 1, 2, 3, 4, 5].map((fret) => (
          <button
            aria-pressed={selected === fret}
            className={selected === fret ? styles.selectedSegment : ""}
            key={fret}
            onClick={() => onSelect(fret)}
            type="button"
          >
            {fret === 0 ? "Open" : fret}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function rotate<T>(items: T[], count: number): T[] {
  return [...items.slice(count), ...items.slice(0, count)];
}
