"use client";

import { useEffect, useRef, useState } from "react";
import {
  evaluatePulseTaps,
  type PilotEvaluationResult,
  type PulseTempoBpm
} from "../../lib/education/pilotRuntime";
import styles from "./educationPilot.module.css";

interface PulseTaskProps {
  sessionId: string;
  outcome: PilotEvaluationResult | null;
  reviewSourceAt?: string;
  reviewSourceTempo?: PulseTempoBpm;
  onComplete: (result: PilotEvaluationResult) => void;
  onContinue: () => void;
  onRetry: () => void;
}

type PulsePhase = "model" | "guided" | "fade" | "independent";

const TEMPOS: PulseTempoBpm[] = [50, 60, 70];

export function PulseTask({
  sessionId,
  outcome,
  reviewSourceAt,
  reviewSourceTempo,
  onComplete,
  onContinue,
  onRetry
}: PulseTaskProps) {
  const [phase, setPhase] = useState<PulsePhase>(
    reviewSourceAt ? "independent" : "model"
  );
  const [tempo, setTempo] = useState<PulseTempoBpm>(() =>
    reviewSourceAt ? changedTempo(reviewSourceTempo ?? 60) : 60
  );
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [taps, setTaps] = useState<number[]>([]);
  const [hiddenDuringTask, setHiddenDuringTask] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const attemptNumberRef = useRef(0);
  const startedAtRef = useRef(0);
  const intervalMs = Math.round(60_000 / tempo);
  const guided = phase === "guided";

  function playPulseClick(): number {
    if (!soundEnabled) {
      return performance.now();
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
    return performance.now();
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
    }, intervalMs);
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
  }, [intervalMs, running, soundEnabled]);

  function start(): void {
    onRetry();
    attemptNumberRef.current += 1;
    setTaps([]);
    setBeat(0);
    setHiddenDuringTask(false);
    startedAtRef.current = playPulseClick();
    setRunning(true);
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
          intervalMs,
          tempoBpm: tempo,
          supportLevel: guided ? "guided" : "independent",
          sessionId: `${sessionId}:pulse-${attemptNumberRef.current}`,
          now: new Date().toISOString(),
          documentHidden: hiddenDuringTask,
          ...(reviewSourceAt === undefined
            ? {}
            : {
                sourceEvidenceAt: reviewSourceAt,
                sourceTempoBpm: reviewSourceTempo ?? 60
              })
        })
      );
    }
  }

  const passed =
    outcome?.evidence.kind === "independent_performance" ||
    outcome?.evidence.kind === "retained_performance";
  const guidedPassed =
    guided && outcome?.evidence.kind === "supported_performance";

  return (
    <section className={styles.lessonBand} aria-labelledby="pulse-title">
      <div className={styles.bandHeading}>
        <p className={styles.eyebrow}>
          {reviewSourceAt
            ? "Pulse review"
            : phase === "model"
              ? "Model"
              : phase === "guided"
                ? "Guided attempt"
                : phase === "fade"
                  ? "Fade the scaffold"
                  : "Independent attempt"}
        </p>
        <h2 id="pulse-title">
          {reviewSourceAt
            ? "Meet the pulse again after a break."
            : "Meet a steady quarter-note pulse."}
        </h2>
        <p>
          Listen or watch, then make eight taps. This task only counts timing
          while this page stays open.
        </p>
      </div>

      {phase === "model" ? (
        <div className={styles.modelPanel}>
          <strong>First, notice what stays steady.</strong>
          <p>
            The pulse marks equal spaces. A guided beat rail will show where eight
            taps belong; it will be removed before the independent attempt.
          </p>
          <button
            className={styles.primaryButton}
            onClick={() => setPhase("guided")}
            type="button"
          >
            Begin guided attempt
          </button>
        </div>
      ) : null}

      {phase === "fade" ? (
        <div className={styles.modelPanel}>
          <strong>The beat rail is coming away.</strong>
          <p>
            The external pulse remains, but the eight-position guide will not appear
            in the next task.
          </p>
          <button
            className={styles.primaryButton}
            onClick={() => setPhase("independent")}
            type="button"
          >
            Begin independent attempt
          </button>
        </div>
      ) : null}

      {phase === "guided" || phase === "independent" ? (
        <div className={styles.pulseWorkspace}>
          <div
            aria-label={`${tempo} BPM pulse status`}
            className={styles.pulseMeter}
            role="group"
          >
            <span
              className={running ? styles.pulseActive : ""}
              data-testid="pilot-pulse-indicator"
              aria-hidden="true"
              style={{ animationDuration: `${intervalMs}ms` }}
            />
            <strong>{running ? `Beat ${beat + 1}` : `${tempo} BPM`}</strong>
            <small>{taps.length} of 8 taps</small>
            {guided ? (
              <div className={styles.beatGuide} aria-label="Eight-position beat guide">
                {Array.from({ length: 8 }, (_, index) => (
                  <i className={index < taps.length ? styles.beatGuidePast : ""} key={index} />
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.pulseControls}>
            <fieldset className={styles.tempoControl}>
              <legend>{reviewSourceAt ? "Changed review tempo" : "Tempo"}</legend>
              <div className={styles.segmented}>
                {TEMPOS.map((candidate) => (
                  <button
                    aria-pressed={tempo === candidate}
                    className={tempo === candidate ? styles.selectedSegment : ""}
                    disabled={
                      running ||
                      (reviewSourceAt !== undefined &&
                        candidate === (reviewSourceTempo ?? 60))
                    }
                    key={candidate}
                    onClick={() => setTempo(candidate)}
                    type="button"
                  >
                    {candidate} BPM
                  </button>
                ))}
              </div>
            </fieldset>
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
                data-interval-ms={intervalMs}
                data-testid="pilot-pulse-tap"
                disabled={!running}
                onClick={tap}
                type="button"
              >
                Tap
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {outcome ? (
        <div
          className={passed || guidedPassed ? styles.feedbackSuccess : styles.feedbackNeedsWork}
          role="status"
        >
          <strong>
            {guidedPassed
              ? "Practiced with support"
              : passed
                ? outcome.evidence.kind === "retained_performance"
                  ? "Remembered after a break"
                  : "Done without the guide"
                : "Try a changed pulse task"}
          </strong>
          <p>
            {guidedPassed
              ? "Eight taps stayed with the beat while the guide was visible."
              : passed
                ? `Eight taps stayed with the beat at ${tempo} BPM.`
                : outcome.remediation.nextAction}
          </p>
          {guidedPassed ? (
            <button
              className={styles.primaryButton}
              onClick={() => {
                onRetry();
                setPhase("fade");
              }}
              type="button"
            >
              Fade the guide
            </button>
          ) : !passed ? (
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

function changedTempo(source: PulseTempoBpm): PulseTempoBpm {
  return source === 70 ? 50 : 70;
}
