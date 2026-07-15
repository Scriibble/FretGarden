import { describe, expect, it } from "vitest";
import { foundationLessons } from "@pocket-practice/education-content";
import {
  areCurriculumPrerequisitesComplete,
  canCompleteCurriculumLesson,
  finalizeCurriculumProgress,
  inspectCurriculumProgress,
  parseCurriculumProgress,
  serializeCurriculumProgress,
  startCurriculumUnit,
  toggleCurriculumCriterion,
  updateCurriculumAnswer,
  updateCurriculumField
} from "./curriculumProgress";

const lesson = foundationLessons[0]!;

describe("curriculum progress", () => {
  it("parses only the versioned curriculum envelope", () => {
    expect(parseCurriculumProgress(null)).toEqual([]);
    expect(parseCurriculumProgress("malformed")).toEqual([]);
    expect(parseCurriculumProgress(JSON.stringify([]))).toEqual([]);
  });

  it("distinguishes absent progress from unreadable progress", () => {
    expect(inspectCurriculumProgress(null)).toEqual({
      status: "empty",
      records: []
    });
    expect(inspectCurriculumProgress("malformed")).toEqual({
      status: "unreadable",
      records: []
    });
    expect(
      inspectCurriculumProgress(serializeCurriculumProgress([]))
    ).toEqual({ status: "valid", records: [] });
  });

  it("starts a unit without duplicating it", () => {
    const started = startCurriculumUnit([], lesson.unitId, "2026-07-14T00:00:00.000Z");
    expect(startCurriculumUnit(started, lesson.unitId, "later")).toEqual(started);
  });

  it("updates fields, answers, and explicit mastery criteria", () => {
    let records = startCurriculumUnit([], lesson.unitId, "now");
    records = updateCurriculumField(records, lesson.unitId, "identity", "I return.");
    records = updateCurriculumAnswer(
      records,
      lesson.unitId,
      lesson.knowledgeChecks[0]!.id,
      lesson.knowledgeChecks[0]!.correctAnswer
    );
    records = toggleCurriculumCriterion(
      records,
      lesson.unitId,
      lesson.masteryCriteria[0]!.id
    );
    expect(records[0]).toMatchObject({
      fields: { identity: "I return." },
      completedCriteria: [lesson.masteryCriteria[0]!.id]
    });
  });

  it("does not complete until every check and required criterion is satisfied", () => {
    let records = startCurriculumUnit([], lesson.unitId, "now");
    expect(canCompleteCurriculumLesson(records[0]!, lesson)).toBe(false);
    lesson.knowledgeChecks.forEach((check) => {
      records = updateCurriculumAnswer(
        records,
        lesson.unitId,
        check.id,
        check.correctAnswer
      );
    });
    lesson.masteryCriteria.forEach((criterion) => {
      records = toggleCurriculumCriterion(
        records,
        lesson.unitId,
        criterion.id
      );
    });
    expect(canCompleteCurriculumLesson(records[0]!, lesson)).toBe(true);
    expect(
      finalizeCurriculumProgress(records, lesson, "done")[0]?.completedAt
    ).toBe("done");
  });

  it("round trips versioned records", () => {
    const records = startCurriculumUnit([], lesson.unitId, "now");
    expect(parseCurriculumProgress(serializeCurriculumProgress(records))).toEqual(
      records
    );
  });

  it("requires every declared prerequisite to have a completed record", () => {
    const records = [
      {
        ...startCurriculumUnit([], "unit.one", "now")[0]!,
        completedAt: "done"
      },
      ...startCurriculumUnit([], "unit.two", "now")
    ];

    expect(areCurriculumPrerequisitesComplete(records, [])).toBe(true);
    expect(areCurriculumPrerequisitesComplete(records, ["unit.one"])).toBe(true);
    expect(
      areCurriculumPrerequisitesComplete(records, ["unit.one", "unit.two"])
    ).toBe(false);
  });
});
