import { expect, test, type Page } from "@playwright/test";

const PILOT_STORAGE_KEY = "pocket-practice:education-pilot:v1";
const PILOT_RECOVERY_KEY = "pocket-practice:education-pilot:recovery:v1";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("completes the opening pilot and preserves legacy storage isolation", async ({
  page
}) => {
  await page.goto("/education-pilot");

  await expect(
    page.getByRole("heading", { name: "Build the first reliable landmarks" })
  ).toBeVisible();
  await page.getByLabel("I am choosing a shorter or lighter session today.").check();
  await page.getByRole("button", { name: "Start this session" }).click();

  await completePulse(page);
  await page.getByRole("button", { name: "Continue" }).click();

  await completeGridSet(page, [
    { string: 6, fret: 0 },
    { string: 5, fret: 3 },
    { string: 6, fret: 5 },
    { string: 5, fret: 2 }
  ]);
  await expect(page.getByText("Shown independently", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await completeNoteSet(page, [
    { string: 6, fret: 1 },
    { string: 5, fret: 2 },
    { string: 6, fret: 3 },
    { string: 5, fret: 3 },
    { string: 6, fret: 0 },
    { string: 5, fret: 0 },
    { string: 6, fret: 1 }
  ], { string: 5, fret: 3 });

  await expect(page.getByText("Shown independently", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await completeApplication(page);
  await expect(page.getByText("Applied in a changed context", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Applied in a changed context" })
  ).toBeVisible();
  await expect(page.getByText("Return when the delayed review becomes due.")).toBeVisible();

  const stored = await page.evaluate((storageKey) => {
    const pilot = window.localStorage.getItem(storageKey);
    return {
      pilot: pilot ? JSON.parse(pilot) : null,
      learning: window.localStorage.getItem("pocket-practice:lesson-learning-progress"),
      practice: window.localStorage.getItem("pocket-practice:lesson-progress")
    };
  }, PILOT_STORAGE_KEY);
  expect(stored.pilot.evidence).toEqual(
    expect.arrayContaining([
    expect.objectContaining({ requirementId: "note-exit", kind: "independent_performance" })
    ])
  );
  expect(stored.pilot.reviews).toHaveLength(2);
  expect(stored.learning).toBeNull();
  expect(stored.practice).toBeNull();
});

test("limits a revealed answer and routes to a fresh unsupported set", async ({
  page
}) => {
  await seedPilot(page, buildPilotSeed("notes"));
  await page.goto("/education-pilot");
  await page.getByRole("button", { name: "Begin retrieval" }).click();

  await page.getByRole("button", { name: "Show answer" }).click();
  await page.getByRole("gridcell", { name: "String 6, fret 1" }).click();
  await page.getByRole("button", { name: "Next prompt" }).click();
  await completeNoteSet(page, [
    { string: 5, fret: 2 },
    { string: 6, fret: 3 },
    { string: 5, fret: 3 },
    { string: 6, fret: 0 },
    { string: 5, fret: 0 },
    { string: 6, fret: 1 }
  ], { string: 5, fret: 3 });

  await expect(page.getByText("Corrected with support")).toBeVisible();
  await page.getByRole("button", { name: "Fade support and retry" }).click();
  await expect(page.getByText("The answer support is now removed.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Begin fresh independent set" })
  ).toBeVisible();
  const reviews = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as { reviews: unknown[] }).reviews : [];
  }, PILOT_STORAGE_KEY);
  expect(reviews).toEqual([]);
});

test("limits a revealed application pattern below transfer", async ({ page }) => {
  await seedPilot(page, buildPilotSeed("application"));
  await page.goto("/education-pilot");

  await page.getByRole("button", { name: "Show pattern" }).click();
  await page.getByRole("button", { name: "Check pattern" }).click();
  await page.getByRole("button", { name: "Next pattern" }).click();
  await choosePattern(page, "A", "B", "Open", "2");
  await page.getByRole("button", { name: "Evaluate application" }).click();

  await expect(page.getByText("Not yet transferred")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try changed patterns" })).toBeVisible();
});

test("completes a due delayed review and preserves the earlier achievement", async ({
  page
}) => {
  await seedPilot(page, buildPilotSeed("due-review"));
  await page.goto("/education-pilot");

  await expect(page.getByText("Due now")).toBeVisible();
  await page.getByRole("button", { name: "Begin due review" }).click();
  await completeNoteSet(page, [
    { string: 6, fret: 1 },
    { string: 5, fret: 2 },
    { string: 6, fret: 3 },
    { string: 5, fret: 3 }
  ], { string: 6, fret: 0 });

  await expect(page.getByText("Retrieved after a delay", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Retrieved after a delay" })
  ).toBeVisible();

  const stored = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, PILOT_STORAGE_KEY);
  expect(stored.evidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ kind: "independent_performance" }),
      expect.objectContaining({ kind: "retained_performance" })
    ])
  );
  expect(stored.reviews).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ state: "completed", sequenceIndex: 0 }),
      expect.objectContaining({ state: "scheduled", sequenceIndex: 1 })
    ])
  );
});

test("completes a due pulse review against its original evidence", async ({ page }) => {
  await seedPilot(page, buildPilotSeed("due-pulse-review"));
  await page.goto("/education-pilot");

  await expect(page.getByText("Due now")).toBeVisible();
  await page.getByRole("button", { name: "Begin due review" }).click();
  await expect(
    page.getByRole("heading", { name: "Meet the pulse again after a delay." })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "60 BPM" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "70 BPM" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await completePulse(page, "Retrieved after a delay");
  await page.getByRole("button", { name: "Continue" }).click();

  const stored = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, PILOT_STORAGE_KEY);
  expect(stored.evidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        requirementId: "pulse-retained",
        kind: "retained_performance"
      })
    ])
  );
  expect(stored.attempts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        taskId: "pulse-tapping",
        variedContext: true,
        response: expect.objectContaining({ tempoBpm: 70 })
      })
    ])
  );
  expect(stored.reviews).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ state: "completed", sequenceIndex: 0 }),
      expect.objectContaining({ state: "scheduled", sequenceIndex: 1 })
    ])
  );
});

test("preserves malformed pilot data before starting with an empty store", async ({
  page
}) => {
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PILOT_STORAGE_KEY, value: "{unreadable-pilot" }
  );
  await page.goto("/education-pilot");

  await expect(page.getByText("A pilot data copy was preserved.")).toBeVisible();
  const recovery = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, PILOT_RECOVERY_KEY);
  expect(recovery).toMatchObject({
    reason: "invalid_json",
    raw: "{unreadable-pilot"
  });
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(page.getByText("A pilot data copy was preserved.")).toBeHidden();
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), PILOT_RECOVERY_KEY)
  ).toBeNull();
});

test("removes pulse animation while preserving beat text for reduced motion", async ({
  page
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/education-pilot");
  await page.getByRole("button", { name: "Start this session" }).click();
  await page.getByRole("button", { name: "Begin guided attempt" }).click();
  await expect(page.getByLabel("Sound")).toBeChecked();
  await expect(
    page.getByRole("group", { name: "60 BPM pulse status" })
  ).not.toHaveAttribute("aria-live");
  await page.getByRole("button", { name: "Start pulse" }).click();

  await expect(page.getByText("Beat 2")).toBeVisible({ timeout: 2_500 });
  await expect(page.getByTestId("pilot-pulse-indicator")).toHaveCSS(
    "animation-name",
    "none"
  );
});

test("exposes current progress and contrast-safe review labels", async ({
  page
}) => {
  await page.goto("/education-pilot");

  const progress = page.getByRole("navigation", { name: "Pilot progress" });
  await expect(progress.locator('[aria-current="step"]')).toContainText(
    "Set the session"
  );
  await expect(page.getByText("Education pilot", { exact: true })).toHaveCSS(
    "color",
    "rgb(122, 69, 45)"
  );
  await expect(progress.locator("span").filter({ hasText: "Retrieve notes" })).toHaveCSS(
    "color",
    "rgb(104, 95, 80)"
  );

  await page.getByRole("button", { name: "Start this session" }).click();
  await expect(progress.locator('[aria-current="step"]')).toContainText(
    "Meet the pulse"
  );
});

test("registers every guided pulse tap through keyboard activation", async ({
  page
}) => {
  await page.goto("/education-pilot");

  const startSession = page.getByRole("button", { name: "Start this session" });
  await startSession.focus();
  await startSession.press("Enter");

  const beginGuided = page.getByRole("button", { name: "Begin guided attempt" });
  await beginGuided.focus();
  await beginGuided.press("Enter");

  const tempo = page.getByRole("button", { name: "50 BPM" });
  await tempo.focus();
  await tempo.press("Enter");

  const startPulse = page.getByRole("button", { name: "Start pulse" });
  await startPulse.focus();
  await startPulse.press("Enter");

  const tap = page.getByTestId("pilot-pulse-tap");
  const startedAt = await page.evaluate(() => performance.now());
  await tap.focus();
  for (let index = 1; index <= 8; index += 1) {
    const waitMs = await page.evaluate(
      ({ start, targetIndex }) =>
        Math.max(0, start + targetIndex * 1_200 - performance.now()),
      { start: startedAt, targetIndex: index }
    );
    await page.waitForTimeout(waitMs);
    await tap.press("Space");
  }

  const keyboardStore = await readPilotStore(page);
  const keyboardAttempt = keyboardStore.attempts.find(
    ({ taskId }) => taskId === "pulse-tapping"
  );
  expect(keyboardAttempt).toMatchObject({
    supportLevel: "guided",
    response: { tempoBpm: 50 }
  });
  expect(
    (keyboardAttempt?.response as { tapsMs?: unknown[] } | undefined)?.tapsMs
  ).toHaveLength(8);
});

test("varies pulse tempo while keeping guided evidence below the independent ceiling", async ({
  page
}) => {
  await page.goto("/education-pilot");
  await page.getByRole("button", { name: "Start this session" }).click();
  await page.getByRole("button", { name: "Begin guided attempt" }).click();
  await page.getByRole("button", { name: "50 BPM" }).click();
  await tapPulse(page);

  await expect(page.getByText("Practiced with support", { exact: true })).toBeVisible();
  const guided = await readPilotStore(page);
  expect(guided.evidence).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        requirementId: "pulse-independent",
        kind: "supported_performance",
        claimCeiling: "supported_performance"
      })
    ])
  );
  expect(guided.reviews).toEqual([]);

  await page.getByRole("button", { name: "Fade the guide" }).click();
  await page.getByRole("button", { name: "Begin independent attempt" }).click();
  await tapPulse(page);
  await expect(page.getByText("Shown independently", { exact: true })).toBeVisible();

  const independent = await readPilotStore(page);
  expect(independent.attempts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        supportLevel: "independent",
        response: expect.objectContaining({ tempoBpm: 50 })
      })
    ])
  );
  expect(independent.reviews).toHaveLength(1);
});

test("surfaces local write failure and allows retry or export", async ({ page }) => {
  await page.addInitScript((pilotKey) => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key: string, value: string): void {
      if (key === pilotKey) {
        throw new DOMException("Storage unavailable", "QuotaExceededError");
      }
      originalSetItem.call(this, key, value);
    };
  }, PILOT_STORAGE_KEY);
  await page.goto("/education-pilot");
  await page.getByRole("button", { name: "Start this session" }).click();

  await expect(page.getByText("This pilot activity is not saved yet.")).toBeVisible();
  await page.getByRole("button", { name: "Retry save" }).click();
  await expect(page.getByText("This pilot activity is not saved yet.")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export session data" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^fretgarden-unsaved-pilot-/);
  expect(await page.evaluate((key) => window.localStorage.getItem(key), PILOT_STORAGE_KEY)).toBeNull();
});

async function completePulse(
  page: Page,
  expectedStatus = "Shown independently"
): Promise<void> {
  const guidedStart = page.getByRole("button", { name: "Begin guided attempt" });
  if (await guidedStart.isVisible().catch(() => false)) {
    await guidedStart.click();
    await tapPulse(page);
    await expect(page.getByText("Practiced with support", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Fade the guide" }).click();
    await page.getByRole("button", { name: "Begin independent attempt" }).click();
  }
  await tapPulse(page);
  await expect(page.getByText(expectedStatus, { exact: true })).toBeVisible();
}

async function tapPulse(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Start pulse" }).click();
  await page.evaluate(async () => {
    const tapButton = document.querySelector<HTMLButtonElement>(
      '[data-testid="pilot-pulse-tap"]'
    );
    if (!tapButton) {
      throw new Error("Pulse tap control was not found.");
    }
    const intervalMs = Number(tapButton.dataset.intervalMs);
    const startedAt = performance.now();
    for (let index = 1; index <= 8; index += 1) {
      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          Math.max(0, startedAt + index * intervalMs - performance.now())
        )
      );
      tapButton.click();
    }
  });
}

async function completeGridSet(
  page: Page,
  answers: Array<{ string: 5 | 6; fret: number }>
): Promise<void> {
  const begin = page.getByRole("button", { name: "Begin placement" });
  if (await begin.isVisible().catch(() => false)) {
    await begin.click();
  }
  for (const [index, answer] of answers.entries()) {
    await page
      .getByRole("gridcell", { name: `String ${answer.string}, fret ${answer.fret}` })
      .click();
    await page
      .getByRole("button", {
        name: index === answers.length - 1 ? "Evaluate this set" : "Next prompt"
      })
      .click();
  }
}

async function completeNoteSet(
  page: Page,
  gridAnswers: Array<{ string: 5 | 6; fret: number }>,
  explicitAnswer: { string: 5 | 6; fret: number }
): Promise<void> {
  const begin = page.getByRole("button", { name: "Begin retrieval" });
  if (await begin.isVisible().catch(() => false)) {
    await begin.click();
  }
  for (const answer of gridAnswers) {
    await page
      .getByRole("gridcell", { name: `String ${answer.string}, fret ${answer.fret}` })
      .click();
    await page.getByRole("button", { name: "Next prompt" }).click();
  }
  await page
    .getByRole("combobox", { name: "String" })
    .selectOption(String(explicitAnswer.string));
  await page
    .getByRole("combobox", { name: "Fret" })
    .selectOption(String(explicitAnswer.fret));
  await page.getByRole("button", { name: "Submit coordinate" }).click();
  await page.getByRole("button", { name: "Evaluate this set" }).click();
}

async function completeApplication(page: Page): Promise<void> {
  await choosePattern(page, "E", "F", "Open", "1");
  await page.getByRole("button", { name: "Next pattern" }).click();
  await choosePattern(page, "A", "B", "Open", "2");
  await page.getByRole("button", { name: "Evaluate application" }).click();
}

async function choosePattern(
  page: Page,
  firstNote: string,
  secondNote: string,
  firstFret: string,
  secondFret: string
): Promise<void> {
  await page
    .getByRole("group", { name: `First note: ${firstNote}` })
    .getByRole("button", { name: firstFret, exact: true })
    .click();
  await page
    .getByRole("group", { name: `Second note: ${secondNote}` })
    .getByRole("button", { name: secondFret, exact: true })
    .click();
  await page.getByRole("button", { name: "Check pattern" }).click();
}

async function seedPilot(page: Page, store: unknown): Promise<void> {
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: PILOT_STORAGE_KEY, value: store }
  );
}

async function readPilotStore(page: Page): Promise<{
  attempts: Array<Record<string, unknown>>;
  evidence: Array<Record<string, unknown>>;
  reviews: Array<Record<string, unknown>>;
}> {
  return page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      throw new Error("Pilot store was not found.");
    }
    return JSON.parse(raw);
  }, PILOT_STORAGE_KEY);
}

function buildPilotSeed(
  stage: "notes" | "application" | "due-review" | "due-pulse-review"
) {
  const now = new Date();
  const sourceAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const dueAt = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const baseEvidence = [
    evidenceRecord({
      id: "coordinate-evidence",
      objectiveId: "fretboard.coordinates.basic",
      requirementId: "coordinate-placement",
      observedAt: sourceAt
    })
  ];
  const noteEvidence = evidenceRecord({
    id: "note-source-evidence",
    objectiveId: "fretboard.natural-notes.region-1",
    requirementId: "note-exit",
    observedAt: sourceAt
  });
  const pulseEvidence = evidenceRecord({
    id: "pulse-source-evidence",
    objectiveId: "rhythm.external-pulse.basic",
    requirementId: "pulse-independent",
    observedAt: sourceAt
  });
  const isNoteReview = stage === "due-review";
  const isPulseReview = stage === "due-pulse-review";
  return {
    schemaVersion: 1,
    contentVersion: "pilot-1",
    policyVersion: "pilot-1",
    updatedAt: now.toISOString(),
    sessions: [
      {
        id: "seed-session",
        startedAt: sourceAt,
        updatedAt: now.toISOString(),
        target: "Natural notes",
        durationMinutes: 5,
        nextAction: "Review",
        state: "active"
      }
    ],
    attempts: [],
    evidence: isNoteReview || stage === "application"
      ? [...baseEvidence, noteEvidence]
      : isPulseReview
        ? [...baseEvidence, noteEvidence, pulseEvidence]
        : baseEvidence,
    reviews:
      isNoteReview || isPulseReview
        ? [
            {
              id: "due-review",
              objective: {
                id: isPulseReview
                  ? "rhythm.external-pulse.basic"
                  : "fretboard.natural-notes.region-1",
                version: 1
              },
              sourceEvidenceId: isPulseReview ? pulseEvidence.id : noteEvidence.id,
              sequenceIndex: 0,
              dueAt,
              dueWindowEndsAt: now.toISOString(),
              state: "scheduled",
              policy: { id: "pilot-spaced-review", version: 1 }
            }
          ]
        : [],
    readinessDecisions: []
  };
}

function evidenceRecord(input: {
  id: string;
  objectiveId: string;
  requirementId: string;
  observedAt: string;
}) {
  return {
    id: input.id,
    attemptId: `${input.id}:attempt`,
    objective: { id: input.objectiveId, version: 1 },
    requirementId: input.requirementId,
    observedAt: input.observedAt,
    outcome: "supports",
    kind: "independent_performance",
    confidence: "moderate",
    supportLevel: "independent",
    quality: [{ dimension: "correctness", passed: true }],
    claimCeiling: "independent_performance",
    reasons: [],
    contentVersion: "pilot-1",
    policyVersion: "pilot-1"
  };
}
