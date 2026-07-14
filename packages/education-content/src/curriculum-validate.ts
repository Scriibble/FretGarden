import {
  foundationCurriculumSchema,
  type FoundationCurriculum
} from "./curriculum-schema.js";

export interface CurriculumValidationIssue {
  code: string;
  path: string;
  message: string;
}

export interface CurriculumValidationResult {
  valid: boolean;
  issues: CurriculumValidationIssue[];
}

export function validateFoundationCurriculum(
  input: unknown
): CurriculumValidationResult {
  const parsed = foundationCurriculumSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      issues: parsed.error.issues.map((issue) => ({
        code: "schema",
        path: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  const issues: CurriculumValidationIssue[] = [];
  const content = parsed.data;
  const unitIds = new Set(content.units.map(({ id }) => id));
  const lessonIds = new Set(content.lessons.map(({ id }) => id));

  addDuplicateIssues(content.units.map(({ id }) => id), "units", issues);
  addDuplicateIssues(content.units.map(({ slug }) => slug), "unit_slugs", issues);
  addDuplicateIssues(content.lessons.map(({ id }) => id), "lessons", issues);
  addDuplicateIssues(content.assessments.map(({ id }) => id), "assessments", issues);
  addDuplicateIssues(content.reviewPlans.map(({ id }) => id), "review_plans", issues);

  const expectedOrders = Array.from({ length: 51 }, (_, index) => index + 1);
  const actualOrders = content.units.map(({ order }) => order).sort((a, b) => a - b);
  if (!expectedOrders.every((order, index) => actualOrders[index] === order)) {
    issues.push({
      code: "unit_order",
      path: "units",
      message: "Curriculum unit order must contain every integer from 1 through 51 exactly once."
    });
  }

  for (const unit of content.units) {
    for (const prerequisiteId of [
      ...unit.requiredPriorUnitIds,
      ...unit.recommendedPriorUnitIds
    ]) {
      if (!unitIds.has(prerequisiteId)) {
        issues.push({
          code: "missing_prerequisite",
          path: `units.${unit.id}.prerequisites`,
          message: `Prerequisite ${prerequisiteId} does not exist.`
        });
      }

      const prerequisite = content.units.find(({ id }) => id === prerequisiteId);
      if (prerequisite && prerequisite.order >= unit.order) {
        issues.push({
          code: "forward_prerequisite",
          path: `units.${unit.id}.prerequisites`,
          message: `Prerequisite ${prerequisiteId} must occur before ${unit.id}.`
        });
      }
    }

    if (unit.status === "implemented") {
      const lessons = content.lessons.filter(({ unitId }) => unitId === unit.id);
      const assessments = content.assessments.filter(({ unitId }) => unitId === unit.id);
      const reviewPlans = content.reviewPlans.filter(({ unitId }) => unitId === unit.id);
      if (lessons.length === 0) addMissingUnitPart(unit.id, "lesson", issues);
      if (assessments.length === 0) addMissingUnitPart(unit.id, "assessment", issues);
      if (reviewPlans.length === 0) addMissingUnitPart(unit.id, "review plan", issues);
    }
  }

  for (const lesson of content.lessons) {
    if (!unitIds.has(lesson.unitId)) {
      issues.push({
        code: "missing_lesson_unit",
        path: `lessons.${lesson.id}.unitId`,
        message: `Unit ${lesson.unitId} does not exist.`
      });
    }

    const blockIds = lesson.contentBlocks.map(({ id }) => id);
    const exerciseIds = lesson.guidedExercises.map(({ id }) => id);
    const mistakeIds = lesson.commonMistakes.map(({ id }) => id);
    const checkIds = lesson.knowledgeChecks.map(({ id }) => id);
    const masteryIds = lesson.masteryCriteria.map(({ id }) => id);
    addDuplicateIssues(blockIds, `lessons.${lesson.id}.blocks`, issues);
    addDuplicateIssues(exerciseIds, `lessons.${lesson.id}.exercises`, issues);
    addDuplicateIssues(mistakeIds, `lessons.${lesson.id}.mistakes`, issues);
    addDuplicateIssues(checkIds, `lessons.${lesson.id}.checks`, issues);
    addDuplicateIssues(masteryIds, `lessons.${lesson.id}.mastery`, issues);

    for (const check of lesson.knowledgeChecks) {
      if (!check.options.includes(check.correctAnswer)) {
        issues.push({
          code: "missing_correct_option",
          path: `lessons.${lesson.id}.knowledgeChecks.${check.id}`,
          message: "The correct answer must be one of the available options."
        });
      }
    }
  }

  for (const assessment of content.assessments) {
    if (!unitIds.has(assessment.unitId)) {
      issues.push({
        code: "missing_assessment_unit",
        path: `assessments.${assessment.id}.unitId`,
        message: `Unit ${assessment.unitId} does not exist.`
      });
    }
    for (const remediationLessonId of assessment.remediationLessonIds) {
      if (!lessonIds.has(remediationLessonId)) {
        issues.push({
          code: "missing_remediation_lesson",
          path: `assessments.${assessment.id}.remediationLessonIds`,
          message: `Lesson ${remediationLessonId} does not exist.`
        });
      }
    }
  }

  return { valid: issues.length === 0, issues };
}

function addDuplicateIssues(
  values: string[],
  path: string,
  issues: CurriculumValidationIssue[]
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      issues.push({
        code: "duplicate_id",
        path,
        message: `Duplicate value ${value}.`
      });
    }
    seen.add(value);
  }
}

function addMissingUnitPart(
  unitId: string,
  part: string,
  issues: CurriculumValidationIssue[]
): void {
  issues.push({
    code: "missing_implemented_unit_part",
    path: `units.${unitId}`,
    message: `Implemented unit ${unitId} requires at least one ${part}.`
  });
}
