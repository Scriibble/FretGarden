import { describe, expect, it } from "vitest";
import {
  advanceFocusTimer,
  createFocusTimerState,
  formatTimerSeconds,
  resetFocusTimer
} from "./focusTimer";

const durations = { workSeconds: 10, restSeconds: 5 };

describe("focus timer", () => {
  it("advances only while running", () => {
    const state = createFocusTimerState(durations);
    expect(advanceFocusTimer(state, durations, 3)).toBe(state);
    expect(
      advanceFocusTimer({ ...state, running: true }, durations, 3).remainingSeconds
    ).toBe(7);
  });

  it("moves from work to rest and records the completed work cycle", () => {
    const next = advanceFocusTimer(
      { ...createFocusTimerState(durations), running: true },
      durations,
      10
    );
    expect(next).toMatchObject({
      phase: "rest",
      remainingSeconds: 5,
      completedWorkCycles: 1
    });
  });

  it("handles elapsed time across multiple phase boundaries", () => {
    const next = advanceFocusTimer(
      { ...createFocusTimerState(durations), running: true },
      durations,
      17
    );
    expect(next).toMatchObject({
      phase: "work",
      remainingSeconds: 8,
      completedWorkCycles: 1
    });
  });

  it("resets the active cycle without erasing completed cycles", () => {
    expect(
      resetFocusTimer(
        {
          phase: "rest",
          remainingSeconds: 2,
          running: true,
          completedWorkCycles: 3
        },
        durations
      )
    ).toEqual({
      phase: "work",
      remainingSeconds: 10,
      running: false,
      completedWorkCycles: 3
    });
  });

  it("formats a stable timer display", () => {
    expect(formatTimerSeconds(0)).toBe("00:00");
    expect(formatTimerSeconds(65)).toBe("01:05");
  });
});
