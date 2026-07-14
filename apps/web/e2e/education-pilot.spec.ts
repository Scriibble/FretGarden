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
  await expect(
    page.getByRole("heading", { name: "Shown independently" })
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
  await expect(page.getByRole("button", { name: "Try a fresh set" })).toBeVisible();
  const reviews = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as { reviews: unknown[] }).reviews : [];
  }, PILOT_STORAGE_KEY);
  expect(reviews).toEqual([]);
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
  await page.getByRole("button", { name: "Start pulse" }).click();

  await expect(page.getByText("Beat 2")).toBeVisible({ timeout: 2_500 });
  await expect(page.getByTestId("pilot-pulse-indicator")).toHaveCSS(
    "animation-name",
    "none"
  );
});

async function completePulse(
  page: Page,
  expectedStatus = "Shown independently"
): Promise<void> {
  await page.getByRole("button", { name: "Start pulse" }).click();
  await page.evaluate(async () => {
    const tapButton = document.querySelector<HTMLButtonElement>(
      '[data-testid="pilot-pulse-tap"]'
    );
    if (!tapButton) {
      throw new Error("Pulse tap control was not found.");
    }
    const startedAt = performance.now();
    for (let index = 1; index <= 8; index += 1) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, Math.max(0, startedAt + index * 1000 - performance.now()))
      );
      tapButton.click();
    }
  });
  await expect(page.getByText(expectedStatus, { exact: true })).toBeVisible();
}

async function completeGridSet(
  page: Page,
  answers: Array<{ string: 5 | 6; fret: number }>
): Promise<void> {
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

async function seedPilot(page: Page, store: unknown): Promise<void> {
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, JSON.stringify(value)),
    { key: PILOT_STORAGE_KEY, value: store }
  );
}

function buildPilotSeed(stage: "notes" | "due-review" | "due-pulse-review") {
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
    evidence: isNoteReview
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
