import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const ROUTE = "/education-migration/fretboard-map";
const LEARNING_KEY = "pocket-practice:lesson-learning-progress";
const PRACTICE_KEY = "pocket-practice:lesson-progress";
const NOTE_HISTORY_KEY = "pocket-practice:note-recognition-history";
const PILOT_KEY = "pocket-practice:education-pilot:v1";
const RECOVERY_KEY = "pocket-practice:education-pilot:recovery:v1";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("empty sources produce a neutral report without writes", async ({ page }) => {
  const before = await storageSnapshot(page);
  await page.goto(ROUTE);

  await expect(
    page.getByRole("heading", { name: "Fretboard map parallel report" })
  ).toBeVisible();
  await expect(page.getByText("No attributable fretboard-map history was found.")).toBeVisible();
  await expect(page.getByText("No current evidence was observed.")).toBeVisible();
  await expect(page.getByText("Unchanged", { exact: true })).toBeVisible();
  expect(await storageSnapshot(page)).toEqual(before);
});

test("legacy completion stays historical beside current evidence states", async ({
  page
}) => {
  await seedCompleteLegacy(page);
  await seedPilot(page, [
    evidence("independent", "independent_performance", "2026-07-14T09:00:00.000Z"),
    evidence("retained", "retained_performance", "2026-07-14T10:00:00.000Z"),
    evidence("transfer", "transfer", "2026-07-14T11:00:00.000Z")
  ]);
  await page.goto(ROUTE);

  const legacy = page.getByRole("region", {
    name: "Legacy lesson and practice history"
  });
  const current = page.getByRole("region", {
    name: "Capability claims and review state"
  });
  await expect(
    legacy.getByText("Lesson status").locator("..").getByText("complete", { exact: true })
  ).toBeVisible();
  await expect(
    legacy.getByText("Practice status").locator("..").getByText("complete", { exact: true })
  ).toBeVisible();
  await expect(legacy.getByText("not independent, retained, or transfer evidence", { exact: false })).toBeVisible();
  await expect(current.getByRole("heading", { name: "applied" })).toBeVisible();
  await expect(current.getByText("independent performance")).toBeVisible();
  await expect(current.getByText("retained performance")).toBeVisible();
  await expect(current.getByText("transfer", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Legacy history and current evidence are both present")).toBeVisible();
});

test("malformed sources remain byte-for-byte unchanged on repeated loads", async ({
  page
}) => {
  await page.evaluate(
    ({ learningKey, practiceKey, noteKey, pilotKey, recoveryKey }) => {
      window.localStorage.setItem(learningKey, "{malformed-learning");
      window.localStorage.setItem(practiceKey, JSON.stringify({ unsupported: [] }));
      window.localStorage.setItem(noteKey, "{malformed-note-history");
      window.localStorage.setItem(pilotKey, "{malformed-pilot");
      window.localStorage.setItem(recoveryKey, "existing-recovery-byte-string");
    },
    {
      learningKey: LEARNING_KEY,
      practiceKey: PRACTICE_KEY,
      noteKey: NOTE_HISTORY_KEY,
      pilotKey: PILOT_KEY,
      recoveryKey: RECOVERY_KEY
    }
  );
  const before = await storageSnapshot(page);

  await page.goto(ROUTE);
  await expect(page.getByText("invalid json", { exact: true })).toBeVisible();
  await expect(page.getByText("malformed envelope", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("Unchanged", { exact: true })).toBeVisible();

  expect(await storageSnapshot(page)).toEqual(before);
});

test("repeated reports are idempotent and legacy lesson routing is unchanged", async ({
  page
}) => {
  await seedCompleteLegacy(page);
  const before = await storageSnapshot(page);
  await page.goto(ROUTE);
  await page.reload();
  expect(await storageSnapshot(page)).toEqual(before);

  await page.goto("/lessons/fretboard-map");
  await page.getByRole("link", { name: "Practice again" }).click();
  await expect(page).toHaveURL(/\/practice/);
  await expect(page).toHaveURL(/drill=note/);
  await expect(page).toHaveURL(/lesson=fretboard-map/);
  await expect(page.getByText("Find D on the A string")).toBeVisible();
});

test("mobile report has no horizontal overflow or clipped export control", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedCompleteLegacy(page);
  await page.goto(ROUTE);

  await expect(page.getByRole("button", { name: "Export JSON" })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test("JSON export contains the report but excludes raw source payloads", async ({
  page
}) => {
  const rawOnlyMarker = "RAW_ONLY_SENTINEL_7f28";
  await page.evaluate(
    ({ key, marker }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          rawOnlyMarker: marker,
          progress: [
            {
              slug: "fretboard-map",
              status: "complete",
              startedAt: "2026-06-01T10:00:00.000Z",
              completedAt: "2026-06-01T10:12:00.000Z",
              completedCheckpoints: ["read", "play", "write"]
            }
          ]
        })
      );
    },
    { key: LEARNING_KEY, marker: rawOnlyMarker }
  );
  await page.goto(ROUTE);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const contents = await readFile(path!, "utf8");
  const report = JSON.parse(contents) as {
    reportVersion: number;
    segmentId: string;
    legacy: { records: unknown[] };
  };

  expect(download.suggestedFilename()).toMatch(/^fretgarden-fretboard-map-migration-/);
  expect(report).toMatchObject({ reportVersion: 1, segmentId: "fretboard-map" });
  expect(report.legacy.records).toHaveLength(1);
  expect(contents).not.toContain(rawOnlyMarker);
  expect(contents).not.toContain("rawOnlyMarker");
});

async function seedCompleteLegacy(page: Page): Promise<void> {
  await page.evaluate(
    ({ learningKey, practiceKey }) => {
      window.localStorage.setItem(
        learningKey,
        JSON.stringify({
          version: 1,
          progress: [
            {
              slug: "fretboard-map",
              status: "complete",
              startedAt: "2026-06-01T10:00:00.000Z",
              completedAt: "2026-06-01T10:12:00.000Z",
              completedCheckpoints: ["read", "play", "write"]
            }
          ]
        })
      );
      window.localStorage.setItem(
        practiceKey,
        JSON.stringify({
          version: 1,
          progress: [
            {
              slug: "fretboard-map",
              drill: "note",
              status: "complete",
              startedAt: "2026-06-01T10:13:00.000Z",
              completedAt: "2026-06-01T10:18:00.000Z",
              lastAttemptedAt: "2026-06-01T10:18:00.000Z",
              lastAccuracy: 90,
              lastPromptCount: 10
            }
          ]
        })
      );
    },
    { learningKey: LEARNING_KEY, practiceKey: PRACTICE_KEY }
  );
}

async function seedPilot(
  page: Page,
  evidenceRecords: ReturnType<typeof evidence>[]
): Promise<void> {
  await page.evaluate(
    ({ key, evidence }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          contentVersion: "pilot-content-1",
          policyVersion: "pilot-1",
          updatedAt: "2026-07-14T11:00:00.000Z",
          sessions: [],
          attempts: [],
          evidence,
          reviews: [],
          readinessDecisions: []
        })
      );
    },
    { key: PILOT_KEY, evidence: evidenceRecords }
  );
}

function evidence(id: string, kind: string, observedAt: string) {
  return {
    id: `evidence:${id}`,
    attemptId: `attempt:${id}`,
    objective: { id: "fretboard.natural-notes.region-1", version: 1 },
    requirementId: id,
    observedAt,
    outcome: "supports",
    kind,
    confidence: kind === "transfer" ? "strong" : "moderate",
    supportLevel: "independent",
    quality: [],
    claimCeiling: kind,
    reasons: [],
    contentVersion: "pilot-content-1",
    policyVersion: "pilot-1"
  };
}

async function storageSnapshot(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const snapshot: Record<string, string> = {};
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key !== null) {
        snapshot[key] = window.localStorage.getItem(key) ?? "";
      }
    }
    return snapshot;
  });
}
