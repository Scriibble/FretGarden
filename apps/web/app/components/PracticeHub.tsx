"use client";

import Link from "next/link";

interface PracticeHubProps {
  noteLastSessionLabel: string;
  noteWeakSpotLabel: string;
  notePresetLabel: string;
  onStartNote: () => void;
  chordLastSessionLabel: string;
  chordWeakSpotLabel: string;
  chordPresetLabel: string;
  onStartChord: () => void;
  scaleLastSessionLabel: string;
  scaleWeakSpotLabel: string;
  scalePresetLabel: string;
  onStartScale: () => void;
  intervalLastSessionLabel: string;
  intervalWeakSpotLabel: string;
  intervalPresetLabel: string;
  onStartInterval: () => void;
  courseRecommendationTitle: string;
  courseRecommendationDescription: string;
  courseLessonHref: string;
  coursePracticeHref: string;
  recommendationTitle: string;
  recommendationDescription: string;
  onStartRecommendation: () => void;
}

export function PracticeHub({
  noteLastSessionLabel,
  noteWeakSpotLabel,
  notePresetLabel,
  onStartNote,
  chordLastSessionLabel,
  chordWeakSpotLabel,
  chordPresetLabel,
  onStartChord,
  scaleLastSessionLabel,
  scaleWeakSpotLabel,
  scalePresetLabel,
  onStartScale,
  intervalLastSessionLabel,
  intervalWeakSpotLabel,
  intervalPresetLabel,
  onStartInterval,
  courseRecommendationTitle,
  courseRecommendationDescription,
  courseLessonHref,
  coursePracticeHref,
  recommendationTitle,
  recommendationDescription,
  onStartRecommendation
}: PracticeHubProps) {
  return (
    <section className="practice-hub" aria-label="Practice hub">
      <div className="hub-heading">
        <div>
          <p className="eyebrow">Practice Hub</p>
          <h2>Choose today&apos;s session</h2>
        </div>
        <div className="hub-heading-actions">
          <p>
            Start from a preset, review weak spots, or jump back into the active
            fretboard.
          </p>
          <Link className="lesson-library-link" href="/lessons">
            Open lesson library
          </Link>
        </div>
      </div>

      <article className="course-recommendation-card">
        <div>
          <span className="control-label">Course recommendation</span>
          <h3>{courseRecommendationTitle}</h3>
          <p>{courseRecommendationDescription}</p>
        </div>
        <div className="hub-heading-actions">
          <Link className="lesson-cta" href={courseLessonHref}>
            Open lesson
          </Link>
          <Link className="lesson-secondary-link" href={coursePracticeHref}>
            Practice lesson
          </Link>
        </div>
      </article>

      <div className="hub-grid">
        <article className="hub-card">
          <div>
            <span className="control-label">Note Recognition</span>
            <h3>Find notes by string</h3>
            <p>Train the fretboard map with string-specific note prompts.</p>
          </div>
          <div className="hub-metrics">
            <span>{noteLastSessionLabel}</span>
            <span>{noteWeakSpotLabel}</span>
          </div>
          <button
            data-testid="hub-start-note"
            onClick={onStartNote}
            type="button"
          >
            Start {notePresetLabel}
          </button>
        </article>

        <article className="hub-card">
          <div>
            <span className="control-label">Chord Tones</span>
            <h3>Spell roots, 3rds, and 5ths</h3>
            <p>Build triad fluency with concept-first chord-tone prompts.</p>
          </div>
          <div className="hub-metrics">
            <span>{chordLastSessionLabel}</span>
            <span>{chordWeakSpotLabel}</span>
          </div>
          <button
            data-testid="hub-start-chord"
            onClick={onStartChord}
            type="button"
          >
            Start {chordPresetLabel}
          </button>
        </article>

        <article className="hub-card">
          <div>
            <span className="control-label">Scale Degrees</span>
            <h3>Find degrees by string</h3>
            <p>
              Connect major and minor scale degrees to real fretboard
              locations.
            </p>
          </div>
          <div className="hub-metrics">
            <span>{scaleLastSessionLabel}</span>
            <span>{scaleWeakSpotLabel}</span>
          </div>
          <button
            data-testid="hub-start-scale-degree"
            onClick={onStartScale}
            type="button"
          >
            Start {scalePresetLabel}
          </button>
        </article>

        <article className="hub-card">
          <div>
            <span className="control-label">Intervals</span>
            <h3>Find landmark intervals</h3>
            <p>Train major/minor 3rds, 5ths, and other intervals by string.</p>
          </div>
          <div className="hub-metrics">
            <span>{intervalLastSessionLabel}</span>
            <span>{intervalWeakSpotLabel}</span>
          </div>
          <button
            data-testid="hub-start-interval"
            onClick={onStartInterval}
            type="button"
          >
            Start {intervalPresetLabel}
          </button>
        </article>

        <article className="hub-card recommendation-card">
          <div>
            <span className="control-label">Smart recommendation</span>
            <h3>{recommendationTitle}</h3>
            <p>{recommendationDescription}</p>
          </div>
          <button
            data-testid="hub-start-recommendation"
            onClick={onStartRecommendation}
            type="button"
          >
            Start recommended session
          </button>
        </article>
      </div>
    </section>
  );
}
