"use client";

export interface PracticeReviewMetric {
  label: string;
  value: string;
}

export interface PracticeReviewItem {
  id: string;
  title: string;
  detail: string;
}

export interface PracticeReviewSection {
  title: string;
  emptyMessage: string;
  items?: PracticeReviewItem[];
  chips?: string[];
}

export interface LessonReviewOutcome {
  status: "complete" | "in-progress";
  title: string;
  description: string;
  criteriaLabel: string;
}

interface PracticeReviewPanelProps {
  title: string;
  metrics: PracticeReviewMetric[];
  missedPrompts: PracticeReviewItem[];
  weakSpots: PracticeReviewItem[];
  breakdowns: PracticeReviewSection[];
  lessonOutcome: LessonReviewOutcome | null;
  canPracticeMisses: boolean;
  onPracticeAgain: () => void;
  onPracticeMisses: () => void;
}

export function PracticeReviewPanel({
  title,
  metrics,
  missedPrompts,
  weakSpots,
  breakdowns,
  lessonOutcome,
  canPracticeMisses,
  onPracticeAgain,
  onPracticeMisses
}: PracticeReviewPanelProps) {
  return (
    <section
      className="completion-panel review-panel"
      data-testid="session-summary"
      aria-labelledby="session-summary-title"
    >
      <div className="completion-heading">
        <div>
          <p className="eyebrow">Session Review</p>
          <h3 id="session-summary-title">{title}</h3>
        </div>
        <div className="review-actions">
          {canPracticeMisses ? (
            <button onClick={onPracticeMisses} type="button">
              Practice missed prompts
            </button>
          ) : null}
          <button onClick={onPracticeAgain} type="button">
            Practice again
          </button>
        </div>
      </div>

      {lessonOutcome ? (
        <div
          className={`lesson-outcome lesson-outcome-${lessonOutcome.status}`}
        >
          <div>
            <span className="control-label">Lesson target</span>
            <strong>{lessonOutcome.title}</strong>
            <p>{lessonOutcome.description}</p>
          </div>
          <span>{lessonOutcome.criteriaLabel}</span>
        </div>
      ) : null}

      <div className="summary-metrics" aria-label="Session metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span className="control-label">{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className="missed-prompts">
        <span className="control-label">Missed prompts</span>
        {missedPrompts.length > 0 ? (
          <ul>
            {missedPrompts.map((missedPrompt) => (
              <li key={missedPrompt.id}>
                <strong>{missedPrompt.title}</strong>
                <span>{missedPrompt.detail}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No missed prompts. Clean run.</p>
        )}
      </div>

      <div className="performance-panel">
        <div className="performance-section">
          <span className="control-label">Weak spots</span>
          {weakSpots.length > 0 ? (
            <div className="performance-card-list">
              {weakSpots.map((weakSpot) => (
                <div className="performance-card" key={weakSpot.id}>
                  <strong>{weakSpot.title}</strong>
                  <span>{weakSpot.detail}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No weak spots yet. Every tracked category is clean.</p>
          )}
        </div>

        {breakdowns.map((breakdown) => (
          <div className="performance-section" key={breakdown.title}>
            <span className="control-label">{breakdown.title}</span>
            {breakdown.items && breakdown.items.length > 0 ? (
              <div className="performance-card-list">
                {breakdown.items.map((item) => (
                  <div className="performance-card" key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                ))}
              </div>
            ) : breakdown.chips && breakdown.chips.length > 0 ? (
              <div className="performance-chip-list">
                {breakdown.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
            ) : (
              <p>{breakdown.emptyMessage}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
