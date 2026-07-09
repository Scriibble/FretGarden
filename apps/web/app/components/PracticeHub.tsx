"use client";

import Link from "next/link";

export interface DemoChecklistItem {
  isComplete: boolean;
  label: string;
}

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
  octaveLastSessionLabel: string;
  octaveWeakSpotLabel: string;
  octavePresetLabel: string;
  onStartOctave: () => void;
  triadInversionLastSessionLabel: string;
  triadInversionWeakSpotLabel: string;
  triadInversionPresetLabel: string;
  onStartTriadInversion: () => void;
  courseRecommendationTitle: string;
  courseRecommendationDescription: string;
  courseProgressLabel: string;
  courseProgressPercent: number;
  courseStepLabel: string;
  courseLessonHref: string;
  coursePracticeHref: string;
  recommendationTitle: string;
  recommendationDescription: string;
  onStartRecommendation: () => void;
  demoChecklistItems: DemoChecklistItem[];
  onResetDemoProgress: () => void;
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
  octaveLastSessionLabel,
  octaveWeakSpotLabel,
  octavePresetLabel,
  onStartOctave,
  triadInversionLastSessionLabel,
  triadInversionWeakSpotLabel,
  triadInversionPresetLabel,
  onStartTriadInversion,
  courseRecommendationTitle,
  courseRecommendationDescription,
  courseProgressLabel,
  courseProgressPercent,
  courseStepLabel,
  courseLessonHref,
  coursePracticeHref,
  recommendationTitle,
  recommendationDescription,
  onStartRecommendation,
  demoChecklistItems,
  onResetDemoProgress
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
          <span className="control-label">Start here</span>
          <h3>{courseRecommendationTitle}</h3>
          <div className="course-progress-inline">
            <span>{courseStepLabel}</span>
            <div
              aria-label={courseProgressLabel}
              className="course-progress-track"
            >
              <i style={{ width: `${courseProgressPercent}%` }} />
            </div>
            <strong>{courseProgressLabel}</strong>
          </div>
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

      <article className="demo-checklist-card">
        <div>
          <span className="control-label">Tester demo loop</span>
          <h3>Try the first three learning steps</h3>
          <p>
            Use this path for a quick playable test: start the first lesson,
            finish one note drill, then try chord tones and scale degrees.
          </p>
        </div>
        <ol className="demo-checklist">
          {demoChecklistItems.map((item) => (
            <li
              className={item.isComplete ? "is-complete" : ""}
              key={item.label}
            >
              <span aria-hidden="true">{item.isComplete ? "Done" : ""}</span>
              {item.label}
            </li>
          ))}
        </ol>
        <button
          className="demo-reset-button"
          onClick={onResetDemoProgress}
          type="button"
        >
          Reset local demo progress
        </button>
      </article>

      <section className="hub-section" aria-labelledby="core-path-heading">
        <div className="hub-section-heading">
          <span className="control-label">First release focus</span>
          <h3 id="core-path-heading">Core MVP path</h3>
          <p>
            These drills form the first public learning loop: notes, chord
            tones, and scale degrees.
          </p>
        </div>

        <div className="hub-grid hub-grid-core">
          <article className="hub-card hub-card-core">
            <div>
              <span className="control-label">Note Recognition</span>
              <h3>Find notes by string</h3>
              <p>Train the fretboard map with string-specific questions.</p>
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

          <article className="hub-card hub-card-core">
            <div>
              <span className="control-label">Chord Tones</span>
              <h3>Spell roots, 3rds, and 5ths</h3>
              <p>Build triad fluency with concept-first chord-tone questions.</p>
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

          <article className="hub-card hub-card-core">
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
        </div>
      </section>

      <section
        className="hub-section"
        aria-labelledby="advanced-practice-heading"
      >
        <div className="hub-section-heading">
          <span className="control-label">Available beyond the core path</span>
          <h3 id="advanced-practice-heading">Advanced practice</h3>
          <p>
            Keep using these recovered drills as stretch work and review while
            the MVP stays focused.
          </p>
        </div>

        <div className="hub-grid">
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

          <article className="hub-card">
            <div>
              <span className="control-label">Octave Shapes</span>
              <h3>Find CAGED octaves</h3>
              <p>Use highlighted anchors to connect CAGED octave positions.</p>
            </div>
            <div className="hub-metrics">
              <span>{octaveLastSessionLabel}</span>
              <span>{octaveWeakSpotLabel}</span>
            </div>
            <button
              data-testid="hub-start-octave"
              onClick={onStartOctave}
              type="button"
            >
              Start {octavePresetLabel}
            </button>
          </article>

          <article className="hub-card">
            <div>
              <span className="control-label">Triad Inversions</span>
              <h3>Name the bass function</h3>
              <p>Practice which chord tone sits in the bass of each inversion.</p>
            </div>
            <div className="hub-metrics">
              <span>{triadInversionLastSessionLabel}</span>
              <span>{triadInversionWeakSpotLabel}</span>
            </div>
            <button
              data-testid="hub-start-triad-inversion"
              onClick={onStartTriadInversion}
              type="button"
            >
              Start {triadInversionPresetLabel}
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
    </section>
  );
}
