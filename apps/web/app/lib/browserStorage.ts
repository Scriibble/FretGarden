import { z } from "zod";
import {
  LESSON_PROGRESS_STORAGE_KEY,
  parseLessonProgress,
  serializeLessonProgress,
  type LessonProgressRecord
} from "./lessonProgress";

const STORAGE_VERSION = 1;
const storedSessionSchema = z
  .object({
    id: z.string(),
    completedAt: z.string(),
    promptCount: z.number(),
    correct: z.number(),
    missed: z.number(),
    accuracy: z.number(),
    missedPrompts: z.array(z.unknown())
  })
  .passthrough();
const sessionHistoryEnvelopeSchema = z
  .object({
    version: z.number(),
    sessions: z.array(storedSessionSchema)
  })
  .passthrough();
const storedPresetSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    settings: z.record(z.unknown())
  })
  .passthrough();
const presetEnvelopeSchema = z
  .object({
    version: z.number(),
    preset: storedPresetSchema
  })
  .passthrough();

export function readStoredSessionHistory<Session>(
  storageKey: string,
  limit: number
): Session[] {
  try {
    const storedHistory = window.localStorage.getItem(storageKey);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory) as unknown;

    if (Array.isArray(parsedHistory)) {
      return parsedHistory
        .flatMap((session) => {
          const parsedSession = storedSessionSchema.safeParse(session);

          return parsedSession.success ? [parsedSession.data as Session] : [];
        })
        .slice(0, limit);
    }

    const parsedEnvelope = sessionHistoryEnvelopeSchema.safeParse(parsedHistory);

    if (parsedEnvelope.success) {
      return parsedEnvelope.data.sessions.slice(0, limit) as Session[];
    }

    return [];
  } catch {
    return [];
  }
}

export function writeStoredSessionHistory<Session>(
  storageKey: string,
  history: Session[]
): void {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        sessions: history
      })
    );
  } catch {
    // Local progress is a convenience; the drill should keep working if storage is unavailable.
  }
}

export function readStoredPreset<Preset>(storageKey: string): Preset | null {
  try {
    const storedPreset = window.localStorage.getItem(storageKey);

    if (!storedPreset) {
      return null;
    }

    const parsedPreset = JSON.parse(storedPreset) as unknown;
    const parsedEnvelope = presetEnvelopeSchema.safeParse(parsedPreset);

    if (parsedEnvelope.success) {
      return parsedEnvelope.data.preset as Preset;
    }

    const parsedLegacyPreset = storedPresetSchema.safeParse(parsedPreset);

    return parsedLegacyPreset.success
      ? (parsedLegacyPreset.data as Preset)
      : null;
  } catch {
    return null;
  }
}

export function writeStoredPreset<Preset>(
  storageKey: string,
  preset: Preset
): void {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: STORAGE_VERSION,
        preset
      })
    );
  } catch {
    // Custom presets are a convenience; the drill should still work without storage.
  }
}

export function readStoredLessonProgress(): LessonProgressRecord[] {
  return parseLessonProgress(
    window.localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY)
  );
}

export function writeStoredLessonProgress(
  progress: readonly LessonProgressRecord[]
): void {
  try {
    window.localStorage.setItem(
      LESSON_PROGRESS_STORAGE_KEY,
      serializeLessonProgress(progress)
    );
  } catch {
    // Lesson progress is a convenience; practice should keep working if storage is unavailable.
  }
}
