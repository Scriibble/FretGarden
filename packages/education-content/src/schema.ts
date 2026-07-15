import { z } from "zod";

export const supportLevelSchema = z.enum([
  "modeled",
  "guided",
  "prompted",
  "independent"
]);

export const evidenceKindSchema = z.enum([
  "exposure",
  "supported_performance",
  "independent_performance",
  "retained_performance",
  "transfer"
]);

export const objectiveRefSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive()
});

export const evidenceRequirementSchema = z.object({
  id: z.string().min(1),
  claimSupported: evidenceKindSchema,
  qualityDimensions: z.array(z.string().min(1)).min(1),
  maxSupportLevel: supportLevelSchema,
  minimumDelayMs: z.number().int().nonnegative().optional(),
  requiresVariedContext: z.boolean().optional(),
  minimumValidSamples: z.number().int().positive().optional()
});

export const prerequisiteSchema = z.object({
  objective: objectiveRefSchema,
  relationship: z.enum([
    "required",
    "strongly_recommended",
    "supporting",
    "corequisite",
    "enrichment"
  ]),
  minimumKind: z.enum([
    "supported_performance",
    "independent_performance",
    "retained_performance",
    "transfer"
  ]),
  placementExerciseId: z.string().min(1).optional()
});

export const objectiveDefinitionSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  status: z.enum(["draft", "active", "retired"]),
  domain: z.enum([
    "orientation",
    "fretboard_navigation",
    "temporal_control",
    "metacognitive_practice"
  ]),
  capability: z.string().min(1),
  contentScope: z.array(z.string().min(1)).min(1),
  conditions: z.array(z.string().min(1)).min(1),
  qualityStandards: z.array(z.string().min(1)).min(1),
  targetIndependence: supportLevelSchema,
  prerequisites: z.array(prerequisiteSchema),
  evidenceRequirements: z.array(evidenceRequirementSchema).min(1),
  reviewPolicyId: z.string().min(1).optional()
});

export const phaseTypeSchema = z.enum([
  "position",
  "activate",
  "encounter",
  "attend",
  "model",
  "attempt",
  "interpret",
  "adjust",
  "fade",
  "retrieve",
  "vary",
  "apply",
  "consolidate",
  "exit",
  "return"
]);

export const lessonDefinitionSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  primaryObjectives: z.array(objectiveRefSchema).min(1),
  phases: z
    .array(
      z.object({
        type: phaseTypeSchema,
        activityIds: z.array(z.string().min(1)).min(1)
      })
    )
    .min(1),
  exitEvidenceRequirementIds: z.array(z.string().min(1)),
  delayedReviewPolicyIds: z.array(z.string().min(1)),
  remediationRouteIds: z.array(z.string().min(1)),
  accessibilityEquivalentIds: z.array(z.string().min(1))
});

export const exerciseDefinitionSchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  objective: objectiveRefSchema,
  kind: z.enum([
    "practice_plan",
    "pulse_tapping",
    "coordinate_selection",
    "note_retrieval",
    "note_application"
  ]),
  evaluatorId: z.string().min(1),
  responseContract: z.string().min(1),
  qualityDimensions: z.array(z.string().min(1)).min(1),
  variationAxes: z.array(z.string().min(1)),
  invalidationConditions: z.array(z.string().min(1)),
  supportFade: z.array(supportLevelSchema).min(1),
  evidenceRequirementIds: z.array(z.string().min(1)).min(1)
});

export const reviewPolicySchema = z.object({
  id: z.string().min(1),
  version: z.number().int().positive(),
  delaysMs: z.array(z.number().int().positive()).min(1),
  dueWindowMs: z.number().int().positive(),
  maximumMixedSessionShare: z.number().min(0).max(1)
});

export const remediationRouteSchema = z.object({
  id: z.string().min(1),
  trigger: z.string().min(1),
  instructionalChange: z.string().min(1),
  preservedCapability: z.string().min(1),
  exitCondition: z.string().min(1)
});

export const accessibilityEquivalentSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  alternateModality: z.string().min(1),
  unchangedCapability: z.string().min(1),
  responseContract: z.string().min(1),
  evaluatorId: z.string().min(1),
  evidenceCeiling: evidenceKindSchema
});

export const educationContentSchema = z.object({
  schemaVersion: z.literal(1),
  contentVersion: z.string().min(1),
  objectives: z.array(objectiveDefinitionSchema).min(1),
  lessons: z.array(lessonDefinitionSchema).min(1),
  exercises: z.array(exerciseDefinitionSchema).min(1),
  reviewPolicies: z.array(reviewPolicySchema).min(1),
  remediationRoutes: z.array(remediationRouteSchema).min(1),
  accessibilityEquivalents: z.array(accessibilityEquivalentSchema).min(1)
});

export type ObjectiveDefinition = z.infer<typeof objectiveDefinitionSchema>;
export type LessonDefinition = z.infer<typeof lessonDefinitionSchema>;
export type ExerciseDefinition = z.infer<typeof exerciseDefinitionSchema>;
export type EducationContent = z.infer<typeof educationContentSchema>;
