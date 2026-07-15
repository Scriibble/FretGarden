export type MetronomeSubdivision =
  | "quarter"
  | "eighth"
  | "sixteenth"
  | "triplet";

export interface MetronomeSettings {
  bpm: number;
  subdivision: MetronomeSubdivision;
  countInMeasures: 0 | 1 | 2;
  accentBeatOne: boolean;
}

export interface MetronomeTick {
  phase: "count-in" | "playing";
  measure: number;
  beat: number;
  subdivisionIndex: number;
  accent: boolean;
  audible: boolean;
  label: string;
}

const subdivisionCounts: Record<MetronomeSubdivision, number> = {
  quarter: 1,
  eighth: 2,
  sixteenth: 4,
  triplet: 3
};

export function getMetronomeIntervalMs(
  bpm: number,
  subdivision: MetronomeSubdivision
): number {
  const safeBpm = clampBpm(bpm);
  return 60_000 / safeBpm / subdivisionCounts[subdivision];
}

export function getMetronomeTick(
  tickIndex: number,
  settings: MetronomeSettings
): MetronomeTick {
  const stepsPerBeat = subdivisionCounts[settings.subdivision];
  const stepsPerMeasure = stepsPerBeat * 4;
  const countInSteps = settings.countInMeasures * stepsPerMeasure;
  const isCountIn = tickIndex < countInSteps;
  const phaseTick = isCountIn ? tickIndex : tickIndex - countInSteps;
  const measure = Math.floor(phaseTick / stepsPerMeasure) + 1;
  const withinMeasure = phaseTick % stepsPerMeasure;
  const beat = Math.floor(withinMeasure / stepsPerBeat) + 1;
  const subdivisionIndex = withinMeasure % stepsPerBeat;
  const beatStart = subdivisionIndex === 0;
  const accent = settings.accentBeatOne && beat === 1 && beatStart;

  return {
    phase: isCountIn ? "count-in" : "playing",
    measure,
    beat,
    subdivisionIndex,
    accent,
    audible: beatStart || !isCountIn,
    label: isCountIn ? `Count in: ${beat}` : `Measure ${measure}, beat ${beat}`
  };
}

export function adjustMetronomeBpm(bpm: number, delta: number): number {
  return clampBpm(bpm + delta);
}

export function getSubdivisionCount(
  subdivision: MetronomeSubdivision
): number {
  return subdivisionCounts[subdivision];
}

function clampBpm(bpm: number): number {
  return Math.min(240, Math.max(30, Math.round(bpm)));
}
