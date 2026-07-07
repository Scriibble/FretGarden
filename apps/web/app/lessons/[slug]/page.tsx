import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonPracticeCard } from "../../components/LessonPracticeCard";
import {
  getLesson,
  getNextLesson,
  getPreviousLesson,
  lessons
} from "../../lib/lessons";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug
  }));
}

export async function generateMetadata({
  params
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);

  return {
    title: lesson ? `${lesson.title} | Pocket.Practice` : "Lesson not found",
    description: lesson?.summary
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);

  if (!lesson) {
    notFound();
  }

  const previousLesson = getPreviousLesson(lesson.slug);
  const nextLesson = getNextLesson(lesson.slug);

  return (
    <main className="lesson-shell lesson-page">
      <nav className="lesson-nav" aria-label="Lesson navigation">
        <Link href="/lessons">All lessons</Link>
        <Link href="/#practice">Practice</Link>
      </nav>

      <article className="lesson-content">
        <header className="lesson-header">
          <div>
            <p className="eyebrow">{lesson.eyebrow}</p>
            <h1>{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>
        </header>

        {lesson.sections.map((section) => (
          <section className="lesson-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <LessonPracticeCard lesson={lesson} />

        <nav className="lesson-sequence-nav" aria-label="Lesson sequence">
          {previousLesson ? (
            <Link href={`/lessons/${previousLesson.slug}`}>
              <span>Previous lesson</span>
              <strong>{previousLesson.title}</strong>
            </Link>
          ) : (
            <span />
          )}

          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.slug}`}>
              <span>Next lesson</span>
              <strong>{nextLesson.title}</strong>
            </Link>
          ) : (
            <Link href="/lessons">
              <span>Course path</span>
              <strong>Review completed lessons</strong>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
