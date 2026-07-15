export type FocusTimerPhase = "work" | "rest";

export interface FocusTimerState {
  phase: FocusTimerPhase;
  remainingSeconds: number;
  running: boolean;
  completedWorkCycles: number;
}

export interface FocusTimerDurations {
  workSeconds: number;
  restSeconds: number;
}

export function createFocusTimerState(
  durations: FocusTimerDurations
): FocusTimerState {
  return {
    phase: "work",
    remainingSeconds: normalizeDuration(durations.workSeconds),
    running: false,
    completedWorkCycles: 0
  };
}

export function advanceFocusTimer(
  state: FocusTimerState,
  durations: FocusTimerDurations,
  elapsedSeconds = 1
): FocusTimerState {
  if (!state.running || elapsedSeconds <= 0) return state;

  let next = { ...state };
  let remainingElapsed = Math.floor(elapsedSeconds);

  while (remainingElapsed > 0) {
    if (remainingElapsed < next.remainingSeconds) {
      next.remainingSeconds -= remainingElapsed;
      break;
    }

    remainingElapsed -= next.remainingSeconds;
    if (next.phase === "work") {
      next = {
        ...next,
        phase: "rest",
        remainingSeconds: normalizeDuration(durations.restSeconds),
        completedWorkCycles: next.completedWorkCycles + 1
      };
    } else {
      next = {
        ...next,
        phase: "work",
        remainingSeconds: normalizeDuration(durations.workSeconds)
      };
    }
  }

  return next;
}

export function resetFocusTimer(
  state: FocusTimerState,
  durations: FocusTimerDurations
): FocusTimerState {
  return {
    ...createFocusTimerState(durations),
    completedWorkCycles: state.completedWorkCycles
  };
}

export function formatTimerSeconds(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function normalizeDuration(value: number): number {
  return Math.max(1, Math.floor(value));
}
