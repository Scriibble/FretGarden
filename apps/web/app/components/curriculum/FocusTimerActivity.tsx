import { useEffect, useRef, useState } from "react";
import {
  advanceFocusTimer,
  createFocusTimerState,
  formatTimerSeconds,
  resetFocusTimer,
  type FocusTimerDurations
} from "../../lib/curriculum/focusTimer";
import type { CurriculumProgressRecord } from "../../lib/curriculum/curriculumProgress";
import styles from "./curriculum.module.css";

type TimerPreset = "25-5" | "10-5" | "custom";

interface FocusTimerActivityProps {
  record: CurriculumProgressRecord;
  onFieldChange: (field: string, value: string) => void;
}

export function FocusTimerActivity({
  record,
  onFieldChange
}: FocusTimerActivityProps) {
  const [preset, setPreset] = useState<TimerPreset>("10-5");
  const [workMinutes, setWorkMinutes] = useState(10);
  const [restMinutes, setRestMinutes] = useState(5);
  const [breakReminder, setBreakReminder] = useState(true);
  const durations: FocusTimerDurations = {
    workSeconds: workMinutes * 60,
    restSeconds: restMinutes * 60
  };
  const [timer, setTimer] = useState(() => createFocusTimerState(durations));
  const [announcement, setAnnouncement] = useState("Ready for focused work.");
  const persistedCyclesRef = useRef(0);

  useEffect(() => {
    if (!timer.running) return;
    const intervalId = window.setInterval(() => {
      setTimer((current) => {
        const next = advanceFocusTimer(current, durations);
        if (next.phase !== current.phase) {
          setAnnouncement(
            next.phase === "rest"
              ? breakReminder
                ? "Work period complete. Put the guitar down and take the planned break."
                : "Work period complete."
              : "Break complete. Begin the next focused goal when ready."
          );
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [breakReminder, durations.restSeconds, durations.workSeconds, timer.running]);

  useEffect(() => {
    if (timer.completedWorkCycles <= persistedCyclesRef.current) return;
    persistedCyclesRef.current = timer.completedWorkCycles;
    onFieldChange("completedFocusCycles", String(timer.completedWorkCycles));
  }, [onFieldChange, timer.completedWorkCycles]);

  function selectPreset(nextPreset: TimerPreset): void {
    setPreset(nextPreset);
    if (nextPreset === "25-5") {
      setWorkMinutes(25);
      setRestMinutes(5);
      setTimer((current) => resetFocusTimer(current, { workSeconds: 1500, restSeconds: 300 }));
      onFieldChange("focusPreset", "25/5");
    } else if (nextPreset === "10-5") {
      setWorkMinutes(10);
      setRestMinutes(5);
      setTimer((current) => resetFocusTimer(current, { workSeconds: 600, restSeconds: 300 }));
      onFieldChange("focusPreset", "10/5");
    } else {
      setTimer((current) => resetFocusTimer(current, durations));
      onFieldChange("focusPreset", "Custom");
    }
  }

  function updateCustomDuration(kind: "work" | "rest", value: number): void {
    const nextValue = Math.max(1, Math.min(kind === "work" ? 60 : 30, value));
    const nextWork = kind === "work" ? nextValue : workMinutes;
    const nextRest = kind === "rest" ? nextValue : restMinutes;
    setPreset("custom");
    setWorkMinutes(nextWork);
    setRestMinutes(nextRest);
    setTimer((current) =>
      resetFocusTimer(current, {
        workSeconds: nextWork * 60,
        restSeconds: nextRest * 60
      })
    );
    onFieldChange("focusPreset", `${nextWork}/${nextRest}`);
  }

  return (
    <section className={styles.tool} aria-labelledby="focus-timer-title">
      <div className={styles.toolHeading}>
        <p className={styles.eyebrow}>Focused practice timer</p>
        <h2 id="focus-timer-title">One goal, one workable cycle</h2>
      </div>

      <label className={styles.fieldWide}>
        <span>Session goal</span>
        <input
          onChange={(event) => onFieldChange("focusGoal", event.target.value)}
          placeholder="Eight relaxed Em-Asus2 changes at 50 BPM"
          type="text"
          value={record.fields.focusGoal ?? ""}
        />
      </label>

      <div className={styles.segmented} aria-label="Timer preset">
        {(["10-5", "25-5", "custom"] as const).map((option) => (
          <button
            aria-pressed={preset === option}
            key={option}
            onClick={() => selectPreset(option)}
            type="button"
          >
            {option === "10-5" ? "10 / 5" : option === "25-5" ? "25 / 5" : "Custom"}
          </button>
        ))}
      </div>

      <div className={styles.timerLayout}>
        <div className={styles.timerDisplay} role="timer" aria-live="off">
          <span>{timer.phase === "work" ? "Focused work" : "Rest"}</span>
          <strong>{formatTimerSeconds(timer.remainingSeconds)}</strong>
          <small>{timer.completedWorkCycles} work cycles completed</small>
        </div>
        <div className={styles.timerSettings}>
          <label>
            <span>Work minutes</span>
            <input
              min="1"
              max="60"
              onChange={(event) => updateCustomDuration("work", Number(event.target.value))}
              type="number"
              value={workMinutes}
            />
          </label>
          <label>
            <span>Rest minutes</span>
            <input
              min="1"
              max="30"
              onChange={(event) => updateCustomDuration("rest", Number(event.target.value))}
              type="number"
              value={restMinutes}
            />
          </label>
          <label className={styles.checkControl}>
            <input
              checked={breakReminder}
              onChange={(event) => setBreakReminder(event.target.checked)}
              type="checkbox"
            />
            <span>Announce the break</span>
          </label>
        </div>
      </div>

      <div className={styles.toolActions}>
        <button
          className={styles.primaryButton}
          onClick={() => {
            setTimer((current) => ({ ...current, running: !current.running }));
            setAnnouncement(timer.running ? "Timer paused." : "Timer started.");
          }}
          type="button"
        >
          {timer.running ? "Pause" : "Start"}
        </button>
        <button
          className={styles.secondaryButton}
          onClick={() => {
            setTimer((current) => resetFocusTimer(current, durations));
            setAnnouncement("Current cycle reset.");
          }}
          type="button"
        >
          Reset cycle
        </button>
      </div>
      <p className={styles.srStatus} role="status">{announcement}</p>

      <label className={styles.fieldWide}>
        <span>Session reflection</span>
        <textarea
          onChange={(event) => onFieldChange("focusReflection", event.target.value)}
          placeholder="What changed, and what is the smallest useful next action?"
          rows={4}
          value={record.fields.focusReflection ?? ""}
        />
      </label>
    </section>
  );
}
