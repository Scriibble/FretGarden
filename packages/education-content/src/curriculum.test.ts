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

  it("fully implements the opening and first seven instrument units without claiming later mapped units are complete", () => {
    expect(curriculumUnitIndex.filter(({ status }) => status === "implemented")).toHaveLength(10);
    expect(curriculumUnitIndex.filter(({ status }) => status === "mapped")).toHaveLength(41);
    expect(foundationCurriculum.lessons).toHaveLength(10);
    expect(foundationCurriculum.assessments).toHaveLength(10);
    expect(foundationCurriculum.reviewPlans).toHaveLength(10);
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

  it("rejects incomplete chord diagrams and malformed tablature", () => {
    const chord = {
      id: "bad-chord",
      type: "chord-diagram" as const,
      heading: "Bad chord",
      chordName: "Em",
      strings: Array.from({ length: 6 }, () => ({
        string: 6,
        state: "open" as const,
        note: "E"
      })),
      strumFromString: 6,
      explanation: "Invalid repeated strings.",
      accessibilityDescription: "All entries incorrectly describe string six."
    };
    const tab = {
      id: "bad-tab",
      type: "tablature" as const,
      heading: "Bad tab",
      events: [{
        count: "1",
        duration: "quarter" as const,
        rest: true,
        notes: [{ string: 1, fret: 0 }]
      }],
      explanation: "Invalid rest with a note.",
      accessibilityDescription: "A rest incorrectly includes an open first string."
    };
    const invalid = structuredClone(foundationCurriculum);
    invalid.lessons[0]!.contentBlocks.push(chord, tab);

    const issues = validateFoundationCurriculum(invalid).issues;
    expect(issues).toContainEqual(expect.objectContaining({ code: "invalid_chord_strings" }));
    expect(issues).toContainEqual(expect.objectContaining({ code: "invalid_tab_event" }));
  });
});
