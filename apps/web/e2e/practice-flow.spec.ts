import { expect, test, type Page } from "@playwright/test";

const noteDrillAnswers = [
  { string: 5, fret: 5 },
  { string: 6, fret: 3 },
  { string: 2, fret: 1 },
  { string: 3, fret: 2 },
  { string: 4, fret: 2 },
  { string: 6, fret: 1 },
  { string: 5, fret: 2 },
  { string: 3, fret: 5 },
  { string: 4, fret: 7 },
  { string: 1, fret: 3 }
];

const scaleDegreeAnswers = [
  { string: 5, fret: 3 },
  { string: 2, fret: 12 },
  { string: 4, fret: 2 },
  { string: 3, fret: 12 },
  { string: 2, fret: 12 },
  { string: 6, fret: 6 },
  { string: 3, fret: 2 },
  { string: 5, fret: 7 },
  { string: 4, fret: 6 },
  { string: 2, fret: 9 },
  { string: 1, fret: 10 },
  { string: 6, fret: 10 }
];

const chordToneAnswers = [
  "C",
  "B",
  "E",
  "G",
  "D",
  "C",
  "D",
  "A",
  "G#",
  "C",
  "E",
  "Bb"
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("shows a focused branded landing page", async ({ page }) => {
  const primaryNavigation = page.getByLabel("Primary navigation");

  await expect(
    page.getByRole("heading", {
      name: "Learn the fretboard. Grow your musicianship."
    })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open the practice app" })
  ).toHaveAttribute("href", "/practice");
  await expect(
    page.getByRole("link", { name: "Create an account" }).first()
  ).toHaveAttribute("href", "/signup");
  await expect(primaryNavigation.getByRole("link", { name: "About Me" })).toHaveAttribute(
    "href",
    "/about"
  );
  await expect(primaryNavigation.getByRole("link", { name: "Sign In" })).toHaveAttribute(
    "href",
    "/login"
  );
  await expect(page.getByText("Accounts are live; cloud progress sync is planned")).toBeVisible();
});

test("surfaces the core MVP path while keeping advanced drills available", async ({
  page
}) => {
  await page.goto("/practice");

  await expect(page.getByTestId("hub-start-note")).toBeVisible();
  await expect(page.getByTestId("hub-start-chord")).toBeVisible();
  await expect(page.getByTestId("hub-start-scale-degree")).toBeVisible();
  await expect(page.getByTestId("hub-start-interval")).toBeVisible();
  await expect(page.getByTestId("hub-start-octave")).toBeVisible();
  await expect(page.getByTestId("hub-start-triad-inversion")).toBeVisible();
  await expect(page.getByText("No sessions yet", { exact: true })).toHaveCount(
    0
  );
  await expect(page.getByText("No weak spots", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Explore mode")).toHaveCount(0);
});

test("links a lesson into its matching practice drill", async ({ page }) => {
  await page.goto("/lessons/fretboard-map");
  await page.getByRole("link", { name: "Start reinforcement drill" }).click();

  await expect(page).toHaveURL(/\/practice/);
  await expect(page).toHaveURL(/drill=note/);
  await expect(page).toHaveURL(/lesson=fretboard-map/);
  await expect(
    page.getByText("Find D on the A string")
  ).toBeVisible();
});

test("completes a note lesson drill and persists course progress", async ({
  page
}) => {
  await page.goto("/practice?drill=note&lesson=fretboard-map#practice");

  await completeFretboardAnswers(page, noteDrillAnswers);

  await expect(
    page.getByRole("heading", { name: "Note recognition complete" })
  ).toBeVisible();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const storedProgress = await page.evaluate(() =>
    window.localStorage.getItem("pocket-practice:lesson-progress")
  );
  expect(storedProgress).not.toBeNull();

  const parsedProgress = JSON.parse(storedProgress ?? "{}") as {
    progress?: Array<{ slug: string; status: string; lastAccuracy?: number }>;
  };
  expect(parsedProgress.progress).toContainEqual(
    expect.objectContaining({
      lastAccuracy: 100,
      slug: "fretboard-map",
      status: "complete"
    })
  );
});

test("completes a scale-degree lesson drill and persists course progress", async ({
  page
}) => {
  await page.goto("/practice?drill=scaleDegree&lesson=scale-degrees#practice");

  await completeFretboardAnswers(page, scaleDegreeAnswers);

  await expect(
    page.getByRole("heading", { name: "Scale degree drill complete" })
  ).toBeVisible();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const storedProgress = await page.evaluate(() =>
    window.localStorage.getItem("pocket-practice:lesson-progress")
  );
  expect(storedProgress).not.toBeNull();

  const parsedProgress = JSON.parse(storedProgress ?? "{}") as {
    progress?: Array<{ slug: string; status: string; lastAccuracy?: number }>;
  };
  expect(parsedProgress.progress).toContainEqual(
    expect.objectContaining({
      lastAccuracy: 100,
      slug: "scale-degrees",
      status: "complete"
    })
  );
});

test("completes a chord-tone lesson drill and persists course progress", async ({
  page
}) => {
  await page.goto("/practice?drill=chordTone&lesson=triads#practice");

  await completeChordToneAnswers(page, chordToneAnswers);

  await expect(
    page.getByRole("heading", { name: "Chord tone drill complete" })
  ).toBeVisible();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const storedProgress = await page.evaluate(() =>
    window.localStorage.getItem("pocket-practice:lesson-progress")
  );
  expect(storedProgress).not.toBeNull();

  const parsedProgress = JSON.parse(storedProgress ?? "{}") as {
    progress?: Array<{ slug: string; status: string; lastAccuracy?: number }>;
  };
  expect(parsedProgress.progress).toContainEqual(
    expect.objectContaining({
      lastAccuracy: 100,
      slug: "triads",
      status: "complete"
    })
  );
});

test("keeps the tester demo path usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/practice");

  await expect(
    page.getByRole("heading", { name: "Find notes by string" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { exact: true, name: "Open lesson library" })
  ).toBeVisible();
  await expect(page.getByTestId("hub-start-note")).toBeVisible();
});

test("keeps practice settings compact until expanded", async ({ page }) => {
  await page.goto("/practice?drill=note&lesson=fretboard-map#practice");

  const settingsPanel = page.locator(".session-setup-panel");

  await expect(page.getByText("Drill", { exact: true })).toBeVisible();
  await expect(
    page.getByTestId("session-setup-disclosure").locator("summary").first()
  ).toBeVisible();
  await expect(settingsPanel.getByText("Quick presets")).toHaveCount(0);
  await expect(settingsPanel.getByText("Target note")).toHaveCount(0);
  await expect(settingsPanel.getByText("String")).toHaveCount(0);
  await expect(settingsPanel.getByText("More options")).toBeHidden();
  await expect(page.getByTestId("note-order-random")).toBeHidden();

  await page
    .getByTestId("session-setup-disclosure")
    .locator("summary")
    .first()
    .click();
  await expect(settingsPanel.getByText("More options")).toBeVisible();
  await settingsPanel.getByText("More options").click();
  await expect(page.getByTestId("note-order-random")).toBeVisible();
});

test("keeps fretboard exploration separate from practice", async ({ page }) => {
  await page.goto("/explore");

  await expect(
    page.getByRole("heading", { name: "Fretboard Explorer" })
  ).toBeVisible();
  await expect(page.getByText("Explore mode")).toBeVisible();
  await expect(page.getByTestId("mode-notes")).toBeVisible();
  await expect(page.getByTestId("mode-practice")).toHaveCount(0);
  await expect(page.getByTestId("hub-start-note")).toHaveCount(0);
});

test("moves recent sessions and weak spots to history", async ({ page }) => {
  await page.goto("/practice?drill=note&lesson=fretboard-map#practice");

  await expect(page.getByText("Find D on the A string")).toBeVisible();
  const missedAnswer = page.locator(
    'button.fret-cell[aria-label="String 5, fret 4"]'
  );
  await expect(missedAnswer).toBeVisible();
  await expect(missedAnswer).toBeEnabled();
  await missedAnswer.click();
  await expect(page.getByTestId("drill-next")).toBeEnabled();
  await page.getByTestId("drill-next").click();
  await completeFretboardAnswers(page, noteDrillAnswers.slice(1));

  await page.goto("/history");

  await expect(
    page.getByRole("heading", { name: "Practice history" })
  ).toBeVisible();
  await expect(
    page.locator(".progress-card-heading").getByText("Recent sessions")
  ).toBeVisible();
  await expect(
    page.locator(".progress-card-heading").getByText("Weak spots")
  ).toBeVisible();
  await expect(
    page.locator(".recent-session-row").getByText("Note recognition")
  ).toBeVisible();
  await expect(page.getByText("D notes")).toBeVisible();
});

test("completes a note lesson drill on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/practice?drill=note&lesson=fretboard-map#practice");

  await expect(page.getByText("Find D on the A string")).toBeVisible();
  await expect(
    page.locator('button.fret-cell[aria-label="String 5, fret 5"]')
  ).toBeVisible();
  await completeFretboardAnswers(page, noteDrillAnswers);

  await expect(
    page.getByRole("heading", { name: "Note recognition complete" })
  ).toBeVisible();
  await expect(page.getByText("Lesson complete")).toBeVisible();
});

async function completeFretboardAnswers(
  page: Page,
  answers: Array<{ fret: number; string: number }>
): Promise<void> {
  for (const [index, answer] of answers.entries()) {
    const answerCell = page.getByTestId(`fret-${answer.string}-${answer.fret}`);

    await answerCell.scrollIntoViewIfNeeded();
    await expect(answerCell).toBeVisible();
    await expect(answerCell).toBeEnabled();
    await answerCell.click();

    if (index < answers.length - 1) {
      await expect(page.getByTestId("drill-next")).toBeEnabled();
      await page.getByTestId("drill-next").click();
    }
  }
}

async function completeChordToneAnswers(
  page: Page,
  answers: string[]
): Promise<void> {
  for (const [index, answer] of answers.entries()) {
    await page.getByTestId(`chord-answer-${formatNoteTestId(answer)}`).click();

    if (index < answers.length - 1) {
      await page.getByRole("button", { name: "Next question" }).click();
    }
  }
}

function formatNoteTestId(note: string): string {
  return note.replace("#", "sharp").replace("b", "flat");
}
