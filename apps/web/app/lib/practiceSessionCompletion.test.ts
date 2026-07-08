import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { completePracticeSession } from "./practiceSessionCompletion";

interface TestAttempt {
  isCorrect: boolean;
}

interface TestSession {
  id: string;
  attempts: TestAttempt[];
}

describe("practiceSessionCompletion", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      localStorage: new MemoryStorage()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds, stores, and reports a completed practice session", () => {
    const attempts = [{ isCorrect: true }];
    const completedSessions: TestSession[] = [];
    let history: TestSession[] = [];
    const completedCallback = vi.fn();

    const session = completePracticeSession({
      appendSession: (previousHistory, nextSession) => [
        nextSession,
        ...previousHistory
      ],
      attempts,
      buildSession: (sessionAttempts) => ({
        id: "session-1",
        attempts: sessionAttempts
      }),
      completedSession: null,
      isComplete: true,
      onComplete: completedCallback,
      promptCount: 1,
      setCompletedSession: (nextSession) => {
        completedSessions.push(nextSession);
      },
      setSessionHistory: (updater) => {
        history = updater(history);
      },
      storageKey: "history"
    });

    expect(session).toEqual({
      id: "session-1",
      attempts
    });
    expect(completedSessions).toEqual([session]);
    expect(history).toEqual([session]);
    expect(completedCallback).toHaveBeenCalledWith(session);
    expect(JSON.parse(window.localStorage.getItem("history") ?? "")).toEqual({
      version: 1,
      sessions: [session]
    });
  });

  it("does nothing when a drill is incomplete or already recorded", () => {
    const callbacks = {
      appendSession: vi.fn(),
      buildSession: vi.fn(),
      onComplete: vi.fn(),
      setCompletedSession: vi.fn(),
      setSessionHistory: vi.fn()
    };

    expect(
      completePracticeSession({
        appendSession: callbacks.appendSession,
        attempts: [],
        buildSession: callbacks.buildSession,
        completedSession: null,
        isComplete: false,
        onComplete: callbacks.onComplete,
        promptCount: 1,
        setCompletedSession: callbacks.setCompletedSession,
        setSessionHistory: callbacks.setSessionHistory,
        storageKey: "history"
      })
    ).toBeNull();
    expect(
      completePracticeSession({
        appendSession: callbacks.appendSession,
        attempts: [],
        buildSession: callbacks.buildSession,
        completedSession: {
          id: "existing",
          attempts: []
        },
        isComplete: true,
        onComplete: callbacks.onComplete,
        promptCount: 1,
        setCompletedSession: callbacks.setCompletedSession,
        setSessionHistory: callbacks.setSessionHistory,
        storageKey: "history"
      })
    ).toBeNull();
    expect(callbacks.buildSession).not.toHaveBeenCalled();
    expect(callbacks.setCompletedSession).not.toHaveBeenCalled();
    expect(callbacks.setSessionHistory).not.toHaveBeenCalled();
    expect(callbacks.onComplete).not.toHaveBeenCalled();
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
