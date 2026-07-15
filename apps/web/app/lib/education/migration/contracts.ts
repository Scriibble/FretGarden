import type {
  CapabilityClaim,
  EvidenceKind,
  ReviewObligation,
  VersionRef
} from "@pocket-practice/education-engine";
import type { EducationPilotStoreState } from "../storage/educationPilotStorage";

export const FRETBOARD_MAP_REPORT_VERSION = 1 as const;

export type MigrationReportVersion = typeof FRETBOARD_MAP_REPORT_VERSION;
export type LegacySourceVersion = number | "unversioned";
export type LegacySourceKind =
  | "learning_progress"
  | "practice_progress"
  | "note_history";
export type LegacySourceState =
  | "absent"
  | "valid"
  | "malformed_json"
  | "malformed_envelope";

export interface LegacySourceRef {
  storageKey: string;
  storageVersion: LegacySourceVersion;
  sourceSlug: "fretboard-map";
}

export interface HistoricalEducationFact {
  name: string;
  value: string | number | boolean;
}

export interface HistoricalEducationRecord {
  id: string;
  segmentId: "fretboard-map";
  category: "participation" | "practice_summary";
  occurredAt: string | null;
  source: LegacySourceRef;
  relatedObjectives: VersionRef[];
  facts: HistoricalEducationFact[];
  unknownConditions: string[];
  educationalLimit: string;
}

export type LegacyMappingDiagnosticCode =
  | "source_records_seen"
  | "valid_non_mappable"
  | "ignored_unrelated"
  | "duplicate_record"
  | "malformed_envelope"
  | "omitted_record"
  | "legacy_format"
  | "timestamp_unknown"
  | "unattributed_session"
  | "combined_sources";

export interface LegacyMappingDiagnostic {
  code: LegacyMappingDiagnosticCode;
  source: LegacySourceKind | "parallel_report";
  count: number;
  message: string;
}

export interface LegacyMappingResult {
  segmentId: "fretboard-map";
  records: HistoricalEducationRecord[];
  diagnostics: LegacyMappingDiagnostic[];
  sourceStates: Record<LegacySourceKind, LegacySourceState>;
}

export interface LegacyReportSummary {
  learningStatus: "not_recorded" | "in-progress" | "complete";
  completedCheckpoints: string[];
  practiceStatus: "not_recorded" | "in-progress" | "complete";
  lastAttemptedAt: string | null;
  lastAccuracy: number | null;
  lastPromptCount: number | null;
}

export interface EvidenceKindCount {
  kind: EvidenceKind | "unclassified";
  count: number;
}

export interface CurrentEducationSummary {
  storeState: EducationPilotStoreState;
  claims: CapabilityClaim[];
  evidenceCounts: EvidenceKindCount[];
  reviews: ReviewObligation[];
  nextAction: string;
}

export interface FretboardMapParallelReport {
  reportVersion: MigrationReportVersion;
  segmentId: "fretboard-map";
  generatedAt: string;
  explanation: string;
  legacy: {
    summary: LegacyReportSummary;
    records: HistoricalEducationRecord[];
    diagnostics: LegacyMappingDiagnostic[];
  };
  currentEducation: CurrentEducationSummary;
}
