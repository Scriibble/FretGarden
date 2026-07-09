"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "../lib/lessons";
import { readStoredLessonProgress } from "../lib/browserStorage";
import {
  buildCourseProgress,
  getLessonProgressStatus,
  type CoursePathState,
  type LessonProgressRecord
} from "../lib/lessonProgress";

interface LessonLibraryProps {
  lessons: readonly Lesson[];
}

export function LessonLibrary({ lessons }: LessonLibraryProps) {
  const [progress, setProgress] = useState<LessonProgressRecord[]>([]);
  const courseProgress = buildCourseProgress(lessons, progress);
  const currentStepNumber = courseProgress.currentLesson
    ? (courseProgress.items.find(
        (item) => item.lesson.slug === courseProgress.currentLesson?.slug
      )?.index ?? 0) + 1
    : null;

  useEffect(() => {
    setProgress(readStoredLessonProgress());
  }, []);

  return (
    <>
      <section
        className="course-overview"
        data-testid="course-overview"
        aria-label="Course progress"
      >
        <div className="course-overview-main">
          <div>
            <span className="control-label">Course path</span>
            <h2>
              {courseProgress.isComplete
                ? "You finished the current path"
                : courseProgress.currentLesson?.title ?? "Start the course"}
            </h2>
            <p>
              {courseProgress.isComplete
                ? "Every lesson in this first Pocket.Practice path is complete. Revisit weak spots or keep refining the drills."
                : courseProgress.currentLesson
                  ? `Your current lesson is step ${currentStepNumber} of ${courseProgress.totalCount}.`
                  : "Begin with the fretboard map, then move through the path one lesson at a time."}
            </p>
          </div>

          <div className="course-progress-card">
            <strong>
              {courseProgress.completedCount}/{courseProgress.totalCount}
            </strong>
            <span>lessons complete</span>
            <div
              aria-label={`${courseProgress.percentComplete}% of lessons complete`}
              className="course-progress-meter"
            >
              <span style={{ width: `${courseProgress.percentComplete}%` }} />
            </div>
          </div>
        </div>

        <div className="course-overview-actions">
          {courseProgress.currentLesson ? (
            <>
              <Link
                className="lesson-cta"
                href={`/lessons/${courseProgress.currentLesson.slug}`}
              >
                Open current lesson
              </Link>
              <Link
                className="lesson-secondary-link"
                href={courseProgress.currentLesson.practice.href}
              >
                Practice current lesson
              </Link>
            </>
          ) : (
            <Link className="lesson-cta" href="/#practice">
              Open practice hub
            </Link>
          )}
        </div>

        <ol className="course-path-list" aria-label="Ordered course path">
          {courseProgress.items.map((item) => (
            <li
              className={`course-path-step path-${item.pathState}`}
              data-testid={`course-step-${item.lesson.slug}`}
              key={item.lesson.slug}
            >
              <span className="course-step-marker">{item.index + 1}</span>
              <div className="course-step-body">
                <div className="lesson-card-meta">
                  <span className="control-label">{item.lesson.eyebrow}</span>
                  <span className={`lesson-status-pill status-${item.status}`}>
                    {formatLessonStatus(item.status)}
                  </span>
                </div>
                <Link href={`/lessons/${item.lesson.slug}`}>
                  {item.lesson.title}
                </Link>
                <p>{getPathStateDescription(item.pathState)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lesson-library-section" aria-label="Lesson library">
        <div className="section-heading">
          <span className="control-label">Lesson Library</span>
          <h2>Browse every lesson</h2>
        </div>

        <div className="lesson-grid">
          {lessons.map((lesson) => {
            const status = getLessonProgressStatus(progress, lesson.slug);
            const lessonProgress =
              progress.find((record) => record.slug === lesson.slug) ?? null;

            return (
              <article
                className={`lesson-card lesson-card-${status}`}
                key={lesson.slug}
              >
                <div>
                  <div className="lesson-card-meta">
                    <span className="control-label">{lesson.eyebrow}</span>
                    <span className={`lesson-status-pill status-${status}`}>
                      {formatLessonStatus(status)}
                    </span>
                  </div>
                  <h2>{lesson.title}</h2>
                  <p>{lesson.summary}</p>
                  <div className="lesson-requirements">
                    <span>
                      {lesson.practice.criteria.promptCount} questions at{" "}
                      {lesson.practice.criteria.minAccuracy}%+
                    </span>
                    {lessonProgress?.lastAccuracy !== undefined &&
                    lessonProgress.lastPromptCount !== undefined ? (
                      <span>
                        Last try: {lessonProgress.lastAccuracy}% over{" "}
                        {lessonProgress.lastPromptCount} questions
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="lesson-card-actions">
                  <Link className="lesson-cta" href={`/lessons/${lesson.slug}`}>
                    Read lesson
                  </Link>
                  <Link
                    className="lesson-secondary-link"
                    href={lesson.practice.href}
                  >
                    {getLessonPracticeLabel(status)}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function getPathStateDescription(state: CoursePathState) {
  if (state === "complete") {
    return "Finished. Revisit it anytime for review.";
  }

  if (state === "current") {
    return "Current step. Complete its drill target to move forward.";
  }

  if (state === "up-next") {
    return "Up next after your current lesson.";
  }

  return "Later in the path.";
}

function formatLessonStatus(status: "not-started" | "in-progress" | "complete") {
  if (status === "complete") {
    return "Complete";
  }

  if (status === "in-progress") {
    return "In progress";
  }

  return "Not started";
}

function getLessonPracticeLabel(
  status: "not-started" | "in-progress" | "complete"
) {
  if (status === "complete") {
    return "Practice again";
  }

  if (status === "in-progress") {
    return "Continue practice";
  }

  return "Practice now";
}
