import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pilotEducationContent } from "./pilot";
import { renderConformanceReport } from "./report";
import { assertConformingContent, validateEducationContent } from "./validate";

describe("pilot education content", () => {
  it("conforms to the runtime schema and reference rules", () => {
    const report = validateEducationContent(pilotEducationContent);
    expect(report).toEqual({
      valid: true,
      issues: [],
      counts: {
        objectives: 4,
        lessons: 4,
        exercises: 5,
        reviewPolicies: 1,
        remediationRoutes: 5,
        accessibilityEquivalents: 5
      }
    });
    expect(assertConformingContent(pilotEducationContent).contentVersion).toBe("pilot-1");
  });

  it("rejects missing prerequisite references", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.objectives[3]!.prerequisites[0]!.objective.id = "missing-objective";
    const report = validateEducationContent(invalid);
    expect(report.valid).toBe(false);
    expect(report.issues.map(({ code }) => code)).toContain("missing_prerequisite");
  });

  it("rejects required prerequisite cycles", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.objectives[2]!.prerequisites = [
      {
        objective: { id: "fretboard.natural-notes.region-1", version: 1 },
        relationship: "required",
        minimumKind: "independent_performance"
      }
    ];
    const report = validateEducationContent(invalid);
    expect(report.valid).toBe(false);
    expect(report.issues.map(({ code }) => code)).toContain("required_prerequisite_cycle");
  });

  it("rejects lessons that reference absent review policies", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.lessons[3]!.delayedReviewPolicyIds = ["missing-review"];
    const report = validateEducationContent(invalid);
    expect(report.valid).toBe(false);
    expect(report.issues.map(({ code }) => code)).toContain("missing_lesson_review");
  });

  it("requires every exercise to preserve explicit evidence alignment", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.exercises[3]!.evidenceRequirementIds = ["missing-evidence"];
    const report = validateEducationContent(invalid);
    expect(report.valid).toBe(false);
    expect(report.issues.map(({ code }) => code)).toContain("missing_exercise_evidence");
  });

  it("rejects ambiguous content identities", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.exercises[1]!.id = invalid.exercises[0]!.id;
    const report = validateEducationContent(invalid);
    expect(report.issues.map(({ code }) => code)).toContain("duplicate_exercise");
  });

  it("rejects active objectives without both lesson and exercise ownership", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.lessons = invalid.lessons.filter(({ id }) => id !== "pilot-coordinates");
    invalid.exercises = invalid.exercises.filter(({ id }) => id !== "coordinate-placement");
    const report = validateEducationContent(invalid);
    expect(report.issues.map(({ code }) => code)).toContain("orphan_objective_lesson");
    expect(report.issues.map(({ code }) => code)).toContain("orphan_objective_exercise");
  });

  it("rejects evidence wired to an exercise or lesson for another objective", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.exercises[1]!.evidenceRequirementIds = ["focused-session-plan"];
    invalid.lessons[1]!.exitEvidenceRequirementIds = ["focused-session-plan"];
    const report = validateEducationContent(invalid);
    expect(report.issues.map(({ code }) => code)).toContain(
      "exercise_evidence_objective_mismatch"
    );
    expect(report.issues.map(({ code }) => code)).toContain(
      "lesson_evidence_objective_mismatch"
    );
  });

  it("requires delayed evidence and lesson review wiring to stay aligned", () => {
    const invalid = structuredClone(pilotEducationContent);
    delete invalid.objectives[1]!.reviewPolicyId;
    invalid.lessons[3]!.delayedReviewPolicyIds = [];
    const report = validateEducationContent(invalid);
    expect(report.issues.map(({ code }) => code)).toContain("missing_objective_review");
    expect(report.issues.map(({ code }) => code)).toContain("lesson_review_mismatch");
  });

  it("rejects accessibility paths that drift to another evaluator", () => {
    const invalid = structuredClone(pilotEducationContent);
    invalid.accessibilityEquivalents[2]!.evaluatorId = "different-evaluator";
    const report = validateEducationContent(invalid);
    expect(report.issues.map(({ code }) => code)).toContain(
      "equivalent_evaluator_mismatch"
    );
  });

  it("keeps the canonical schema and committed conformance report discoverable", () => {
    const schema = JSON.parse(
      readFileSync("../../docs/education-overhaul/schemas/education-content.schema.json", "utf8")
    ) as { properties?: Record<string, unknown> };
    const report = readFileSync(
      "../../docs/education-overhaul/generated/PILOT_CONFORMANCE_REPORT.md",
      "utf8"
    );
    expect(schema.properties).toMatchObject({
      objectives: expect.any(Object),
      lessons: expect.any(Object),
      exercises: expect.any(Object),
      reviewPolicies: expect.any(Object),
      remediationRoutes: expect.any(Object),
      accessibilityEquivalents: expect.any(Object)
    });
    expect(report).toBe(renderConformanceReport(pilotEducationContent));
  });
});
