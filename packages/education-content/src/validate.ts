import {
  educationContentSchema,
  type EducationContent,
  type ObjectiveDefinition
} from "./schema.js";

export interface ConformanceIssue {
  code: string;
  path: string;
  message: string;
}

export interface ConformanceReport {
  valid: boolean;
  issues: ConformanceIssue[];
  counts: {
    objectives: number;
    lessons: number;
    exercises: number;
    reviewPolicies: number;
    remediationRoutes: number;
    accessibilityEquivalents: number;
  };
}

export function validateEducationContent(input: unknown): ConformanceReport {
  const parsed = educationContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      issues: parsed.error.issues.map((issue) => ({
        code: "schema",
        path: issue.path.join("."),
        message: issue.message
      })),
      counts: emptyCounts()
    };
  }

  const content = parsed.data;
  const issues: ConformanceIssue[] = [];
  const objectiveKeys = new Set<string>();
  const evidenceRequirementIds = new Set<string>();
  const reviewPolicyIds = new Set(content.reviewPolicies.map(({ id }) => id));
  const remediationRouteIds = new Set(content.remediationRoutes.map(({ id }) => id));
  const equivalentIds = new Set(content.accessibilityEquivalents.map(({ id }) => id));
  const exerciseIds = new Set(content.exercises.map(({ id }) => id));
  const lessonObjectiveKeys = new Set(
    content.lessons.flatMap(({ primaryObjectives }) =>
      primaryObjectives.map(({ id, version }) => `${id}@${version}`)
    )
  );
  const exerciseObjectiveKeys = new Set(
    content.exercises.map(({ objective }) => `${objective.id}@${objective.version}`)
  );
  const evidenceOwners = new Map<string, string>();

  issues.push(
    ...findDuplicateIds(content.lessons, "lesson", true),
    ...findDuplicateIds(content.exercises, "exercise"),
    ...findDuplicateIds(content.reviewPolicies, "review_policy"),
    ...findDuplicateIds(content.remediationRoutes, "remediation_route"),
    ...findDuplicateIds(content.accessibilityEquivalents, "accessibility_equivalent")
  );

  for (const objective of content.objectives) {
    const key = objectiveKey(objective);
    if (objectiveKeys.has(key)) {
      issues.push(issue("duplicate_objective", `objectives.${key}`, "Objective ID and version must be unique."));
    }
    objectiveKeys.add(key);

    for (const requirement of objective.evidenceRequirements) {
      if (evidenceRequirementIds.has(requirement.id)) {
        issues.push(issue("duplicate_evidence_requirement", `objectives.${key}`, `Evidence requirement ${requirement.id} is duplicated.`));
      }
      evidenceRequirementIds.add(requirement.id);
      evidenceOwners.set(requirement.id, key);
    }

    if (objective.reviewPolicyId && !reviewPolicyIds.has(objective.reviewPolicyId)) {
      issues.push(issue("missing_review_policy", `objectives.${key}.reviewPolicyId`, `Review policy ${objective.reviewPolicyId} does not exist.`));
    }

    const hasDelayedEvidence = objective.evidenceRequirements.some(
      ({ minimumDelayMs }) => minimumDelayMs !== undefined && minimumDelayMs > 0
    );
    if (hasDelayedEvidence && !objective.reviewPolicyId) {
      issues.push(issue("missing_objective_review", `objectives.${key}.reviewPolicyId`, "An objective with delayed evidence requires a review policy."));
    }
    if (objective.status === "active" && !lessonObjectiveKeys.has(key)) {
      issues.push(issue("orphan_objective_lesson", `objectives.${key}`, "Active objectives must be taught or placed by a lesson."));
    }
    if (objective.status === "active" && !exerciseObjectiveKeys.has(key)) {
      issues.push(issue("orphan_objective_exercise", `objectives.${key}`, "Active objectives must have an exercise that can produce evidence."));
    }
  }

  for (const objective of content.objectives) {
    for (const prerequisite of objective.prerequisites) {
      const key = `${prerequisite.objective.id}@${prerequisite.objective.version}`;
      if (!objectiveKeys.has(key)) {
        issues.push(issue("missing_prerequisite", `objectives.${objectiveKey(objective)}.prerequisites`, `Prerequisite ${key} does not exist.`));
      }
      if (prerequisite.placementExerciseId && !exerciseIds.has(prerequisite.placementExerciseId)) {
        issues.push(issue("missing_placement_exercise", `objectives.${objectiveKey(objective)}.prerequisites`, `Placement exercise ${prerequisite.placementExerciseId} does not exist.`));
      }
    }
  }

  issues.push(...findRequiredCycles(content.objectives));

  for (const exercise of content.exercises) {
    const exerciseObjectiveKey = `${exercise.objective.id}@${exercise.objective.version}`;
    if (!objectiveKeys.has(exerciseObjectiveKey)) {
      issues.push(issue("missing_exercise_objective", `exercises.${exercise.id}.objective`, "Exercise objective does not exist."));
    }
    for (const requirementId of exercise.evidenceRequirementIds) {
      if (!evidenceRequirementIds.has(requirementId)) {
        issues.push(issue("missing_exercise_evidence", `exercises.${exercise.id}.evidenceRequirementIds`, `Evidence requirement ${requirementId} does not exist.`));
      } else if (evidenceOwners.get(requirementId) !== exerciseObjectiveKey) {
        issues.push(issue("exercise_evidence_objective_mismatch", `exercises.${exercise.id}.evidenceRequirementIds`, `Evidence requirement ${requirementId} belongs to another objective.`));
      }
    }

    const objective = content.objectives.find(
      ({ id, version }) => id === exercise.objective.id && version === exercise.objective.version
    );
    const requiredDimensions = new Set(
      objective?.evidenceRequirements
        .filter(({ id }) => exercise.evidenceRequirementIds.includes(id))
        .flatMap(({ qualityDimensions }) => qualityDimensions) ?? []
    );
    for (const dimension of requiredDimensions) {
      if (!exercise.qualityDimensions.includes(dimension)) {
        issues.push(issue("exercise_quality_mismatch", `exercises.${exercise.id}.qualityDimensions`, `Required quality dimension ${dimension} is not produced by the exercise.`));
      }
    }
  }

  for (const lesson of content.lessons) {
    for (const objective of lesson.primaryObjectives) {
      if (!objectiveKeys.has(`${objective.id}@${objective.version}`)) {
        issues.push(issue("missing_lesson_objective", `lessons.${lesson.id}.primaryObjectives`, `Objective ${objective.id}@${objective.version} does not exist.`));
      }
    }
    for (const requirementId of lesson.exitEvidenceRequirementIds) {
      if (!evidenceRequirementIds.has(requirementId)) {
        issues.push(issue("missing_exit_evidence", `lessons.${lesson.id}.exitEvidenceRequirementIds`, `Evidence requirement ${requirementId} does not exist.`));
      } else {
        const primaryObjectiveKeys = new Set(
          lesson.primaryObjectives.map(({ id, version }) => `${id}@${version}`)
        );
        if (!primaryObjectiveKeys.has(evidenceOwners.get(requirementId) ?? "")) {
          issues.push(issue("lesson_evidence_objective_mismatch", `lessons.${lesson.id}.exitEvidenceRequirementIds`, `Evidence requirement ${requirementId} belongs to another objective.`));
        }
      }
    }
    for (const policyId of lesson.delayedReviewPolicyIds) {
      if (!reviewPolicyIds.has(policyId)) {
        issues.push(issue("missing_lesson_review", `lessons.${lesson.id}.delayedReviewPolicyIds`, `Review policy ${policyId} does not exist.`));
      }
    }
    for (const routeId of lesson.remediationRouteIds) {
      if (!remediationRouteIds.has(routeId)) {
        issues.push(issue("missing_remediation", `lessons.${lesson.id}.remediationRouteIds`, `Remediation route ${routeId} does not exist.`));
      }
    }
    for (const equivalentId of lesson.accessibilityEquivalentIds) {
      if (!equivalentIds.has(equivalentId)) {
        issues.push(issue("missing_accessibility_equivalent", `lessons.${lesson.id}.accessibilityEquivalentIds`, `Accessibility equivalent ${equivalentId} does not exist.`));
      }
    }
    if (lesson.exitEvidenceRequirementIds.length > 0 && !lesson.phases.some(({ type }) => type === "exit")) {
      issues.push(issue("missing_exit_phase", `lessons.${lesson.id}.phases`, "A lesson with exit evidence requires an exit phase."));
    }

    for (const objectiveReference of lesson.primaryObjectives) {
      const objective = content.objectives.find(
        ({ id, version }) => id === objectiveReference.id && version === objectiveReference.version
      );
      if (
        objective?.reviewPolicyId &&
        !lesson.delayedReviewPolicyIds.includes(objective.reviewPolicyId)
      ) {
        issues.push(issue("lesson_review_mismatch", `lessons.${lesson.id}.delayedReviewPolicyIds`, `Lesson must include objective review policy ${objective.reviewPolicyId}.`));
      }
    }
  }

  for (const equivalent of content.accessibilityEquivalents) {
    const exercise = content.exercises.find(({ id }) => id === equivalent.exerciseId);
    if (!exerciseIds.has(equivalent.exerciseId) || !exercise) {
      issues.push(issue("missing_equivalent_exercise", `accessibilityEquivalents.${equivalent.id}.exerciseId`, `Exercise ${equivalent.exerciseId} does not exist.`));
      continue;
    }
    if (equivalent.evaluatorId !== exercise.evaluatorId) {
      issues.push(issue("equivalent_evaluator_mismatch", `accessibilityEquivalents.${equivalent.id}.evaluatorId`, "Equivalent paths must use the same evaluator as the source exercise."));
    }
    const objective = content.objectives.find(
      ({ id, version }) => id === exercise.objective.id && version === exercise.objective.version
    );
    const strongestRequirement = objective?.evidenceRequirements
      .filter(({ id }) => exercise.evidenceRequirementIds.includes(id))
      .reduce<string | null>(
        (strongest, requirement) =>
          strongest === null || evidenceKindRank(requirement.claimSupported) > evidenceKindRank(strongest)
            ? requirement.claimSupported
            : strongest,
        null
      );
    if (
      strongestRequirement !== null &&
      strongestRequirement !== undefined &&
      evidenceKindRank(equivalent.evidenceCeiling) > evidenceKindRank(strongestRequirement)
    ) {
      issues.push(issue("equivalent_claim_inflation", `accessibilityEquivalents.${equivalent.id}.evidenceCeiling`, "Equivalent path evidence cannot exceed its source exercise."));
    }
  }

  for (const policy of content.reviewPolicies) {
    if (policy.delaysMs.some((delay, index) => index > 0 && delay <= policy.delaysMs[index - 1]!)) {
      issues.push(issue("review_delay_order", `reviewPolicies.${policy.id}.delaysMs`, "Review delays must be strictly increasing."));
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    counts: {
      objectives: content.objectives.length,
      lessons: content.lessons.length,
      exercises: content.exercises.length,
      reviewPolicies: content.reviewPolicies.length,
      remediationRoutes: content.remediationRoutes.length,
      accessibilityEquivalents: content.accessibilityEquivalents.length
    }
  };
}

function findDuplicateIds(
  items: Array<{ id: string; version?: number }>,
  kind: string,
  includeVersion = false
): ConformanceIssue[] {
  const seen = new Set<string>();
  const issues: ConformanceIssue[] = [];
  for (const item of items) {
    const key = includeVersion && item.version !== undefined ? `${item.id}@${item.version}` : item.id;
    if (seen.has(key)) {
      issues.push(issue(`duplicate_${kind}`, `${kind}s.${key}`, `${kind.replaceAll("_", " ")} identity must be unique.`));
    }
    seen.add(key);
  }
  return issues;
}

function evidenceKindRank(kind: string): number {
  return [
    "exposure",
    "supported_performance",
    "independent_performance",
    "retained_performance",
    "transfer"
  ].indexOf(kind);
}

function findRequiredCycles(objectives: ObjectiveDefinition[]): ConformanceIssue[] {
  const graph = new Map<string, string[]>();
  for (const objective of objectives) {
    graph.set(
      objectiveKey(objective),
      objective.prerequisites
        .filter(({ relationship }) => relationship === "required")
        .map(({ objective: reference }) => `${reference.id}@${reference.version}`)
    );
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const issues: ConformanceIssue[] = [];

  function visit(key: string): void {
    if (visiting.has(key)) {
      issues.push(issue("required_prerequisite_cycle", `objectives.${key}.prerequisites`, "Required prerequisite graph contains a cycle."));
      return;
    }
    if (visited.has(key)) {
      return;
    }
    visiting.add(key);
    for (const dependency of graph.get(key) ?? []) {
      visit(dependency);
    }
    visiting.delete(key);
    visited.add(key);
  }

  for (const key of graph.keys()) {
    visit(key);
  }
  return issues;
}

function objectiveKey(objective: Pick<ObjectiveDefinition, "id" | "version">): string {
  return `${objective.id}@${objective.version}`;
}

function issue(code: string, path: string, message: string): ConformanceIssue {
  return { code, path, message };
}

function emptyCounts(): ConformanceReport["counts"] {
  return {
    objectives: 0,
    lessons: 0,
    exercises: 0,
    reviewPolicies: 0,
    remediationRoutes: 0,
    accessibilityEquivalents: 0
  };
}

export function assertConformingContent(input: unknown): EducationContent {
  const report = validateEducationContent(input);
  if (!report.valid) {
    throw new Error(report.issues.map(({ code, path }) => `${code}:${path}`).join(", "));
  }
  return educationContentSchema.parse(input);
}
