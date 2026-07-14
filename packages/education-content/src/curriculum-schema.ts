import { z } from "zod";

export const curriculumLevelSchema = z.enum([
  "absolute-beginner",
  "beginner",
  "intermediate",
  "upper-intermediate",
  "advanced"
]);

export const curriculumUnitStatusSchema = z.enum(["implemented", "mapped"]);

export const curriculumIndexEntrySchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(1).max(51),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  level: curriculumLevelSchema,
  sourceUnit: z.number().int().min(1).max(48).nullable(),
  status: curriculumUnitStatusSchema,
  summary: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  requiredPriorUnitIds: z.array(z.string().min(1)),
  recommendedPriorUnitIds: z.array(z.string().min(1)),
  outcomes: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1)
});

const textBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("text"),
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1)
});

const calloutBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("callout"),
  heading: z.string().min(1),
  body: z.string().min(1),
  tone: z.enum(["practice", "safety", "listen", "remember"])
});

const guitarTaskBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("guitar-task"),
  heading: z.string().min(1),
  instructions: z.array(z.string().min(1)).min(1),
  listenFor: z.string().min(1),
  successCriteria: z.array(z.string().min(1)).min(1),
  accessibilityDescription: z.string().min(1)
});

const rhythmBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("rhythm"),
  heading: z.string().min(1),
  counts: z.array(z.string().min(1)).min(1),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const reflectionBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("reflection"),
  heading: z.string().min(1),
  prompt: z.string().min(1),
  fieldLabel: z.string().min(1),
  placeholder: z.string().min(1)
});

export const curriculumContentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  calloutBlockSchema,
  guitarTaskBlockSchema,
  rhythmBlockSchema,
  reflectionBlockSchema
]);

export const curriculumExerciseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  purpose: z.string().min(1),
  instructions: z.array(z.string().min(1)).min(1),
  successCriteria: z.array(z.string().min(1)).min(1),
  reduceDifficultyWhen: z.array(z.string().min(1)).min(1),
  increaseDifficultyWhen: z.array(z.string().min(1)).min(1),
  relatedSkills: z.array(z.string().min(1)).min(1),
  startingBpm: z.number().int().min(30).max(240).optional(),
  repetitions: z.number().int().positive().optional()
});

export const curriculumMistakeSchema = z.object({
  id: z.string().min(1),
  symptom: z.string().min(1),
  likelyCause: z.string().min(1),
  adjustment: z.string().min(1)
});

export const curriculumKnowledgeCheckSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
  incorrectFeedback: z.record(z.string().min(1)).optional()
});

export const curriculumMasteryCriterionSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  verification: z.enum([
    "automatic",
    "guided-self-check",
    "recorded-value",
    "reflection",
    "performance-checklist"
  ]),
  required: z.boolean()
});

export const curriculumLessonSchema = z.object({
  id: z.string().min(1),
  unitId: z.string().min(1),
  order: z.number().int().positive(),
  title: z.string().min(1),
  objective: z.string().min(1),
  whyItMatters: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  priorKnowledge: z.array(z.string().min(1)),
  contentBlocks: z.array(curriculumContentBlockSchema).min(1),
  guidedExercises: z.array(curriculumExerciseSchema).min(1),
  commonMistakes: z.array(curriculumMistakeSchema).min(1),
  knowledgeChecks: z.array(curriculumKnowledgeCheckSchema).min(1),
  masteryCriteria: z.array(curriculumMasteryCriterionSchema).min(1),
  reviewRecommendation: z.string().min(1),
  optionalExtension: z.string().min(1),
  interactive: z.enum(["practice-identity", "focus-timer", "metronome"]).optional()
});

export const curriculumAssessmentSchema = z.object({
  id: z.string().min(1),
  unitId: z.string().min(1),
  title: z.string().min(1),
  requirements: z.array(curriculumMasteryCriterionSchema).min(1),
  passingRule: z.string().min(1),
  remediationLessonIds: z.array(z.string().min(1)).min(1)
});

export const curriculumReviewPlanSchema = z.object({
  id: z.string().min(1),
  unitId: z.string().min(1),
  immediateReview: z.array(z.string().min(1)).min(1),
  nextSessionReview: z.array(z.string().min(1)).min(1),
  oneWeekReview: z.array(z.string().min(1)).min(1),
  longTermReview: z.array(z.string().min(1)).min(1)
});

export const foundationCurriculumSchema = z.object({
  schemaVersion: z.literal(1),
  contentVersion: z.string().min(1),
  units: z.array(curriculumIndexEntrySchema).length(51),
  lessons: z.array(curriculumLessonSchema).min(3),
  assessments: z.array(curriculumAssessmentSchema).min(3),
  reviewPlans: z.array(curriculumReviewPlanSchema).min(3)
});

export type CurriculumIndexEntry = z.infer<typeof curriculumIndexEntrySchema>;
export type CurriculumContentBlock = z.infer<typeof curriculumContentBlockSchema>;
export type CurriculumExercise = z.infer<typeof curriculumExerciseSchema>;
export type CurriculumMistake = z.infer<typeof curriculumMistakeSchema>;
export type CurriculumKnowledgeCheck = z.infer<typeof curriculumKnowledgeCheckSchema>;
export type CurriculumMasteryCriterion = z.infer<typeof curriculumMasteryCriterionSchema>;
export type CurriculumLesson = z.infer<typeof curriculumLessonSchema>;
export type CurriculumAssessment = z.infer<typeof curriculumAssessmentSchema>;
export type CurriculumReviewPlan = z.infer<typeof curriculumReviewPlanSchema>;
export type FoundationCurriculum = z.infer<typeof foundationCurriculumSchema>;
