import {
  foundationCurriculum,
  type CurriculumIndexEntry
} from "@pocket-practice/education-content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppNavigation } from "../../components/AppNavigation";
import { CurriculumUnitExperience } from "../../components/curriculum/CurriculumUnitExperience";
import styles from "../curriculumPage.module.css";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

const replacedLessonSlugs = new Set([
  "fretboard-map",
  "repeating-notes",
  "triads",
  "scale-degrees",
  "intervals",
  "octave-shapes",
  "triad-inversions",
  "major-scale-landmarks"
]);

const implementedUnits = foundationCurriculum.units.filter(
  ({ status }) => status === "implemented"
);

export function generateStaticParams() {
  return implementedUnits.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const unit = implementedUnits.find((candidate) => candidate.slug === slug);
  return {
    title: unit?.title ?? "Lesson moved",
    description: unit?.summary ?? "Continue in the FretGarden curriculum."
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  if (replacedLessonSlugs.has(slug)) redirect("/lessons");

  const unit = implementedUnits.find((candidate) => candidate.slug === slug);
  if (!unit) notFound();

  const lesson = foundationCurriculum.lessons.find(
    (candidate) => candidate.unitId === unit.id
  );
  const assessment = foundationCurriculum.assessments.find(
    (candidate) => candidate.unitId === unit.id
  );
  const reviewPlan = foundationCurriculum.reviewPlans.find(
    (candidate) => candidate.unitId === unit.id
  );
  if (!lesson || !assessment || !reviewPlan) notFound();

  const unitIndex = implementedUnits.findIndex(({ id }) => id === unit.id);
  const previousUnit = implementedUnits[unitIndex - 1] ?? null;
  const nextUnit = implementedUnits[unitIndex + 1] ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <AppNavigation activePage="lessons" />
        <nav className={styles.lessonNav} aria-label="Lesson navigation">
          <Link href="/lessons">All curriculum units</Link>
          <Link href="/practice#practice">Practice tools</Link>
        </nav>
        <CurriculumUnitExperience
          assessment={assessment}
          lesson={lesson}
          nextUnit={nextUnit as CurriculumIndexEntry | null}
          previousUnit={previousUnit as CurriculumIndexEntry | null}
          reviewPlan={reviewPlan}
          unit={unit}
        />
      </div>
    </main>
  );
}
