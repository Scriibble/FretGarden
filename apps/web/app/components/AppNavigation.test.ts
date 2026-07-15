import { describe, expect, it } from "vitest";
import { buildProductNavigationItems } from "./AppNavigation";

describe("product navigation", () => {
  it("includes the learner progress destination when the bridge is enabled", () => {
    expect(buildProductNavigationItems(true)).toContainEqual({
      key: "progress",
      href: "/progress",
      label: "Progress"
    });
  });

  it("removes only progress when the bridge is disabled", () => {
    const items = buildProductNavigationItems(false);

    expect(items.map(({ key }) => key)).toEqual([
      "practice",
      "explore",
      "lessons",
      "history"
    ]);
  });
});
