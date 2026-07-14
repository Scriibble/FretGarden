import {
  EDUCATION_PILOT_RECOVERY_KEY,
  EDUCATION_PILOT_STORAGE_KEY
} from "../storage/educationPilotStorage";
import { FRETBOARD_MAP_MIGRATION_STORAGE_KEYS } from "./fretboardMapLegacyMapping";

export interface FretboardMapMigrationInputs {
  learningProgressRaw: string | null;
  lessonProgressRaw: string | null;
  noteHistoryRaw: string | null;
  educationPilotRaw: string | null;
  educationPilotRecoveryRaw: string | null;
}

export function readFretboardMapMigrationInputs(
  storage: Pick<Storage, "getItem">
): FretboardMapMigrationInputs {
  return {
    learningProgressRaw: storage.getItem(
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.learning
    ),
    lessonProgressRaw: storage.getItem(
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.practice
    ),
    noteHistoryRaw: storage.getItem(
      FRETBOARD_MAP_MIGRATION_STORAGE_KEYS.noteHistory
    ),
    educationPilotRaw: storage.getItem(EDUCATION_PILOT_STORAGE_KEY),
    educationPilotRecoveryRaw: storage.getItem(EDUCATION_PILOT_RECOVERY_KEY)
  };
}

export function fretboardMapMigrationInputsEqual(
  left: FretboardMapMigrationInputs,
  right: FretboardMapMigrationInputs
): boolean {
  return Object.keys(left).every(
    (key) =>
      left[key as keyof FretboardMapMigrationInputs] ===
      right[key as keyof FretboardMapMigrationInputs]
  );
}
