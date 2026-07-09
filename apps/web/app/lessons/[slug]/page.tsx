import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCompletionCard } from "../../components/LessonCompletionCard";
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
    title: lesson ? lesson.title : "Lesson not found",
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
        <Link href="/practice#practice">Practice</Link>
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

        {lesson.fretboardApplications.map((section) => (
          <section className="lesson-section" key={section.heading}>
            <span className="control-label">Fretboard application</span>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section className="lesson-section lesson-guided-panel">
          <span className="control-label">Play this now</span>
          <h2>Use the idea on your guitar</h2>
          {lesson.playPrompts.map((prompt) => (
            <div className="lesson-guided-block" key={prompt.title}>
              <h3>{prompt.title}</h3>
              <ol>
                {prompt.instructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ol>
              <p>
                <strong>Listen for:</strong> {prompt.listeningGoal}
              </p>
            </div>
          ))}
        </section>

        <section className="lesson-section">
          <span className="control-label">Song connection</span>
          <h2>{lesson.songConnection.title}</h2>
          <p>
            <strong>Reference:</strong> {lesson.songConnection.reference}
          </p>
          {lesson.songConnection.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <section className="lesson-section lesson-guided-panel">
          <span className="control-label">Write with it</span>
          <h2>{lesson.writeWithIt.title}</h2>
          <p>{lesson.writeWithIt.prompt}</p>
          <ul>
            {lesson.writeWithIt.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ul>
        </section>

        <section className="lesson-section">
          <span className="control-label">Check understanding</span>
          <h2>Before you move on</h2>
          <dl className="lesson-check-list">
            {lesson.checkUnderstanding.map((check) => (
              <div key={check.question}>
                <dt>{check.question}</dt>
                <dd>{check.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <LessonCompletionCard lesson={lesson} />

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
              <strong>Back to lessons</strong>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
