import type { CurriculumContentBlock } from "@pocket-practice/education-content";
import styles from "./curriculum.module.css";

interface StructuredMusicBlockProps {
  block: CurriculumContentBlock;
}

export function StructuredMusicBlock({ block }: StructuredMusicBlockProps) {
  if (block.type === "chord-diagram") {
    const strings = [...block.strings].sort((a, b) => b.string - a.string);
    return (
      <section className={styles.musicBlock} aria-labelledby={`${block.id}-title`}>
        <p className={styles.eyebrow}>Chord shape</p>
        <h2 id={`${block.id}-title`}>{block.heading}</h2>
        <div className={styles.chordLayout}>
          <div className={styles.chordDiagram} aria-hidden="true">
            <strong>{block.chordName}</strong>
            <div className={styles.chordStrings}>
              {strings.map((string) => (
                <div key={string.string}>
                  <span>{string.state === "muted" ? "x" : string.state === "open" ? "o" : string.fret}</span>
                  <i>{string.state === "fretted" ? string.finger : ""}</i>
                  <small>{string.string}</small>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p>{block.explanation}</p>
            <p><strong>Text diagram:</strong> {block.accessibilityDescription}</p>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "tablature") {
    return (
      <section className={styles.musicBlock} aria-labelledby={`${block.id}-title`}>
        <p className={styles.eyebrow}>Read and play</p>
        <h2 id={`${block.id}-title`}>{block.heading}</h2>
        <div className={styles.tableScroller}>
          <table className={styles.tabTable}>
            <caption>{block.accessibilityDescription}</caption>
            <thead>
              <tr><th scope="col">String</th>{block.events.map((event, index) => <th key={`${event.count}-${index}`} scope="col">{event.count}</th>)}</tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((string) => (
                <tr key={string}>
                  <th scope="row">{string}</th>
                  {block.events.map((event, index) => {
                    const note = event.notes.find((candidate) => candidate.string === string);
                    return <td key={`${event.count}-${index}`}>{event.rest ? "-" : note?.fret ?? "-"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{block.explanation}{block.tempo ? ` Start at ${block.tempo} BPM.` : ""}</p>
      </section>
    );
  }

  if (block.type === "rhythm-grid") {
    return (
      <section className={styles.musicBlock} aria-labelledby={`${block.id}-title`}>
        <p className={styles.eyebrow}>Rhythm grid · {block.meter}</p>
        <h2 id={`${block.id}-title`}>{block.heading}</h2>
        <div className={styles.structuredRhythm} aria-label={block.accessibilityDescription}>
          {block.events.map((event, index) => (
            <div className={event.accent ? styles.rhythmAccent : undefined} key={`${event.count}-${index}`}>
              <strong>{event.count}</strong>
              <span>{formatRhythmAction(event.action)}</span>
            </div>
          ))}
        </div>
        <p>{block.explanation}</p>
      </section>
    );
  }

  if (block.type === "instrument-setup") {
    return (
      <section className={styles.musicBlock} aria-labelledby={`${block.id}-title`}>
        <p className={styles.eyebrow}>Set up the instrument</p>
        <h2 id={`${block.id}-title`}>{block.heading}</h2>
        <p className={styles.visuallyHidden}>{block.accessibilityDescription}</p>
        <ol className={styles.setupList}>
          {block.items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.instruction}</p>
              <small>Self-check: {item.selfCheck}</small>
            </li>
          ))}
        </ol>
        <p className={styles.safetyLine}><strong>Safety:</strong> {block.safetyNote}</p>
      </section>
    );
  }

  if (block.type === "learning-stage") {
    return (
      <section className={styles.learningStage} aria-labelledby={`${block.id}-title`}>
        <div className={styles.stageHeading}>
          <span>{formatStage(block.stage)}</span>
          <h2 id={`${block.id}-title`}>{block.heading}</h2>
        </div>
        <p className={styles.visuallyHidden}>{block.accessibilityDescription}</p>
        <ol>{block.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
        {block.supports.length > 0 ? <p><strong>Support available:</strong> {block.supports.join(" · ")}</p> : <p><strong>Support:</strong> Complete without prompts or a model.</p>}
        <ul>{block.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
      </section>
    );
  }

  return null;
}

function formatRhythmAction(action: "down" | "up" | "rest" | "hold" | "mute"): string {
  return { down: "Down", up: "Up", rest: "Rest", hold: "Hold", mute: "Mute" }[action];
}

function formatStage(stage: "model" | "guided" | "scaffold-fade" | "independent"): string {
  return {
    model: "1 · Model",
    guided: "2 · Guided attempt",
    "scaffold-fade": "3 · Fade support",
    independent: "4 · Independent attempt"
  }[stage];
}
