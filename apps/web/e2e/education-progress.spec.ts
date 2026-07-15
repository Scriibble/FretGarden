import { expect, test, type Page } from "@playwright/test";

const PROGRESS_ROUTE = "/progress";
const LEARNING_KEY = "pocket-practice:lesson-learning-progress";
const PRACTICE_KEY = "pocket-practice:lesson-progress";
const NOTE_HISTORY_KEY = "pocket-practice:note-recognition-history";
const PILOT_KEY = "pocket-practice:education-pilot:v1";
const RECOVERY_KEY = "pocket-practice:education-pilot:recovery:v1";
const APPROVED_KEYS = [
  LEARNING_KEY,
  PRACTICE_KEY,
  NOTE_HISTORY_KEY,
  PILOT_KEY,
  RECOVERY_KEY
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("exposes shared product navigation on every approved surface", async ({ page }) => {
  const surfaces = [
    ["/practice", "Practice"],
    ["/explore", "Explore"],
    ["/lessons", "Lessons"],
    ["/lessons/tending-the-practice-garden", "Lessons"],
    ["/history", "History"],
    ["/education-pilot", "Progress"],
    [PROGRESS_ROUTE, "Progress"]
  ] as const;

  for (const [route, activeLabel] of surfaces) {
    await page.goto(route);
    const navigation = page.getByRole("navigation", { name: "Product navigation" });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link", { name: activeLabel, exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(navigation.getByRole("link", { name: "Progress" })).toHaveAttribute(
      "href",
      "/progress"
    );
  }
});

test("empty learner progress is neutral and writes no approved value", async ({ page }) => {
  const before = await approvedStorageSnapshot(page);
  await page.goto(PROGRESS_ROUTE);

  await expect(
    page.getByRole("heading", { name: "What your fretboard practice has shown" })
  ).toBeVisible();
  await expect(page.getByLabel("Preserved lesson history").getByText("Not recorded")).toBeVisible();
  await expect(page.getByLabel("Preserved drill history").getByText("Not recorded")).toBeVisible();
  await expect(page.getByText("Not yet observed")).toHaveCount(2);
  expect(await approvedStorageSnapshot(page)).toEqual(before);
});

test("keeps complete legacy history separate from current evidence", async ({ page }) => {
  await seedCompleteLegacy(page);
  await seedPilot(page, [
    evidence(
      "coordinate-independent",
      "fretboard.coordinates.basic",
      "independent_performance",
      "2026-07-14T09:00:00.000Z"
    ),
    evidence(
      "note-transfer",
      "fretboard.natural-notes.region-1",
      "transfer",
      "2026-07-14T10:00:00.000Z"
    )
  ]);
  const before = await approvedStorageSnapshot(page);
  await page.goto(PROGRESS_ROUTE);

  await expect(page.getByLabel("Preserved lesson history").getByText("Complete")).toBeVisible();
  await expect(page.getByLabel("Preserved drill history").getByText("Complete")).toBeVisible();
  await expect(page.getByText("Shown independently")).toBeVisible();
  await expect(page.getByText("Applied in a changed context")).toBeVisible();
  await expect(page.getByText("history does not become independent", { exact: false })).toBeVisible();

  await expect(page.getByRole("button", { name: "Export JSON" })).toHaveCount(0);
  await expect(page.getByText("Mapping diagnostics")).toHaveCount(0);
  await expect(page.getByText("Report version")).toHaveCount(0);
  await expect(page.getByText("Storage integrity")).toHaveCount(0);
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
  await expect(page.getByText(/convert/i)).toHaveCount(0);
  expect(await approvedStorageSnapshot(page)).toEqual(before);
});

test("malformed sources stay unchanged behind a neutral learner alert", async ({ page }) => {
  await page.evaluate(
    ({ learning, practice, note, pilot, recovery }) => {
      window.localStorage.setItem(learning, "{bad-learning");
      window.localStorage.setItem(practice, JSON.stringify({ unsupported: [] }));
      window.localStorage.setItem(note, "{bad-history");
      window.localStorage.setItem(pilot, "{bad-pilot");
      window.localStorage.setItem(recovery, "preserved-recovery-value");
    },
    {
      learning: LEARNING_KEY,
      practice: PRACTICE_KEY,
      note: NOTE_HISTORY_KEY,
      pilot: PILOT_KEY,
      recovery: RECOVERY_KEY
    }
  );
  const before = await approvedStorageSnapshot(page);
  await page.goto(PROGRESS_ROUTE);

  await expect(page.getByText("Some local progress could not be read.")).toBeVisible();
  await expect(page.getByText("bad-learning")).toHaveCount(0);
  await expect(page.getByText("bad-pilot")).toHaveCount(0);
  expect(await approvedStorageSnapshot(page)).toEqual(before);
});

test("routes a due review into the guided path", async ({ page }) => {
  const source = evidence(
    "note-exit",
    "fretboard.natural-notes.region-1",
    "independent_performance",
    "2026-07-12T09:00:00.000Z"
  );
  await seedPilot(page, [source], [
    {
      id: "review:due-note",
      objective: { id: "fretboard.natural-notes.region-1", version: 1 },
      sourceEvidenceId: source.id,
      sequenceIndex: 0,
      dueAt: "2026-07-13T09:00:00.000Z",
      dueWindowEndsAt: "2099-07-20T09:00:00.000Z",
      state: "scheduled",
      policy: { id: "pilot-review", version: 1 }
    }
  ]);
  await page.goto(PROGRESS_ROUTE);

  await expect(page.getByText("Review due", { exact: true })).toBeVisible();
  const action = page.getByRole("link", { name: "Complete current review" });
  await expect(action).toHaveAttribute("href", "/education-pilot");
  await action.click();
  await expect(page).toHaveURL(/\/education-pilot$/);
  await expect(page.getByText("Due now")).toBeVisible();
});

test("read failure offers safe paths without attempting a write", async ({ page }) => {
  await page.addInitScript((blockedKey) => {
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    (window as unknown as { progressWriteCount: number }).progressWriteCount = 0;
    Storage.prototype.getItem = function getItem(key: string): string | null {
      if (key === blockedKey) {
        throw new DOMException("Storage unavailable", "SecurityError");
      }
      return originalGetItem.call(this, key);
    };
    Storage.prototype.setItem = function setItem(key: string, value: string): void {
      (window as unknown as { progressWriteCount: number }).progressWriteCount += 1;
      originalSetItem.call(this, key, value);
    };
  }, LEARNING_KEY);
  await page.goto(PROGRESS_ROUTE);

  await expect(page.getByRole("heading", { name: "Local progress could not be read" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open guided practice" })).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as unknown as { progressWriteCount: number }).progressWriteCount
    )
  ).toBe(0);
});

test("mobile navigation and progress content do not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await seedCompleteLegacy(page);
  await page.goto(PROGRESS_ROUTE);

  await expect(page.getByRole("navigation", { name: "Product navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start guided practice" })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

async function approvedStorageSnapshot(page: Page): Promise<Record<string, string | null>> {
  return page.evaluate(
    (keys) => Object.fromEntries(keys.map((key) => [key, window.localStorage.getItem(key)])),
    APPROVED_KEYS
  );
}

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
              startedAt: "2026-07-13T10:00:00.000Z",
              completedAt: "2026-07-13T10:12:00.000Z",
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
              startedAt: "2026-07-13T10:13:00.000Z",
              completedAt: "2026-07-13T10:18:00.000Z",
              lastAttemptedAt: "2026-07-13T10:18:00.000Z",
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
  evidenceRecords: ReturnType<typeof evidence>[],
  reviews: unknown[] = []
): Promise<void> {
  await page.evaluate(
    ({ key, evidence, reviewRecords }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          contentVersion: "pilot-content-1",
          policyVersion: "pilot-1",
          updatedAt: "2026-07-14T10:00:00.000Z",
          sessions: [],
          attempts: [],
          evidence,
          reviews: reviewRecords,
          readinessDecisions: []
        })
      );
    },
    { key: PILOT_KEY, evidence: evidenceRecords, reviewRecords: reviews }
  );
}

function evidence(
  id: string,
  objectiveId: string,
  kind: "independent_performance" | "transfer",
  observedAt: string
) {
  return {
    id: `evidence:${id}`,
    attemptId: `attempt:${id}`,
    objective: { id: objectiveId, version: 1 },
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
  } as const;
}
