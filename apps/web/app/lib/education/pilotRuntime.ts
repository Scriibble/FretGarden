import {
  EDUCATION_POLICY_VERSION,
  interpretAttempt,
  scheduleNextReview,
  selectRemediation,
  type AttemptRecord,
  type EvidenceRecord,
  type EvidenceRequirement,
  type ObservableError,
  type RemediationDecision,
  type ReviewObligation,
  type SupportLevel
} from "@pocket-practice/education-engine";
import {
  PILOT_CONTENT_VERSION,
  pilotEducationContent
} from "@pocket-practice/education-content";

const DAY = 24 * 60 * 60 * 1000;
const NOTE_OBJECTIVE = { id: "fretboard.natural-notes.region-1", version: 1 } as const;
const COORDINATE_OBJECTIVE = { id: "fretboard.coordinates.basic", version: 1 } as const;
const PULSE_OBJECTIVE = { id: "rhythm.external-pulse.basic", version: 1 } as const;
const PRACTICE_OBJECTIVE = { id: "practice.focused-session", version: 1 } as const;

export interface PracticePlanResponse {
  target: string;
  durationMinutes: 5 | 10 | 15;
  nextAction: string;
  reducedLoad: boolean;
}

export interface CoordinatePrompt {
  id: string;
  string: 5 | 6;
  fret: number;
  label: string;
}

export interface NotePrompt {
  id: string;
  note: "A" | "B" | "C" | "E" | "F" | "G";
  string: 5 | 6;
  fret: number;
}

export interface ApplicationPrompt {
  id: string;
  string: 5 | 6;
  firstNote: NotePrompt["note"];
  firstFret: number;
  secondNote: NotePrompt["note"];
  secondFret: number;
}

export interface ApplicationResponse {
  promptId: string;
  selectedFirstFret: number;
  selectedSecondFret: number;
  correct: boolean;
  supportLevel: SupportLevel;
  answerRevealed: boolean;
}

export interface CoordinateResponse {
  promptId: string;
  selectedString: 5 | 6;
  selectedFret: number;
  correct: boolean;
  supportLevel: SupportLevel;
  answerRevealed: boolean;
  responseControl: "grid" | "explicit";
}

export interface PulseEvaluation {
  valid: boolean;
  sampleCount: number;
  medianAbsoluteOffsetMs: number;
  timingVariabilityMs: number;
  errors: ObservableError[];
}

export interface PilotEvaluationResult {
  attempt: AttemptRecord;
  evidence: EvidenceRecord;
  remediation: RemediationDecision;
  review: ReviewObligation | null;
}

export const coordinatePrompts: CoordinatePrompt[] = [
  { id: "coordinate-6-0", string: 6, fret: 0, label: "String 6, open" },
  { id: "coordinate-5-3", string: 5, fret: 3, label: "String 5, fret 3" },
  { id: "coordinate-6-5", string: 6, fret: 5, label: "String 6, fret 5" },
  { id: "coordinate-5-2", string: 5, fret: 2, label: "String 5, fret 2" }
];

export const notePrompts: NotePrompt[] = [
  { id: "note-f-6", note: "F", string: 6, fret: 1 },
  { id: "note-b-5", note: "B", string: 5, fret: 2 },
  { id: "note-g-6", note: "G", string: 6, fret: 3 },
  { id: "note-c-5", note: "C", string: 5, fret: 3 },
  { id: "note-e-6", note: "E", string: 6, fret: 0 },
  { id: "note-a-5", note: "A", string: 5, fret: 0 },
  { id: "note-f-6-varied", note: "F", string: 6, fret: 1 },
  { id: "note-c-5-varied", note: "C", string: 5, fret: 3 }
];

export const applicationPrompts: ApplicationPrompt[] = [
  {
    id: "pattern-e-f-6",
    string: 6,
    firstNote: "E",
    firstFret: 0,
    secondNote: "F",
    secondFret: 1
  },
  {
    id: "pattern-a-b-5",
    string: 5,
    firstNote: "A",
    firstFret: 0,
    secondNote: "B",
    secondFret: 2
  }
];

export function evaluatePracticePlan(input: {
  response: PracticePlanResponse;
  sessionId: string;
  now: string;
}): PilotEvaluationResult {
  const targetIsSpecific = input.response.target.trim().length >= 3;
  const nextActionIsNamed = input.response.nextAction.trim().length >= 3;
  const attempt = buildAttempt({
    id: `${input.sessionId}:practice-plan`,
    sessionId: input.sessionId,
    taskId: "practice-plan",
    objective: PRACTICE_OBJECTIVE,
    now: input.now,
    response: input.response,
    supportLevel: "independent",
    observations: [
      { dimension: "target_is_specific", passed: targetIsSpecific },
      { dimension: "duration_is_selected", passed: [5, 10, 15].includes(input.response.durationMinutes) },
      { dimension: "next_action_is_named", passed: nextActionIsNamed }
    ]
  });
  return result(attempt, requirement("practice.focused-session", "focused-session-plan"), []);
}

export function evaluateCoordinateSet(input: {
  responses: CoordinateResponse[];
  sessionId: string;
  now: string;
}): PilotEvaluationResult {
  const validResponses = input.responses.filter((response) => !response.answerRevealed);
  const correct = validResponses.filter((response) => response.correct).length;
  const coverage = new Set(validResponses.map(({ promptId }) => promptId)).size;
  const isIndependent = validResponses.every(
    ({ supportLevel }) => supportLevel === "independent"
  );
  const errors = coordinateErrors(input.responses);
  const attempt = buildAttempt({
    id: `${input.sessionId}:coordinate-exit`,
    sessionId: input.sessionId,
    taskId: "coordinate-placement",
    objective: COORDINATE_OBJECTIVE,
    now: input.now,
    response: input.responses,
    supportLevel: isIndependent ? "independent" : "prompted",
    supportsUsed: isIndependent ? [] : ["coordinate_hint"],
    correctionState: input.responses.some(({ answerRevealed }) => answerRevealed)
      ? "corrected_reattempt"
      : "none",
    variedContext: new Set(input.responses.map(({ responseControl }) => responseControl)).size > 1,
    observations: [
      { dimension: "correctness", passed: correct >= 3, value: correct },
      { dimension: "scope_coverage", passed: coverage >= 4, value: coverage },
      { dimension: "independence", passed: isIndependent }
    ]
  });
  return result(attempt, requirement("fretboard.coordinates.basic", "coordinate-placement"), errors);
}

export function evaluateNoteSet(input: {
  responses: CoordinateResponse[];
  sessionId: string;
  now: string;
  sourceEvidenceAt?: string;
  review?: boolean;
}): PilotEvaluationResult {
  const minimumSamples = input.review === true ? 5 : 8;
  const requirementId = input.review === true ? "note-retained" : "note-exit";
  const relevant = input.responses.slice(0, minimumSamples);
  const independent = relevant.every(
    ({ supportLevel, answerRevealed }) => supportLevel === "independent" && !answerRevealed
  );
  const correct = relevant.filter(({ correct }) => correct).length;
  const requiredCorrect = input.review === true ? 4 : 6;
  const promptCoverage = new Set(relevant.map(({ promptId }) => promptId)).size;
  const stringCoverage = new Set(
    relevant.map(({ promptId }) => notePrompts.find(({ id }) => id === promptId)?.string)
  );
  const varied =
    stringCoverage.has(5) &&
    stringCoverage.has(6) &&
    new Set(relevant.map(({ responseControl }) => responseControl)).size > 1;
  const errors = noteErrors(relevant);
  const attemptInput = {
    id: `${input.sessionId}:${requirementId}`,
    sessionId: input.sessionId,
    taskId: "natural-note-retrieval",
    objective: NOTE_OBJECTIVE,
    now: input.now,
    response: relevant,
    supportLevel: independent ? ("independent" as const) : ("prompted" as const),
    supportsUsed: independent ? [] : ["answer_or_prompt"],
    correctionState: relevant.some(({ answerRevealed }) => answerRevealed)
      ? ("corrected_reattempt" as const)
      : ("none" as const),
    variedContext: varied,
    observations: [
      { dimension: "correctness", passed: correct >= requiredCorrect, value: correct },
      { dimension: "scope_coverage", passed: promptCoverage >= minimumSamples, value: promptCoverage },
      { dimension: "independence", passed: independent },
      { dimension: "validity", passed: relevant.length === minimumSamples },
      { dimension: "variation", passed: varied }
    ]
  };
  const attempt = buildAttempt(
    input.sourceEvidenceAt === undefined
      ? attemptInput
      : { ...attemptInput, sourceEvidenceAt: input.sourceEvidenceAt }
  );
  return result(attempt, requirement("fretboard.natural-notes.region-1", requirementId), errors);
}

export function evaluateApplicationSet(input: {
  responses: ApplicationResponse[];
  sessionId: string;
  now: string;
}): PilotEvaluationResult {
  const relevant = input.responses.slice(0, applicationPrompts.length);
  const correct = relevant.filter(({ correct }) => correct).length;
  const independent = relevant.every(
    ({ supportLevel, answerRevealed }) =>
      supportLevel === "independent" && !answerRevealed
  );
  const promptCoverage = new Set(relevant.map(({ promptId }) => promptId));
  const stringCoverage = new Set(
    relevant.map(
      ({ promptId }) =>
        applicationPrompts.find(({ id }) => id === promptId)?.string
    )
  );
  const varied = stringCoverage.has(5) && stringCoverage.has(6);
  const errors: ObservableError[] = [];
  for (const response of relevant) {
    if (!response.correct) {
      errors.push("incorrect_response");
    }
    if (response.supportLevel !== "independent" || response.answerRevealed) {
      errors.push("support_dependency");
    }
  }
  const attempt = buildAttempt({
    id: `${input.sessionId}:note-transfer`,
    sessionId: input.sessionId,
    taskId: "natural-note-application",
    objective: NOTE_OBJECTIVE,
    now: input.now,
    response: relevant,
    supportLevel: independent ? "independent" : "prompted",
    supportsUsed: independent ? [] : ["pattern_answer"],
    correctionState: relevant.some(({ answerRevealed }) => answerRevealed)
      ? "corrected_reattempt"
      : "none",
    variedContext: varied,
    observations: [
      { dimension: "correctness", passed: correct === 2, value: correct },
      {
        dimension: "scope_coverage",
        passed: promptCoverage.size === applicationPrompts.length,
        value: promptCoverage.size
      },
      { dimension: "independence", passed: independent },
      { dimension: "validity", passed: relevant.length === applicationPrompts.length },
      { dimension: "variation", passed: varied }
    ]
  });
  return result(
    attempt,
    requirement("fretboard.natural-notes.region-1", "note-transfer"),
    errors
  );
}

export function evaluatePulseTaps(input: {
  tapsMs: number[];
  pulseStartedAtMs: number;
  intervalMs: number;
  sessionId: string;
  now: string;
  documentHidden?: boolean;
  supportLevel?: SupportLevel;
  sourceEvidenceAt?: string;
}): PilotEvaluationResult & { timing: PulseEvaluation } {
  const timing = analyzePulseTaps(input);
  const requirementId = input.sourceEvidenceAt ? "pulse-retained" : "pulse-independent";
  const supportLevel = input.supportLevel ?? "independent";
  const invalidReason = timing.valid ? {} : { invalidReason: "timing_task_invalid" };
  const attemptInput = {
    id: `${input.sessionId}:${requirementId}`,
    sessionId: input.sessionId,
    taskId: "pulse-tapping",
    objective: PULSE_OBJECTIVE,
    now: input.now,
    response: input.tapsMs,
    supportLevel,
    supportsUsed: supportLevel === "independent" ? [] : ["visual_subdivision"],
    valid: timing.valid,
    ...invalidReason,
    observations: [
      { dimension: "minimum_samples", passed: timing.sampleCount >= 8, value: timing.sampleCount },
      { dimension: "median_offset", passed: timing.medianAbsoluteOffsetMs <= 180, value: timing.medianAbsoluteOffsetMs },
      { dimension: "timing_variability", passed: timing.timingVariabilityMs <= 120, value: timing.timingVariabilityMs }
    ]
  };
  const attempt = buildAttempt(
    input.sourceEvidenceAt === undefined
      ? attemptInput
      : { ...attemptInput, sourceEvidenceAt: input.sourceEvidenceAt }
  );
  return { ...result(attempt, requirement("rhythm.external-pulse.basic", requirementId), timing.errors), timing };
}

export function analyzePulseTaps(input: {
  tapsMs: number[];
  pulseStartedAtMs: number;
  intervalMs: number;
  documentHidden?: boolean;
}): PulseEvaluation {
  if (input.documentHidden === true || input.intervalMs <= 0 || input.tapsMs.length < 2) {
    return {
      valid: false,
      sampleCount: input.tapsMs.length,
      medianAbsoluteOffsetMs: 0,
      timingVariabilityMs: 0,
      errors: ["task_invalid"]
    };
  }

  const offsets = input.tapsMs.map((tap) => {
    const elapsed = tap - input.pulseStartedAtMs;
    const nearestBeat = Math.round(elapsed / input.intervalMs) * input.intervalMs;
    return elapsed - nearestBeat;
  });
  const absoluteOffsets = offsets.map(Math.abs).sort((left, right) => left - right);
  const medianAbsoluteOffsetMs = median(absoluteOffsets);
  const averageOffset = offsets.reduce((sum, offset) => sum + offset, 0) / offsets.length;
  const timingVariabilityMs = Math.round(
    offsets.reduce((sum, offset) => sum + Math.abs(offset - averageOffset), 0) /
      offsets.length
  );
  const averageDirection = averageOffset < -80 ? "timing_early" : averageOffset > 80 ? "timing_late" : null;
  const errors: ObservableError[] = [];
  if (timingVariabilityMs > 120) {
    errors.push("timing_unstable");
  }
  if (averageDirection) {
    errors.push(averageDirection);
  }

  return {
    valid: input.tapsMs.length >= 8,
    sampleCount: input.tapsMs.length,
    medianAbsoluteOffsetMs,
    timingVariabilityMs,
    errors: input.tapsMs.length >= 8 ? errors : ["task_invalid"]
  };
}

function result(
  attempt: AttemptRecord,
  evidenceRequirement: EvidenceRequirement,
  errors: ObservableError[]
): PilotEvaluationResult {
  const evidence = interpretAttempt(attempt, evidenceRequirement);
  const objective = pilotEducationContent.objectives.find(
    ({ id, version }) =>
      id === evidence.objective.id && version === evidence.objective.version
  );
  const reviewPolicy = pilotEducationContent.reviewPolicies.find(
    ({ id }) => id === objective?.reviewPolicyId
  );
  const review =
    evidence.kind === "independent_performance" &&
    evidenceRequirement.claimSupported === "independent_performance" &&
    reviewPolicy
      ? scheduleNextReview(evidence, reviewPolicy)
      : null;
  return {
    attempt,
    evidence,
    remediation: selectRemediation(errors),
    review
  };
}

function requirement(objectiveId: string, requirementId: string): EvidenceRequirement {
  const objective = pilotEducationContent.objectives.find(({ id }) => id === objectiveId);
  const source = objective?.evidenceRequirements.find(({ id }) => id === requirementId) as
    | {
        id: string;
        claimSupported: EvidenceRequirement["claimSupported"];
        qualityDimensions: string[];
        maxSupportLevel: SupportLevel;
        minimumDelayMs?: number;
        requiresVariedContext?: boolean;
      }
    | undefined;
  if (!objective || !source) {
    throw new Error(`Missing pilot evidence requirement: ${objectiveId}/${requirementId}`);
  }
  return {
    id: source.id,
    objective: { id: objective.id, version: objective.version },
    claimSupported: source.claimSupported,
    qualityDimensions: source.qualityDimensions,
    maxSupportLevel: source.maxSupportLevel,
    ...(source.minimumDelayMs === undefined ? {} : { minimumDelayMs: source.minimumDelayMs }),
    ...(source.requiresVariedContext === undefined
      ? {}
      : { requiresVariedContext: source.requiresVariedContext })
  };
}

function buildAttempt(input: {
  id: string;
  sessionId: string;
  taskId: string;
  objective: { id: string; version: number };
  now: string;
  response: unknown;
  supportLevel: SupportLevel;
  supportsUsed?: string[];
  correctionState?: AttemptRecord["correctionState"];
  valid?: boolean;
  invalidReason?: string;
  sourceEvidenceAt?: string;
  variedContext?: boolean;
  observations: AttemptRecord["observations"];
}): AttemptRecord {
  return {
    id: input.id,
    sessionId: input.sessionId,
    taskId: input.taskId,
    objective: input.objective,
    contentVersion: PILOT_CONTENT_VERSION,
    policyVersion: EDUCATION_POLICY_VERSION,
    startedAt: input.now,
    respondedAt: input.now,
    response: input.response,
    supportLevel: input.supportLevel,
    supportsUsed: input.supportsUsed ?? [],
    correctionState: input.correctionState ?? "none",
    valid: input.valid ?? true,
    ...(input.invalidReason === undefined ? {} : { invalidReason: input.invalidReason }),
    ...(input.sourceEvidenceAt === undefined ? {} : { sourceEvidenceAt: input.sourceEvidenceAt }),
    variedContext: input.variedContext ?? false,
    observations: input.observations
  };
}

function coordinateErrors(responses: CoordinateResponse[]): ObservableError[] {
  const errors: ObservableError[] = [];
  for (const response of responses) {
    if (!response.correct) {
      errors.push("coordinate_confusion");
    }
    if (response.supportLevel !== "independent" || response.answerRevealed) {
      errors.push("support_dependency");
    }
  }
  return errors;
}

function noteErrors(responses: CoordinateResponse[]): ObservableError[] {
  const errors: ObservableError[] = [];
  for (const response of responses) {
    if (!response.correct) {
      errors.push("incorrect_response");
    }
    if (response.supportLevel !== "independent" || response.answerRevealed) {
      errors.push("support_dependency");
    }
  }
  return errors;
}

function median(values: number[]): number {
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return Math.round(((values[middle - 1] ?? 0) + (values[middle] ?? 0)) / 2);
  }
  return Math.round(values[middle] ?? 0);
}

export const PILOT_REVIEW_DELAY_MS = DAY;
