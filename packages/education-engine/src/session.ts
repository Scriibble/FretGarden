import type { SessionItem } from "./contracts";

export function composeSession(input: {
  availableMinutes: number;
  candidates: SessionItem[];
  reviewOnly?: boolean;
}): SessionItem[] {
  const budget = Math.max(0, input.availableMinutes);
  const reviewBudget = input.reviewOnly === true ? budget : Math.floor(budget * 0.4);
  let used = 0;
  let reviewUsed = 0;
  const selected: SessionItem[] = [];
  const ordered = [...input.candidates].sort((left, right) => right.priority - left.priority);

  for (const item of ordered) {
    if (used + item.estimatedMinutes > budget) {
      continue;
    }

    if (item.kind === "review" && reviewUsed + item.estimatedMinutes > reviewBudget) {
      continue;
    }

    selected.push(item);
    used += item.estimatedMinutes;
    if (item.kind === "review") {
      reviewUsed += item.estimatedMinutes;
    }
  }

  return selected;
}
