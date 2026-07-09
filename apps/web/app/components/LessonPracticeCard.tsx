"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "../lib/lessons";
import { readStoredLessonProgress } from "../lib/browserStorage";
import {
  getLessonProgressStatus,
  type LessonProgressRecord
} from "../lib/lessonProgress";

interface LessonPracticeCardProps {
  lesson: Lesson;
}

export function LessonPracticeCard({ lesson }: LessonPracticeCardProps) {
  const [progress, setProgress] = useState<LessonProgressRecord[]>([]);
  const status = getLessonProgressStatus(progress, lesson.slug);
  const lessonProgress =
    progress.find((record) => record.slug === lesson.slug) ?? null;

  useEffect(() => {
    setProgress(readStoredLessonProgress());
  }, []);

  return (
    <aside className={`lesson-practice-card lesson-practice-${status}`}>
      <div>
        <span className="control-label">Apply it now</span>
        <div className="lesson-practice-heading">
          <h2>{lesson.practice.label}</h2>
          <span className={`lesson-status-pill status-${status}`}>
            {formatLessonStatus(status)}
          </span>
        </div>
        <p>
          Complete {lesson.practice.criteria.promptCount} questions at{" "}
          {lesson.practice.criteria.minAccuracy}%+ to finish this lesson.
        </p>
        {lessonProgress?.lastAccuracy !== undefined &&
        lessonProgress.lastPromptCount !== undefined ? (
          <p className="lesson-attempt-note">
            Last try: {lessonProgress.lastAccuracy}% over{" "}
            {lessonProgress.lastPromptCount} questions.
          </p>
        ) : null}
      </div>
      <Link className="lesson-cta" href={lesson.practice.href}>
        {getPracticeCtaLabel(status)}
      </Link>
    </aside>
  );
}

function getPracticeCtaLabel(
  status: "not-started" | "in-progress" | "complete"
): string {
  if (status === "complete") {
    return "Practice again";
  }

  if (status === "in-progress") {
    return "Continue lesson practice";
  }

  return "Start lesson practice";
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
