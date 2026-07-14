"use client";

import { useEffect, useRef, useState } from "react";
import {
  evaluatePulseTaps,
  type PilotEvaluationResult
} from "../../lib/education/pilotRuntime";
import styles from "./educationPilot.module.css";

interface PulseTaskProps {
  sessionId: string;
  outcome: PilotEvaluationResult | null;
  reviewSourceAt?: string;
  onComplete: (result: PilotEvaluationResult) => void;
  onContinue: () => void;
  onRetry: () => void;
}

const INTERVAL_MS = 1000;

export function PulseTask({
  sessionId,
  outcome,
  reviewSourceAt,
  onComplete,
  onContinue,
  onRetry
}: PulseTaskProps) {
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [taps, setTaps] = useState<number[]>([]);
  const [hiddenDuringTask, setHiddenDuringTask] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const attemptNumberRef = useRef(0);
  const startedAtRef = useRef(0);

  function playPulseClick(): void {
    if (!soundEnabled) {
      return;
    }

    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime;

    oscillator.frequency.setValueAtTime(880, startAt);
    gain.gain.setValueAtTime(0.12, startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.05);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.05);
  }

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!running) {
      return;
    }
    const interval = window.setInterval(() => {
      setBeat((current) => current + 1);
      playPulseClick();
    }, INTERVAL_MS);
    const visibility = () => {
      if (document.hidden) {
        setHiddenDuringTask(true);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [running, soundEnabled]);

  function start(): void {
    onRetry();
    attemptNumberRef.current += 1;
    startedAtRef.current = performance.now();
    setTaps([]);
    setBeat(0);
    setHiddenDuringTask(false);
    setRunning(true);
    playPulseClick();
  }

  function tap(): void {
    if (!running || taps.length >= 8) {
      return;
    }
    const next = [...taps, performance.now()];
    setTaps(next);
    if (next.length === 8) {
      setRunning(false);
      onComplete(
        evaluatePulseTaps({
          tapsMs: next,
          pulseStartedAtMs: startedAtRef.current,
          intervalMs: INTERVAL_MS,
          sessionId: `${sessionId}:pulse-${attemptNumberRef.current}`,
          now: new Date().toISOString(),
          documentHidden: hiddenDuringTask,
          ...(reviewSourceAt === undefined ? {} : { sourceEvidenceAt: reviewSourceAt })
        })
      );
    }
  }

  const passed =
    outcome?.evidence.kind === "independent_performance" ||
    outcome?.evidence.kind === "retained_performance";

  return (
    <section className={styles.lessonBand} aria-labelledby="pulse-title">
      <div className={styles.bandHeading}>
        <p className={styles.eyebrow}>
          {reviewSourceAt ? "Delayed pulse retrieval" : "Model, attempt, interpret"}
        </p>
        <h2 id="pulse-title">
          {reviewSourceAt
            ? "Meet the pulse again after a delay."
            : "Meet a steady quarter-note pulse."}
        </h2>
        <p>
          Start the pulse, listen or watch, then make eight taps. The task records
          timing only while this page stays active.
        </p>
      </div>
      <div className={styles.pulseWorkspace}>
        <div className={styles.pulseMeter} aria-live="polite">
          <span
            className={running ? styles.pulseActive : ""}
            data-testid="pilot-pulse-indicator"
            aria-hidden="true"
          />
          <strong>{running ? `Beat ${beat + 1}` : "60 BPM"}</strong>
          <small>{taps.length} of 8 taps</small>
        </div>
        <div className={styles.actionRow}>
          <label className={styles.soundToggle}>
            <input
              checked={soundEnabled}
              onChange={(event) => setSoundEnabled(event.target.checked)}
              type="checkbox"
            />
            Sound
          </label>
          <button className={styles.secondaryButton} onClick={start} type="button">
            {running ? "Restart pulse" : "Start pulse"}
          </button>
          <button
            className={styles.tapButton}
            data-testid="pilot-pulse-tap"
            disabled={!running}
            onClick={tap}
            type="button"
          >
            Tap
          </button>
        </div>
      </div>
      {outcome ? (
        <div className={passed ? styles.feedbackSuccess : styles.feedbackNeedsWork} role="status">
          <strong>
            {passed
              ? outcome.evidence.kind === "retained_performance"
                ? "Retrieved after a delay"
                : "Shown independently"
              : "Try a changed pulse task"}
          </strong>
          <p>
            {passed
              ? "Eight valid taps met the current offset and stability conditions."
              : outcome.remediation.nextAction}
          </p>
          {!passed ? (
            <button className={styles.secondaryButton} onClick={start} type="button">
              Try again
            </button>
          ) : (
            <button className={styles.primaryButton} onClick={onContinue} type="button">
              Continue
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}
