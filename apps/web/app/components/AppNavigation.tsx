import Link from "next/link";
import { FRETBOARD_MAP_LEARNER_BRIDGE_ENABLED } from "../lib/education/migration/fretboardMapLearnerProgress";
import styles from "./appNavigation.module.css";

export type ProductPage =
  | "practice"
  | "explore"
  | "lessons"
  | "progress"
  | "history";

interface AppNavigationProps {
  activePage: ProductPage;
}

interface ProductNavigationItem {
  key: ProductPage;
  href: string;
  label: string;
}

export function AppNavigation({ activePage }: AppNavigationProps) {
  const items = buildProductNavigationItems(
    FRETBOARD_MAP_LEARNER_BRIDGE_ENABLED
  );

  return (
    <nav className={styles.navigation} aria-label="Product navigation">
      <Link className={styles.brand} href="/" aria-label="FretGarden home">
        <img src="/brand/fretgarden-icon.svg" width="34" height="34" alt="" />
        <strong>FretGarden</strong>
      </Link>
      <div className={styles.links}>
        {items.map((item) => (
          <Link
            aria-current={activePage === item.key ? "page" : undefined}
            className={styles.link}
            href={item.href}
            key={item.key}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function buildProductNavigationItems(
  progressEnabled: boolean
): ProductNavigationItem[] {
  return [
    { key: "practice", href: "/practice", label: "Practice" },
    { key: "explore", href: "/explore", label: "Explore" },
    { key: "lessons", href: "/lessons", label: "Lessons" },
    ...(progressEnabled
      ? [{ key: "progress" as const, href: "/progress", label: "Progress" }]
      : []),
    { key: "history", href: "/history", label: "History" }
  ];
}
