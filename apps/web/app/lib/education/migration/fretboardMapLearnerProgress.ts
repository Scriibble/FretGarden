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
  not_observed: "No counted try yet",
  developing: "Practiced with help",
  insufficient_evidence: "Keep practicing this",
  independent_once: "Done without help",
  review_due: "Ready to review",
  retained: "Remembered after a break",
  applied: "Used it in a new pattern",
  needs_refresh: "Needs a quick refresh"
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
      "Your earlier lesson and drill history is still here. Guided practice only counts tasks where you tap, click, or choose an answer on screen.",
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
      ? "No saved drill result is recorded."
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
    detail: friendlyClaimRationale(claim.rationale)
  };
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

function choosePrimaryAction(claims: CapabilityClaim[]): LearnerProgressAction {
  if (claims.some(({ state }) => state === "review_due" || state === "needs_refresh")) {
    return {
      href: "/education-pilot",
      label: "Do the current review",
      detail: "Return to guided practice for the review or refresh that is ready."
    };
  }
  if (claims.some(({ state }) => state === "not_observed")) {
    return {
      href: "/education-pilot",
      label: "Start guided practice",
      detail: "Begin the guided path so FretGarden can check your answers on screen."
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
      detail: "Keep working with help and fresh tries."
    };
  }
  if (claims.some(({ state }) => state === "independent_once")) {
    return {
      href: "/education-pilot",
      label: "Come back for review",
      detail: "Keep the try you did without help, then return later to check it again."
    };
  }
  return {
    href: "/education-pilot",
    label: "Practice this segment again",
    detail: "Revisit the guided path without replacing earlier work."
  };
}

function formatHistoryStatus(status: LearnerHistoryStatus): string {
  if (status === "complete") return "Complete";
  if (status === "in-progress") return "In progress";
  return "Not recorded";
}
