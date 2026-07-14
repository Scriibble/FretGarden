"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildFretboardMapLearnerProgress,
  type FretboardMapLearnerProgress,
  type LearnerHistorySummary
} from "../../lib/education/migration/fretboardMapLearnerProgress";
import {
  fretboardMapMigrationInputsEqual,
  readFretboardMapMigrationInputs
} from "../../lib/education/migration/readFretboardMapMigrationInputs";
import { createFretboardMapParallelReport } from "../../lib/education/migration/fretboardMapReportOrchestration";
import styles from "./fretboardMapProgress.module.css";

interface ProgressState {
  progress: FretboardMapLearnerProgress;
  sourceStable: boolean;
}

export function FretboardMapProgress() {
  const [state, setState] = useState<ProgressState | null>(null);
  const [readError, setReadError] = useState(false);

  useEffect(() => {
    try {
      const before = readFretboardMapMigrationInputs(window.localStorage);
      const report = createFretboardMapParallelReport({
        raw: before,
        now: new Date().toISOString()
      });
      const after = readFretboardMapMigrationInputs(window.localStorage);
      setState({
        progress: buildFretboardMapLearnerProgress(report),
        sourceStable: fretboardMapMigrationInputsEqual(before, after)
      });
    } catch {
      setReadError(true);
    }
  }, []);

  if (readError) {
    return (
      <section className={styles.alert} role="alert">
        <h1>Local progress could not be read</h1>
        <p>
          Nothing was changed. You can still open the fretboard lesson or guided
          practice path.
        </p>
        <ProgressLinks primaryLabel="Open guided practice" />
      </section>
    );
  }

  if (!state) {
    return (
      <p className={styles.loading} role="status">
        Preparing your learning progress...
      </p>
    );
  }

  const { progress, sourceStable } = state;
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Learning progress</p>
        <h1>What your fretboard practice has shown</h1>
        <p>
          See earlier lesson activity beside evidence from the guided practice
          path without merging the two.
        </p>
      </header>

      {progress.hasUnreadableSources ? (
        <section className={styles.alert} role="alert">
          <strong>Some local progress could not be read.</strong>
          <p>The readable parts are shown below, and no stored value was changed.</p>
        </section>
      ) : null}

      {!sourceStable ? (
        <section className={styles.alert} role="alert">
          <strong>Local progress changed while this page was loading.</strong>
          <p>Refresh to compare the latest values. This page did not write the change.</p>
        </section>
      ) : null}

      <p className={styles.explanation}>{progress.explanation}</p>

      <HistoryBand
        eyebrow="Preserved lesson history"
        heading="Fretboard map lesson"
        summary={progress.lessonHistory}
      />
      <HistoryBand
        eyebrow="Preserved drill history"
        heading="Note-recognition reinforcement"
        summary={progress.practiceHistory}
      />

      <section className={styles.band} aria-labelledby="current-evidence-title">
        <div className={styles.bandHeading}>
          <p className={styles.eyebrow}>Current evidence</p>
          <h2 id="current-evidence-title">Capabilities observed in guided practice</h2>
          <p>
            These states come only from evaluated attempts in the current education
            path.
          </p>
        </div>
        <div className={styles.capabilityGrid}>
          {progress.capabilities.map((capability) => (
            <article className={styles.capability} key={capability.objectiveId}>
              <span>{capability.label}</span>
              <h3>{capability.statusLabel}</h3>
              <p>{capability.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.nextBand} aria-labelledby="next-action-title">
        <div>
          <p className={styles.eyebrow}>Next useful action</p>
          <h2 id="next-action-title">{progress.primaryAction.label}</h2>
          <p>{progress.primaryAction.detail}</p>
        </div>
        <ProgressLinks primaryLabel={progress.primaryAction.label} />
      </section>
    </>
  );
}

function HistoryBand({
  eyebrow,
  heading,
  summary
}: {
  eyebrow: string;
  heading: string;
  summary: LearnerHistorySummary;
}) {
  return (
    <section className={styles.band} aria-label={eyebrow}>
      <div className={styles.historyHeading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <strong className={styles.historyStatus}>{summary.label}</strong>
      </div>
      <p>{summary.detail}</p>
      <small>{formatDate(summary.occurredAt)}</small>
    </section>
  );
}

function ProgressLinks({ primaryLabel }: { primaryLabel: string }) {
  return (
    <div className={styles.actions}>
      <Link className={styles.primaryLink} href="/education-pilot">
        {primaryLabel}
      </Link>
      <Link className={styles.secondaryLink} href="/lessons/fretboard-map">
        Open fretboard map lesson
      </Link>
      <Link
        className={styles.secondaryLink}
        href="/practice?drill=note&lesson=fretboard-map#practice"
      >
        Reinforce with note drill
      </Link>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (value === null) return "No date recorded";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "No date recorded"
    : `Last recorded ${new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(timestamp))}`;
}
