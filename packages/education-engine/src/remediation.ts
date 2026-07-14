import type {
  ObservableError,
  RemediationDecision,
  SupportLevel
} from "./contracts";

export function selectRemediation(errors: ObservableError[]): RemediationDecision {
  if (errors.includes("task_invalid")) {
    return decision(
      "retry_equivalent_input",
      "independent",
      "The task or input was invalid, so it was not counted.",
      "Retry or choose the equivalent input control."
    );
  }

  if (errors.includes("timing_unstable") || errors.includes("timing_early") || errors.includes("timing_late")) {
    return decision(
      "slower_shorter_pulse",
      "guided",
      "Tap spacing was not yet stable under the current pulse conditions.",
      "Try four taps at a slower pulse with a count-in."
    );
  }

  if (errors.includes("context_not_varied")) {
    return decision(
      "vary_context_then_retrieve",
      "independent",
      "The review repeated the original context, so it cannot establish changed-context retrieval.",
      "Choose a different tempo, then complete a new independent pulse task."
    );
  }

  if (errors.includes("coordinate_confusion")) {
    return decision(
      "coordinate_orientation",
      "guided",
      "The selected string or fret suggests a coordinate mix-up.",
      "Revisit string numbering, then try a short coordinate contrast."
    );
  }

  const incorrectCount = errors.filter((error) => error === "incorrect_response").length;
  if (incorrectCount >= 2) {
    return decision(
      "remodel_then_novel_retrieval",
      "guided",
      "The same relationship was missed more than once.",
      "Review the relationship once, then retrieve it from a different prompt."
    );
  }

  if (errors.includes("support_dependency")) {
    return decision(
      "contrast_and_fade",
      "prompted",
      "Current success still depends on a cue.",
      "Use a two-choice contrast, then remove the cue for a new prompt."
    );
  }

  if (incorrectCount === 1 || errors.includes("omission")) {
    return decision(
      "remodel_then_novel_retrieval",
      "prompted",
      "This response needs a correction before unsupported retrieval.",
      "Check the relationship, then answer a different prompt without the cue."
    );
  }

  return decision(
    "independent_retrieval",
    "independent",
    "No remediation trigger is present.",
    "Continue with a varied independent prompt."
  );
}

function decision(
  route: RemediationDecision["route"],
  supportLevel: SupportLevel,
  reason: string,
  nextAction: string
): RemediationDecision {
  return { route, supportLevel, reason, nextAction };
}
