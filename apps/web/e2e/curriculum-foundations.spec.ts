import { expect, test, type Page } from "@playwright/test";

const CURRICULUM_KEY = "fretgarden:curriculum-progress:v1";
const LEGACY_LEARNING_KEY = "pocket-practice:lesson-learning-progress";
const LEGACY_DRILL_KEY = "pocket-practice:lesson-progress";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
});

test("presents the implemented curriculum without claiming the mapped roadmap is complete", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page.getByRole("heading", { name: "Learn to practice before you rush to collect facts" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tending the Practice Garden" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Focused Practice and the Pomodoro Technique" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Using and Practicing With a Metronome" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Meet the Guitar and Produce a Clear Sound" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Level 1 Integration Project" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lead-Sheet Literacy and Transposition" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Level 2 Band and Songwriting Project" })).toBeVisible();
  await expect(page.getByText("The remaining 32 units are source-mapped", { exact: false })).toBeVisible();
  await expect(page.getByText("CAGED System and Fretboard Integration")).toHaveCount(0);
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
    "/lessons/using-a-metronome",
    "/lessons/meet-the-guitar",
    "/lessons/pulse-subdivision-first-chords",
    "/lessons/open-chord-vocabulary-one",
    "/lessons/reading-rhythm-tablature",
    "/lessons/melody-scales-musical-alphabet",
    "/lessons/power-chords-rock-rhythm",
    "/lessons/open-chord-vocabulary-two-song-form",
    "/lessons/level-one-integration-project",
    "/lessons/barre-chords-movable-harmony",
    "/lessons/minor-pentatonic-blues-language",
    "/lessons/fretboard-notes-octave-shapes",
    "/lessons/major-scale-diatonic-melody",
    "/lessons/rhythm-guitar-vocabulary",
    "/lessons/triads-open-movable-contexts",
    "/lessons/lead-sheet-literacy-transposition",
    "/lessons/level-two-band-songwriting-project"
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

test("renders structured music blocks with text equivalents and explicit support fade", async ({ page }) => {
  await page.goto("/lessons/open-chord-vocabulary-one");

  await expect(page.getByRole("heading", { name: "Build C major around three target notes" })).toBeVisible();
  await expect(page.getByText("C major: string 6 muted", { exact: false })).toBeVisible();
  await expect(page.getByText("1 · Model", { exact: true })).toBeVisible();
  await expect(page.getByText("2 · Guided attempt", { exact: true })).toBeVisible();
  await expect(page.getByText("3 · Fade support", { exact: true })).toBeVisible();
  await expect(page.getByText("4 · Independent attempt", { exact: true })).toBeVisible();

  await page.goto("/lessons/reading-rhythm-tablature");
  const tab = page.getByRole("table", { name: /Two-measure etude/ });
  await expect(tab).toBeVisible();
  await expect(tab.getByRole("columnheader", { name: "1 &" })).toBeVisible();

  await page.goto("/lessons/fretboard-notes-octave-shapes");
  await expect(page.getByRole("table", { name: /Strings 6 and 5 natural-note map/ })).toBeVisible();

  await page.goto("/lessons/lead-sheet-literacy-transposition");
  await expect(page.getByRole("heading", { name: "North Window: Read one section ahead" })).toBeVisible();
  await expect(page.getByLabel(/Original G-major chart/)).toBeVisible();
  await expect(page.getByText("1 · Model", { exact: true })).toBeVisible();
});

test("keeps optional Level 2 reinforcement isolated from legacy storage", async ({ page }) => {
  await page.goto("/lessons/triads-open-movable-contexts");

  const reinforcement = page.getByRole("link", { name: "Practice optional chord-tone reinforcement" });
  await expect(reinforcement).toHaveAttribute("href", "/practice?drill=chordTone&lesson=triads#practice");
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), LEGACY_LEARNING_KEY)).toBeNull();
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), LEGACY_DRILL_KEY)).toBeNull();
});

test("keeps later units previewable while enforcing the completion prerequisite", async ({ page }) => {
  await page.goto("/lessons/level-one-integration-project");

  await expect(page.getByText("Preview available", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Complete the prior unit first" })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "Plan, perform, and assess a complete Level 1 piece" })).toBeVisible();
  await expect(page.getByText("60–120 second original piece", { exact: false })).toBeVisible();
});

test("presents the Level 2 capstone as a complete evidence-bearing project", async ({ page }) => {
  await page.goto("/lessons/level-two-band-songwriting-project");

  await expect(page.getByText("Preview available", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Complete the prior unit first" })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "Build, rehearse, and assess a complete Level 2 performance" })).toBeVisible();
  await expect(page.getByText("two-to-four-minute original piece", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lantern Lines: Original project model" })).toBeVisible();
  await expect(page.getByLabel(/Original G-major model/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Three contrasting studies" })).toBeVisible();
  await expect(page.getByText("FretGarden does not require or accept an upload", { exact: false })).toBeVisible();
});

test("supports a keyboard knowledge-check path in the instrument sequence", async ({ page }) => {
  await page.goto("/lessons/meet-the-guitar");
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), CURRICULUM_KEY))
    .not.toBeNull();

  const answer = page.getByLabel("E-A-D-G-B-E");
  await answer.press("Space");
  await expect(answer).toBeChecked();
  await expect(page.getByText("Correct.", { exact: true }).first()).toBeVisible();
});
