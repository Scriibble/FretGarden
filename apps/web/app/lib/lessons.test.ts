import { describe, expect, it } from "vitest";
import { getLesson, getNextLesson, getPreviousLesson, lessons } from "./lessons";

describe("lessons", () => {
  it("keeps lesson practice links aligned with declared drills", () => {
    lessons.forEach((lesson) => {
      const practiceUrl = new URL(lesson.practice.href, "http://localhost");

      expect(practiceUrl.pathname).toBe("/practice");
      expect(practiceUrl.searchParams.get("drill")).toBe(lesson.practice.drill);
      expect(practiceUrl.searchParams.get("lesson")).toBe(lesson.slug);
      expect(practiceUrl.hash).toBe("#practice");
    });
  });

  it("keeps every lesson aligned with the guided lesson anatomy", () => {
    lessons.forEach((lesson) => {
      expect(lesson.sections.length).toBeGreaterThan(0);
      expect(lesson.fretboardApplications.length).toBeGreaterThan(0);
      expect(lesson.playPrompts.length).toBeGreaterThan(0);
      expect(lesson.songConnection.body.length).toBeGreaterThan(0);
      expect(lesson.writeWithIt.constraints.length).toBeGreaterThan(0);
      expect(lesson.checkUnderstanding.length).toBeGreaterThan(0);
    });
  });

  it("looks up neighboring lessons in course order", () => {
    expect(getLesson("triads")?.title).toBe("Roots, 3rds, and 5ths");
    expect(getPreviousLesson("triads")?.slug).toBe("repeating-notes");
    expect(getNextLesson("triads")?.slug).toBe("scale-degrees");
    expect(getPreviousLesson(lessons[0]!.slug)).toBeUndefined();
    expect(getNextLesson(lessons[lessons.length - 1]!.slug)).toBeUndefined();
  });
});
