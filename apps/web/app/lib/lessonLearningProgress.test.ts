import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import {
  LESSON_LEARNING_PROGRESS_STORAGE_VERSION,
  buildLearningCourseProgress,
  findLessonLearningProgress,
  getLessonLearningProgressStatus,
  markLessonLearningCheckpoint,
  markLessonLearningComplete,
  markLessonLearningStarted,
  parseLessonLearningProgress,
  serializeLessonLearningProgress
} from "./lessonLearningProgress";

describe("lessonLearningProgress", () => {
  it("parses valid stored learning progress", () => {
    const progress = [
      {
        slug: "triads",
        status: "complete",
        startedAt: "2026-07-08T12:00:00.000Z",
        completedAt: "2026-07-08T12:05:00.000Z",
        completedCheckpoints: ["read", "play", "write"]
      }
    ] as const;

    expect(
      parseLessonLearningProgress(JSON.stringify({ version: 1, progress }))
    ).toEqual(progress);
    expect(parseLessonLearningProgress(JSON.stringify(progress))).toEqual(
      progress
    );
  });

  it("ignores invalid stored learning progress", () => {
    expect(parseLessonLearningProgress(null)).toEqual([]);
    expect(parseLessonLearningProgress("{not json")).toEqual([]);
    expect(
      parseLessonLearningProgress(
        JSON.stringify([
          {
            slug: "triads",
            status: "complete",
            startedAt: "2026-07-08T12:00:00.000Z",
            completedCheckpoints: ["read", "quiz"]
          }
        ])
      )
    ).toEqual([]);
  });

  it("starts a lesson without duplicating records", () => {
    const progress = markLessonLearningStarted(
      [],
      "fretboard-map",
      "2026-07-08T12:00:00.000Z"
    );

    expect(
      markLessonLearningStarted(
        progress,
        "fretboard-map",
        "2026-07-08T12:05:00.000Z"
      )
    ).toEqual(progress);
  });

  it("marks checkpoints and completes after read, play, and write", () => {
    const readProgress = markLessonLearningCheckpoint(
      [],
      "scale-degrees",
      "read",
      "2026-07-08T12:00:00.000Z"
    );
    const playProgress = markLessonLearningCheckpoint(
      readProgress,
      "scale-degrees",
      "play",
      "2026-07-08T12:01:00.000Z"
    );
    const writeProgress = markLessonLearningCheckpoint(
      playProgress,
      "scale-degrees",
      "write",
      "2026-07-08T12:02:00.000Z"
    );

    expect(getLessonLearningProgressStatus(playProgress, "scale-degrees")).toBe(
      "in-progress"
    );
    expect(writeProgress).toEqual([
      {
        slug: "scale-degrees",
        status: "complete",
        startedAt: "2026-07-08T12:00:00.000Z",
        completedAt: "2026-07-08T12:02:00.000Z",
        completedCheckpoints: ["read", "play", "write"]
      }
    ]);
  });

  it("can mark a lesson complete directly", () => {
    expect(
      markLessonLearningComplete(
        [],
        "triads",
        "2026-07-08T12:05:00.000Z"
      )
    ).toEqual([
      {
        slug: "triads",
        status: "complete",
        startedAt: "2026-07-08T12:05:00.000Z",
        completedAt: "2026-07-08T12:05:00.000Z",
        completedCheckpoints: ["read", "play", "write"]
      }
    ]);
  });

  it("finds progress status and serializes versioned progress", () => {
    const progress = markLessonLearningStarted(
      [],
      "repeating-notes",
      "2026-07-08T12:00:00.000Z"
    );

    expect(findLessonLearningProgress(progress, "repeating-notes")).toEqual(
      progress[0]
    );
    expect(getLessonLearningProgressStatus(progress, "repeating-notes")).toBe(
      "in-progress"
    );
    expect(getLessonLearningProgressStatus(progress, "triads")).toBe(
      "not-started"
    );
    expect(serializeLessonLearningProgress(progress)).toBe(
      JSON.stringify({
        version: LESSON_LEARNING_PROGRESS_STORAGE_VERSION,
        progress
      })
    );
  });

  it("builds an ordered learning course progress summary", () => {
    const progress = markLessonLearningStarted(
      markLessonLearningComplete(
        [],
        "fretboard-map",
        "2026-07-08T12:05:00.000Z"
      ),
      "repeating-notes",
      "2026-07-08T12:10:00.000Z"
    );
    const courseProgress = buildLearningCourseProgress(lessons, progress);

    expect(courseProgress.completedCount).toBe(1);
    expect(courseProgress.totalCount).toBe(lessons.length);
    expect(courseProgress.currentLesson?.slug).toBe("repeating-notes");
    expect(courseProgress.upNextLesson?.slug).toBe("triads");
    expect(courseProgress.items.slice(0, 4).map((item) => item.pathState)).toEqual([
      "complete",
      "current",
      "up-next",
      "later"
    ]);
    expect(courseProgress.isComplete).toBe(false);
  });
});
