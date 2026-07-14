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

const guitarStringNumberSchema = z.number().int().min(1).max(6);
const guitarNoteNameSchema = z.string().regex(/^[A-G](?:#|b)?$/);

const chordStringSchema = z.discriminatedUnion("state", [
  z.object({
    string: guitarStringNumberSchema,
    state: z.literal("muted")
  }),
  z.object({
    string: guitarStringNumberSchema,
    state: z.literal("open"),
    note: guitarNoteNameSchema
  }),
  z.object({
    string: guitarStringNumberSchema,
    state: z.literal("fretted"),
    fret: z.number().int().min(1).max(24),
    finger: z.number().int().min(1).max(4),
    note: guitarNoteNameSchema
  })
]);

const chordDiagramBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("chord-diagram"),
  heading: z.string().min(1),
  chordName: z.string().min(1),
  strings: z.array(chordStringSchema).length(6),
  strumFromString: guitarStringNumberSchema,
  baseFret: z.number().int().min(1).max(20).optional(),
  barres: z.array(z.object({
    fret: z.number().int().min(1).max(24),
    fromString: guitarStringNumberSchema,
    toString: guitarStringNumberSchema,
    finger: z.number().int().min(1).max(4)
  })).optional(),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const tablatureNoteSchema = z.object({
  string: guitarStringNumberSchema,
  fret: z.number().int().min(0).max(24),
  technique: z.enum(["pick", "hammer-on", "pull-off", "slide", "mute"]).optional()
});

const tablatureEventSchema = z.object({
  count: z.string().min(1),
  notes: z.array(tablatureNoteSchema).max(6),
  duration: z.enum(["whole", "half", "quarter", "eighth"]),
  rest: z.boolean(),
  tieToNext: z.boolean().optional(),
  dotted: z.boolean().optional()
});

const tablatureBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("tablature"),
  heading: z.string().min(1),
  tempo: z.number().int().min(30).max(240).optional(),
  events: z.array(tablatureEventSchema).min(1),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const rhythmGridEventSchema = z.object({
  count: z.string().min(1),
  action: z.enum(["down", "up", "rest", "hold", "mute"]),
  accent: z.boolean()
});

const rhythmGridBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("rhythm-grid"),
  heading: z.string().min(1),
  meter: z.enum(["4/4", "3/4", "6/8"]),
  events: z.array(rhythmGridEventSchema).min(1),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const instrumentSetupBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("instrument-setup"),
  heading: z.string().min(1),
  items: z.array(z.object({
    label: z.string().min(1),
    instruction: z.string().min(1),
    selfCheck: z.string().min(1)
  })).min(1),
  safetyNote: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

export const curriculumLearningStageSchema = z.enum([
  "model",
  "guided",
  "scaffold-fade",
  "independent"
]);

const learningStageBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("learning-stage"),
  stage: curriculumLearningStageSchema,
  heading: z.string().min(1),
  instructions: z.array(z.string().min(1)).min(1),
  supports: z.array(z.string().min(1)),
  successCriteria: z.array(z.string().min(1)).min(1),
  accessibilityDescription: z.string().min(1)
});

const fretboardMapBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("fretboard-map"),
  heading: z.string().min(1),
  fretStart: z.number().int().min(0).max(20),
  fretEnd: z.number().int().min(1).max(24),
  positions: z.array(z.object({
    string: guitarStringNumberSchema,
    fret: z.number().int().min(0).max(24),
    note: guitarNoteNameSchema,
    label: z.string().min(1),
    emphasis: z.enum(["root", "target", "context"])
  })).min(1),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const scalePatternBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("scale-pattern"),
  heading: z.string().min(1),
  root: guitarNoteNameSchema,
  collectionName: z.string().min(1),
  formulaSemitones: z.array(z.number().int().min(0).max(11)).min(2),
  notes: z.array(guitarNoteNameSchema).min(2),
  degrees: z.array(z.string().min(1)).min(2),
  positions: z.array(z.object({
    string: guitarStringNumberSchema,
    fret: z.number().int().min(0).max(24),
    degree: z.string().min(1)
  })).min(2),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const progressionMeasureSchema = z.object({
  label: z.string().min(1),
  chord: z.string().min(1),
  romanNumeral: z.string().min(1),
  nashvilleNumber: z.string().min(1),
  beats: z.number().int().positive()
});

const progressionChartBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("progression-chart"),
  heading: z.string().min(1),
  key: guitarNoteNameSchema,
  meter: z.enum(["4/4", "3/4", "6/8", "12/8"]),
  measures: z.array(progressionMeasureSchema).min(2),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

const leadSheetBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("lead-sheet"),
  heading: z.string().min(1),
  songTitle: z.string().min(1),
  key: guitarNoteNameSchema,
  meter: z.enum(["4/4", "3/4", "6/8", "12/8"]),
  tempo: z.number().int().min(30).max(240),
  capo: z.number().int().min(0).max(12),
  sections: z.array(z.object({
    name: z.string().min(1),
    repeatCount: z.number().int().positive(),
    measures: z.array(z.object({
      chord: z.string().min(1),
      cue: z.string().min(1),
      beats: z.number().int().positive()
    })).min(1)
  })).min(1),
  explanation: z.string().min(1),
  accessibilityDescription: z.string().min(1)
});

export const curriculumContentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  calloutBlockSchema,
  guitarTaskBlockSchema,
  rhythmBlockSchema,
  reflectionBlockSchema,
  chordDiagramBlockSchema,
  tablatureBlockSchema,
  rhythmGridBlockSchema,
  instrumentSetupBlockSchema,
  learningStageBlockSchema,
  fretboardMapBlockSchema,
  scalePatternBlockSchema,
  progressionChartBlockSchema,
  leadSheetBlockSchema
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
  schemaVersion: z.literal(3),
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
