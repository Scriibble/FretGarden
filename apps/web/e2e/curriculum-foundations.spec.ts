import { expect, test, type Page } from "@playwright/test";

const CURRICULUM_KEY = "fretgarden:curriculum-progress:v1";
const LEGACY_LEARNING_KEY = "pocket-practice:lesson-learning-progress";
const LEGACY_DRILL_KEY = "pocket-practice:lesson-progress";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("presents the three implemented foundation units without claiming the mapped roadmap is complete", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page.getByRole("heading", { name: "Learn to practice before you rush to collect facts" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tending the Practice Garden" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Focused Practice and the Pomodoro Technique" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Using and Practicing With a Metronome" })).toBeVisible();
  await expect(page.getByText("The remaining 48 units are source-mapped", { exact: false })).toBeVisible();
  await expect(page.getByText("Fretboard Notes and Octave Shapes")).toHaveCount(0);
});

test("requires correct knowledge and explicit performance checks before Unit 1 completion", async ({ page }) => {
  await page.goto("/lessons/tending-the-practice-garden");

  await expect(page.getByRole("heading", { name: "Build a practice you can return to" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Difficulty is information" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Turn frustration into a next action" })).toBeVisible();

  const completeButton = page.getByRole("button", { name: "Finish checks to complete" });
  await expect(completeButton).toBeDisabled();

  await page.getByLabel("Ten focused minutes on four separate days").check();
  await page.getByLabel("Describe which string buzzes and test one smaller adjustment").check();
  const mastery = page.getByRole("heading", { name: /assessment$/ }).locator("..").locator("..");
  for (const checkbox of await mastery.getByRole("checkbox").all()) {
    await checkbox.check();
  }

  await expect(page.getByRole("button", { name: "Complete unit self-check" })).toBeEnabled();
  await page.getByRole("button", { name: "Complete unit self-check" }).click();
  await expect(page.getByRole("button", { name: "Unit self-check complete" })).toBeDisabled();

  const stored = await page.evaluate((key) => window.localStorage.getItem(key), CURRICULUM_KEY);
  expect(stored).toContain("unit.practice-garden");
  expect(stored).toContain("completedAt");
  expect(await page.evaluate((key) => window.localStorage.getItem(key), LEGACY_LEARNING_KEY)).toBeNull();
  expect(await page.evaluate((key) => window.localStorage.getItem(key), LEGACY_DRILL_KEY)).toBeNull();
});

test("provides focused-practice presets, custom durations, goals, reflection, and break control", async ({ page }) => {
  await page.goto("/lessons/focused-practice-pomodoro");

  await page.getByLabel("Session goal").fill("Eight relaxed chord changes");
  await page.getByRole("button", { name: "25 / 5" }).click();
  await expect(page.getByLabel("Work minutes")).toHaveValue("25");
  await page.getByRole("button", { name: "Custom" }).click();
  await page.getByLabel("Work minutes").fill("12");
  await page.getByLabel("Rest minutes").fill("4");
  await expect(page.getByRole("timer")).toContainText("12:00");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByLabel("Session reflection").fill("The shorter target kept my attention on the change.");
  await expect(page.getByLabel("Announce the break")).toBeChecked();
});

test("provides one timing source for metronome audio, beat display, subdivisions, count-in, and tempo controls", async ({ page }) => {
  await page.goto("/lessons/using-a-metronome");

  await expect(page.getByText("Quarter: 1 2 3 4")).toBeVisible();
  const metronome = page.getByRole("region", {
    name: "Hear, count, and keep the pulse"
  });
  await page.getByRole("button", { name: "Increase tempo by 5 BPM" }).click();
  await expect(page.getByLabel("Tempo in BPM")).toHaveValue("55");
  await metronome.getByRole("combobox").selectOption("eighth");
  await page.getByRole("button", { name: "2 measures" }).click();
  await expect(page.getByLabel("Accent beat 1")).toBeChecked();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(/Count in|Measure/);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.getByRole("button", { name: "Add one clean repetition" }).click();
  await metronome.getByLabel("Practice task").fill("Muted quarter-note strums");
  await metronome.getByLabel("Timing observation").fill("Beat 4 rushed before the chord change.");
});

test("keeps every foundation route inside a 320 pixel viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of [
    "/lessons",
    "/lessons/tending-the-practice-garden",
    "/lessons/focused-practice-pomodoro",
    "/lessons/using-a-metronome"
  ]) {
    await page.goto(route);
    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.documentWidth, route).toBeLessThanOrEqual(dimensions.viewportWidth);
  }
});

test("redirects every replaced lesson slug without modifying legacy values", async ({ page }) => {
  await page.evaluate(
    ({ learningKey, drillKey }) => {
      window.localStorage.setItem(learningKey, "preserved-learning");
      window.localStorage.setItem(drillKey, "preserved-drill");
    },
    { learningKey: LEGACY_LEARNING_KEY, drillKey: LEGACY_DRILL_KEY }
  );

  for (const slug of [
    "fretboard-map",
    "repeating-notes",
    "triads",
    "scale-degrees",
    "intervals",
    "octave-shapes",
    "triad-inversions",
    "major-scale-landmarks"
  ]) {
    await page.goto(`/lessons/${slug}`);
    await expect(page).toHaveURL(/\/lessons$/);
  }

  expect(await page.evaluate((key) => window.localStorage.getItem(key), LEGACY_LEARNING_KEY)).toBe("preserved-learning");
  expect(await page.evaluate((key) => window.localStorage.getItem(key), LEGACY_DRILL_KEY)).toBe("preserved-drill");
});

test("leaves unreadable curriculum progress untouched", async ({ page }) => {
  await page.evaluate((key) => {
    window.localStorage.setItem(key, "{unreadable-curriculum");
  }, CURRICULUM_KEY);

  await page.goto("/lessons/tending-the-practice-garden");
  await expect(
    page.getByText("Local lesson progress could not be saved.", { exact: true })
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Practice identity", exact: true })
    .fill("I return with care.");

  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), CURRICULUM_KEY)
  ).toBe("{unreadable-curriculum");
});
