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
        <span className="control-label">Extra practice</span>
        <div className="lesson-practice-heading">
          <h2>{lesson.practice.label}</h2>
          <span className={`lesson-status-pill status-${status}`}>
            Drill {formatLessonStatus(status).toLowerCase()}
          </span>
        </div>
        <p>
          Use this drill after the lesson to check what you remember. It does
          not mark the lesson complete, but {lesson.practice.criteria.promptCount}{" "}
          questions at {lesson.practice.criteria.minAccuracy}%+ is a good
          practice goal.
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
    return "Continue practice drill";
  }

  return "Start practice drill";
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
