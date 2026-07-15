"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  deriveCapabilityClaim,
  evaluateReadiness,
  getReviewState,
  type EvidenceKind,
  type ReviewObligation
} from "@pocket-practice/education-engine";
import { PracticePlanStep } from "./PracticePlanStep";
import { PulseTask } from "./PulseTask";
import { FretboardTask } from "./FretboardTask";
import { ApplicationTask } from "./ApplicationTask";
import {
  applicationPrompts,
  coordinatePrompts,
  evaluateCoordinateSet,
  evaluateNoteSet,
  evaluatePracticePlan,
  notePrompts,
  type PilotEvaluationResult,
  type PracticePlanResponse,
  type PulseTempoBpm
} from "../../lib/education/pilotRuntime";
import {
  appendPilotEvaluation,
  appendReadinessDecision,
  completePilotReview,
  createEmptyPilotStore,
  discardEducationPilotRecovery,
  readEducationPilotStore,
  readEducationPilotRecovery,
  upsertPilotSession,
  writeEducationPilotStore,
  type EducationPilotRecovery,
  type EducationPilotStore
} from "../../lib/education/storage/educationPilotStorage";
import styles from "./educationPilot.module.css";
import { AppNavigation } from "../AppNavigation";

type Stage = "plan" | "pulse" | "coordinates" | "notes" | "application" | "summary";

const EPOCH = "1970-01-01T00:00:00.000Z";
const stageOrder: Stage[] = [
  "plan",
  "pulse",
  "coordinates",
  "notes",
  "application",
  "summary"
];
const stageLabels: Record<Stage, string> = {
  plan: "Set the session",
  pulse: "Meet the pulse",
  coordinates: "Orient the region",
  notes: "Retrieve notes",
  application: "Apply a pattern",
  summary: "Next action"
};

export function EducationPilot() {
  const [hydrated, setHydrated] = useState(false);
  const [store, setStore] = useState<EducationPilotStore>(() => createEmptyPilotStore(EPOCH));
  const [stage, setStage] = useState<Stage>("plan");
  const [sessionId, setSessionId] = useState<string>("");
  const [outcome, setOutcome] = useState<PilotEvaluationResult | null>(null);
  const [reviewObligation, setReviewObligation] = useState<ReviewObligation | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [recovery, setRecovery] = useState<EducationPilotRecovery | null>(null);
  const [pendingPersistence, setPendingPersistence] =
    useState<EducationPilotStore | null>(null);

  useEffect(() => {
    const now = new Date().toISOString();
    const restored = readEducationPilotStore(window.localStorage, now);
    setRecovery(readEducationPilotRecovery(window.localStorage));
    setStore(restored);
    setSessionId(restored.sessions[0]?.id ?? "");
    setStage(inferStage(restored));
    setHydrated(true);
  }, []);

  const noteEvidence = useMemo(
    () =>
      store.evidence.filter(
        ({ objective }) => objective.id === "fretboard.natural-notes.region-1"
      ),
    [store.evidence]
  );
  const dueReview = useMemo(
    () =>
      [...store.reviews]
        .filter(
          (review) =>
            getReviewState(review, new Date().toISOString()) === "due" &&
            store.evidence.some(({ id }) => id === review.sourceEvidenceId)
        )
        .sort((left, right) => Date.parse(left.dueAt) - Date.parse(right.dueAt))[0] ?? null,
    [store.evidence, store.reviews]
  );
  const noteReview = useMemo(
    () =>
      [...store.reviews]
        .filter(
          (review) =>
            review.objective.id === "fretboard.natural-notes.region-1" &&
            (review.state === "scheduled" || getReviewState(review, new Date().toISOString()) === "due")
        )
        .sort((left, right) => Date.parse(left.dueAt) - Date.parse(right.dueAt))[0],
    [store.reviews]
  );
  const noteClaim = useMemo(
    () =>
      deriveCapabilityClaim({
        objective: { id: "fretboard.natural-notes.region-1", version: 1 },
        evidence: noteEvidence,
        now: new Date().toISOString(),
        ...(noteReview?.dueAt ? { reviewDueAt: noteReview.dueAt } : {})
      }),
    [noteEvidence, noteReview]
  );

  function persist(next: EducationPilotStore): void {
    setStore(next);
    setPendingPersistence(
      writeEducationPilotStore(window.localStorage, next) ? null : next
    );
  }

  function retryPersistence(): void {
    if (
      pendingPersistence &&
      writeEducationPilotStore(window.localStorage, pendingPersistence)
    ) {
      setPendingPersistence(null);
    }
  }

  function exportPendingPersistence(): void {
    if (!pendingPersistence) {
      return;
    }
    exportJson(
      JSON.stringify(pendingPersistence, null, 2),
      `fretgarden-unsaved-pilot-${pendingPersistence.updatedAt.replaceAll(":", "-")}.json`
    );
  }

  function saveEvaluation(result: PilotEvaluationResult): void {
    const now = result.attempt.respondedAt;
    persist(appendPilotEvaluation(store, result, now));
    setOutcome(result);
  }

  function handlePracticePlan(response: PracticePlanResponse): void {
    const now = new Date().toISOString();
    const id = sessionId || createId("education-session");
    const result = evaluatePracticePlan({ response, sessionId: id, now });
    const withSession = upsertPilotSession(store, {
      id,
      startedAt: store.sessions.find(({ id: candidate }) => candidate === id)?.startedAt ?? now,
      updatedAt: now,
      target: response.target,
      durationMinutes: response.durationMinutes,
      nextAction: response.nextAction,
      state: response.reducedLoad ? "paused" : "active"
    });
    const next = appendPilotEvaluation(withSession, result, now);
    setSessionId(id);
    setOutcome(null);
    persist(next);
    setStage("pulse");
  }

  function handleCoordinateComplete(result: PilotEvaluationResult): void {
    saveEvaluation(result);
    if (result.evidence.kind === "independent_performance") {
      const now = result.attempt.respondedAt;
      const coordinateClaim = deriveCapabilityClaim({
        objective: { id: "fretboard.coordinates.basic", version: 1 },
        evidence: [...store.evidence, result.evidence],
        now
      });
      const readiness = evaluateReadiness({
        target: { id: "fretboard.natural-notes.region-1", version: 1 },
        prerequisites: [
          {
            objective: { id: "fretboard.coordinates.basic", version: 1 },
            relationship: "required",
            minimumKind: "independent_performance"
          }
        ],
        claims: [coordinateClaim],
        now
      });
      const nextStore = appendReadinessDecision(
        appendPilotEvaluation(store, result, now),
        readiness,
        now
      );
      persist(nextStore);
    }
  }

  function handlePulseComplete(result: PilotEvaluationResult): void {
    if (reviewMode && reviewObligation) {
      const next = completePilotReview(
        store,
        reviewObligation.id,
        result,
        result.attempt.respondedAt
      );
      persist(next);
      setOutcome(result);
      return;
    }
    saveEvaluation(result);
  }

  function handleNoteComplete(result: PilotEvaluationResult): void {
    if (reviewMode && reviewObligation) {
      const next = completePilotReview(
        store,
        reviewObligation.id,
        result,
        result.attempt.respondedAt
      );
      persist(next);
      setOutcome(result);
      return;
    }
    saveEvaluation(result);
  }

  function beginReview(): void {
    if (!dueReview) {
      return;
    }
    setReviewObligation(dueReview);
    setReviewMode(true);
    setOutcome(null);
    setStage(
      dueReview.objective.id === "rhythm.external-pulse.basic" ? "pulse" : "notes"
    );
  }

  function endSession(): void {
    const current = store.sessions.find(({ id }) => id === sessionId);
    if (!current) {
      setStage("summary");
      return;
    }
    const now = new Date().toISOString();
    persist(
      upsertPilotSession(store, {
        ...current,
        updatedAt: now,
        state: "ended"
      })
    );
    setOutcome(null);
    setStage("summary");
  }

  function exportRecovery(): void {
    if (!recovery) {
      return;
    }
    exportJson(
      recovery.raw,
      `fretgarden-pilot-recovery-${recovery.capturedAt.replaceAll(":", "-")}.json`
    );
  }

  function dismissRecovery(): void {
    discardEducationPilotRecovery(window.localStorage);
    setRecovery(null);
  }

  if (!hydrated) {
    return (
      <main className={styles.shell}>
        <AppNavigation activePage="progress" />
        <p className={styles.loading} role="status">
          Preparing your practice path...
        </p>
      </main>
    );
  }

  const currentIndex = stageOrder.indexOf(stage);
  const activeSessionId = sessionId || createId("education-session");
  const sourceEvidence = reviewObligation
    ? store.evidence.find(({ id }) => id === reviewObligation.sourceEvidenceId)
    : undefined;
  const sourceAttempt = sourceEvidence
    ? store.attempts.find(({ id }) => id === sourceEvidence.attemptId)
    : undefined;
  const sourcePulseTempo = readPulseTempo(sourceAttempt?.response) ?? 60;

  return (
    <main className={styles.shell}>
      <AppNavigation activePage="progress" />
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Guided practice</p>
          <h1>Build the first reliable landmarks</h1>
          <p className={styles.lead}>
            Choose a short session, keep a steady beat, and find six natural
            notes in a small fretboard area.
          </p>
        </div>
        <div className={styles.headerActions}>
          {sessionId && stage !== "plan" && stage !== "summary" ? (
            <button className={styles.endSessionButton} onClick={endSession} type="button">
              End session here
            </button>
          ) : null}
          <Link className={styles.exitLink} href="/lessons">
            Lesson library
          </Link>
        </div>
      </header>

      {recovery ? (
        <section className={styles.recoveryNotice} aria-labelledby="pilot-recovery-title">
          <div>
            <strong id="pilot-recovery-title">A saved copy is available.</strong>
            <p>
              FretGarden could not read an earlier practice record, so this session
              started fresh without changing lesson or practice history.
            </p>
          </div>
          <div className={styles.actionRow}>
            <button className={styles.secondaryButton} onClick={exportRecovery} type="button">
              Export recovery copy
            </button>
            <button className={styles.endSessionButton} onClick={dismissRecovery} type="button">
              Dismiss
            </button>
          </div>
        </section>
      ) : null}

      {pendingPersistence ? (
        <section
          className={`${styles.recoveryNotice} ${styles.persistenceNotice}`}
          aria-labelledby="pilot-persistence-title"
          role="alert"
        >
          <div>
            <strong id="pilot-persistence-title">
              This practice activity is not saved yet.
            </strong>
            <p>
              Your current work remains on this screen. Retry local saving or export
              the pending practice record; lesson and practice history are untouched.
            </p>
          </div>
          <div className={styles.actionRow}>
            <button
              className={styles.secondaryButton}
              onClick={retryPersistence}
              type="button"
            >
              Retry save
            </button>
            <button
              className={styles.primaryButton}
              onClick={exportPendingPersistence}
              type="button"
            >
              Export session data
            </button>
          </div>
        </section>
      ) : null}

      <nav className={styles.progress} aria-label="Pilot progress">
        {stageOrder.map((item, index) => (
          <span
            aria-current={item === stage ? "step" : undefined}
            className={index === currentIndex ? styles.currentStep : index < currentIndex ? styles.pastStep : ""}
            key={item}
          >
            <b>{index + 1}</b>
            {stageLabels[item]}
          </span>
        ))}
      </nav>

      {stage === "plan" ? <PracticePlanStep onComplete={handlePracticePlan} /> : null}

      {stage === "pulse" ? (
        <PulseTask
          sessionId={activeSessionId}
          outcome={outcome}
          {...(sourceEvidence?.observedAt === undefined
            ? {}
            : {
                reviewSourceAt: sourceEvidence.observedAt,
                reviewSourceTempo: sourcePulseTempo
              })}
          onComplete={handlePulseComplete}
          onContinue={() => {
            const completedReview = reviewMode;
            if (completedReview) {
              setReviewMode(false);
              setReviewObligation(null);
            }
            setOutcome(null);
            setStage(completedReview ? "summary" : "coordinates");
          }}
          onRetry={() => setOutcome(null)}
        />
      ) : null}

      {stage === "coordinates" ? (
        <FretboardTask
          kind="coordinate"
          prompts={coordinatePrompts}
          sessionId={activeSessionId}
          outcome={outcome}
          onComplete={handleCoordinateComplete}
          onRetry={() => setOutcome(null)}
          onContinue={() => {
            setOutcome(null);
            setStage("notes");
          }}
        />
      ) : null}

      {stage === "notes" ? (
        <FretboardTask
          kind="note"
          prompts={reviewMode ? notePrompts.slice(0, 5) : notePrompts}
          sessionId={activeSessionId}
          outcome={outcome}
          {...(sourceEvidence?.observedAt === undefined
            ? {}
            : { reviewSourceAt: sourceEvidence.observedAt })}
          onComplete={handleNoteComplete}
          onRetry={() => setOutcome(null)}
          onContinue={() => {
            const completedReview = reviewMode;
            if (completedReview) {
              setReviewMode(false);
              setReviewObligation(null);
            }
            setOutcome(null);
            setStage(completedReview ? "summary" : "application");
          }}
        />
      ) : null}

      {stage === "application" ? (
        <ApplicationTask
          prompts={applicationPrompts}
          sessionId={activeSessionId}
          outcome={outcome}
          onComplete={saveEvaluation}
          onRetry={() => setOutcome(null)}
          onContinue={() => {
            setOutcome(null);
            setStage("summary");
          }}
        />
      ) : null}

      {stage === "summary" ? (
        <section className={styles.lessonBand} aria-labelledby="pilot-summary-title">
          <div className={styles.bandHeading}>
            <p className={styles.eyebrow}>What you showed</p>
            <h2 id="pilot-summary-title">{statusLabel(noteClaim.strongestKind, noteClaim.state)}</h2>
            <p>{friendlyClaimRationale(noteClaim.rationale)}</p>
          </div>
          <div className={styles.summaryGrid}>
            <div>
              <span>Tries without help</span>
              <strong>{noteEvidence.filter(({ kind }) => kind === "independent_performance").length}</strong>
            </div>
            <div>
              <span>Remembered later</span>
              <strong>{noteEvidence.filter(({ kind }) => kind === "retained_performance").length}</strong>
            </div>
            <div>
              <span>New patterns</span>
              <strong>{noteEvidence.filter(({ kind }) => kind === "transfer").length}</strong>
            </div>
            <div>
              <span>Next review</span>
              <strong>{formatReview(store.reviews)}</strong>
            </div>
          </div>
          <div className={styles.nextAction}>
            <div>
              <span>Next useful action</span>
              <strong>
                {dueReview
                  ? dueReview.objective.id === "rhythm.external-pulse.basic"
                    ? "Meet the pulse again without added support."
                    : "Retrieve the same notes without cues."
                  : store.reviews.some(({ state }) => state === "scheduled")
                    ? "Come back when the review is ready."
                    : store.sessions[0]?.nextAction ?? "Choose one useful next action."}
              </strong>
            </div>
            {dueReview ? (
              <button className={styles.primaryButton} onClick={beginReview} type="button">
                Begin due review
              </button>
            ) : (
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  setOutcome(null);
                  setStage("plan");
                }}
                type="button"
              >
                Plan another session
              </button>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function inferStage(store: EducationPilotStore): Stage {
  const supportedRequirements = new Set(
    store.evidence
      .filter(({ kind }) =>
        kind === "independent_performance" ||
        kind === "retained_performance" ||
        kind === "transfer"
      )
      .map(({ requirementId }) => requirementId)
  );
  const hasDueReview = store.reviews.some(
    (review) =>
      getReviewState(review, new Date().toISOString()) === "due" &&
      store.evidence.some(({ id }) => id === review.sourceEvidenceId)
  );
  if (
    supportedRequirements.has("note-transfer") ||
    supportedRequirements.has("note-retained") ||
    (supportedRequirements.has("note-exit") && hasDueReview)
  ) {
    return "summary";
  }
  if (supportedRequirements.has("note-exit")) {
    return "application";
  }
  if (supportedRequirements.has("coordinate-placement")) {
    return "notes";
  }
  if (supportedRequirements.has("pulse-independent")) {
    return "coordinates";
  }
  if (store.sessions.length > 0) {
    return "pulse";
  }
  return "plan";
}

function statusLabel(kind: EvidenceKind | null, state: string): string {
  if (state === "needs_refresh") {
    return "Needs a quick refresh";
  }
  if (kind === "retained_performance") {
    return "Remembered after a break";
  }
  if (kind === "transfer" || state === "applied") {
    return "Used it in a new pattern";
  }
  if (kind === "independent_performance") {
    return "Done without help";
  }
  if (kind === "supported_performance" || kind === "correction") {
    return "Practiced with help";
  }
  return "No counted try yet";
}

function friendlyClaimRationale(rationale: string): string {
  const replacements: Record<string, string> = {
    "No evidence has been observed.": "No counted try has been recorded yet.",
    "Current evidence does not yet meet the requirement.":
      "Your latest tries do not count for this skill yet.",
    "Earlier achievement is preserved, and newer independent evidence calls for a refresh.":
      "Your earlier success still counts. A newer try shows this skill needs a quick refresh.",
    "Independent performance was observed and delayed retrieval is now due.":
      "You did it without help. Now it is time to check whether you still remember it.",
    "The capability was observed independently in a changed musical context.":
      "You used the skill without help in a new pattern.",
    "Independent retrieval was observed after a meaningful delay.":
      "You remembered it after a break.",
    "Independent performance was observed once; delayed review is still required.":
      "You did it once without help. Come back later to check it again.",
    "Performance has been observed with support.":
      "You practiced it with help."
  };

  return replacements[rationale] ?? rationale;
}

function formatReview(reviews: ReviewObligation[]): string {
  const next = reviews.find(({ state }) => state === "scheduled" || state === "due");
  if (!next) {
    return "Not scheduled";
  }
  if (getReviewState(next, new Date().toISOString()) === "due") {
    return "Due now";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(next.dueAt));
}

function createId(prefix: string): string {
  return `${prefix}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

function readPulseTempo(response: unknown): PulseTempoBpm | null {
  if (typeof response !== "object" || response === null || !("tempoBpm" in response)) {
    return null;
  }
  const tempo = response.tempoBpm;
  return tempo === 50 || tempo === 60 || tempo === 70 ? tempo : null;
}

function exportJson(contents: string, filename: string): void {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
