import type { EducationContent } from "./schema.js";

const DAY = 24 * 60 * 60 * 1000;

export const PILOT_CONTENT_VERSION = "pilot-1";

export const pilotEducationContent = {
  schemaVersion: 1,
  contentVersion: PILOT_CONTENT_VERSION,
  objectives: [
    {
      id: "practice.focused-session",
      version: 1,
      status: "active",
      domain: "metacognitive_practice",
      capability:
        "Choose one useful target and a sustainable interval, then name the next useful action.",
      contentScope: ["single-target planning", "5-15 minute interval", "session reflection"],
      conditions: ["learner-selected duration", "stopping or reducing load remains available"],
      qualityStandards: ["target_is_specific", "duration_is_selected", "next_action_is_named"],
      targetIndependence: "independent",
      prerequisites: [],
      evidenceRequirements: [
        {
          id: "focused-session-plan",
          claimSupported: "supported_performance",
          qualityDimensions: ["target_is_specific", "duration_is_selected", "next_action_is_named"],
          maxSupportLevel: "independent"
        }
      ]
    },
    {
      id: "rhythm.external-pulse.basic",
      version: 1,
      status: "active",
      domain: "temporal_control",
      capability:
        "Produce repeated taps aligned to an external pulse with defined stability and decreasing support.",
      contentScope: ["quarter-note taps", "50-70 BPM", "groups of 8 taps"],
      conditions: ["keyboard, pointer, or accessible button input", "optional audiovisual pulse"],
      qualityStandards: ["minimum_samples", "median_offset", "timing_variability"],
      targetIndependence: "independent",
      prerequisites: [
        {
          objective: { id: "practice.focused-session", version: 1 },
          relationship: "strongly_recommended",
          minimumKind: "supported_performance"
        }
      ],
      evidenceRequirements: [
        {
          id: "pulse-independent",
          claimSupported: "independent_performance",
          qualityDimensions: ["minimum_samples", "median_offset", "timing_variability"],
          maxSupportLevel: "independent",
          minimumValidSamples: 8
        },
        {
          id: "pulse-retained",
          claimSupported: "retained_performance",
          qualityDimensions: ["minimum_samples", "median_offset", "timing_variability"],
          maxSupportLevel: "independent",
          minimumDelayMs: DAY,
          minimumValidSamples: 8,
          requiresVariedContext: true
        }
      ],
      reviewPolicyId: "pilot-spaced-review"
    },
    {
      id: "fretboard.coordinates.basic",
      version: 1,
      status: "active",
      domain: "orientation",
      capability: "Identify string and fret coordinates using an equivalent response control.",
      contentScope: ["strings 6 and 5", "open through fret 5"],
      conditions: ["semantic grid or explicit string/fret controls", "varied prompt order"],
      qualityStandards: ["correctness", "scope_coverage", "independence"],
      targetIndependence: "independent",
      prerequisites: [
        {
          objective: { id: "practice.focused-session", version: 1 },
          relationship: "strongly_recommended",
          minimumKind: "supported_performance"
        }
      ],
      evidenceRequirements: [
        {
          id: "coordinate-placement",
          claimSupported: "independent_performance",
          qualityDimensions: ["correctness", "scope_coverage", "independence"],
          maxSupportLevel: "independent",
          minimumValidSamples: 4
        }
      ]
    },
    {
      id: "fretboard.natural-notes.region-1",
      version: 1,
      status: "active",
      domain: "fretboard_navigation",
      capability:
        "Retrieve natural-note locations on strings 6 and 5 through fret 5 without visible answer cues.",
      contentScope: ["string 6: E F G", "string 5: A B C", "frets 0-5"],
      conditions: ["varied prompts", "no answer-producing cues", "valid coordinate input"],
      qualityStandards: [
        "correctness",
        "scope_coverage",
        "independence",
        "validity",
        "variation"
      ],
      targetIndependence: "independent",
      prerequisites: [
        {
          objective: { id: "fretboard.coordinates.basic", version: 1 },
          relationship: "required",
          minimumKind: "independent_performance",
          placementExerciseId: "coordinate-placement"
        }
      ],
      evidenceRequirements: [
        {
          id: "note-exit",
          claimSupported: "independent_performance",
          qualityDimensions: ["correctness", "scope_coverage", "independence", "validity", "variation"],
          maxSupportLevel: "independent",
          minimumValidSamples: 8,
          requiresVariedContext: true
        },
        {
          id: "note-retained",
          claimSupported: "retained_performance",
          qualityDimensions: ["correctness", "scope_coverage", "independence", "validity", "variation"],
          maxSupportLevel: "independent",
          minimumDelayMs: DAY,
          minimumValidSamples: 5,
          requiresVariedContext: true
        },
        {
          id: "note-transfer",
          claimSupported: "transfer",
          qualityDimensions: ["correctness", "scope_coverage", "independence", "validity", "variation"],
          maxSupportLevel: "independent",
          minimumValidSamples: 2,
          requiresVariedContext: true
        }
      ],
      reviewPolicyId: "pilot-spaced-review"
    }
  ],
  lessons: [
    {
      id: "pilot-practice-expectations",
      version: 1,
      title: "Choose a workable session",
      summary: "Set one target, choose a sustainable interval, and leave with a useful next action.",
      primaryObjectives: [{ id: "practice.focused-session", version: 1 }],
      phases: [
        { type: "position", activityIds: ["choose-target-and-time"] },
        { type: "encounter", activityIds: ["garden-expectations"] },
        { type: "attempt", activityIds: ["practice-plan"] },
        { type: "exit", activityIds: ["practice-reflection"] },
        { type: "return", activityIds: ["practice-next-action"] }
      ],
      exitEvidenceRequirementIds: ["focused-session-plan"],
      delayedReviewPolicyIds: [],
      remediationRouteIds: ["shorter-sustainable-session"],
      accessibilityEquivalentIds: ["practice-plan-semantic-form"]
    },
    {
      id: "pilot-pulse",
      version: 1,
      title: "Meet the pulse",
      summary: "Tap with an external pulse, read the timing observation, and adjust the task conditions.",
      primaryObjectives: [{ id: "rhythm.external-pulse.basic", version: 1 }],
      phases: [
        { type: "model", activityIds: ["pulse-model"] },
        { type: "attempt", activityIds: ["pulse-guided"] },
        { type: "interpret", activityIds: ["pulse-feedback"] },
        { type: "fade", activityIds: ["pulse-fade"] },
        { type: "retrieve", activityIds: ["pulse-independent"] },
        { type: "exit", activityIds: ["pulse-exit"] },
        { type: "return", activityIds: ["pulse-review-registration"] }
      ],
      exitEvidenceRequirementIds: ["pulse-independent"],
      delayedReviewPolicyIds: ["pilot-spaced-review"],
      remediationRouteIds: ["pulse-slower-shorter", "pulse-change-tempo"],
      accessibilityEquivalentIds: ["pulse-multimodal-input"]
    },
    {
      id: "pilot-coordinates",
      version: 1,
      title: "Orient the first region",
      summary: "Use string and fret coordinates before attaching note names.",
      primaryObjectives: [{ id: "fretboard.coordinates.basic", version: 1 }],
      phases: [
        { type: "model", activityIds: ["coordinate-model"] },
        { type: "attempt", activityIds: ["coordinate-guided"] },
        { type: "fade", activityIds: ["coordinate-fade"] },
        { type: "retrieve", activityIds: ["coordinate-placement"] },
        { type: "exit", activityIds: ["coordinate-exit"] },
        { type: "return", activityIds: ["coordinate-next-action"] }
      ],
      exitEvidenceRequirementIds: ["coordinate-placement"],
      delayedReviewPolicyIds: [],
      remediationRouteIds: ["coordinate-orientation"],
      accessibilityEquivalentIds: ["coordinate-explicit-controls"]
    },
    {
      id: "pilot-natural-notes",
      version: 1,
      title: "Retrieve the first natural notes",
      summary: "Find E, F, G, A, B, and C in a small region, then return after a delay.",
      primaryObjectives: [{ id: "fretboard.natural-notes.region-1", version: 1 }],
      phases: [
        { type: "model", activityIds: ["note-landmarks"] },
        { type: "attempt", activityIds: ["note-guided"] },
        { type: "interpret", activityIds: ["note-feedback"] },
        { type: "adjust", activityIds: ["note-remediation"] },
        { type: "fade", activityIds: ["note-fade"] },
        { type: "retrieve", activityIds: ["note-exit"] },
        { type: "vary", activityIds: ["note-alternate-control"] },
        { type: "apply", activityIds: ["note-two-note-pattern"] },
        { type: "exit", activityIds: ["note-exit-summary"] },
        { type: "return", activityIds: ["note-review-registration"] }
      ],
      exitEvidenceRequirementIds: ["note-exit", "note-transfer"],
      delayedReviewPolicyIds: ["pilot-spaced-review"],
      remediationRouteIds: ["coordinate-orientation", "note-contrast-and-fade"],
      accessibilityEquivalentIds: [
        "note-explicit-coordinate-controls",
        "note-pattern-fret-controls"
      ]
    }
  ],
  exercises: [
    {
      id: "practice-plan",
      version: 1,
      objective: { id: "practice.focused-session", version: 1 },
      kind: "practice_plan",
      evaluatorId: "practice-plan-v1",
      responseContract: "specific target, selected duration, optional stop reason, next action",
      qualityDimensions: ["target_is_specific", "duration_is_selected", "next_action_is_named"],
      variationAxes: ["duration"],
      invalidationConditions: ["storage unavailable does not invalidate learner response"],
      supportFade: ["guided", "independent"],
      evidenceRequirementIds: ["focused-session-plan"]
    },
    {
      id: "pulse-tapping",
      version: 1,
      objective: { id: "rhythm.external-pulse.basic", version: 1 },
      kind: "pulse_tapping",
      evaluatorId: "pulse-timing-v1",
      responseContract: "ordered monotonic tap timestamps",
      qualityDimensions: ["minimum_samples", "median_offset", "timing_variability"],
      variationAxes: ["tempo", "pulse modality", "input modality"],
      invalidationConditions: ["document hidden", "clock discontinuity", "insufficient samples", "input cancelled"],
      supportFade: ["modeled", "guided", "independent"],
      evidenceRequirementIds: ["pulse-independent", "pulse-retained"]
    },
    {
      id: "coordinate-placement",
      version: 1,
      objective: { id: "fretboard.coordinates.basic", version: 1 },
      kind: "coordinate_selection",
      evaluatorId: "coordinate-v1",
      responseContract: "string number and fret number",
      qualityDimensions: ["correctness", "scope_coverage", "independence"],
      variationAxes: ["string", "fret", "response control"],
      invalidationConditions: ["input cancelled"],
      supportFade: ["modeled", "guided", "prompted", "independent"],
      evidenceRequirementIds: ["coordinate-placement"]
    },
    {
      id: "natural-note-retrieval",
      version: 1,
      objective: { id: "fretboard.natural-notes.region-1", version: 1 },
      kind: "note_retrieval",
      evaluatorId: "natural-note-coordinate-v1",
      responseContract: "prompted note and string answered with fret coordinate",
      qualityDimensions: ["correctness", "scope_coverage", "independence", "validity", "variation"],
      variationAxes: ["note", "string", "prompt order", "response control"],
      invalidationConditions: ["input cancelled", "prompt answer unavailable"],
      supportFade: ["modeled", "guided", "prompted", "independent"],
      evidenceRequirementIds: ["note-exit", "note-retained"]
    },
    {
      id: "natural-note-application",
      version: 1,
      objective: { id: "fretboard.natural-notes.region-1", version: 1 },
      kind: "note_application",
      evaluatorId: "natural-note-pattern-v1",
      responseContract: "ordered pair of fret locations on a prompted string",
      qualityDimensions: ["correctness", "scope_coverage", "independence", "validity", "variation"],
      variationAxes: ["ordered note pattern", "string", "physical playing context"],
      invalidationConditions: ["input cancelled", "prompt answer unavailable"],
      supportFade: ["modeled", "prompted", "independent"],
      evidenceRequirementIds: ["note-transfer"]
    }
  ],
  reviewPolicies: [
    {
      id: "pilot-spaced-review",
      version: 1,
      delaysMs: [DAY, 3 * DAY, 7 * DAY],
      dueWindowMs: DAY,
      maximumMixedSessionShare: 0.4
    }
  ],
  remediationRoutes: [
    {
      id: "shorter-sustainable-session",
      trigger: "learner chooses to reduce load or stop",
      instructionalChange: "save a specific next action and shorten the session without penalty",
      preservedCapability: "practice regulation",
      exitCondition: "learner identifies a workable next action"
    },
    {
      id: "pulse-slower-shorter",
      trigger: "timing is early, late, or unstable",
      instructionalChange: "use a slower pulse, count-in, and four-tap group before fading support",
      preservedCapability: "synchronization to an external pulse",
      exitCondition: "one stable supported group followed by a new independent task"
    },
    {
      id: "pulse-change-tempo",
      trigger: "delayed pulse review repeats the original tempo",
      instructionalChange: "select a different authored tempo before independent retrieval",
      preservedCapability: "synchronization to an external pulse",
      exitCondition: "valid independent pulse task at a changed tempo"
    },
    {
      id: "coordinate-orientation",
      trigger: "wrong string or repeated coordinate confusion",
      instructionalChange: "revisit string numbering and contrast two coordinates",
      preservedCapability: "fretboard coordinate retrieval",
      exitCondition: "correct response to a new coordinate without a cue"
    },
    {
      id: "note-contrast-and-fade",
      trigger: "repeated note relationship error or support dependency",
      instructionalChange: "show one relationship, contrast it with a neighbor, then remove the cue",
      preservedCapability: "natural-note location retrieval",
      exitCondition: "correct response to a different unsupported prompt"
    }
  ],
  accessibilityEquivalents: [
    {
      id: "practice-plan-semantic-form",
      exerciseId: "practice-plan",
      alternateModality: "semantic form controls",
      unchangedCapability: "select a target, duration, and next action",
      responseContract: "same practice-plan fields",
      evaluatorId: "practice-plan-v1",
      evidenceCeiling: "supported_performance"
    },
    {
      id: "pulse-multimodal-input",
      exerciseId: "pulse-tapping",
      alternateModality: "keyboard, pointer, or accessible button with optional sound",
      unchangedCapability: "align repeated action to an external pulse",
      responseContract: "ordered monotonic tap timestamps",
      evaluatorId: "pulse-timing-v1",
      evidenceCeiling: "retained_performance"
    },
    {
      id: "coordinate-explicit-controls",
      exerciseId: "coordinate-placement",
      alternateModality: "explicit string and fret selectors",
      unchangedCapability: "identify the requested fretboard coordinate",
      responseContract: "string number and fret number",
      evaluatorId: "coordinate-v1",
      evidenceCeiling: "independent_performance"
    },
    {
      id: "note-explicit-coordinate-controls",
      exerciseId: "natural-note-retrieval",
      alternateModality: "explicit string and fret selectors",
      unchangedCapability: "retrieve a natural-note location on the requested string",
      responseContract: "prompted string plus selected fret coordinate",
      evaluatorId: "natural-note-coordinate-v1",
      evidenceCeiling: "retained_performance"
    },
    {
      id: "note-pattern-fret-controls",
      exerciseId: "natural-note-application",
      alternateModality: "ordered labeled fret controls",
      unchangedCapability: "retrieve two natural-note locations as a playable pattern",
      responseContract: "ordered pair of fret locations on a prompted string",
      evaluatorId: "natural-note-pattern-v1",
      evidenceCeiling: "transfer"
    }
  ]
} satisfies EducationContent;
