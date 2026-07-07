"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "../lib/lessons";
import {
  LESSON_PROGRESS_STORAGE_KEY,
  getLessonProgressStatus,
  parseLessonProgress,
  type LessonProgressRecord
} from "../lib/lessonProgress";

interface LessonLibraryProps {
  lessons: readonly Lesson[];
}

export function LessonLibrary({ lessons }: LessonLibraryProps) {
  const [progress, setProgress] = useState<LessonProgressRecord[]>([]);

  useEffect(() => {
    setProgress(
      parseLessonProgress(window.localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY))
    );
  }, []);

  return (
    <section className="lesson-grid" aria-label="Lesson library">
      {lessons.map((lesson) => {
        const status = getLessonProgressStatus(progress, lesson.slug);

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
            </div>
            <div className="lesson-card-actions">
              <Link className="lesson-cta" href={`/lessons/${lesson.slug}`}>
                Read lesson
              </Link>
              <Link className="lesson-secondary-link" href={lesson.practice.href}>
                {getLessonPracticeLabel(status)}
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
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
