"use client";

import type {
  CurriculumAssessment,
  CurriculumIndexEntry,
  CurriculumLesson,
  CurriculumReviewPlan
} from "@pocket-practice/education-content";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CURRICULUM_PROGRESS_STORAGE_KEY,
  areCurriculumPrerequisitesComplete,
  canCompleteCurriculumLesson,
  finalizeCurriculumProgress,
  getCurriculumRecord,
  inspectCurriculumProgress,
  serializeCurriculumProgress,
  startCurriculumUnit,
  toggleCurriculumCriterion,
  updateCurriculumAnswer,
  updateCurriculumField,
  type CurriculumProgressRecord
} from "../../lib/curriculum/curriculumProgress";
import { FocusTimerActivity } from "./FocusTimerActivity";
import { MetronomeActivity } from "./MetronomeActivity";
import { PracticeIdentityActivity } from "./PracticeIdentityActivity";
import { StructuredMusicBlock } from "./StructuredMusicBlock";
import styles from "./curriculum.module.css";

interface CurriculumUnitExperienceProps {
  unit: CurriculumIndexEntry;
  lesson: CurriculumLesson;
  assessment: CurriculumAssessment;
  reviewPlan: CurriculumReviewPlan;
  previousUnit: CurriculumIndexEntry | null;
  nextUnit: CurriculumIndexEntry | null;
}

export function CurriculumUnitExperience({
  unit,
  lesson,
  assessment,
  reviewPlan,
  previousUnit,
  nextUnit
}: CurriculumUnitExperienceProps) {
  const [records, setRecords] = useState<CurriculumProgressRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const storageWritableRef = useRef(true);

  useEffect(() => {
    const now = new Date().toISOString();
    let stored: CurriculumProgressRecord[] = [];
    try {
      const inspection = inspectCurriculumProgress(
        window.localStorage.getItem(CURRICULUM_PROGRESS_STORAGE_KEY)
      );
      if (inspection.status === "unreadable") {
        storageWritableRef.current = false;
        setStorageWarning(true);
        setHydrated(true);
        return;
      }
      stored = inspection.records;
    } catch {
      storageWritableRef.current = false;
      setStorageWarning(true);
      setHydrated(true);
      return;
    }
    const started = startCurriculumUnit(stored, unit.id, now);
    setRecords(started);
    setHydrated(true);
    if (started.length !== stored.length) {
      try {
        window.localStorage.setItem(
          CURRICULUM_PROGRESS_STORAGE_KEY,
          serializeCurriculumProgress(started)
        );
      } catch {
        setStorageWarning(true);
      }
    }
  }, [unit.id]);

  const persist = useCallback((next: CurriculumProgressRecord[]) => {
    setRecords(next);
    if (!storageWritableRef.current) return;
    try {
      window.localStorage.setItem(
        CURRICULUM_PROGRESS_STORAGE_KEY,
        serializeCurriculumProgress(next)
      );
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, []);

  const record = useMemo(
    () =>
      getCurriculumRecord(records, unit.id) ?? {
        unitId: unit.id,
        startedAt: "",
        knowledgeAnswers: {},
        completedCriteria: [],
        fields: {}
      },
    [records, unit.id]
  );

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      persist(updateCurriculumField(records, unit.id, field, value));
    },
    [persist, records, unit.id]
  );

  const readyToComplete = hydrated && canCompleteCurriculumLesson(record, lesson);
  const prerequisitesComplete = areCurriculumPrerequisitesComplete(
    records,
    unit.requiredPriorUnitIds
  );
  const readyToCompleteWithPrerequisites = readyToComplete && prerequisitesComplete;
  const completed = Boolean(record.completedAt);

  return (
    <article className={styles.lesson}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Unit {unit.order} · {formatLevel(unit.level)}</p>
          <h1>{unit.title}</h1>
          <p>{unit.summary}</p>
        </div>
        <dl className={styles.unitFacts}>
          <div><dt>Lesson</dt><dd>{lesson.title}</dd></div>
          <div><dt>Estimated time</dt><dd>{lesson.estimatedMinutes} minutes</dd></div>
          <div><dt>Status</dt><dd>{completed ? "Lesson check complete" : prerequisitesComplete ? "In progress" : "Previewing"}</dd></div>
        </dl>
      </header>

      {storageWarning ? (
        <div className={styles.warning} role="alert">
          <strong>Local lesson progress could not be saved.</strong>
          <p>The lesson remains usable. Keep your written reflection somewhere you control before leaving this page.</p>
        </div>
      ) : null}

      {!prerequisitesComplete ? (
        <div className={styles.prerequisiteNotice} role="note">
          <strong>Preview available</strong>
          <p>Complete the required prior unit before this unit can be marked complete. You may still read and try every activity.</p>
        </div>
      ) : null}

      <section className={styles.objective} aria-labelledby="objective-title">
        <p className={styles.eyebrow}>What you will learn</p>
        <h2 id="objective-title">{lesson.objective}</h2>
        <p><strong>Why this matters:</strong> {lesson.whyItMatters}</p>
        <div>
          <strong>Before you begin</strong>
          <p>{lesson.priorKnowledge.length === 0 ? "No prior guitar knowledge is required." : lesson.priorKnowledge.join(" · ")}</p>
        </div>
      </section>

      <div className={styles.readingFlow}>
        {lesson.contentBlocks.map((block) => {
          if (block.type === "text") {
            return (
              <section className={styles.contentSection} key={block.id}>
                <h2>{block.heading}</h2>
                {block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            );
          }
          if (block.type === "callout") {
            return (
              <aside className={`${styles.callout} ${styles[`callout-${block.tone}`]}`} key={block.id}>
                <h2>{block.heading}</h2>
                <p>{block.body}</p>
              </aside>
            );
          }
          if (block.type === "rhythm") {
            return (
              <section className={styles.contentSection} key={block.id}>
                <p className={styles.eyebrow}>See and count it</p>
                <h2>{block.heading}</h2>
                <div className={styles.rhythmGrid} aria-label={block.accessibilityDescription}>
                  {block.counts.map((count) => <code key={count}>{count}</code>)}
                </div>
                <p>{block.explanation}</p>
              </section>
            );
          }
          if (block.type === "guitar-task") {
            return (
              <section className={styles.playBlock} key={block.id}>
                <p className={styles.eyebrow}>Play it</p>
                <h2>{block.heading}</h2>
                <p className={styles.visuallyHidden}>{block.accessibilityDescription}</p>
                <ol>{block.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
                <p><strong>Listen for:</strong> {block.listenFor}</p>
                <ul>{block.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
              </section>
            );
          }
          if (
            block.type === "chord-diagram" ||
            block.type === "tablature" ||
            block.type === "rhythm-grid" ||
            block.type === "instrument-setup" ||
            block.type === "learning-stage" ||
            block.type === "fretboard-map" ||
            block.type === "scale-pattern" ||
            block.type === "progression-chart" ||
            block.type === "lead-sheet"
          ) {
            return <StructuredMusicBlock block={block} key={block.id} />;
          }
          return (
            <section className={styles.contentSection} key={block.id}>
              <p className={styles.eyebrow}>Reflect</p>
              <h2>{block.heading}</h2>
              <p>{block.prompt}</p>
              <label>
                <span>{block.fieldLabel}</span>
                <textarea
                  onChange={(event) => handleFieldChange(block.id, event.target.value)}
                  placeholder={block.placeholder}
                  rows={4}
                  value={record.fields[block.id] ?? ""}
                />
              </label>
            </section>
          );
        })}
      </div>

      {lesson.interactive === "practice-identity" ? (
        <PracticeIdentityActivity record={record} onFieldChange={handleFieldChange} />
      ) : null}
      {lesson.interactive === "focus-timer" ? (
        <FocusTimerActivity record={record} onFieldChange={handleFieldChange} />
      ) : null}
      {lesson.interactive === "metronome" ? (
        <MetronomeActivity record={record} onFieldChange={handleFieldChange} />
      ) : null}

      <section className={styles.band} aria-labelledby="guided-practice-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Guided practice</p>
          <h2 id="guided-practice-title">Build the skill in manageable steps</h2>
        </div>
        <div className={styles.exerciseList}>
          {lesson.guidedExercises.map((exercise, index) => (
            <article className={styles.exercise} key={exercise.id}>
              <span>Exercise {index + 1}</span>
              <h3>{exercise.title}</h3>
              <p>{exercise.purpose}</p>
              <ol>{exercise.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
              <div className={styles.criteriaColumns}>
                <div><strong>Success sounds or feels like</strong><ul>{exercise.successCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Make it smaller when</strong><ul>{exercise.reduceDifficultyWhen.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Increase difficulty when</strong><ul>{exercise.increaseDifficultyWhen.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="mistakes-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Common mistakes</p>
          <h2 id="mistakes-title">Match the problem to a better next try</h2>
        </div>
        <div className={styles.mistakeList}>
          {lesson.commonMistakes.map((mistake) => (
            <article key={mistake.id}>
              <h3>{mistake.symptom}</h3>
              <p><strong>Likely cause:</strong> {mistake.likelyCause}</p>
              <p><strong>Try:</strong> {mistake.adjustment}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="knowledge-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Knowledge check</p>
          <h2 id="knowledge-title">Explain the practice decision</h2>
        </div>
        <div className={styles.knowledgeList}>
          {lesson.knowledgeChecks.map((check, checkIndex) => {
            const answer = record.knowledgeAnswers[check.id];
            const isCorrect = answer === check.correctAnswer;
            return (
              <fieldset key={check.id}>
                <legend>{checkIndex + 1}. {check.prompt}</legend>
                {check.options.map((option) => (
                  <label key={option}>
                    <input
                      checked={answer === option}
                      name={check.id}
                      onChange={() => persist(updateCurriculumAnswer(records, unit.id, check.id, option))}
                      type="radio"
                      value={option}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {answer ? (
                  <p className={isCorrect ? styles.correct : styles.incorrect} role="status">
                    <strong>{isCorrect ? "Correct." : "Not yet."}</strong> {isCorrect ? check.explanation : check.incorrectFeedback?.[answer] ?? "Read the explanation, then choose the answer that helps the music."}
                  </p>
                ) : null}
              </fieldset>
            );
          })}
        </div>
      </section>

      <section className={styles.mastery} aria-labelledby="mastery-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Check your work</p>
          <h2 id="mastery-title">{assessment.title}</h2>
          <p>{assessment.passingRule}</p>
        </div>
        <div className={styles.masteryList}>
          {lesson.masteryCriteria.map((criterion) => (
            <label key={criterion.id}>
              <input
                checked={record.completedCriteria.includes(criterion.id)}
                onChange={() => persist(toggleCurriculumCriterion(records, unit.id, criterion.id))}
                type="checkbox"
              />
              <span>
                <strong>{criterion.description}</strong>
                <small>{formatVerification(criterion.verification)}</small>
              </span>
            </label>
          ))}
        </div>
        <button
          className={styles.primaryButton}
          disabled={!readyToCompleteWithPrerequisites || completed}
          onClick={() => persist(finalizeCurriculumProgress(records, lesson, new Date().toISOString()))}
          type="button"
        >
          {completed ? "Lesson check complete" : !prerequisitesComplete ? "Complete the prior lesson first" : readyToComplete ? "Complete lesson check" : "Finish checks to complete"}
        </button>
        <p className={styles.evidenceNote}>
          You check off guitar-playing tasks yourself. FretGarden only grades
          tasks where you tap, click, or choose an answer on screen.
        </p>
      </section>

      <section className={styles.review} aria-labelledby="review-title">
        <p className={styles.eyebrow}>Review plan</p>
        <h2 id="review-title">Return before the idea fades</h2>
        <div className={styles.reviewGrid}>
          <ReviewColumn title="Now" items={reviewPlan.immediateReview} />
          <ReviewColumn title="Next session" items={reviewPlan.nextSessionReview} />
          <ReviewColumn title="One week" items={reviewPlan.oneWeekReview} />
          <ReviewColumn title="Long term" items={reviewPlan.longTermReview} />
        </div>
        <p><strong>Optional extension:</strong> {lesson.optionalExtension}</p>
        {lesson.reinforcement ? (
          <Link className={styles.secondaryButton} href={lesson.reinforcement.href}>
            {lesson.reinforcement.label}
          </Link>
        ) : null}
      </section>

      <nav className={styles.sequenceNav} aria-label="Curriculum sequence">
        {previousUnit ? <Link href={`/lessons/${previousUnit.slug}`}><span>Previous unit</span><strong>{previousUnit.title}</strong></Link> : <Link href="/lessons"><span>Curriculum</span><strong>All foundation units</strong></Link>}
        {nextUnit ? <Link href={`/lessons/${nextUnit.slug}`}><span>Next unit</span><strong>{nextUnit.title}</strong></Link> : <Link href="/lessons"><span>Foundation complete</span><strong>Review the path</strong></Link>}
      </nav>
    </article>
  );
}

function ReviewColumn({ title, items }: { title: string; items: string[] }) {
  return <div><strong>{title}</strong>{items.map((item) => <p key={item}>{item}</p>)}</div>;
}

function formatLevel(level: CurriculumIndexEntry["level"]): string {
  return level.split("-").map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`).join(" ");
}

function formatVerification(value: CurriculumLesson["masteryCriteria"][number]["verification"]): string {
  const labels = {
    automatic: "Automatically evaluated",
    "guided-self-check": "Guided check",
    "recorded-value": "Record a value",
    reflection: "Written reflection",
    "performance-checklist": "Playing checklist"
  } as const;
  return labels[value];
}
