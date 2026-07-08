import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  readStoredPreset,
  readStoredSessionHistory,
  writeStoredPreset,
  writeStoredSessionHistory
} from "./browserStorage";

interface TestSession {
  id: string;
  completedAt: string;
  promptCount: number;
  correct: number;
  missed: number;
  accuracy: number;
  missedPrompts: unknown[];
}

interface TestPreset {
  id: string;
  label: string;
  settings: Record<string, unknown>;
}

describe("browserStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: new MemoryStorage()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads valid versioned and legacy session history", () => {
    const firstSession = buildSession("first");
    const secondSession = buildSession("second");

    window.localStorage.setItem(
      "history",
      JSON.stringify({
        version: 1,
        sessions: [firstSession, secondSession]
      })
    );

    expect(readStoredSessionHistory<TestSession>("history", 1)).toEqual([
      firstSession
    ]);

    window.localStorage.setItem("history", JSON.stringify([secondSession]));

    expect(readStoredSessionHistory<TestSession>("history", 5)).toEqual([
      secondSession
    ]);
  });

  it("filters malformed session history records", () => {
    const validSession = buildSession("valid");

    window.localStorage.setItem(
      "history",
      JSON.stringify([
        validSession,
        {
          id: "invalid",
          accuracy: 100
        }
      ])
    );

    expect(readStoredSessionHistory<TestSession>("history", 5)).toEqual([
      validSession
    ]);

    window.localStorage.setItem(
      "history",
      JSON.stringify({
        version: 1,
        sessions: [{ id: "missing-fields" }]
      })
    );

    expect(readStoredSessionHistory<TestSession>("history", 5)).toEqual([]);
    window.localStorage.setItem("history", "{not-json");
    expect(readStoredSessionHistory<TestSession>("history", 5)).toEqual([]);
  });

  it("reads valid versioned and legacy custom presets", () => {
    const preset = {
      id: "custom",
      label: "Custom",
      settings: {
        promptCount: 10
      }
    } satisfies TestPreset;

    window.localStorage.setItem(
      "preset",
      JSON.stringify({
        version: 1,
        preset
      })
    );

    expect(readStoredPreset<TestPreset>("preset")).toEqual(preset);

    window.localStorage.setItem("preset", JSON.stringify(preset));

    expect(readStoredPreset<TestPreset>("preset")).toEqual(preset);
  });

  it("ignores malformed custom presets", () => {
    window.localStorage.setItem(
      "preset",
      JSON.stringify({
        id: "missing-settings",
        label: "Missing settings"
      })
    );

    expect(readStoredPreset<TestPreset>("preset")).toBeNull();

    window.localStorage.setItem("preset", "{not-json");
    expect(readStoredPreset<TestPreset>("preset")).toBeNull();
  });

  it("writes versioned session histories and presets", () => {
    const session = buildSession("written");
    const preset = {
      id: "written",
      label: "Written",
      settings: {}
    } satisfies TestPreset;

    writeStoredSessionHistory("history", [session]);
    writeStoredPreset("preset", preset);

    expect(JSON.parse(window.localStorage.getItem("history") ?? "")).toEqual({
      version: 1,
      sessions: [session]
    });
    expect(JSON.parse(window.localStorage.getItem("preset") ?? "")).toEqual({
      version: 1,
      preset
    });
  });
});

function buildSession(id: string): TestSession {
  return {
    id,
    completedAt: "2026-07-08T12:00:00.000Z",
    promptCount: 10,
    correct: 8,
    missed: 2,
    accuracy: 80,
    missedPrompts: []
  };
}

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
