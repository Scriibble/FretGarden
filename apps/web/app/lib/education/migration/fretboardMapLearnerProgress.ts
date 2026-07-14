import type {
  CapabilityClaim,
  CapabilityState
} from "@pocket-practice/education-engine";
import type { FretboardMapParallelReport } from "./contracts";

export const FRETBOARD_MAP_LEARNER_BRIDGE_ENABLED = true;

export type LearnerHistoryStatus = "not_recorded" | "in-progress" | "complete";

export interface LearnerHistorySummary {
  status: LearnerHistoryStatus;
  label: string;
  detail: string;
  occurredAt: string | null;
}

export interface LearnerCapabilitySummary {
  objectiveId: string;
  label: string;
  state: CapabilityState;
  statusLabel: string;
  detail: string;
}

export interface LearnerProgressAction {
  href: "/education-pilot";
  label: string;
  detail: string;
}

export interface FretboardMapLearnerProgress {
  segmentId: "fretboard-map";
  lessonHistory: LearnerHistorySummary;
  practiceHistory: LearnerHistorySummary;
  capabilities: LearnerCapabilitySummary[];
  hasUnreadableSources: boolean;
  explanation: string;
  primaryAction: LearnerProgressAction;
}

const objectiveLabels: Record<string, string> = {
  "fretboard.coordinates.basic": "Fretboard coordinates",
  "fretboard.natural-notes.region-1": "Natural notes in the first region"
};

const capabilityLabels: Record<CapabilityState, string> = {
  not_observed: "Not yet observed",
  developing: "Practiced with support",
  insufficient_evidence: "More evidence needed",
  independent_once: "Shown independently",
  review_due: "Review due",
  retained: "Retrieved after a delay",
  applied: "Applied in a changed context",
  needs_refresh: "Refresh recommended"
};

export function buildFretboardMapLearnerProgress(
  report: FretboardMapParallelReport
): FretboardMapLearnerProgress {
  return {
    segmentId: "fretboard-map",
    lessonHistory: lessonHistory(report),
    practiceHistory: practiceHistory(report),
    capabilities: report.currentEducation.claims.map(toCapabilitySummary),
    hasUnreadableSources:
      report.currentEducation.storeState === "invalid_json" ||
      report.currentEducation.storeState === "unknown_schema" ||
      report.legacy.diagnostics.some(({ code }) => code === "malformed_envelope"),
    explanation:
      "Your earlier lesson and drill history is preserved. Current evidence records only what the guided practice path has observed, so history does not become independent, retained, or applied evidence.",
    primaryAction: choosePrimaryAction(report.currentEducation.claims)
  };
}

export function formatCapabilityState(state: CapabilityState): string {
  return capabilityLabels[state];
}

function lessonHistory(report: FretboardMapParallelReport): LearnerHistorySummary {
  const status = report.legacy.summary.learningStatus;
  const checkpoints = report.legacy.summary.completedCheckpoints;
  return {
    status,
    label: formatHistoryStatus(status),
    detail:
      checkpoints.length === 0
        ? "No lesson checkpoints are recorded."
        : `Recorded checkpoints: ${checkpoints.join(", ")}.`,
    occurredAt:
      report.legacy.records.find(({ category }) => category === "participation")
        ?.occurredAt ?? null
  };
}

function practiceHistory(report: FretboardMapParallelReport): LearnerHistorySummary {
  const { lastAccuracy, lastPromptCount, lastAttemptedAt, practiceStatus } =
    report.legacy.summary;
  const detail =
    lastAccuracy === null || lastPromptCount === null
      ? "No attributable drill summary is recorded."
      : `Last recorded drill: ${lastAccuracy}% across ${lastPromptCount} prompts.`;
  return {
    status: practiceStatus,
    label: formatHistoryStatus(practiceStatus),
    detail,
    occurredAt: lastAttemptedAt
  };
}

function toCapabilitySummary(claim: CapabilityClaim): LearnerCapabilitySummary {
  return {
    objectiveId: claim.objective.id,
    label: objectiveLabels[claim.objective.id] ?? claim.objective.id,
    state: claim.state,
    statusLabel: formatCapabilityState(claim.state),
    detail: claim.rationale
  };
}

function choosePrimaryAction(claims: CapabilityClaim[]): LearnerProgressAction {
  if (claims.some(({ state }) => state === "review_due" || state === "needs_refresh")) {
    return {
      href: "/education-pilot",
      label: "Complete current review",
      detail: "Return to the guided path for the review or refresh that is due."
    };
  }
  if (claims.some(({ state }) => state === "not_observed")) {
    return {
      href: "/education-pilot",
      label: "Start guided practice",
      detail: "Begin the guided path so current evidence can be observed."
    };
  }
  if (
    claims.some(
      ({ state }) => state === "developing" || state === "insufficient_evidence"
    )
  ) {
    return {
      href: "/education-pilot",
      label: "Continue guided practice",
      detail: "Keep working with the current supports and fresh attempts."
    };
  }
  if (claims.some(({ state }) => state === "independent_once")) {
    return {
      href: "/education-pilot",
      label: "Continue toward delayed review",
      detail: "Preserve the independent result and return for delayed retrieval."
    };
  }
  return {
    href: "/education-pilot",
    label: "Practice this segment again",
    detail: "Revisit the guided path without replacing earlier evidence."
  };
}

function formatHistoryStatus(status: LearnerHistoryStatus): string {
  if (status === "complete") return "Complete";
  if (status === "in-progress") return "In progress";
  return "Not recorded";
}
