import { describe, expect, it } from "vitest";
import {
  findLessonProgress,
  getLessonProgressStatus,
  markLessonComplete,
  markLessonStarted,
  parseLessonProgress,
  serializeLessonProgress
} from "./lessonProgress";

describe("lessonProgress", () => {
  it("parses valid stored lesson progress", () => {
    expect(
      parseLessonProgress(
        JSON.stringify([
          {
            slug: "triads",
            drill: "chordTone",
            status: "complete",
            startedAt: "2026-07-07T12:00:00.000Z",
            completedAt: "2026-07-07T12:05:00.000Z"
          }
        ])
      )
    ).toEqual([
      {
        slug: "triads",
        drill: "chordTone",
        status: "complete",
        startedAt: "2026-07-07T12:00:00.000Z",
        completedAt: "2026-07-07T12:05:00.000Z"
      }
    ]);
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
    expect(serializeLessonProgress(progress)).toBe(JSON.stringify(progress));
  });
});
