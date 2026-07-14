import { describe, expect, it } from "vitest";
import {
  EDUCATION_PILOT_STORAGE_KEY,
  EDUCATION_PILOT_RECOVERY_KEY,
  appendPilotEvaluation,
  createEmptyPilotStore,
  discardEducationPilotRecovery,
  readEducationPilotStore,
  readEducationPilotRecovery,
  upsertPilotSession,
  writeEducationPilotStore
} from "./educationPilotStorage";
import { evaluatePracticePlan } from "../pilotRuntime";

const now = "2026-07-13T12:00:00.000Z";

describe("education pilot storage", () => {
  it("uses an isolated versioned namespace", () => {
    const storage = new MemoryStorage();
    storage.setItem("pocket-practice:lesson-progress", "legacy-progress");
    const empty = createEmptyPilotStore(now);
    expect(writeEducationPilotStore(storage, empty)).toBe(true);
    expect(storage.getItem(EDUCATION_PILOT_STORAGE_KEY)).not.toBeNull();
    expect(storage.getItem("pocket-practice:lesson-progress")).toBe("legacy-progress");
  });

  it("round trips append-only attempts and evidence", () => {
    const storage = new MemoryStorage();
    const evaluation = evaluatePracticePlan({
      sessionId: "session-1",
      now,
      response: {
        target: "Find F notes",
        durationMinutes: 5,
        nextAction: "Review F tomorrow",
        reducedLoad: false
      }
    });
    const store = appendPilotEvaluation(createEmptyPilotStore(now), evaluation, now);
    writeEducationPilotStore(storage, store);
    const restored = readEducationPilotStore(storage, now);
    expect(restored.attempts).toHaveLength(1);
    expect(restored.evidence).toHaveLength(1);
  });

  it("does not duplicate records when an event is replayed", () => {
    const evaluation = evaluatePracticePlan({
      sessionId: "session-1",
      now,
      response: {
        target: "Find F notes",
        durationMinutes: 5,
        nextAction: "Review F tomorrow",
        reducedLoad: false
      }
    });
    const once = appendPilotEvaluation(createEmptyPilotStore(now), evaluation, now);
    const twice = appendPilotEvaluation(once, evaluation, now);
    expect(twice.attempts).toHaveLength(1);
    expect(twice.evidence).toHaveLength(1);
  });

  it("keeps one current session record while preserving event history", () => {
    const store = upsertPilotSession(createEmptyPilotStore(now), {
      id: "session-1",
      startedAt: now,
      updatedAt: now,
      target: "Natural notes",
      durationMinutes: 5,
      nextAction: "Start coordinates",
      state: "active"
    });
    const updated = upsertPilotSession(store, {
      ...store.sessions[0]!,
      updatedAt: "2026-07-13T12:05:00.000Z",
      state: "ended"
    });
    expect(updated.sessions).toHaveLength(1);
    expect(updated.sessions[0]?.state).toBe("ended");
  });

  it("recovers safely from malformed or unknown data", () => {
    const storage = new MemoryStorage();
    storage.setItem(EDUCATION_PILOT_STORAGE_KEY, "{bad-json");
    expect(readEducationPilotStore(storage, now).attempts).toEqual([]);
    expect(readEducationPilotRecovery(storage)).toEqual({
      capturedAt: now,
      reason: "invalid_json",
      raw: "{bad-json"
    });
    storage.setItem(EDUCATION_PILOT_STORAGE_KEY, JSON.stringify({ schemaVersion: 99 }));
    expect(readEducationPilotStore(storage, now).schemaVersion).toBe(1);
    expect(storage.getItem(EDUCATION_PILOT_RECOVERY_KEY)).toContain("{bad-json");
    discardEducationPilotRecovery(storage);
    expect(readEducationPilotRecovery(storage)).toBeNull();
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
