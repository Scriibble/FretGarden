import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";
import {
  LESSON_PROGRESS_STORAGE_VERSION,
  buildCourseProgress,
  doesLessonPracticeMeetCriteria,
  findLessonProgress,
  getLessonProgressStatus,
  markLessonComplete,
  markLessonPracticed,
  markLessonStarted,
  parseLessonProgress,
  serializeLessonProgress
} from "./lessonProgress";

describe("lessonProgress", () => {
  it("parses valid stored lesson progress", () => {
    const progress = [
      {
        slug: "triads",
        drill: "chordTone",
        status: "complete",
        startedAt: "2026-07-07T12:00:00.000Z",
        completedAt: "2026-07-07T12:05:00.000Z",
        lastAttemptedAt: "2026-07-07T12:05:00.000Z",
        lastAccuracy: 90,
        lastPromptCount: 10
      }
    ] as const;

    expect(
      parseLessonProgress(JSON.stringify({ version: 1, progress }))
    ).toEqual(progress);
    expect(parseLessonProgress(JSON.stringify(progress))).toEqual(progress);
  });

  it("ignores invalid stored lesson progress", () => {
    expect(parseLessonProgress(null)).toEqual([]);
    expect(parseLessonProgress("{not json")).toEqual([]);
    expect(
      parseLessonProgress(
        JSON.stringify([
          {
            slug: "triads",
            drill: "banjo",
            status: "complete",
            startedAt: "2026-07-07T12:00:00.000Z"
          }
        ])
      )
    ).toEqual([]);
  });

  it("marks a lesson in progress without duplicating records", () => {
    const progress = markLessonStarted(
      [],
      "scale-degrees",
      "scaleDegree",
      "2026-07-07T12:00:00.000Z"
    );

    expect(
      markLessonStarted(
        progress,
        "scale-degrees",
        "scaleDegree",
        "2026-07-07T12:10:00.000Z"
      )
    ).toEqual([
      {
        slug: "scale-degrees",
        drill: "scaleDegree",
        status: "in-progress",
        startedAt: "2026-07-07T12:00:00.000Z"
      }
    ]);
  });

  it("accepts octave-shape and triad-inversion lesson progress records", () => {
    expect(
      parseLessonProgress(
        JSON.stringify([
          {
            slug: "octave-shapes",
            drill: "octaveShape",
            status: "in-progress",
            startedAt: "2026-07-07T12:00:00.000Z"
          },
          {
            slug: "triad-inversions",
            drill: "triadInversion",
            status: "in-progress",
            startedAt: "2026-07-07T12:00:00.000Z"
          }
        ])
      )
    ).toEqual([
      {
        slug: "octave-shapes",
        drill: "octaveShape",
        status: "in-progress",
        startedAt: "2026-07-07T12:00:00.000Z"
      },
      {
        slug: "triad-inversions",
        drill: "triadInversion",
        status: "in-progress",
        startedAt: "2026-07-07T12:00:00.000Z"
      }
    ]);
  });

  it("keeps completed lessons complete when started again", () => {
    const progress = markLessonComplete(
      [],
      "triads",
      "chordTone",
      "2026-07-07T12:05:00.000Z"
    );

    expect(
      markLessonStarted(
        progress,
        "triads",
        "chordTone",
        "2026-07-07T12:10:00.000Z"
      )
    ).toEqual(progress);
  });

  it("marks an existing lesson complete", () => {
    const progress = markLessonStarted(
      [],
      "fretboard-map",
      "note",
      "2026-07-07T12:00:00.000Z"
    );

    expect(
      markLessonComplete(
        progress,
        "fretboard-map",
        "note",
        "2026-07-07T12:05:00.000Z"
      )
    ).toEqual([
      {
        slug: "fretboard-map",
        drill: "note",
        status: "complete",
        startedAt: "2026-07-07T12:00:00.000Z",
        completedAt: "2026-07-07T12:05:00.000Z"
      }
    ]);
  });

  it("finds and formats lesson progress status", () => {
    const progress = markLessonStarted(
      [],
      "repeating-notes",
      "note",
      "2026-07-07T12:00:00.000Z"
    );

    expect(findLessonProgress(progress, "repeating-notes")).toEqual(
      progress[0]
    );
    expect(getLessonProgressStatus(progress, "repeating-notes")).toBe(
      "in-progress"
    );
    expect(getLessonProgressStatus(progress, "triads")).toBe("not-started");
    expect(serializeLessonProgress(progress)).toBe(
      JSON.stringify({
        version: LESSON_PROGRESS_STORAGE_VERSION,
        progress
      })
    );
  });

  it("checks whether lesson practice meets completion criteria", () => {
    const criteria = {
      promptCount: 10,
      minAccuracy: 80
    };

    expect(
      doesLessonPracticeMeetCriteria(
        {
          promptCount: 10,
          accuracy: 80
        },
        criteria
      )
    ).toBe(true);
    expect(
      doesLessonPracticeMeetCriteria(
        {
          promptCount: 6,
          accuracy: 100
        },
        criteria
      )
    ).toBe(false);
    expect(
      doesLessonPracticeMeetCriteria(
        {
          promptCount: 10,
          accuracy: 70
        },
        criteria
      )
    ).toBe(false);
  });

  it("keeps a practiced lesson in progress when criteria are not met", () => {
    expect(
      markLessonPracticed(
        [],
        "fretboard-map",
        "note",
        {
          attemptedAt: "2026-07-07T12:05:00.000Z",
          accuracy: 70,
          promptCount: 10
        },
        {
          promptCount: 10,
          minAccuracy: 80
        }
      )
    ).toEqual([
      {
        slug: "fretboard-map",
        drill: "note",
        status: "in-progress",
        startedAt: "2026-07-07T12:05:00.000Z",
        lastAttemptedAt: "2026-07-07T12:05:00.000Z",
        lastAccuracy: 70,
        lastPromptCount: 10
      }
    ]);
  });

  it("marks a practiced lesson complete when criteria are met", () => {
    const progress = markLessonStarted(
      [],
      "triad-inversions",
      "triadInversion",
      "2026-07-07T12:00:00.000Z"
    );

    expect(
      markLessonPracticed(
        progress,
        "triad-inversions",
        "triadInversion",
        {
          attemptedAt: "2026-07-07T12:05:00.000Z",
          accuracy: 92,
          promptCount: 12
        },
        {
          promptCount: 12,
          minAccuracy: 80
        }
      )
    ).toEqual([
      {
        slug: "triad-inversions",
        drill: "triadInversion",
        status: "complete",
        startedAt: "2026-07-07T12:00:00.000Z",
        completedAt: "2026-07-07T12:05:00.000Z",
        lastAttemptedAt: "2026-07-07T12:05:00.000Z",
        lastAccuracy: 92,
        lastPromptCount: 12
      }
    ]);
  });

  it("builds an ordered course progress summary", () => {
    const progress = markLessonStarted(
      markLessonComplete(
        [],
        "fretboard-map",
        "note",
        "2026-07-07T12:05:00.000Z"
      ),
      "repeating-notes",
      "note",
      "2026-07-07T12:10:00.000Z"
    );
    const courseProgress = buildCourseProgress(lessons, progress);

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

  it("marks the course complete when every lesson is complete", () => {
    const progress = lessons.map((lesson) => ({
      slug: lesson.slug,
      drill: lesson.practice.drill,
      status: "complete" as const,
      startedAt: "2026-07-07T12:00:00.000Z",
      completedAt: "2026-07-07T12:05:00.000Z"
    }));
    const courseProgress = buildCourseProgress(lessons, progress);

    expect(courseProgress.completedCount).toBe(lessons.length);
    expect(courseProgress.percentComplete).toBe(100);
    expect(courseProgress.currentLesson).toBeNull();
    expect(courseProgress.upNextLesson).toBeNull();
    expect(courseProgress.isComplete).toBe(true);
  });
});
