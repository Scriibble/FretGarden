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

  it("implements all 51 units without mapped completion placeholders", () => {
    expect(curriculumUnitIndex.filter(({ status }) => status === "implemented")).toHaveLength(51);
    expect(curriculumUnitIndex.filter(({ status }) => status === "mapped")).toHaveLength(0);
    expect(foundationCurriculum.lessons).toHaveLength(51);
    expect(foundationCurriculum.assessments).toHaveLength(51);
    expect(foundationCurriculum.reviewPlans).toHaveLength(51);
  });

  it("passes curriculum schema and reference validation", () => {
    expect(validateFoundationCurriculum(foundationCurriculum)).toEqual({
      valid: true,
      issues: []
    });
  });

  it("keeps every implemented route aligned with authored lesson content", () => {
    const lessonsByUnit = new Map(foundationCurriculum.lessons.map((lesson) => [lesson.unitId, lesson]));
    const assessmentsByUnit = new Map(
      foundationCurriculum.assessments.map((assessment) => [assessment.unitId, assessment])
    );
    const reviewPlansByUnit = new Map(
      foundationCurriculum.reviewPlans.map((reviewPlan) => [reviewPlan.unitId, reviewPlan])
    );

    for (const unit of foundationCurriculum.units) {
      const lesson = lessonsByUnit.get(unit.id);
      const assessment = assessmentsByUnit.get(unit.id);
      const reviewPlan = reviewPlansByUnit.get(unit.id);

      expect(lesson, unit.id).toBeDefined();
      expect(assessment, unit.id).toBeDefined();
      expect(reviewPlan, unit.id).toBeDefined();
      expect(unit.status, unit.id).toBe("implemented");
      expect(unit.outcomes.length, unit.id).toBeGreaterThanOrEqual(3);
      expect(lesson?.title, unit.id).toBeTruthy();
      expect(lesson?.objective, unit.id).toMatch(/[.!?]$/);
      expect(lesson?.estimatedMinutes, unit.id).toBe(unit.estimatedMinutes);
      expect(assessment?.requirements, unit.id).toEqual(lesson?.masteryCriteria);
    }
  });

  it("preserves explicit support fade across every instrument and portfolio lesson", () => {
    const expectedStages = ["model", "guided", "scaffold-fade", "independent"];
    const postOpeningLessons = foundationCurriculum.lessons.filter((lesson) => {
      const unit = foundationCurriculum.units.find(({ id }) => id === lesson.unitId);
      return unit && unit.order >= 4;
    });

    for (const lesson of postOpeningLessons) {
      const stages = lesson.contentBlocks
        .filter((block) => block.type === "learning-stage")
        .map((block) => block.stage);

      expect(stages, lesson.id).toEqual(expectedStages);
    }
  });

  it("keeps completion evidence learner-confirmed and reviewable", () => {
    for (const lesson of foundationCurriculum.lessons) {
      expect(lesson.masteryCriteria.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.masteryCriteria.some(({ verification }) => verification === "reflection"), lesson.id).toBe(true);
      expect(lesson.masteryCriteria.some(({ required }) => required), lesson.id).toBe(true);
      expect(lesson.masteryCriteria.every(({ verification }) => verification !== "automatic"), lesson.id).toBe(true);
      expect(lesson.guidedExercises.every(({ reduceDifficultyWhen, increaseDifficultyWhen }) =>
        reduceDifficultyWhen.length > 0 && increaseDifficultyWhen.length > 0
      ), lesson.id).toBe(true);
      expect(lesson.commonMistakes.every(({ symptom, likelyCause, adjustment }) =>
        symptom.length > 0 && likelyCause.length > 0 && adjustment.length > 0
      ), lesson.id).toBe(true);
    }
  });

  it("keeps spaced review present for every unit without changing curriculum order", () => {
    const orderedUnitIds = foundationCurriculum.units.map(({ id }) => id);

    expect(foundationCurriculum.units.map(({ order }) => order)).toEqual(
      Array.from({ length: 51 }, (_, index) => index + 1)
    );
    foundationCurriculum.units.slice(1).forEach((unit, index) => {
      expect(unit.requiredPriorUnitIds, unit.id).toContain(orderedUnitIds[index]);
    });

    for (const reviewPlan of foundationCurriculum.reviewPlans) {
      expect(reviewPlan.immediateReview.length, reviewPlan.unitId).toBeGreaterThan(0);
      expect(reviewPlan.nextSessionReview.length, reviewPlan.unitId).toBeGreaterThan(0);
      expect(reviewPlan.oneWeekReview.length, reviewPlan.unitId).toBeGreaterThan(0);
      expect(reviewPlan.longTermReview.length, reviewPlan.unitId).toBeGreaterThan(0);
    }
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

  it("validates fretboard positions and scale formulas against the pure engines", () => {
    const invalid = structuredClone(foundationCurriculum);
    invalid.lessons[0]!.contentBlocks.push(
      {
        id: "bad-map",
        type: "fretboard-map",
        heading: "Bad fretboard map",
        fretStart: 0,
        fretEnd: 3,
        positions: [{ string: 6, fret: 0, note: "C", label: "C", emphasis: "root" }],
        explanation: "The label does not match standard tuning.",
        accessibilityDescription: "String 6 open is incorrectly labeled C."
      },
      {
        id: "bad-scale",
        type: "scale-pattern",
        heading: "Bad scale",
        root: "C",
        collectionName: "test collection",
        formulaSemitones: [0, 2],
        notes: ["C", "E"],
        degrees: ["1", "2"],
        positions: [{ string: 5, fret: 3, degree: "1" }, { string: 4, fret: 2, degree: "2" }],
        explanation: "The second note does not match two semitones from C.",
        accessibilityDescription: "A deliberately invalid two-note formula."
      }
    );

    const issues = validateFoundationCurriculum(invalid).issues;
    expect(issues).toContainEqual(expect.objectContaining({ code: "invalid_fretboard_position" }));
    expect(issues).toContainEqual(expect.objectContaining({ code: "invalid_scale_note" }));
  });

  it("validates scale and arpeggio positions against their declared degrees", () => {
    const invalid = structuredClone(foundationCurriculum);
    const lesson = invalid.lessons.find(({ id }) => id === "lesson.major-scale-diatonic-melody")!;
    const pattern = lesson.contentBlocks.find(({ id }) => id === "g-major-position");
    if (pattern?.type !== "scale-pattern") throw new Error("Expected G-major scale pattern.");
    pattern.positions[0]!.degree = "3";

    expect(validateFoundationCurriculum(invalid).issues).toContainEqual(
      expect.objectContaining({ code: "invalid_scale_position" })
    );
  });
});
