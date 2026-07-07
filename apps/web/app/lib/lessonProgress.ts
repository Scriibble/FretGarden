import type {
  Lesson,
  LessonPracticeCriteria,
  LessonPracticeDrill
} from "./lessons";

export const LESSON_PROGRESS_STORAGE_KEY = "pocket-practice:lesson-progress";

export type LessonProgressStatus = "in-progress" | "complete";

export interface LessonProgressRecord {
  slug: string;
  drill: LessonPracticeDrill;
  status: LessonProgressStatus;
  startedAt: string;
  completedAt?: string;
  lastAttemptedAt?: string;
  lastAccuracy?: number;
  lastPromptCount?: number;
}

export interface LessonPracticeAttemptResult {
  attemptedAt: string;
  accuracy: number;
  promptCount: number;
}

export type CoursePathState = "complete" | "current" | "up-next" | "later";

export interface CourseProgressItem {
  lesson: Lesson;
  index: number;
  record: LessonProgressRecord | null;
  status: LessonProgressStatus | "not-started";
  pathState: CoursePathState;
}

export interface CourseProgressSummary {
  items: CourseProgressItem[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  currentLesson: Lesson | null;
  upNextLesson: Lesson | null;
  isComplete: boolean;
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

export function markLessonPracticed(
  progress: readonly LessonProgressRecord[],
  slug: string,
  drill: LessonPracticeDrill,
  result: LessonPracticeAttemptResult,
  criteria: LessonPracticeCriteria
): LessonProgressRecord[] {
  const existingRecord = findLessonProgress(progress, slug);
  const isPassing = doesLessonPracticeMeetCriteria(result, criteria);
  const nextStatus =
    isPassing || existingRecord?.status === "complete"
      ? "complete"
      : "in-progress";
  const nextRecord: LessonProgressRecord = {
    slug,
    drill,
    status: nextStatus,
    startedAt: existingRecord?.startedAt ?? result.attemptedAt,
    lastAttemptedAt: result.attemptedAt,
    lastAccuracy: result.accuracy,
    lastPromptCount: result.promptCount
  };

  if (nextStatus === "complete") {
    nextRecord.completedAt = existingRecord?.completedAt ?? result.attemptedAt;
  }

  return upsertLessonProgress(progress, nextRecord);
}

export function doesLessonPracticeMeetCriteria(
  result: Pick<LessonPracticeAttemptResult, "accuracy" | "promptCount">,
  criteria: LessonPracticeCriteria
): boolean {
  return (
    result.promptCount >= criteria.promptCount &&
    result.accuracy >= criteria.minAccuracy
  );
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

export function buildCourseProgress(
  lessons: readonly Lesson[],
  progress: readonly LessonProgressRecord[]
): CourseProgressSummary {
  const statuses = lessons.map((lesson) =>
    getLessonProgressStatus(progress, lesson.slug)
  );
  const completedCount = statuses.filter((status) => status === "complete").length;
  const firstIncompleteIndex = statuses.findIndex(
    (status) => status !== "complete"
  );
  const currentLesson =
    firstIncompleteIndex === -1 ? null : lessons[firstIncompleteIndex] ?? null;
  const upNextLesson =
    firstIncompleteIndex === -1
      ? null
      : lessons[firstIncompleteIndex + 1] ?? null;
  const items = lessons.map((lesson, index) => {
    const status = statuses[index] ?? "not-started";

    return {
      lesson,
      index,
      record: findLessonProgress(progress, lesson.slug),
      status,
      pathState: getCoursePathState(status, index, firstIncompleteIndex)
    };
  });

  return {
    items,
    completedCount,
    totalCount: lessons.length,
    percentComplete:
      lessons.length === 0
        ? 0
        : Math.round((completedCount / lessons.length) * 100),
    currentLesson,
    upNextLesson,
    isComplete: lessons.length > 0 && completedCount === lessons.length
  };
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
      typeof candidate.completedAt === "string") &&
    (candidate.lastAttemptedAt === undefined ||
      typeof candidate.lastAttemptedAt === "string") &&
    (candidate.lastAccuracy === undefined ||
      typeof candidate.lastAccuracy === "number") &&
    (candidate.lastPromptCount === undefined ||
      typeof candidate.lastPromptCount === "number")
  );
}

function isLessonPracticeDrill(value: unknown): value is LessonPracticeDrill {
  return value === "note" || value === "chordTone" || value === "scaleDegree";
}

function getCoursePathState(
  status: LessonProgressStatus | "not-started",
  index: number,
  firstIncompleteIndex: number
): CoursePathState {
  if (status === "complete") {
    return "complete";
  }

  if (index === firstIncompleteIndex) {
    return "current";
  }

  if (index === firstIncompleteIndex + 1) {
    return "up-next";
  }

  return "later";
}
