"use client";

import { useState, type FormEvent } from "react";
import type { PracticePlanResponse } from "../../lib/education/pilotRuntime";
import styles from "./educationPilot.module.css";

interface PracticePlanStepProps {
  onComplete: (response: PracticePlanResponse) => void;
}

export function PracticePlanStep({ onComplete }: PracticePlanStepProps) {
  const [target, setTarget] = useState("Natural notes on strings 6 and 5");
  const [durationMinutes, setDurationMinutes] = useState<5 | 10 | 15>(10);
  const [nextAction, setNextAction] = useState("Come back later to check this again");
  const [reducedLoad, setReducedLoad] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onComplete({ target, durationMinutes, nextAction, reducedLoad });
  }

  return (
    <section className={styles.lessonBand} aria-labelledby="practice-plan-title">
      <div className={styles.bandHeading}>
        <p className={styles.eyebrow}>Get ready</p>
        <h2 id="practice-plan-title">Choose a session you can finish with care.</h2>
        <p>One goal is enough. A shorter session can be a smart choice.</p>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <label>
          <span>Primary target</span>
          <input
            minLength={3}
            onChange={(event) => setTarget(event.target.value)}
            required
            value={target}
          />
        </label>
        <fieldset>
          <legend>Available focus time</legend>
          <div className={styles.segmented}>
            {([5, 10, 15] as const).map((minutes) => (
              <button
                aria-pressed={durationMinutes === minutes}
                className={durationMinutes === minutes ? styles.selectedSegment : ""}
                key={minutes}
                onClick={() => setDurationMinutes(minutes)}
                type="button"
              >
                {minutes} min
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span>Next useful action</span>
          <input
            minLength={3}
            onChange={(event) => setNextAction(event.target.value)}
            required
            value={nextAction}
          />
        </label>
        <label className={styles.checkLabel}>
          <input
            checked={reducedLoad}
            onChange={(event) => setReducedLoad(event.target.checked)}
            type="checkbox"
          />
          <span>I am choosing a shorter or lighter session today.</span>
        </label>
        <button className={styles.primaryButton} type="submit">
          Start this session
        </button>
      </form>
    </section>
  );
}
