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

test("surfaces the core MVP path while keeping advanced drills available", async ({
  page
}) => {
  await expect(
    page.getByRole("heading", { name: "Core MVP path" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Advanced practice" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Try the first three learning steps" })
  ).toBeVisible();

  await expect(page.getByTestId("hub-start-note")).toBeVisible();
  await expect(page.getByTestId("hub-start-chord")).toBeVisible();
  await expect(page.getByTestId("hub-start-scale-degree")).toBeVisible();
  await expect(page.getByTestId("hub-start-interval")).toBeVisible();
  await expect(page.getByTestId("hub-start-octave")).toBeVisible();
  await expect(page.getByTestId("hub-start-triad-inversion")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset local demo progress" })
  ).toBeVisible();
});

test("links a lesson into its matching practice drill", async ({ page }) => {
  await page.goto("/lessons/fretboard-map");
  await page.getByRole("link", { name: "Start lesson practice" }).click();

  await expect(page).toHaveURL(/drill=note/);
  await expect(page).toHaveURL(/lesson=fretboard-map/);
  await expect(page.getByRole("button", { name: "Note drill" })).toHaveClass(
    /is-selected/
  );
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "How the fretboard is organized"
    })
  ).toBeVisible();
});

test("completes a note lesson drill and persists course progress", async ({
  page
}) => {
  await page.goto("/?drill=note&lesson=fretboard-map#practice");

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
  await page.goto("/?drill=scaleDegree&lesson=scale-degrees#practice");

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
  await page.goto("/?drill=chordTone&lesson=triads#practice");

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

test("resets local demo progress for another tester", async ({ page }) => {
  await page.evaluate(() => {
    window.localStorage.setItem(
      "pocket-practice:lesson-progress",
      JSON.stringify({
        version: 1,
        progress: [
          {
            slug: "fretboard-map",
            drill: "note",
            status: "complete",
            startedAt: "2026-07-08T12:00:00.000Z"
          }
        ]
      })
    );
  });
  await page.reload();
  await expect(page.getByText("Done").first()).toBeVisible();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Reset local demo progress" }).click();

  await expect(page.getByText("Done")).toHaveCount(0);
  await expect.poll(() =>
    page.evaluate(() =>
      window.localStorage.getItem("pocket-practice:lesson-progress")
    )
  ).toBeNull();
});

test("keeps the tester demo path usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Try the first three learning steps" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { exact: true, name: "Open lesson" })
  ).toBeVisible();
  await expect(page.getByTestId("hub-start-note")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset local demo progress" })
  ).toBeVisible();
});

test("keeps practice settings compact until expanded", async ({ page }) => {
  await page.goto("/?drill=note&lesson=fretboard-map#practice");

  const settingsPanel = page.locator(".session-setup-panel");

  await expect(settingsPanel.getByText("Quick presets")).toHaveCount(0);
  await expect(settingsPanel.getByText("Target note")).toHaveCount(0);
  await expect(settingsPanel.getByText("String")).toHaveCount(0);
  await expect(page.getByText("More options")).toBeVisible();
  await expect(page.getByTestId("note-order-random")).toBeHidden();

  await page.getByText("More options").click();
  await expect(page.getByTestId("note-order-random")).toBeVisible();
});

test("completes a note lesson drill on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?drill=note&lesson=fretboard-map#practice");

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
    await page
      .locator(
        `button.fret-cell[aria-label="String ${answer.string}, fret ${answer.fret}"]`
      )
      .click();

    if (index < answers.length - 1) {
      await page.getByRole("button", { name: "Next question" }).click();
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
