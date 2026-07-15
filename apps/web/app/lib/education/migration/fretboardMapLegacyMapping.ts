import {
  LESSON_LEARNING_PROGRESS_STORAGE_KEY,
  parseLessonLearningProgress,
  type LessonLearningProgressRecord
} from "../../lessonLearningProgress";
import {
  LESSON_PROGRESS_STORAGE_KEY,
  parseLessonProgress,
  type LessonProgressRecord
} from "../../lessonProgress";
import { NOTE_RECOGNITION_HISTORY_STORAGE_KEY } from "../../practiceStorage";
import type {
  HistoricalEducationRecord,
  LegacyMappingDiagnostic,
  LegacyMappingDiagnosticCode,
  LegacyMappingResult,
  LegacySourceKind,
  LegacySourceState,
  LegacySourceVersion
} from "./contracts";

interface InspectedSource<Record> {
  state: LegacySourceState;
  storageVersion: LegacySourceVersion;
  sourceRecordsSeen: number;
  omittedRecords: number;
  records: Record[];
}

interface InspectedNoteHistory {
  state: LegacySourceState;
  storageVersion: LegacySourceVersion;
  sessionCount: number;
}

export interface FretboardMapLegacySourceSnapshot {
  learning: InspectedSource<LessonLearningProgressRecord>;
  practice: InspectedSource<LessonProgressRecord>;
  noteHistory: InspectedNoteHistory;
}

const COORDINATE_OBJECTIVE = {
  id: "fretboard.coordinates.basic",
  version: 1
} as const;
const NATURAL_NOTE_OBJECTIVE = {
  id: "fretboard.natural-notes.region-1",
  version: 1
} as const;
const PRACTICE_UNKNOWNS = [
  "support_level_unknown",
  "answer_revelation_unknown",
  "prompt_variation_unknown",
  "delay_condition_unknown",
  "task_validity_unknown",
  "content_version_unknown",
  "policy_version_unknown"
] as const;

export function inspectFretboardMapLegacySources(input: {
  learningProgressRaw: string | null;
  lessonProgressRaw: string | null;
  noteHistoryRaw: string | null;
}): FretboardMapLegacySourceSnapshot {
  return {
    learning: inspectProgressSource(
      input.learningProgressRaw,
      "progress",
      parseLessonLearningProgress
    ),
    practice: inspectProgressSource(
      input.lessonProgressRaw,
      "progress",
      parseLessonProgress
    ),
    noteHistory: inspectNoteHistory(input.noteHistoryRaw)
  };
}

export function mapFretboardMapLegacyHistory(
  snapshot: FretboardMapLegacySourceSnapshot
): LegacyMappingResult {
  const diagnostics: LegacyMappingDiagnostic[] = [];
  const records: HistoricalEducationRecord[] = [];

  collectSourceDiagnostics(diagnostics, "learning_progress", snapshot.learning);
  collectSourceDiagnostics(diagnostics, "practice_progress", snapshot.practice);
  collectNoteHistoryDiagnostics(diagnostics, snapshot.noteHistory);

  const learningRecords = snapshot.learning.records.filter(
    ({ slug }) => slug === "fretboard-map"
  );
  const practiceRecords = snapshot.practice.records.filter(
    ({ slug }) => slug === "fretboard-map"
  );
  addCount(
    diagnostics,
    "ignored_unrelated",
    "learning_progress",
    snapshot.learning.records.length - learningRecords.length,
    "Unrelated lesson-learning records were ignored."
  );
  addCount(
    diagnostics,
    "ignored_unrelated",
    "practice_progress",
    snapshot.practice.records.length - practiceRecords.length,
    "Unrelated lesson-practice records were ignored."
  );

  const mappedLearning = learningRecords.flatMap((record) => {
    if (record.completedCheckpoints.length === 0) {
      addCount(
        diagnostics,
        "valid_non_mappable",
        "learning_progress",
        1,
        "A saved lesson record did not say which activity it came from."
      );
      return [];
    }
    return [toParticipation(record, snapshot.learning.storageVersion)];
  });
  const mappedPractice = practiceRecords.flatMap((record) => {
    if (
      record.lastAttemptedAt === undefined &&
      record.lastAccuracy === undefined &&
      record.lastPromptCount === undefined
    ) {
      addCount(
        diagnostics,
        "valid_non_mappable",
        "practice_progress",
        1,
        "A saved practice record did not include a score or attempt summary."
      );
      return [];
    }
    return [toPracticeSummary(record, snapshot.practice.storageVersion)];
  });

  records.push(
    ...deduplicate(mappedLearning, "learning_progress", diagnostics),
    ...deduplicate(mappedPractice, "practice_progress", diagnostics)
  );
  for (const record of records) {
    if (record.occurredAt === null) {
      addCount(
        diagnostics,
        "timestamp_unknown",
        record.category === "participation"
          ? "learning_progress"
          : "practice_progress",
        1,
        "A saved history item did not include a practice time."
      );
    }
  }

  return {
    segmentId: "fretboard-map",
    records: records.sort(compareHistoricalRecords),
    diagnostics: diagnostics.sort(compareDiagnostics),
    sourceStates: {
      learning_progress: snapshot.learning.state,
      practice_progress: snapshot.practice.state,
      note_history: snapshot.noteHistory.state
    }
  };
}

function inspectProgressSource<Record>(
  raw: string | null,
  collectionKey: "progress",
  parser: (stored: string | null) => Record[]
): InspectedSource<Record> {
  if (raw === null || raw === "") {
    return emptySource("absent");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return emptySource("malformed_json");
  }

  const envelope = inspectEnvelope(parsed, collectionKey);
  if (envelope === null) {
    return emptySource("malformed_envelope");
  }
  const records = parser(raw);
  return {
    state: "valid",
    storageVersion: envelope.version,
    sourceRecordsSeen: envelope.items.length,
    omittedRecords: envelope.items.length - records.length,
    records
  };
}

function inspectNoteHistory(raw: string | null): InspectedNoteHistory {
  if (raw === null || raw === "") {
    return {
      state: "absent",
      storageVersion: "unversioned",
      sessionCount: 0
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return {
      state: "malformed_json",
      storageVersion: "unversioned",
      sessionCount: 0
    };
  }
  const envelope = inspectEnvelope(parsed, "sessions");
  return envelope === null
    ? {
        state: "malformed_envelope",
        storageVersion: "unversioned",
        sessionCount: 0
      }
    : {
        state: "valid",
        storageVersion: envelope.version,
        sessionCount: envelope.items.length
      };
}

function inspectEnvelope(
  parsed: unknown,
  collectionKey: "progress" | "sessions"
): { version: LegacySourceVersion; items: unknown[] } | null {
  if (Array.isArray(parsed)) {
    return { version: "unversioned", items: parsed };
  }
  if (parsed === null || typeof parsed !== "object") {
    return null;
  }
  const candidate = parsed as Record<string, unknown>;
  return typeof candidate.version === "number" &&
    Array.isArray(candidate[collectionKey])
    ? { version: candidate.version, items: candidate[collectionKey] }
    : null;
}

function emptySource<Record>(state: LegacySourceState): InspectedSource<Record> {
  return {
    state,
    storageVersion: "unversioned",
    sourceRecordsSeen: 0,
    omittedRecords: 0,
    records: []
  };
}

function toParticipation(
  record: LessonLearningProgressRecord,
  storageVersion: LegacySourceVersion
): HistoricalEducationRecord {
  return {
    id: `legacy:fretboard-map:learning:${record.startedAt || "unknown"}`,
    segmentId: "fretboard-map",
    category: "participation",
    occurredAt: record.completedAt ?? record.startedAt ?? null,
    source: {
      storageKey: LESSON_LEARNING_PROGRESS_STORAGE_KEY,
      storageVersion,
      sourceSlug: "fretboard-map"
    },
    relatedObjectives: [COORDINATE_OBJECTIVE, NATURAL_NOTE_OBJECTIVE],
    facts: [
      { name: "legacy_status", value: record.status },
      { name: "read", value: record.completedCheckpoints.includes("read") },
      { name: "play", value: record.completedCheckpoints.includes("play") },
      { name: "write", value: record.completedCheckpoints.includes("write") }
    ],
    unknownConditions: [
      "correctness_unknown",
      "independence_unknown",
      "physical_execution_unknown",
      "retention_unknown",
      "transfer_unknown"
    ],
    educationalLimit:
      "FretGarden saved this lesson activity as history, but it does not prove the skill yet."
  };
}

function toPracticeSummary(
  record: LessonProgressRecord,
  storageVersion: LegacySourceVersion
): HistoricalEducationRecord {
  const occurredAt = record.lastAttemptedAt ?? null;
  return {
    id: `legacy:fretboard-map:practice:${record.lastAttemptedAt ?? record.startedAt ?? "unknown"}`,
    segmentId: "fretboard-map",
    category: "practice_summary",
    occurredAt,
    source: {
      storageKey: LESSON_PROGRESS_STORAGE_KEY,
      storageVersion,
      sourceSlug: "fretboard-map"
    },
    relatedObjectives: [NATURAL_NOTE_OBJECTIVE],
    facts: [
      { name: "legacy_status", value: record.status },
      { name: "drill", value: record.drill },
      ...(record.lastAccuracy === undefined
        ? []
        : [{ name: "last_accuracy", value: record.lastAccuracy }]),
      ...(record.lastPromptCount === undefined
        ? []
        : [{ name: "last_prompt_count", value: record.lastPromptCount }])
    ],
    unknownConditions: [
      ...PRACTICE_UNKNOWNS,
      ...(occurredAt === null ? ["timestamp_unknown"] : [])
    ],
    educationalLimit:
      "FretGarden saved this older drill result as history, but it does not prove the skill yet."
  };
}

function deduplicate(
  records: HistoricalEducationRecord[],
  source: LegacySourceKind,
  diagnostics: LegacyMappingDiagnostic[]
): HistoricalEducationRecord[] {
  const byId = new Map<string, HistoricalEducationRecord>();
  for (const record of records) {
    const existing = byId.get(record.id);
    if (!existing) {
      byId.set(record.id, record);
      continue;
    }
    addCount(
      diagnostics,
      "duplicate_record",
      source,
      1,
      "FretGarden found a duplicate saved item and kept one copy."
    );
    if (compareAttributableRecency(record, existing) > 0) {
      byId.set(record.id, record);
    }
  }
  return [...byId.values()];
}

function collectSourceDiagnostics<Record>(
  diagnostics: LegacyMappingDiagnostic[],
  source: LegacySourceKind,
  inspection: InspectedSource<Record>
): void {
  addCount(
    diagnostics,
    "source_records_seen",
    source,
    inspection.sourceRecordsSeen,
    "Source records were inspected."
  );
  if (inspection.state === "malformed_json" || inspection.state === "malformed_envelope") {
    addCount(
      diagnostics,
      "malformed_envelope",
      source,
      1,
      "The source could not be interpreted as a supported legacy envelope."
    );
  }
  addCount(
    diagnostics,
    "omitted_record",
    source,
    inspection.omittedRecords,
    "Malformed source records were omitted."
  );
  if (inspection.state === "valid" && inspection.storageVersion === "unversioned") {
    addCount(
      diagnostics,
      "legacy_format",
      source,
      1,
      "An unversioned legacy array was interpreted without inventing provenance."
    );
  }
}

function collectNoteHistoryDiagnostics(
  diagnostics: LegacyMappingDiagnostic[],
  inspection: InspectedNoteHistory
): void {
  if (inspection.state === "malformed_json" || inspection.state === "malformed_envelope") {
    addCount(
      diagnostics,
      "malformed_envelope",
      "note_history",
      1,
      "The note-history source could not be interpreted as a supported envelope."
    );
  }
  addCount(
    diagnostics,
    "unattributed_session",
    "note_history",
    inspection.sessionCount,
    "Global note sessions were excluded because they do not retain a lesson slug."
  );
}

function addCount(
  diagnostics: LegacyMappingDiagnostic[],
  code: LegacyMappingDiagnosticCode,
  source: LegacySourceKind | "parallel_report",
  count: number,
  message: string
): void {
  if (count <= 0 && code !== "source_records_seen") {
    return;
  }
  const existing = diagnostics.find(
    (diagnostic) => diagnostic.code === code && diagnostic.source === source
  );
  if (existing) {
    existing.count += count;
    return;
  }
  diagnostics.push({ code, source, count, message });
}

function compareHistoricalRecords(
  left: HistoricalEducationRecord,
  right: HistoricalEducationRecord
): number {
  if (left.occurredAt === null && right.occurredAt !== null) return 1;
  if (left.occurredAt !== null && right.occurredAt === null) return -1;
  const timeComparison =
    (left.occurredAt === null ? 0 : Date.parse(left.occurredAt)) -
    (right.occurredAt === null ? 0 : Date.parse(right.occurredAt));
  if (timeComparison !== 0) return timeComparison;
  const categoryComparison =
    (left.category === "participation" ? 0 : 1) -
    (right.category === "participation" ? 0 : 1);
  return categoryComparison !== 0
    ? categoryComparison
    : left.id.localeCompare(right.id);
}

function compareAttributableRecency(
  left: HistoricalEducationRecord,
  right: HistoricalEducationRecord
): number {
  return (left.occurredAt ? Date.parse(left.occurredAt) : 0) -
    (right.occurredAt ? Date.parse(right.occurredAt) : 0);
}

function compareDiagnostics(
  left: LegacyMappingDiagnostic,
  right: LegacyMappingDiagnostic
): number {
  return left.source.localeCompare(right.source) || left.code.localeCompare(right.code);
}

export const FRETBOARD_MAP_MIGRATION_STORAGE_KEYS = {
  learning: LESSON_LEARNING_PROGRESS_STORAGE_KEY,
  practice: LESSON_PROGRESS_STORAGE_KEY,
  noteHistory: NOTE_RECOGNITION_HISTORY_STORAGE_KEY
} as const;
