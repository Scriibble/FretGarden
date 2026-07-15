import { useEffect, useRef, useState } from "react";
import {
  adjustMetronomeBpm,
  getMetronomeIntervalMs,
  getMetronomeTick,
  type MetronomeSettings,
  type MetronomeSubdivision,
  type MetronomeTick
} from "../../lib/curriculum/metronome";
import type { CurriculumProgressRecord } from "../../lib/curriculum/curriculumProgress";
import styles from "./curriculum.module.css";

interface MetronomeActivityProps {
  record: CurriculumProgressRecord;
  onFieldChange: (field: string, value: string) => void;
}

const subdivisions: Array<{ value: MetronomeSubdivision; label: string }> = [
  { value: "quarter", label: "Quarter notes" },
  { value: "eighth", label: "Eighth notes" },
  { value: "sixteenth", label: "Sixteenth notes" },
  { value: "triplet", label: "Triplets" }
];

export function MetronomeActivity({
  record,
  onFieldChange
}: MetronomeActivityProps) {
  const [settings, setSettings] = useState<MetronomeSettings>({
    bpm: 50,
    subdivision: "quarter",
    countInMeasures: 1,
    accentBeatOne: true
  });
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState<MetronomeTick>(() => getMetronomeTick(0, settings));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cleanRepetitions, setCleanRepetitions] = useState(0);
  const timerRef = useRef<number | null>(null);
  const tickIndexRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!running) return;
    const secondTimer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(secondTimer);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;

    const runTick = () => {
      if (cancelled) return;
      const nextTick = getMetronomeTick(tickIndexRef.current, settings);
      setTick(nextTick);
      if (nextTick.audible) playClick(nextTick.accent);
      tickIndexRef.current += 1;
      timerRef.current = window.setTimeout(
        runTick,
        getMetronomeIntervalMs(settings.bpm, settings.subdivision)
      );
    };

    runTick();
    return () => {
      cancelled = true;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [running, settings]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      void audioContextRef.current?.close();
    },
    []
  );

  function playClick(accent: boolean): void {
    const AudioContextConstructor = window.AudioContext;
    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = accent ? 1200 : 820;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.055);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.06);
  }

  function updateSettings(next: Partial<MetronomeSettings>): void {
    setRunning(false);
    tickIndexRef.current = 0;
    setSettings((current) => ({ ...current, ...next }));
  }

  function changeBpm(delta: number): void {
    const bpm = adjustMetronomeBpm(settings.bpm, delta);
    updateSettings({ bpm });
    onFieldChange("lastMetronomeBpm", String(bpm));
  }

  function reset(): void {
    setRunning(false);
    tickIndexRef.current = 0;
    setElapsedSeconds(0);
    setTick(getMetronomeTick(0, settings));
  }

  return (
    <section className={styles.tool} aria-labelledby="metronome-title">
      <div className={styles.toolHeading}>
        <p className={styles.eyebrow}>Practice metronome</p>
        <h2 id="metronome-title">Hear, count, and keep the pulse</h2>
        <p>The sound and beat marker stay together.</p>
      </div>

      <div className={styles.metronomeLayout}>
        <div className={styles.pulsePanel} aria-live="off">
          <span>{tick.phase === "count-in" ? "Count in" : `Measure ${tick.measure}`}</span>
          <strong
            className={running && tick.audible ? styles.pulseActive : undefined}
            key={`${tick.phase}-${tick.measure}-${tick.beat}-${tick.subdivisionIndex}`}
          >
            {tick.beat}
          </strong>
          <small>{settings.bpm} BPM · {formatElapsed(elapsedSeconds)}</small>
        </div>

        <div className={styles.metronomeControls}>
          <div className={styles.bpmControl}>
            <span>Tempo</span>
            <div>
              <button aria-label="Decrease tempo by 5 BPM" onClick={() => changeBpm(-5)} type="button">-5</button>
              <button aria-label="Decrease tempo by 1 BPM" onClick={() => changeBpm(-1)} type="button">-1</button>
              <input
                aria-label="Tempo in BPM"
                max="240"
                min="30"
                onChange={(event) => updateSettings({ bpm: adjustMetronomeBpm(Number(event.target.value), 0) })}
                type="number"
                value={settings.bpm}
              />
              <button aria-label="Increase tempo by 1 BPM" onClick={() => changeBpm(1)} type="button">+1</button>
              <button aria-label="Increase tempo by 5 BPM" onClick={() => changeBpm(5)} type="button">+5</button>
            </div>
          </div>

          <label>
            <span>Subdivision</span>
            <select
              onChange={(event) => updateSettings({ subdivision: event.target.value as MetronomeSubdivision })}
              value={settings.subdivision}
            >
              {subdivisions.map((subdivision) => (
                <option key={subdivision.value} value={subdivision.value}>{subdivision.label}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Count-in</legend>
            <div className={styles.segmented}>
              {([0, 1, 2] as const).map((measures) => (
                <button
                  aria-pressed={settings.countInMeasures === measures}
                  key={measures}
                  onClick={() => updateSettings({ countInMeasures: measures })}
                  type="button"
                >
                  {measures === 0 ? "None" : `${measures} measure${measures === 1 ? "" : "s"}`}
                </button>
              ))}
            </div>
          </fieldset>

          <label className={styles.checkControl}>
            <input
              checked={settings.accentBeatOne}
              onChange={(event) => updateSettings({ accentBeatOne: event.target.checked })}
              type="checkbox"
            />
            <span>Accent beat 1</span>
          </label>
        </div>
      </div>

      <div className={styles.toolActions}>
        <button
          className={styles.primaryButton}
          onClick={async () => {
            if (!running) {
              audioContextRef.current ??= new window.AudioContext();
              await audioContextRef.current.resume();
            }
            setRunning((value) => !value);
          }}
          type="button"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button className={styles.secondaryButton} onClick={reset} type="button">Reset</button>
      </div>
      <p className={styles.srStatus} role="status">{running ? tick.label : "Metronome paused"}</p>

      <div className={styles.practiceLogGrid}>
        <label>
          <span>Practice task</span>
          <input
            onChange={(event) => onFieldChange("metronomeTask", event.target.value)}
            placeholder="Em to Asus2 chord change"
            value={record.fields.metronomeTask ?? ""}
          />
        </label>
        <label>
          <span>Clean BPM</span>
          <input
            max="240"
            min="30"
            onChange={(event) => onFieldChange("cleanBpm", event.target.value)}
            type="number"
            value={record.fields.cleanBpm ?? String(settings.bpm)}
          />
        </label>
        <div className={styles.repetitionControl}>
          <span>Clean repetitions</span>
          <div>
            <button
              aria-label="Remove one clean repetition"
              onClick={() => {
                const next = Math.max(0, cleanRepetitions - 1);
                setCleanRepetitions(next);
                onFieldChange("cleanRepetitions", String(next));
              }}
              type="button"
            >
              -
            </button>
            <strong>{cleanRepetitions}</strong>
            <button
              aria-label="Add one clean repetition"
              onClick={() => {
                const next = cleanRepetitions + 1;
                setCleanRepetitions(next);
                onFieldChange("cleanRepetitions", String(next));
              }}
              type="button"
            >
              +
            </button>
          </div>
        </div>
        <label className={styles.fieldWide}>
          <span>Timing observation</span>
          <textarea
            onChange={(event) => onFieldChange("timingObservation", event.target.value)}
            placeholder="What rushed, dragged, tightened, or became more stable?"
            rows={3}
            value={record.fields.timingObservation ?? ""}
          />
        </label>
      </div>
    </section>
  );
}

function formatElapsed(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
