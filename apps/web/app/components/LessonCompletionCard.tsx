"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lesson } from "../lib/lessons";
import {
  readStoredLessonLearningProgress,
  writeStoredLessonLearningProgress
} from "../lib/browserStorage";
import {
  findLessonLearningProgress,
  getLessonLearningProgressStatus,
  markLessonLearningCheckpoint,
  markLessonLearningComplete,
  markLessonLearningStarted,
  type LessonLearningCheckpoint,
  type LessonLearningProgressRecord
} from "../lib/lessonLearningProgress";

interface LessonCompletionCardProps {
  lesson: Lesson;
}

const checkpoints = [
  {
    id: "read",
    label: "I read the concept and fretboard examples."
  },
  {
    id: "play",
    label: "I played the lesson examples on guitar."
  },
  {
    id: "write",
    label: "I tried the songwriting task."
  }
] as const satisfies readonly {
  id: LessonLearningCheckpoint;
  label: string;
}[];

export function LessonCompletionCard({ lesson }: LessonCompletionCardProps) {
  const [progress, setProgress] = useState<LessonLearningProgressRecord[]>([]);
  const lessonProgress = useMemo(
    () => findLessonLearningProgress(progress, lesson.slug),
    [lesson.slug, progress]
  );
  const status = getLessonLearningProgressStatus(progress, lesson.slug);
  const completedCheckpoints = lessonProgress?.completedCheckpoints ?? [];

  useEffect(() => {
    const storedProgress = readStoredLessonLearningProgress();
    const startedProgress = markLessonLearningStarted(
      storedProgress,
      lesson.slug
    );

    if (startedProgress !== storedProgress) {
      writeStoredLessonLearningProgress(startedProgress);
    }

    setProgress(startedProgress);
  }, [lesson.slug]);

  function handleCheckpointChange(checkpoint: LessonLearningCheckpoint): void {
    const nextProgress = markLessonLearningCheckpoint(
      readStoredLessonLearningProgress(),
      lesson.slug,
      checkpoint
    );

    writeStoredLessonLearningProgress(nextProgress);
    setProgress(nextProgress);
  }

  function handleCompleteLesson(): void {
    const nextProgress = markLessonLearningComplete(
      readStoredLessonLearningProgress(),
      lesson.slug
    );

    writeStoredLessonLearningProgress(nextProgress);
    setProgress(nextProgress);
  }

  return (
    <aside className={`lesson-practice-card lesson-practice-${status}`}>
      <div>
        <span className="control-label">Lesson progress</span>
        <div className="lesson-practice-heading">
          <h2>
            {status === "complete"
              ? "Lesson complete"
              : "Complete the guided lesson"}
          </h2>
          <span className={`lesson-status-pill status-${status}`}>
            {formatLessonStatus(status)}
          </span>
        </div>
        <p>
          Mark these checkpoints as you read, play, and write. Drills are
          optional reinforcement after the lesson makes sense.
        </p>
      </div>

      <div className="lesson-checklist" aria-label="Lesson completion checklist">
        {checkpoints.map((checkpoint) => {
          const isChecked = completedCheckpoints.includes(checkpoint.id);

          return (
            <label key={checkpoint.id}>
              <input
                checked={isChecked}
                disabled={isChecked}
                onChange={() => handleCheckpointChange(checkpoint.id)}
                type="checkbox"
              />
              <span>{checkpoint.label}</span>
            </label>
          );
        })}
      </div>

      <button
        className="lesson-cta"
        disabled={status === "complete"}
        onClick={handleCompleteLesson}
        type="button"
      >
        {status === "complete" ? "Completed" : "Mark lesson complete"}
      </button>
    </aside>
  );
}

function formatLessonStatus(
  status: "not-started" | "in-progress" | "complete"
) {
  if (status === "complete") {
    return "Complete";
  }

  if (status === "in-progress") {
    return "In progress";
  }

  return "Not started";
}
