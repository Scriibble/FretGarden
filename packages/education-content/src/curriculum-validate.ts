import {
  foundationCurriculumSchema,
  type FoundationCurriculum
} from "./curriculum-schema.js";
import {
  getNoteAtFret,
  type GuitarStringNumber
} from "@pocket-practice/fretboard-engine";
import {
  getPitchClass,
  transpose,
  type NoteName
} from "@pocket-practice/music-theory-engine";

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

    for (const block of lesson.contentBlocks) {
      if (block.type === "chord-diagram") {
        const strings = block.strings.map(({ string }) => string);
        if (new Set(strings).size !== 6) {
          issues.push({
            code: "invalid_chord_strings",
            path: `lessons.${lesson.id}.contentBlocks.${block.id}`,
            message: "A chord diagram must define each guitar string exactly once."
          });
        }
        if (block.strings.find(({ string }) => string === block.strumFromString)?.state === "muted") {
          issues.push({
            code: "invalid_chord_strum_range",
            path: `lessons.${lesson.id}.contentBlocks.${block.id}.strumFromString`,
            message: "The first strummed string cannot be muted."
          });
        }
        for (const stringState of block.strings) {
          if (stringState.state === "muted") continue;
          const fret = stringState.state === "open" ? 0 : stringState.fret;
          const actual = getNoteAtFret(
            stringState.string as GuitarStringNumber,
            fret
          ).note;
          if (getPitchClass(actual) !== getPitchClass(stringState.note as NoteName)) {
            issues.push({
              code: "invalid_chord_note",
              path: `lessons.${lesson.id}.contentBlocks.${block.id}.strings.${stringState.string}`,
              message: `String ${stringState.string} fret ${fret} is ${actual}, not ${stringState.note}.`
            });
          }
        }
        for (const barre of block.barres ?? []) {
          if (barre.fromString <= barre.toString) {
            issues.push({
              code: "invalid_barre_span",
              path: `lessons.${lesson.id}.contentBlocks.${block.id}.barres`,
              message: "A barre must run from a lower-pitched string number toward a higher-pitched string number."
            });
          }
        }
      }

      if (block.type === "tablature") {
        block.events.forEach((event, eventIndex) => {
          const noteStrings = event.notes.map(({ string }) => string);
          if (event.rest === (event.notes.length > 0)) {
            issues.push({
              code: "invalid_tab_event",
              path: `lessons.${lesson.id}.contentBlocks.${block.id}.events.${eventIndex}`,
              message: "A rest must contain no notes and a played event must contain at least one note."
            });
          }
          if (new Set(noteStrings).size !== noteStrings.length) {
            issues.push({
              code: "duplicate_tab_string",
              path: `lessons.${lesson.id}.contentBlocks.${block.id}.events.${eventIndex}`,
              message: "A tablature event cannot contain two notes on the same string."
            });
          }
        });
      }

      if (block.type === "fretboard-map") {
        if (block.fretStart >= block.fretEnd) {
          issues.push({
            code: "invalid_fretboard_range",
            path: `lessons.${lesson.id}.contentBlocks.${block.id}`,
            message: "A fretboard map must end after it starts."
          });
        }
        for (const position of block.positions) {
          const actual = getNoteAtFret(
            position.string as GuitarStringNumber,
            position.fret
          ).note;
          if (
            position.fret < block.fretStart ||
            position.fret > block.fretEnd ||
            getPitchClass(actual) !== getPitchClass(position.note as NoteName)
          ) {
            issues.push({
              code: "invalid_fretboard_position",
              path: `lessons.${lesson.id}.contentBlocks.${block.id}.positions`,
              message: `Mapped string ${position.string} fret ${position.fret} must be in range and carry its actual pitch.`
            });
          }
        }
      }

      if (block.type === "scale-pattern") {
        const uniqueFormula = new Set(block.formulaSemitones);
        if (
          block.formulaSemitones[0] !== 0 ||
          uniqueFormula.size !== block.formulaSemitones.length ||
          block.notes.length !== block.formulaSemitones.length ||
          block.degrees.length !== block.formulaSemitones.length
        ) {
          issues.push({
            code: "invalid_scale_formula",
            path: `lessons.${lesson.id}.contentBlocks.${block.id}`,
            message: "A scale formula must begin at zero and provide one unique note and degree per interval."
          });
        } else {
          block.formulaSemitones.forEach((semitones, index) => {
            const expected = transpose(block.root as NoteName, semitones);
            if (getPitchClass(expected) !== getPitchClass(block.notes[index] as NoteName)) {
              issues.push({
                code: "invalid_scale_note",
                path: `lessons.${lesson.id}.contentBlocks.${block.id}.notes.${index}`,
                message: `Scale note ${block.notes[index]} does not match interval ${semitones} from ${block.root}.`
              });
            }
          });
        }
      }

      if (block.type === "progression-chart" || block.type === "lead-sheet") {
        const meter = Number(block.meter.split("/")[0]);
        const measures = block.type === "progression-chart"
          ? block.measures
          : block.sections.flatMap(({ measures: sectionMeasures }) => sectionMeasures);
        if (measures.some(({ beats }) => beats !== meter)) {
          issues.push({
            code: "invalid_measure_duration",
            path: `lessons.${lesson.id}.contentBlocks.${block.id}`,
            message: `Every chart measure must contain ${meter} notated beats in ${block.meter}.`
          });
        }
      }
    }

    const lessonUnit = content.units.find(({ id }) => id === lesson.unitId);
    if (
      lessonUnit?.status === "implemented" &&
      lessonUnit.sourceUnit !== null &&
      lessonUnit.sourceUnit <= 16
    ) {
      const requiredStages = [
        "model",
        "guided",
        "scaffold-fade",
        "independent"
      ];
      const actualStages = lesson.contentBlocks
        .flatMap((block) => block.type === "learning-stage" ? [block.stage] : []);
      if (
        requiredStages.length !== actualStages.length ||
        requiredStages.some((stage, index) => actualStages[index] !== stage)
      ) {
        issues.push({
          code: "incomplete_learning_progression",
          path: `lessons.${lesson.id}.contentBlocks`,
          message: "Level 1 instrument lessons require model, guided, scaffold-fade, and independent stages in order."
        });
      }
    }

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
