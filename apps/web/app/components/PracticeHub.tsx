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
  const noteMetrics = getVisibleMetrics(noteLastSessionLabel, noteWeakSpotLabel);
  const chordMetrics = getVisibleMetrics(
    chordLastSessionLabel,
    chordWeakSpotLabel
  );
  const scaleMetrics = getVisibleMetrics(
    scaleLastSessionLabel,
    scaleWeakSpotLabel
  );
  const intervalMetrics = getVisibleMetrics(
    intervalLastSessionLabel,
    intervalWeakSpotLabel
  );
  const octaveMetrics = getVisibleMetrics(
    octaveLastSessionLabel,
    octaveWeakSpotLabel
  );
  const triadInversionMetrics = getVisibleMetrics(
    triadInversionLastSessionLabel,
    triadInversionWeakSpotLabel
  );

  return (
    <section className="practice-hub" aria-label="Practice hub">
      <article className="curriculum-gateway" aria-labelledby="curriculum-gateway-title">
        <div>
          <span className="control-label">Guided path</span>
          <h2 id="curriculum-gateway-title">Start with the 51-unit curriculum</h2>
          <p>
            Lessons are the main learning flow. Use these drills as focused
            reinforcement after a unit gives you something specific to practice.
          </p>
        </div>
        <div className="curriculum-gateway-actions">
          <Link className="curriculum-gateway-primary" href="/lessons">
            Open curriculum
          </Link>
        </div>
      </article>

      <section className="hub-section" aria-labelledby="core-path-heading">
        <div className="hub-section-heading">
          <span className="control-label">Reinforcement tools</span>
          <h2 id="core-path-heading">Core fretboard drills</h2>
          <p>
            Use these when a curriculum unit asks you to strengthen a concrete
            fretboard skill. Drill results stay separate from curriculum
            self-checks.
          </p>
        </div>

        <div className="hub-grid hub-grid-core">
          <article className="hub-card hub-card-core">
            <div>
              <span className="control-label">Note Recognition</span>
              <h3>Find notes by string</h3>
              <p>Train the fretboard map with string-specific questions.</p>
            </div>
            <HubMetrics metrics={noteMetrics} />
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
            <HubMetrics metrics={chordMetrics} />
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
            <HubMetrics metrics={scaleMetrics} />
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
          <span className="control-label">Optional reinforcement</span>
          <h2 id="advanced-practice-heading">Advanced practice tools</h2>
        </div>

        <div className="hub-grid">
          <article className="hub-card">
            <div>
              <span className="control-label">Intervals</span>
              <h3>Find landmark intervals</h3>
              <p>Train major/minor 3rds, 5ths, and other intervals by string.</p>
            </div>
            <HubMetrics metrics={intervalMetrics} />
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
            <HubMetrics metrics={octaveMetrics} />
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
            <HubMetrics metrics={triadInversionMetrics} />
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
        Return to curriculum
      </Link>
    </section>
  );
}

function HubMetrics({ metrics }: { metrics: string[] }) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="hub-metrics">
      {metrics.map((metric) => (
        <span key={metric}>{metric}</span>
      ))}
    </div>
  );
}

function getVisibleMetrics(...metrics: string[]): string[] {
  return metrics.filter(
    (metric) => metric !== "No sessions yet" && metric !== "No weak spots"
  );
}
