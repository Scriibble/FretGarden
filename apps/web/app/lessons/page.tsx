import Link from "next/link";
import { LessonLibrary } from "../components/LessonLibrary";
import { lessons } from "../lib/lessons";

export default function LessonsPage() {
  return (
    <main className="lesson-shell">
      <header className="lesson-header">
        <div>
          <p className="eyebrow">FretGarden Lessons</p>
          <h1>Short lessons for better practice</h1>
          <p>
            Each lesson explains one concept used by the drills, then points
            you back to the fretboard to practice it.
          </p>
        </div>
        <Link className="lesson-library-link" href="/practice#practice">
          Back to practice
        </Link>
      </header>

      <LessonLibrary lessons={lessons} />
    </main>
  );
}
