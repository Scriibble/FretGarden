"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "../lib/lessons";
import { readStoredLessonLearningProgress } from "../lib/browserStorage";
import {
  buildLearningCourseProgress,
  type LearningPathState,
  type LessonLearningProgressRecord
} from "../lib/lessonLearningProgress";

interface LessonLibraryProps {
  lessons: readonly Lesson[];
}

export function LessonLibrary({ lessons }: LessonLibraryProps) {
  const [learningProgress, setLearningProgress] = useState<
    LessonLearningProgressRecord[]
  >([]);
  const courseProgress = buildLearningCourseProgress(lessons, learningProgress);
  const currentStepNumber = courseProgress.currentLesson
    ? (courseProgress.items.find(
        (item) => item.lesson.slug === courseProgress.currentLesson?.slug
      )?.index ?? 0) + 1
    : null;

  useEffect(() => {
    setLearningProgress(readStoredLessonLearningProgress());
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
                ? "Every guided lesson in this first FretGarden path is complete. Revisit a lesson or practice with drills."
                : courseProgress.currentLesson
                  ? `Your current lesson is step ${currentStepNumber} of ${courseProgress.totalCount}.`
                  : "Begin with the fretboard map, then read, play, and write through the path one lesson at a time."}
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
                Practice with drill
              </Link>
            </>
          ) : (
            <Link className="lesson-cta" href="/practice#practice">
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

    </>
  );
}

function getPathStateDescription(state: LearningPathState) {
  if (state === "complete") {
    return "Finished. Revisit it anytime for review.";
  }

  if (state === "current") {
    return "Current step. Read, play, and write through this lesson.";
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
