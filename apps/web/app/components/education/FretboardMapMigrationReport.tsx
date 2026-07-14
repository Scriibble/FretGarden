"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  CapabilityClaim,
  ReviewObligation
} from "@pocket-practice/education-engine";
import {
  parseEducationPilotStore
} from "../../lib/education/storage/educationPilotStorage";
import type {
  FretboardMapParallelReport,
  HistoricalEducationRecord,
  LegacyMappingDiagnostic
} from "../../lib/education/migration/contracts";
import {
  inspectFretboardMapLegacySources,
  mapFretboardMapLegacyHistory
} from "../../lib/education/migration/fretboardMapLegacyMapping";
import { buildFretboardMapParallelReport } from "../../lib/education/migration/fretboardMapParallelReport";
import {
  readFretboardMapMigrationInputs,
  type FretboardMapMigrationInputs
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
      const historical = mapFretboardMapLegacyHistory(
        inspectFretboardMapLegacySources(before)
      );
      const parsedPilot = parseEducationPilotStore(before.educationPilotRaw, now);
      const report = buildFretboardMapParallelReport({
        historical,
        educationStore: parsedPilot.store,
        educationStoreState: parsedPilot.state,
        now
      });
      const after = readFretboardMapMigrationInputs(window.localStorage);
      setState({ report, storageUnchanged: rawInputsEqual(before, after) });
    } catch {
      setReadError(true);
    }
  }, []);

  if (readError) {
    return (
      <main className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Local migration review</p>
          <h1>Fretboard map parallel report</h1>
        </header>
        <section className={styles.notice} role="alert">
          <h2>Local data could not be read</h2>
          <p>
            The report stopped without changing storage. Review browser storage
            availability before trying this rehearsal again.
          </p>
        </section>
      </main>
    );
  }

  if (!state) {
    return (
      <main className={styles.loading} aria-live="polite">
        Preparing the local migration report...
      </main>
    );
  }

  const { report, storageUnchanged } = state;
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Local migration review</p>
          <h1>Fretboard map parallel report</h1>
          <p className={styles.lead}>
            This read-only rehearsal compares preserved legacy history with
            current evidence without merging the two systems.
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
        <Status label="Pilot source" value={formatToken(report.currentEducation.storeState)} />
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
            These records preserve what the legacy interface stored. Unknown
            support, timing, validity, and transfer conditions remain unknown.
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
            <p className={styles.emptyState}>No attributable fretboard-map history was found.</p>
          ) : (
            report.legacy.records.map((record) => (
              <HistoricalRecordView key={record.id} record={record} />
            ))
          )}
        </div>
      </section>

      <section className={styles.reportBand} aria-labelledby="current-evidence-heading">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Current evidence policy</p>
          <h2 id="current-evidence-heading">Capability claims and review state</h2>
          <p>{report.currentEducation.nextAction}</p>
        </div>
        <div className={styles.claimList}>
          {report.currentEducation.claims.map((claim) => (
            <ClaimView key={`${claim.objective.id}@${claim.objective.version}`} claim={claim} />
          ))}
        </div>
        <div className={styles.detailColumns}>
          <div>
            <h3>Observed evidence kinds</h3>
            {report.currentEducation.evidenceCounts.length === 0 ? (
              <p className={styles.emptyState}>No current evidence was observed.</p>
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
          <p className={styles.eyebrow}>Mapping diagnostics</p>
          <h2 id="diagnostics-heading">Source conditions kept explicit</h2>
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
          <dt>Strongest evidence</dt>
          <dd>{claim.strongestKind ? formatToken(claim.strongestKind) : "Not observed"}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
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
      <h3>Review obligations</h3>
      {reviews.length === 0 ? (
        <p className={styles.emptyState}>No review obligation is recorded.</p>
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
    return <p className={styles.emptyState}>No source diagnostics were produced.</p>;
  }
  return (
    <ul className={styles.diagnosticList}>
      {diagnostics.map((diagnostic) => (
        <li key={`${diagnostic.source}:${diagnostic.code}`}>
          <div>
            <strong>{formatToken(diagnostic.code)}</strong>
            <span>{formatToken(diagnostic.source)}</span>
          </div>
          <p>{diagnostic.message}</p>
          <b aria-label={`${diagnostic.count} occurrences`}>{diagnostic.count}</b>
        </li>
      ))}
    </ul>
  );
}

function rawInputsEqual(
  before: FretboardMapMigrationInputs,
  after: FretboardMapMigrationInputs
): boolean {
  return Object.keys(before).every(
    (key) =>
      before[key as keyof FretboardMapMigrationInputs] ===
      after[key as keyof FretboardMapMigrationInputs]
  );
}

function formatToken(value: string): string {
  return value.replaceAll("_", " ");
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
  anchor.download = `fretgarden-fretboard-map-migration-${report.generatedAt.replaceAll(":", "-")}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
