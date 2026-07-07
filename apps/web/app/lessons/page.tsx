import Link from "next/link";
import { lessons } from "../lib/lessons";

export default function LessonsPage() {
  return (
    <main className="lesson-shell">
      <header className="lesson-header">
        <div>
          <p className="eyebrow">Pocket.Practice Lessons</p>
          <h1>Short lessons for better practice</h1>
          <p>
            Each lesson explains one concept used by the drills, then points
            you back to the fretboard to practice it.
          </p>
        </div>
        <Link className="lesson-library-link" href="/#practice">
          Back to practice
        </Link>
      </header>

      <section className="lesson-grid" aria-label="Lesson library">
        {lessons.map((lesson) => (
          <article className="lesson-card" key={lesson.slug}>
            <div>
              <span className="control-label">{lesson.eyebrow}</span>
              <h2>{lesson.title}</h2>
              <p>{lesson.summary}</p>
            </div>
            <Link className="lesson-cta" href={`/lessons/${lesson.slug}`}>
              Read lesson
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
