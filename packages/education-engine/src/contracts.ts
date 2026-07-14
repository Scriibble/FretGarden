export const EDUCATION_SCHEMA_VERSION = 1;
export const EDUCATION_POLICY_VERSION = "pilot-1";

export type SupportLevel = "modeled" | "guided" | "prompted" | "independent";
export type EvidenceKind =
  | "correction"
  | "exposure"
  | "supported_performance"
  | "independent_performance"
  | "retained_performance"
  | "transfer"
  | "readiness";
export type Confidence = "insufficient" | "limited" | "moderate" | "strong";
export type CapabilityState =
  | "not_observed"
  | "developing"
  | "independent_once"
  | "review_due"
  | "retained"
  | "needs_refresh"
  | "insufficient_evidence";

export interface VersionRef {
  id: string;
  version: number;
}

export interface QualityObservation {
  dimension: string;
  passed: boolean;
  value?: number | string | boolean;
  detail?: string;
}

export interface AttemptRecord<Response = unknown> {
  id: string;
  sessionId: string;
  taskId: string;
  objective: VersionRef;
  contentVersion: string;
  policyVersion: string;
  startedAt: string;
  respondedAt: string;
  response: Response;
  supportLevel: SupportLevel;
  supportsUsed: string[];
  correctionState: "none" | "answer_revealed" | "corrected_reattempt";
  valid: boolean;
  invalidReason?: string;
  sourceEvidenceAt?: string;
  variedContext: boolean;
  observations: QualityObservation[];
}

export interface EvidenceRequirement {
  id: string;
  objective: VersionRef;
  claimSupported: Exclude<EvidenceKind, "correction" | "readiness">;
  qualityDimensions: string[];
  maxSupportLevel: SupportLevel;
  minimumDelayMs?: number;
  requiresVariedContext?: boolean;
}

export interface EvidenceRecord {
  id: string;
  attemptId: string;
  objective: VersionRef;
  requirementId: string;
  observedAt: string;
  outcome: "supports" | "contradicts" | "invalid";
  kind: EvidenceKind | null;
  confidence: Confidence;
  supportLevel: SupportLevel;
  quality: QualityObservation[];
  claimCeiling: EvidenceKind | null;
  reasons: string[];
  contentVersion: string;
  policyVersion: string;
}

export interface CapabilityClaim {
  objective: VersionRef;
  state: CapabilityState;
  strongestKind: EvidenceKind | null;
  confidence: Confidence;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  reviewDueAt?: string;
  rationale: string;
  policyVersion: string;
}

export interface PrerequisiteRule {
  objective: VersionRef;
  relationship:
    | "required"
    | "strongly_recommended"
    | "supporting"
    | "corequisite"
    | "enrichment";
  minimumKind: EvidenceKind;
  maxAgeMs?: number;
}

export interface ReadinessDecision {
  target: VersionRef;
  decision: "ready" | "ready_with_support" | "not_yet_demonstrated";
  satisfied: string[];
  missing: string[];
  nextAction: string;
  rationale: string;
  policyVersion: string;
}

export interface ReviewPolicy {
  id: string;
  version: number;
  delaysMs: number[];
  dueWindowMs: number;
}

export interface ReviewObligation {
  id: string;
  objective: VersionRef;
  sourceEvidenceId: string;
  sequenceIndex: number;
  dueAt: string;
  dueWindowEndsAt: string;
  state: "scheduled" | "due" | "completed" | "lapsed";
  policy: VersionRef;
}

export type ObservableError =
  | "incorrect_response"
  | "omission"
  | "coordinate_confusion"
  | "timing_early"
  | "timing_late"
  | "timing_unstable"
  | "support_dependency"
  | "task_invalid";

export interface RemediationDecision {
  route:
    | "retry_equivalent_input"
    | "coordinate_orientation"
    | "contrast_and_fade"
    | "slower_shorter_pulse"
    | "remodel_then_novel_retrieval"
    | "independent_retrieval"
    | "none";
  supportLevel: SupportLevel;
  reason: string;
  nextAction: string;
}

export interface SessionItem {
  id: string;
  kind: "review" | "new" | "remediation";
  estimatedMinutes: number;
  priority: number;
}
