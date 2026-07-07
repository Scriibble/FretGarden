import type { LessonPracticeDrill } from "./lessons";

export const LESSON_PROGRESS_STORAGE_KEY = "pocket-practice:lesson-progress";

export type LessonProgressStatus = "in-progress" | "complete";

export interface LessonProgressRecord {
  slug: string;
  drill: LessonPracticeDrill;
  status: LessonProgressStatus;
  startedAt: string;
  completedAt?: string;
}

export function parseLessonProgress(
  storedProgress: string | null
): LessonProgressRecord[] {
  if (!storedProgress) {
    return [];
  }

  try {
    const parsedProgress = JSON.parse(storedProgress) as unknown;

    if (!Array.isArray(parsedProgress)) {
      return [];
    }

    return parsedProgress.filter(isLessonProgressRecord);
  } catch {
    return [];
  }
}

export function serializeLessonProgress(
  progress: readonly LessonProgressRecord[]
): string {
  return JSON.stringify(progress);
}

export function markLessonStarted(
  progress: readonly LessonProgressRecord[],
  slug: string,
  drill: LessonPracticeDrill,
  startedAt = new Date().toISOString()
): LessonProgressRecord[] {
  const existingRecord = findLessonProgress(progress, slug);

  if (existingRecord?.status === "complete") {
    return [...progress];
  }

  return upsertLessonProgress(progress, {
    slug,
    drill,
    status: "in-progress",
    startedAt: existingRecord?.startedAt ?? startedAt
  });
}

export function markLessonComplete(
  progress: readonly LessonProgressRecord[],
  slug: string,
  drill: LessonPracticeDrill,
  completedAt = new Date().toISOString()
): LessonProgressRecord[] {
  const existingRecord = findLessonProgress(progress, slug);

  return upsertLessonProgress(progress, {
    slug,
    drill,
    status: "complete",
    startedAt: existingRecord?.startedAt ?? completedAt,
    completedAt
  });
}

export function findLessonProgress(
  progress: readonly LessonProgressRecord[],
  slug: string
): LessonProgressRecord | null {
  return progress.find((record) => record.slug === slug) ?? null;
}

export function getLessonProgressStatus(
  progress: readonly LessonProgressRecord[],
  slug: string
): LessonProgressStatus | "not-started" {
  return findLessonProgress(progress, slug)?.status ?? "not-started";
}

function upsertLessonProgress(
  progress: readonly LessonProgressRecord[],
  nextRecord: LessonProgressRecord
): LessonProgressRecord[] {
  const existingIndex = progress.findIndex(
    (record) => record.slug === nextRecord.slug
  );

  if (existingIndex === -1) {
    return [nextRecord, ...progress];
  }

  return progress.map((record, index) =>
    index === existingIndex ? nextRecord : record
  );
}

function isLessonProgressRecord(value: unknown): value is LessonProgressRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<LessonProgressRecord>;

  return (
    typeof candidate.slug === "string" &&
    isLessonPracticeDrill(candidate.drill) &&
    (candidate.status === "in-progress" || candidate.status === "complete") &&
    typeof candidate.startedAt === "string" &&
    (candidate.completedAt === undefined ||
      typeof candidate.completedAt === "string")
  );
}

function isLessonPracticeDrill(value: unknown): value is LessonPracticeDrill {
  return value === "note" || value === "chordTone" || value === "scaleDegree";
}
