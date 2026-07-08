import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LESSON_PROGRESS_STORAGE_KEY } from "./lessonProgress";
import {
  NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY,
  NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
  readStoredPracticeData
} from "./practiceStorage";

describe("practiceStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: new MemoryStorage()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads the stored practice snapshot for histories, presets, and lesson progress", () => {
    const noteSession = {
      id: "note-session",
      completedAt: "2026-07-08T12:00:00.000Z",
      promptCount: 10,
      correct: 10,
      missed: 0,
      accuracy: 100,
      missedPrompts: []
    };
    const notePreset = {
      id: "custom-note",
      label: "Custom note",
      settings: {
        promptCount: 10
      }
    };
    const lessonProgress = {
      slug: "fretboard-map",
      drill: "note",
      status: "complete",
      startedAt: "2026-07-08T12:00:00.000Z"
    };

    window.localStorage.setItem(
      NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        sessions: [noteSession]
      })
    );
    window.localStorage.setItem(
      NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        preset: notePreset
      })
    );
    window.localStorage.setItem(
      LESSON_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        progress: [lessonProgress]
      })
    );

    expect(readStoredPracticeData()).toEqual({
      lessonProgressRecords: [lessonProgress],
      noteSessionHistory: [noteSession],
      chordSessionHistory: [],
      scaleDegreeSessionHistory: [],
      intervalSessionHistory: [],
      octaveSessionHistory: [],
      triadInversionSessionHistory: [],
      customNotePreset: notePreset,
      customChordPreset: null,
      customScaleDegreePreset: null,
      customIntervalPreset: null,
      customOctavePreset: null,
      customTriadInversionPreset: null
    });
  });
});

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
