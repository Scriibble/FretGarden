import { foundationCurriculum } from "@pocket-practice/education-content";
import Link from "next/link";
import { AppNavigation } from "../components/AppNavigation";
import { CurriculumLibrary } from "../components/curriculum/CurriculumLibrary";
import styles from "./curriculumPage.module.css";

export default function LessonsPage() {
  const implementedUnits = foundationCurriculum.units.filter(
    ({ status }) => status === "implemented"
  );
  const mappedUnitCount = foundationCurriculum.units.filter(
    ({ status }) => status === "mapped"
  ).length;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <AppNavigation activePage="lessons" />
        <header className={styles.pageHeader}>
          <div>
            <span>FretGarden curriculum</span>
            <h1>Learn guitar one clear step at a time</h1>
            <p>
              Start with a simple practice plan, steady focus, and clear timing.
              Each lesson asks you to understand, try, adjust, use the idea, and
              come back for review.
            </p>
          </div>
          <Link href="/practice#practice">Open practice tools</Link>
        </header>

        <CurriculumLibrary
          mappedUnitCount={mappedUnitCount}
          units={implementedUnits}
        />
      </div>
    </main>
  );
}
