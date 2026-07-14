import {
  deriveCapabilityClaim,
  getReviewState,
  type CapabilityClaim,
  type EvidenceKind,
  type EvidenceRecord,
  type ReviewObligation,
  type VersionRef
} from "@pocket-practice/education-engine";
import type {
  EducationPilotStore,
  EducationPilotStoreState
} from "../storage/educationPilotStorage";
import {
  FRETBOARD_MAP_REPORT_VERSION,
  type EvidenceKindCount,
  type FretboardMapParallelReport,
  type HistoricalEducationRecord,
  type LegacyMappingResult,
  type LegacyReportSummary
} from "./contracts";

const OBJECTIVES = [
  { id: "fretboard.coordinates.basic", version: 1 },
  { id: "fretboard.natural-notes.region-1", version: 1 }
] as const satisfies readonly VersionRef[];

const EVIDENCE_KIND_ORDER: Array<EvidenceKind | "unclassified"> = [
  "correction",
  "exposure",
  "supported_performance",
  "independent_performance",
  "retained_performance",
  "transfer",
  "readiness",
  "unclassified"
];

export function buildFretboardMapParallelReport(input: {
  historical: LegacyMappingResult;
  educationStore: EducationPilotStore;
  educationStoreState: EducationPilotStoreState;
  now: string;
}): FretboardMapParallelReport {
  const evidence = input.educationStore.evidence.filter(({ objective }) =>
    isTargetObjective(objective)
  );
  const reviews = input.educationStore.reviews
    .filter(({ objective }) => isTargetObjective(objective))
    .map((review) => ({ ...review, state: getReviewState(review, input.now) }))
    .sort(compareReviews);
  const claims = OBJECTIVES.map((objective) =>
    buildClaim(objective, evidence, reviews, input.now)
  );
  const diagnostics = [...input.historical.diagnostics];
  if (input.historical.records.length > 0 && evidence.length > 0) {
    diagnostics.push({
      code: "combined_sources",
      source: "parallel_report",
      count: 1,
      message:
        "Legacy history and current evidence are both present and remain independent."
    });
  }

  return {
    reportVersion: FRETBOARD_MAP_REPORT_VERSION,
    segmentId: "fretboard-map",
    generatedAt: input.now,
    explanation:
      "Legacy completion is preserved as historical context. It was not evaluated under the current evidence policy and does not strengthen capability claims.",
    legacy: {
      summary: summarizeLegacy(input.historical.records),
      records: input.historical.records.map(cloneHistoricalRecord),
      diagnostics
    },
    currentEducation: {
      storeState: input.educationStoreState,
      claims,
      evidenceCounts: countEvidence(evidence),
      reviews,
      nextAction: chooseNextAction(claims)
    }
  };
}

function buildClaim(
  objective: VersionRef,
  evidence: EvidenceRecord[],
  reviews: ReviewObligation[],
  now: string
): CapabilityClaim {
  const relevantReviews = reviews.filter(
    (review) =>
      review.objective.id === objective.id &&
      review.objective.version === objective.version &&
      (review.state === "scheduled" || review.state === "due")
  );
  const reviewDueAt = relevantReviews.sort(compareReviews)[0]?.dueAt;
  return deriveCapabilityClaim({
    objective,
    evidence,
    now,
    ...(reviewDueAt === undefined ? {} : { reviewDueAt })
  });
}

function summarizeLegacy(
  records: HistoricalEducationRecord[]
): LegacyReportSummary {
  const participation = records.find(({ category }) => category === "participation");
  const practice = records.find(({ category }) => category === "practice_summary");
  return {
    learningStatus: readStatus(participation),
    completedCheckpoints: ["read", "play", "write"].filter(
      (checkpoint) => readFact(participation, checkpoint) === true
    ),
    practiceStatus: readStatus(practice),
    lastAttemptedAt: practice?.occurredAt ?? null,
    lastAccuracy: readNumberFact(practice, "last_accuracy"),
    lastPromptCount: readNumberFact(practice, "last_prompt_count")
  };
}

function readStatus(
  record: HistoricalEducationRecord | undefined
): "not_recorded" | "in-progress" | "complete" {
  const status = readFact(record, "legacy_status");
  return status === "complete" || status === "in-progress"
    ? status
    : "not_recorded";
}

function readNumberFact(
  record: HistoricalEducationRecord | undefined,
  name: string
): number | null {
  const value = readFact(record, name);
  return typeof value === "number" ? value : null;
}

function readFact(
  record: HistoricalEducationRecord | undefined,
  name: string
): string | number | boolean | undefined {
  return record?.facts.find((fact) => fact.name === name)?.value;
}

function countEvidence(evidence: EvidenceRecord[]): EvidenceKindCount[] {
  return EVIDENCE_KIND_ORDER.flatMap((kind) => {
    const count = evidence.filter((record) =>
      kind === "unclassified" ? record.kind === null : record.kind === kind
    ).length;
    return count === 0 ? [] : [{ kind, count }];
  });
}

function chooseNextAction(claims: CapabilityClaim[]): string {
  if (claims.some(({ state }) => state === "needs_refresh" || state === "review_due")) {
    return "Complete the due current-system review before making a new claim.";
  }
  if (claims.every(({ state }) => state === "not_observed")) {
    return "No current-system evidence has been observed for this segment.";
  }
  if (claims.some(({ state }) => state === "independent_once")) {
    return "Preserve the independent result and wait for its delayed review.";
  }
  if (claims.some(({ state }) => state === "applied")) {
    return "Keep the applied result separate from legacy completion history.";
  }
  return "Continue with the next current-system action already assigned by the pilot.";
}

function isTargetObjective(objective: VersionRef): boolean {
  return OBJECTIVES.some(
    (target) => target.id === objective.id && target.version === objective.version
  );
}

function compareReviews(left: ReviewObligation, right: ReviewObligation): number {
  return Date.parse(left.dueAt) - Date.parse(right.dueAt) || left.id.localeCompare(right.id);
}

function cloneHistoricalRecord(
  record: HistoricalEducationRecord
): HistoricalEducationRecord {
  return {
    ...record,
    source: { ...record.source },
    relatedObjectives: record.relatedObjectives.map((objective) => ({ ...objective })),
    facts: record.facts.map((fact) => ({ ...fact })),
    unknownConditions: [...record.unknownConditions]
  };
}
