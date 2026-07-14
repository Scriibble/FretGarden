import { describe, expect, it } from "vitest";
import {
  adjustMetronomeBpm,
  getMetronomeIntervalMs,
  getMetronomeTick,
  getSubdivisionCount,
  type MetronomeSettings
} from "./metronome";

const settings: MetronomeSettings = {
  bpm: 60,
  subdivision: "quarter",
  countInMeasures: 1,
  accentBeatOne: true
};

describe("metronome timing", () => {
  it("calculates subdivision intervals from one quarter-note BPM", () => {
    expect(getMetronomeIntervalMs(60, "quarter")).toBe(1000);
    expect(getMetronomeIntervalMs(60, "eighth")).toBe(500);
    expect(getMetronomeIntervalMs(60, "sixteenth")).toBe(250);
    expect(getMetronomeIntervalMs(60, "triplet")).toBeCloseTo(1000 / 3);
  });

  it("uses the configured count-in before the playing measure", () => {
    expect(getMetronomeTick(0, settings)).toMatchObject({
      phase: "count-in",
      beat: 1,
      accent: true
    });
    expect(getMetronomeTick(3, settings)).toMatchObject({
      phase: "count-in",
      beat: 4
    });
    expect(getMetronomeTick(4, settings)).toMatchObject({
      phase: "playing",
      measure: 1,
      beat: 1,
      accent: true
    });
  });

  it("keeps beat and subdivision positions aligned", () => {
    const eighths = { ...settings, subdivision: "eighth" as const };
    expect(getMetronomeTick(9, eighths)).toMatchObject({
      phase: "playing",
      beat: 1,
      subdivisionIndex: 1,
      accent: false
    });
    expect(getMetronomeTick(10, eighths)).toMatchObject({
      beat: 2,
      subdivisionIndex: 0
    });
  });

  it("supports one and two measure count-ins for every subdivision", () => {
    expect(getSubdivisionCount("triplet")).toBe(3);
    const twoMeasures = {
      ...settings,
      subdivision: "triplet" as const,
      countInMeasures: 2 as const
    };
    expect(getMetronomeTick(23, twoMeasures).phase).toBe("count-in");
    expect(getMetronomeTick(24, twoMeasures)).toMatchObject({
      phase: "playing",
      measure: 1,
      beat: 1
    });
  });

  it("clamps tempo controls to the supported range", () => {
    expect(adjustMetronomeBpm(30, -5)).toBe(30);
    expect(adjustMetronomeBpm(240, 5)).toBe(240);
    expect(adjustMetronomeBpm(60, 5)).toBe(65);
  });
});
