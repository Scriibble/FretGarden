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
    page.getByRole("link", { name: "Start the 51-unit curriculum" })
  ).toHaveAttribute("href", "/lessons");
  await expect(
    page.getByRole("link", { name: "Open practice tools" }).first()
  ).toHaveAttribute("href", "/practice");
  await expect(
    page.getByRole("link", { name: "Create an account" }).first()
  ).toHaveAttribute("href", "/signup");
  await expect(primaryNavigation.getByRole("link", { name: "Curriculum" })).toHaveAttribute(
    "href",
    "/lessons"
  );
  await expect(primaryNavigation.getByRole("link", { name: "About Me" })).toHaveAttribute(
    "href",
    "/about"
  );
  await expect(primaryNavigation.getByRole("link", { name: "Test Feedback" })).toHaveAttribute(
    "href",
    "/tester-feedback"
  );
  await expect(primaryNavigation.getByRole("link", { name: "Sign In" })).toHaveAttribute(
    "href",
    "/login"
  );
  await expect(page.getByText("51 authored units available now")).toBeVisible();
  await expect(page.getByText("Accounts are live; cloud progress sync is planned")).toBeVisible();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toHaveAttribute(
    "href",
    "/privacy"
  );
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Terms" })).toHaveAttribute(
    "href",
    "/terms"
  );
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Accessibility" })
  ).toHaveAttribute("href", "/accessibility");
});

test("renders account access pages without requiring live signup", async ({
  page
}) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: "Return to your practice garden." })
  ).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Reset a forgotten password." })
  ).toHaveAttribute("href", "/forgot-password");

  await page.goto("/forgot-password");
  await expect(
    page.getByRole("heading", { name: "Get a fresh path back in." })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send reset link" })
  ).toBeVisible();

  await page.goto("/update-password");
  await expect(
    page.getByRole("heading", { name: "Reset your account key." })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Update password" })
  ).toBeVisible();

  await page.goto("/account-notice");
  await expect(
    page.getByRole("heading", {
      name: "Accounts are real, but still early."
    })
  ).toBeVisible();
  await expect(page.getByText("What accounts do now")).toBeVisible();
});

test("renders release policy and tester evidence pages", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Early-access data boundaries." })).toBeVisible();
  await expect(page.getByText("This data is not synced across devices.")).toBeVisible();

  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Use FretGarden with clear expectations." })).toBeVisible();
  await expect(page.getByText("Accounts do not currently sync lesson progress", { exact: false })).toBeVisible();

  await page.goto("/accessibility");
  await expect(page.getByRole("heading", { name: "Accessibility is part of release readiness." })).toBeVisible();
  await expect(page.getByText("Full screen-reader matrix execution and signoff.")).toBeVisible();

  await page.goto("/tester-feedback");
  await expect(page.getByRole("heading", { name: "Help decide what is ready." })).toBeVisible();
  await expect(page.getByText("Survey link not configured yet")).toBeVisible();
  await expect(page.getByText("NEXT_PUBLIC_TESTER_SURVEY_URL", { exact: false })).toBeVisible();
});

test("protects the account page and exposes signout redirect", async ({
  page,
  request
}) => {
  await page.goto("/account");

  await expect(page).toHaveURL(/\/login\?next=%2Faccount|\/login\?next=\/account/);
  await expect(
    page.getByRole("heading", { name: "Return to your practice garden." })
  ).toBeVisible();

  const signoutResponse = await request.post("/auth/signout", {
    maxRedirects: 0
  });

  expect(signoutResponse.status()).toBe(303);
  expect(signoutResponse.headers().location).toMatch(/\/login$/);
});

test("surfaces the core MVP path while keeping advanced drills available", async ({
  page
}) => {
  await page.goto("/practice");

  await expect(page.getByRole("heading", { name: "Start with the 51-unit curriculum" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open curriculum" })).toHaveAttribute("href", "/lessons");
  await expect(page.getByText("Drill results stay separate from curriculum self-checks.")).toBeVisible();
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

test("keeps curriculum entry points reachable without mobile overflow", async ({ page }) => {
  for (const route of ["/", "/practice", "/lessons"]) {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(route);

    if (route === "/") {
      await expect(page.getByRole("link", { name: "Start the 51-unit curriculum" })).toBeVisible();
    }

    if (route === "/practice") {
      await expect(page.getByRole("link", { name: "Open curriculum" })).toBeVisible();
    }

    if (route === "/lessons") {
      await expect(page.getByRole("link", { name: /Begin next unit|Continue current unit/ })).toBeVisible();
      await expect(page.getByText("51 units shown", { exact: true })).toBeVisible();
    }

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    }));
    expect(dimensions.documentWidth, route).toBeLessThanOrEqual(dimensions.viewportWidth);
  }
});

test("redirects replaced lesson content while preserving its practice drill", async ({ page }) => {
  await page.goto("/lessons/fretboard-map");
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(
    page.getByRole("heading", { name: "Learn to practice before you rush to collect facts" })
  ).toBeVisible();

  await page.goto("/practice?drill=note&lesson=fretboard-map#practice");
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
    page.getByRole("link", { exact: true, name: "Return to curriculum" })
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
