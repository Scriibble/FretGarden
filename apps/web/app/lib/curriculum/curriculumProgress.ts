import type { CurriculumLesson } from "@pocket-practice/education-content";
import { z } from "zod";

export const CURRICULUM_PROGRESS_STORAGE_KEY =
  "fretgarden:curriculum-progress:v1";

export interface CurriculumProgressRecord {
  unitId: string;
  startedAt: string;
  knowledgeAnswers: Record<string, string>;
  completedCriteria: string[];
  fields: Record<string, string>;
  completedAt?: string;
}

const progressRecordSchema = z.object({
  unitId: z.string().min(1),
  startedAt: z.string().min(1),
  knowledgeAnswers: z.record(z.string()),
  completedCriteria: z.array(z.string()),
  fields: z.record(z.string()),
  completedAt: z.string().optional()
});

const progressEnvelopeSchema = z.object({
  version: z.literal(1),
  records: z.array(progressRecordSchema)
});

export interface CurriculumProgressReadResult {
  status: "empty" | "valid" | "unreadable";
  records: CurriculumProgressRecord[];
}

export function inspectCurriculumProgress(
  raw: string | null
): CurriculumProgressReadResult {
  if (raw === null) return { status: "empty", records: [] };
  try {
    const parsed = progressEnvelopeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return { status: "unreadable", records: [] };
    return {
      status: "valid",
      records: parsed.data.records.map(({ completedAt, ...record }) =>
        completedAt ? { ...record, completedAt } : record
      )
    };
  } catch {
    return { status: "unreadable", records: [] };
  }
}

export function parseCurriculumProgress(
  raw: string | null
): CurriculumProgressRecord[] {
  return inspectCurriculumProgress(raw).records;
}

export function serializeCurriculumProgress(
  records: readonly CurriculumProgressRecord[]
): string {
  return JSON.stringify({ version: 1, records });
}

export function startCurriculumUnit(
  records: readonly CurriculumProgressRecord[],
  unitId: string,
  now: string
): CurriculumProgressRecord[] {
  if (records.some((record) => record.unitId === unitId)) return [...records];
  return [
    ...records,
    {
      unitId,
      startedAt: now,
      knowledgeAnswers: {},
      completedCriteria: [],
      fields: {}
    }
  ];
}

export function updateCurriculumAnswer(
  records: readonly CurriculumProgressRecord[],
  unitId: string,
  checkId: string,
  answer: string
): CurriculumProgressRecord[] {
  return updateRecord(records, unitId, (record) => ({
    ...record,
    knowledgeAnswers: { ...record.knowledgeAnswers, [checkId]: answer }
  }));
}

export function updateCurriculumField(
  records: readonly CurriculumProgressRecord[],
  unitId: string,
  fieldId: string,
  value: string
): CurriculumProgressRecord[] {
  return updateRecord(records, unitId, (record) => ({
    ...record,
    fields: { ...record.fields, [fieldId]: value }
  }));
}

export function toggleCurriculumCriterion(
  records: readonly CurriculumProgressRecord[],
  unitId: string,
  criterionId: string
): CurriculumProgressRecord[] {
  return updateRecord(records, unitId, (record) => {
    const completed = record.completedCriteria.includes(criterionId)
      ? record.completedCriteria.filter((id) => id !== criterionId)
      : [...record.completedCriteria, criterionId];
    return { ...record, completedCriteria: completed };
  });
}

export function finalizeCurriculumProgress(
  records: readonly CurriculumProgressRecord[],
  lesson: CurriculumLesson,
  now: string
): CurriculumProgressRecord[] {
  return updateRecord(records, lesson.unitId, (record) =>
    canCompleteCurriculumLesson(record, lesson)
      ? { ...record, completedAt: record.completedAt ?? now }
      : record
  );
}

export function canCompleteCurriculumLesson(
  record: CurriculumProgressRecord,
  lesson: CurriculumLesson
): boolean {
  const allChecksCorrect = lesson.knowledgeChecks.every(
    (check) => record.knowledgeAnswers[check.id] === check.correctAnswer
  );
  const requiredCriteriaComplete = lesson.masteryCriteria
    .filter(({ required }) => required)
    .every(({ id }) => record.completedCriteria.includes(id));
  return allChecksCorrect && requiredCriteriaComplete;
}

export function areCurriculumPrerequisitesComplete(
  records: readonly CurriculumProgressRecord[],
  requiredUnitIds: readonly string[]
): boolean {
  return requiredUnitIds.every((unitId) =>
    records.some((record) => record.unitId === unitId && Boolean(record.completedAt))
  );
}

export function getCurriculumRecord(
  records: readonly CurriculumProgressRecord[],
  unitId: string
): CurriculumProgressRecord | null {
  return records.find((record) => record.unitId === unitId) ?? null;
}

function updateRecord(
  records: readonly CurriculumProgressRecord[],
  unitId: string,
  update: (record: CurriculumProgressRecord) => CurriculumProgressRecord
): CurriculumProgressRecord[] {
  return records.map((record) =>
    record.unitId === unitId ? update(record) : record
  );
}
