"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  CapabilityClaim,
  ReviewObligation
} from "@pocket-practice/education-engine";
import type {
  FretboardMapParallelReport,
  HistoricalEducationRecord,
  LegacyMappingDiagnostic
} from "../../lib/education/migration/contracts";
import { createFretboardMapParallelReport } from "../../lib/education/migration/fretboardMapReportOrchestration";
import {
  fretboardMapMigrationInputsEqual,
  readFretboardMapMigrationInputs,
} from "../../lib/education/migration/readFretboardMapMigrationInputs";
import styles from "./fretboardMapMigrationReport.module.css";

interface ReportState {
  report: FretboardMapParallelReport;
  storageUnchanged: boolean;
}

export function FretboardMapMigrationReport() {
  const [state, setState] = useState<ReportState | null>(null);
  const [readError, setReadError] = useState(false);

  useEffect(() => {
    try {
      const before = readFretboardMapMigrationInputs(window.localStorage);
      const now = new Date().toISOString();
      const report = createFretboardMapParallelReport({ raw: before, now });
      const after = readFretboardMapMigrationInputs(window.localStorage);
      setState({
        report,
        storageUnchanged: fretboardMapMigrationInputsEqual(before, after)
      });
    } catch {
      setReadError(true);
    }
  }, []);

  if (readError) {
    return (
      <main className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Local progress check</p>
          <h1>Fretboard map comparison report</h1>
        </header>
        <section className={styles.notice} role="alert">
          <h2>Local data could not be read</h2>
          <p>
            FretGarden stopped without changing your saved data. Check that your
            browser allows local storage, then try this review again.
          </p>
        </section>
      </main>
    );
  }

  if (!state) {
    return (
      <main className={styles.loading} aria-live="polite">
        Preparing the local comparison report...
      </main>
    );
  }

  const { report, storageUnchanged } = state;
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Local progress check</p>
          <h1>Fretboard map comparison report</h1>
          <p className={styles.lead}>
            This read-only check compares older history with the new guided
            practice results without mixing them together.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => exportReport(report)}
          >
            Export JSON
          </button>
          <Link className={styles.secondaryLink} href="/lessons">
            Lesson library
          </Link>
        </div>
      </header>

      <section className={styles.statusBand} aria-label="Report integrity">
        <Status label="Report version" value={String(report.reportVersion)} />
        <Status label="Guided practice data" value={formatToken(report.currentEducation.storeState)} />
        <Status
          label="Storage integrity"
          value={storageUnchanged ? "Unchanged" : "Changed during read"}
          warning={!storageUnchanged}
        />
      </section>

      <p className={styles.explanation}>{report.explanation}</p>

      <section className={styles.reportBand} aria-labelledby="legacy-history-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Historical context</p>
          <h2 id="legacy-history-heading">Legacy lesson and practice history</h2>
          <p>
            These records show what the older screen saved. They do not prove
            how much help, timing, or review was involved.
          </p>
        </div>
        <dl className={styles.summaryGrid}>
          <Summary label="Lesson status" value={formatToken(report.legacy.summary.learningStatus)} />
          <Summary
            label="Checkpoints"
            value={report.legacy.summary.completedCheckpoints.join(", ") || "None recorded"}
          />
          <Summary label="Practice status" value={formatToken(report.legacy.summary.practiceStatus)} />
          <Summary
            label="Last practice"
            value={formatDate(report.legacy.summary.lastAttemptedAt)}
          />
          <Summary
            label="Last accuracy"
            value={report.legacy.summary.lastAccuracy === null ? "Unknown" : `${report.legacy.summary.lastAccuracy}%`}
          />
          <Summary
            label="Prompt count"
            value={report.legacy.summary.lastPromptCount === null ? "Unknown" : String(report.legacy.summary.lastPromptCount)}
          />
        </dl>
        <div className={styles.recordList}>
          {report.legacy.records.length === 0 ? (
            <p className={styles.emptyState}>No saved fretboard-map history was found.</p>
          ) : (
            report.legacy.records.map((record) => (
              <HistoricalRecordView key={record.id} record={record} />
            ))
          )}
        </div>
      </section>

      <section className={styles.reportBand} aria-labelledby="current-evidence-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>New guided practice checks</p>
          <h2 id="current-evidence-heading">Skills shown and review state</h2>
          <p>{report.currentEducation.nextAction}</p>
        </div>
        <div className={styles.claimList}>
          {report.currentEducation.claims.map((claim) => (
            <ClaimView key={`${claim.objective.id}@${claim.objective.version}`} claim={claim} />
          ))}
        </div>
        <div className={styles.detailColumns}>
          <div>
            <h3>Results counted here</h3>
            {report.currentEducation.evidenceCounts.length === 0 ? (
              <p className={styles.emptyState}>No new guided practice results yet.</p>
            ) : (
              <ul className={styles.plainList}>
                {report.currentEducation.evidenceCounts.map(({ kind, count }) => (
                  <li key={kind}>
                    <span>{formatToken(kind)}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ReviewList reviews={report.currentEducation.reviews} />
        </div>
      </section>

      <section className={styles.reportBand} aria-labelledby="diagnostics-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Storage notes</p>
          <h2 id="diagnostics-heading">What the old data can and cannot show</h2>
        </div>
        <DiagnosticList diagnostics={report.legacy.diagnostics} />
      </section>
    </main>
  );
}

function Status({
  label,
  value,
  warning = false
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className={warning ? styles.warningStatus : undefined}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function HistoricalRecordView({ record }: { record: HistoricalEducationRecord }) {
  return (
    <article className={styles.record}>
      <div className={styles.recordHeading}>
        <h3>{formatToken(record.category)}</h3>
        <span>{formatDate(record.occurredAt)}</span>
      </div>
      <dl className={styles.factList}>
        {record.facts.map((fact) => (
          <div key={fact.name}>
            <dt>{formatToken(fact.name)}</dt>
            <dd>{String(fact.value)}</dd>
          </div>
        ))}
      </dl>
      <p>{record.educationalLimit}</p>
      <details>
        <summary>Unknown conditions ({record.unknownConditions.length})</summary>
        <ul>
          {record.unknownConditions.map((condition) => (
            <li key={condition}>{formatToken(condition)}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

function ClaimView({ claim }: { claim: CapabilityClaim }) {
  return (
    <article className={styles.claim}>
      <div>
        <p className={styles.objectiveId}>
          {claim.objective.id}@{claim.objective.version}
        </p>
        <h3>{formatToken(claim.state)}</h3>
      </div>
      <dl>
        <div>
          <dt>Strongest result</dt>
          <dd>{claim.strongestKind ? formatToken(claim.strongestKind) : "No result yet"}</dd>
        </div>
        <div>
          <dt>Skill strength</dt>
          <dd>{formatToken(claim.confidence)}</dd>
        </div>
      </dl>
      <p>{claim.rationale}</p>
    </article>
  );
}

function ReviewList({ reviews }: { reviews: ReviewObligation[] }) {
  return (
    <div>
      <h3>Scheduled reviews</h3>
      {reviews.length === 0 ? (
        <p className={styles.emptyState}>No scheduled review is recorded.</p>
      ) : (
        <ul className={styles.plainList}>
          {reviews.map((review) => (
            <li key={review.id}>
              <span>{formatToken(review.state)}</span>
              <strong>{formatDate(review.dueAt)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DiagnosticList({ diagnostics }: { diagnostics: LegacyMappingDiagnostic[] }) {
  if (diagnostics.length === 0) {
    return <p className={styles.emptyState}>No storage notes were produced.</p>;
  }
  return (
    <ul className={styles.diagnosticList}>
      {diagnostics.map((diagnostic) => (
        <li key={`${diagnostic.source}:${diagnostic.code}`}>
          <div>
            <strong>{formatDiagnosticCode(diagnostic.code)}</strong>
            <span>{formatDiagnosticSource(diagnostic.source)}</span>
          </div>
          <p>{diagnostic.message}</p>
          <b aria-label={`${diagnostic.count} occurrences`}>{diagnostic.count}</b>
        </li>
      ))}
    </ul>
  );
}

function formatToken(value: string): string {
  return value.replaceAll("_", " ");
}

function formatDiagnosticCode(value: LegacyMappingDiagnostic["code"]): string {
  const labels: Record<LegacyMappingDiagnostic["code"], string> = {
    combined_sources: "Old and new results found",
    duplicate_record: "Duplicate saved item",
    ignored_unrelated: "Other lesson data skipped",
    legacy_format: "Older save format",
    malformed_envelope: "Saved data could not be read",
    omitted_record: "Saved item skipped",
    source_records_seen: "Saved items found",
    timestamp_unknown: "Missing practice time",
    unattributed_session: "Session source missing",
    valid_non_mappable: "Missing activity detail"
  };
  return labels[value];
}

function formatDiagnosticSource(value: LegacyMappingDiagnostic["source"]): string {
  const labels: Record<LegacyMappingDiagnostic["source"], string> = {
    learning_progress: "Lesson history",
    note_history: "Note drill history",
    parallel_report: "Comparison report",
    practice_progress: "Practice history"
  };
  return labels[value];
}

function formatDate(value: string | null): string {
  if (value === null) return "Unknown";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "Unknown"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(timestamp));
}

function exportReport(report: FretboardMapParallelReport): void {
  const contents = JSON.stringify(report, null, 2);
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `fretgarden-fretboard-map-comparison-${report.generatedAt.replaceAll(":", "-")}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
