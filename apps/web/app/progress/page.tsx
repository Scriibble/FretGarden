import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNavigation } from "../components/AppNavigation";
import { FretboardMapProgress } from "../components/education/FretboardMapProgress";
import { FRETBOARD_MAP_LEARNER_BRIDGE_ENABLED } from "../lib/education/migration/fretboardMapLearnerProgress";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Learning Progress",
  description:
    "Preserved fretboard-map history beside what guided practice has checked."
};

export default function ProgressPage() {
  if (!FRETBOARD_MAP_LEARNER_BRIDGE_ENABLED) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <AppNavigation activePage="progress" />
        <FretboardMapProgress />
      </div>
    </main>
  );
}
