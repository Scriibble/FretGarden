import { expect, test } from "@playwright/test";

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

  await expect(page.getByTestId("hub-start-note")).toBeVisible();
  await expect(page.getByTestId("hub-start-chord")).toBeVisible();
  await expect(page.getByTestId("hub-start-scale-degree")).toBeVisible();
  await expect(page.getByTestId("hub-start-interval")).toBeVisible();
  await expect(page.getByTestId("hub-start-octave")).toBeVisible();
  await expect(page.getByTestId("hub-start-triad-inversion")).toBeVisible();
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

  for (const [index, answer] of noteDrillAnswers.entries()) {
    await page
      .locator(
        `button.fret-cell[aria-label="String ${answer.string}, fret ${answer.fret}"]`
      )
      .click();

    if (index < noteDrillAnswers.length - 1) {
      await page.getByRole("button", { name: "Next prompt" }).click();
    }
  }

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
