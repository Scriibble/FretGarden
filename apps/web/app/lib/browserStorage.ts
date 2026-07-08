const STORAGE_VERSION = 1;

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
      return parsedHistory.slice(0, limit) as Session[];
    }

    if (
      isVersionedStorageRecord(parsedHistory) &&
      Array.isArray(parsedHistory.sessions)
    ) {
      return parsedHistory.sessions.slice(0, limit) as Session[];
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

    if (
      isVersionedStorageRecord(parsedPreset) &&
      "preset" in parsedPreset &&
      parsedPreset.preset !== null &&
      typeof parsedPreset.preset === "object"
    ) {
      return parsedPreset.preset as Preset;
    }

    return typeof parsedPreset === "object" && parsedPreset !== null
      ? (parsedPreset as Preset)
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

function isVersionedStorageRecord(
  value: unknown
): value is Record<string, unknown> & { version: number } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as { version?: unknown };

  return typeof candidate.version === "number";
}
