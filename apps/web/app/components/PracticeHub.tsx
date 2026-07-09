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
  octaveLastSessionLabel: string;
  octaveWeakSpotLabel: string;
  octavePresetLabel: string;
  onStartOctave: () => void;
  triadInversionLastSessionLabel: string;
  triadInversionWeakSpotLabel: string;
  triadInversionPresetLabel: string;
  onStartTriadInversion: () => void;
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
  octaveLastSessionLabel,
  octaveWeakSpotLabel,
  octavePresetLabel,
  onStartOctave,
  triadInversionLastSessionLabel,
  triadInversionWeakSpotLabel,
  triadInversionPresetLabel,
  onStartTriadInversion,
  recommendationTitle,
  recommendationDescription,
  onStartRecommendation
}: PracticeHubProps) {
  return (
    <section className="practice-hub" aria-label="Practice hub">
      <section className="hub-section" aria-labelledby="core-path-heading">
        <h2 className="visually-hidden" id="core-path-heading">
          Core practice
        </h2>

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
        <h2 className="visually-hidden" id="advanced-practice-heading">
          Advanced practice
        </h2>

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

      <Link className="lesson-library-link hub-library-link" href="/lessons">
        Open lesson library
      </Link>
    </section>
  );
}
