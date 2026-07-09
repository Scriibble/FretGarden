import { z } from "zod";
import type { Lesson } from "./lessons";

export const LESSON_LEARNING_PROGRESS_STORAGE_KEY =
  "pocket-practice:lesson-learning-progress";
export const LESSON_LEARNING_PROGRESS_STORAGE_VERSION = 1;

export type LessonLearningCheckpoint = "read" | "play" | "write";
export type LessonLearningProgressStatus = "in-progress" | "complete";
export type LearningPathState = "complete" | "current" | "up-next" | "later";

export interface LessonLearningProgressRecord {
  slug: string;
  status: LessonLearningProgressStatus;
  startedAt: string;
  completedAt?: string;
  completedCheckpoints: readonly LessonLearningCheckpoint[];
}

export interface LearningCourseProgressItem {
  lesson: Lesson;
  index: number;
  record: LessonLearningProgressRecord | null;
  status: LessonLearningProgressStatus | "not-started";
  pathState: LearningPathState;
}

export interface LearningCourseProgressSummary {
  items: LearningCourseProgressItem[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  currentLesson: Lesson | null;
  upNextLesson: Lesson | null;
  isComplete: boolean;
}

const lessonLearningCheckpointSchema = z.enum(["read", "play", "write"]);
const lessonLearningProgressRecordSchema = z.object({
  slug: z.string(),
  status: z.enum(["in-progress", "complete"]),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  completedCheckpoints: z.array(lessonLearningCheckpointSchema)
});
const versionedLessonLearningProgressSchema = z.object({
  version: z.number(),
  progress: z.array(z.unknown())
});

type ParsedLessonLearningProgressRecord = z.infer<
  typeof lessonLearningProgressRecordSchema
>;

const REQUIRED_LEARNING_CHECKPOINTS = [
  "read",
  "play",
  "write"
] as const satisfies readonly LessonLearningCheckpoint[];

export function parseLessonLearningProgress(
  storedProgress: string | null
): LessonLearningProgressRecord[] {
  if (!storedProgress) {
    return [];
  }

  try {
    const parsedProgress = JSON.parse(storedProgress) as unknown;
    const versionedProgress =
      versionedLessonLearningProgressSchema.safeParse(parsedProgress);
    const progressRecords = Array.isArray(parsedProgress)
      ? parsedProgress
      : versionedProgress.success
        ? versionedProgress.data.progress
        : [];

    return progressRecords.flatMap(
      (record): LessonLearningProgressRecord[] => {
        const parsedRecord =
          lessonLearningProgressRecordSchema.safeParse(record);

        return parsedRecord.success
          ? [toLessonLearningProgressRecord(parsedRecord.data)]
          : [];
      }
    );
  } catch {
    return [];
  }
}

export function serializeLessonLearningProgress(
  progress: readonly LessonLearningProgressRecord[]
): string {
  return JSON.stringify({
    version: LESSON_LEARNING_PROGRESS_STORAGE_VERSION,
    progress
  });
}

export function markLessonLearningStarted(
  progress: readonly LessonLearningProgressRecord[],
  slug: string,
  startedAt = new Date().toISOString()
): LessonLearningProgressRecord[] {
  const existingRecord = findLessonLearningProgress(progress, slug);

  if (existingRecord) {
    return [...progress];
  }

  return upsertLessonLearningProgress(progress, {
    slug,
    status: "in-progress",
    startedAt,
    completedCheckpoints: []
  });
}

export function markLessonLearningCheckpoint(
  progress: readonly LessonLearningProgressRecord[],
  slug: string,
  checkpoint: LessonLearningCheckpoint,
  updatedAt = new Date().toISOString()
): LessonLearningProgressRecord[] {
  const existingRecord = findLessonLearningProgress(progress, slug);
  const completedCheckpoints = [
    ...new Set([...(existingRecord?.completedCheckpoints ?? []), checkpoint])
  ];
  const isComplete = hasAllRequiredCheckpoints(completedCheckpoints);

  return upsertLessonLearningProgress(progress, {
    slug,
    status: isComplete ? "complete" : "in-progress",
    startedAt: existingRecord?.startedAt ?? updatedAt,
    ...(isComplete
      ? { completedAt: existingRecord?.completedAt ?? updatedAt }
      : {}),
    completedCheckpoints
  });
}

export function markLessonLearningComplete(
  progress: readonly LessonLearningProgressRecord[],
  slug: string,
  completedAt = new Date().toISOString()
): LessonLearningProgressRecord[] {
  const existingRecord = findLessonLearningProgress(progress, slug);

  return upsertLessonLearningProgress(progress, {
    slug,
    status: "complete",
    startedAt: existingRecord?.startedAt ?? completedAt,
    completedAt: existingRecord?.completedAt ?? completedAt,
    completedCheckpoints: [...REQUIRED_LEARNING_CHECKPOINTS]
  });
}

export function findLessonLearningProgress(
  progress: readonly LessonLearningProgressRecord[],
  slug: string
): LessonLearningProgressRecord | null {
  return progress.find((record) => record.slug === slug) ?? null;
}

export function getLessonLearningProgressStatus(
  progress: readonly LessonLearningProgressRecord[],
  slug: string
): LessonLearningProgressStatus | "not-started" {
  return findLessonLearningProgress(progress, slug)?.status ?? "not-started";
}

export function buildLearningCourseProgress(
  lessons: readonly Lesson[],
  progress: readonly LessonLearningProgressRecord[]
): LearningCourseProgressSummary {
  const statuses = lessons.map((lesson) =>
    getLessonLearningProgressStatus(progress, lesson.slug)
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
      record: findLessonLearningProgress(progress, lesson.slug),
      status,
      pathState: getLearningPathState(status, index, firstIncompleteIndex)
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

function toLessonLearningProgressRecord(
  record: ParsedLessonLearningProgressRecord
): LessonLearningProgressRecord {
  const completedCheckpoints = [...new Set(record.completedCheckpoints)];

  return {
    slug: record.slug,
    status: record.status,
    startedAt: record.startedAt,
    ...(record.completedAt ? { completedAt: record.completedAt } : {}),
    completedCheckpoints
  };
}

function hasAllRequiredCheckpoints(
  completedCheckpoints: readonly LessonLearningCheckpoint[]
): boolean {
  return REQUIRED_LEARNING_CHECKPOINTS.every((checkpoint) =>
    completedCheckpoints.includes(checkpoint)
  );
}

function upsertLessonLearningProgress(
  progress: readonly LessonLearningProgressRecord[],
  nextRecord: LessonLearningProgressRecord
): LessonLearningProgressRecord[] {
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

function getLearningPathState(
  status: LessonLearningProgressStatus | "not-started",
  index: number,
  firstIncompleteIndex: number
): LearningPathState {
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
