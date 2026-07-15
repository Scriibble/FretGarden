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
            <h1>Learn to practice before you rush to collect facts</h1>
            <p>
              Begin with a sustainable practice process, focused attention, and
              dependable time. Each unit asks you to understand, try, adjust,
              apply, and plan a return.
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
