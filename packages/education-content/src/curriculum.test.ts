import { describe, expect, it } from "vitest";
import { curriculumUnitIndex } from "./curriculum-index.js";
import { foundationCurriculum } from "./foundation-curriculum.js";
import { validateFoundationCurriculum } from "./curriculum-validate.js";

describe("foundation curriculum", () => {
  it("maps the three opening units and all 48 source units into a stable 51-unit index", () => {
    expect(curriculumUnitIndex).toHaveLength(51);
    expect(curriculumUnitIndex.map(({ order }) => order)).toEqual(
      Array.from({ length: 51 }, (_, index) => index + 1)
    );
    expect(curriculumUnitIndex.slice(0, 3).map(({ sourceUnit }) => sourceUnit)).toEqual([
      null,
      null,
      null
    ]);
    expect(curriculumUnitIndex.slice(3).map(({ sourceUnit }) => sourceUnit)).toEqual(
      Array.from({ length: 48 }, (_, index) => index + 1)
    );
    expect(curriculumUnitIndex[13]?.title).toBe("Fretboard Notes and Octave Shapes");
  });

  it("fully implements the three opening units without claiming later mapped units are complete", () => {
    expect(curriculumUnitIndex.filter(({ status }) => status === "implemented")).toHaveLength(3);
    expect(curriculumUnitIndex.filter(({ status }) => status === "mapped")).toHaveLength(48);
    expect(foundationCurriculum.lessons).toHaveLength(3);
    expect(foundationCurriculum.assessments).toHaveLength(3);
    expect(foundationCurriculum.reviewPlans).toHaveLength(3);
  });

  it("passes curriculum schema and reference validation", () => {
    expect(validateFoundationCurriculum(foundationCurriculum)).toEqual({
      valid: true,
      issues: []
    });
  });

  it("requires every knowledge check answer to be present in its options", () => {
    const invalid = structuredClone(foundationCurriculum);
    invalid.lessons[0]!.knowledgeChecks[0]!.correctAnswer = "Missing option";

    expect(validateFoundationCurriculum(invalid).issues).toContainEqual(
      expect.objectContaining({ code: "missing_correct_option" })
    );
  });

  it("rejects unresolved and forward prerequisite references", () => {
    const missing = structuredClone(foundationCurriculum);
    missing.units[1]!.requiredPriorUnitIds = ["unit.missing"];
    expect(validateFoundationCurriculum(missing).issues).toContainEqual(
      expect.objectContaining({ code: "missing_prerequisite" })
    );

    const forward = structuredClone(foundationCurriculum);
    forward.units[0]!.requiredPriorUnitIds = ["unit.focused-practice"];
    expect(validateFoundationCurriculum(forward).issues).toContainEqual(
      expect.objectContaining({ code: "forward_prerequisite" })
    );
  });

  it("requires implemented units to own lessons, assessments, and review plans", () => {
    const invalid = structuredClone(foundationCurriculum);
    invalid.lessons[0]!.unitId = "unit.focused-practice";

    expect(validateFoundationCurriculum(invalid).issues).toContainEqual(
      expect.objectContaining({
        code: "missing_implemented_unit_part",
        path: "units.unit.practice-garden"
      })
    );
  });
});
