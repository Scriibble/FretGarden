import { describe, expect, it, vi } from "vitest";
import {
  EDUCATION_PILOT_RECOVERY_KEY,
  EDUCATION_PILOT_STORAGE_KEY
} from "../storage/educationPilotStorage";
import { FRETBOARD_MAP_MIGRATION_STORAGE_KEYS } from "./fretboardMapLegacyMapping";
import { readFretboardMapMigrationInputs } from "./readFretboardMapMigrationInputs";

describe("fretboard-map migration input reader", () => {
  it("reads exactly the five approved keys without requiring a writer", () => {
    const getItem = vi.fn((key: string) => `raw:${key}`);
    const result = readFretboardMapMigrationInputs({ getItem });

    expect(getItem.mock.calls.map(([key]) => key)).toEqual([
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.learning,
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.practice,
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.noteHistory,
      EDUCATION_PILOT_STORAGE_KEY,
      EDUCATION_PILOT_RECOVERY_KEY
    ]);
    expect(result.educationPilotRaw).toBe(`raw:${EDUCATION_PILOT_STORAGE_KEY}`);
  });
});
