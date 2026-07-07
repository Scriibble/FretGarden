export interface DrillAttempt {
  isCorrect: boolean;
}

export interface DrillSummary {
  attempted: number;
  correct: number;
  missed: number;
  accuracy: number;
  isComplete: boolean;
}

export interface DrillSession<MissedPrompt> {
  id: string;
  completedAt: string;
  promptCount: number;
  correct: number;
  missed: number;
  accuracy: number;
  missedPrompts: MissedPrompt[];
}

export interface BuildDrillSessionOptions<Attempt extends DrillAttempt, MissedPrompt> {
  attempts: Attempt[];
  completedAt?: string;
  idPrefix: string;
  missedPrompts: MissedPrompt[];
  promptCount: number;
}

export function summarizeDrill<Attempt extends DrillAttempt>(
  attempts: Attempt[],
  promptCount: number
): DrillSummary {
  const correct = attempts.filter((attempt) => attempt.isCorrect).length;
  const attempted = attempts.length;

  return {
    attempted,
    correct,
    missed: attempted - correct,
    accuracy: attempted === 0 ? 0 : Math.round((correct / attempted) * 100),
    isComplete: attempted >= promptCount
  };
}

export function buildDrillSession<
  Attempt extends DrillAttempt,
  MissedPrompt
>({
  attempts,
  completedAt = new Date().toISOString(),
  idPrefix,
  missedPrompts,
  promptCount
}: BuildDrillSessionOptions<Attempt, MissedPrompt>): DrillSession<MissedPrompt> {
  const summary = summarizeDrill(attempts, promptCount);

  return {
    id: `${idPrefix}-${completedAt}`,
    completedAt,
    promptCount,
    correct: summary.correct,
    missed: summary.missed,
    accuracy: summary.accuracy,
    missedPrompts
  };
}

export function appendDrillSession<Session>(
  history: Session[],
  session: Session,
  limit: number
): Session[] {
  return [session, ...history].slice(0, limit);
}

export function getCurrentDrillPrompt<Prompt>(
  promptIndex: number,
  prompts: readonly Prompt[]
): Prompt {
  return prompts[promptIndex % prompts.length] as Prompt;
}
