import type { CurriculumProgressRecord } from "../../lib/curriculum/curriculumProgress";
import styles from "./curriculum.module.css";

interface PracticeIdentityActivityProps {
  record: CurriculumProgressRecord;
  onFieldChange: (field: string, value: string) => void;
}

export function PracticeIdentityActivity({
  record,
  onFieldChange
}: PracticeIdentityActivityProps) {
  return (
    <section className={styles.tool} aria-labelledby="practice-plan-title">
      <div className={styles.toolHeading}>
        <p className={styles.eyebrow}>Your first garden log</p>
        <h2 id="practice-plan-title">Make the practice repeatable</h2>
        <p>These entries stay in this browser and can be revised as you learn.</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.fieldWide}>
          <span>Practice identity</span>
          <textarea
            onChange={(event) => onFieldChange("practiceIdentity", event.target.value)}
            placeholder="I am a guitarist who returns regularly and works on one clear target."
            rows={3}
            value={record.fields.practiceIdentity ?? ""}
          />
        </label>
        <label>
          <span>Minimum minutes</span>
          <input
            inputMode="numeric"
            min="1"
            onChange={(event) => onFieldChange("minimumMinutes", event.target.value)}
            type="number"
            value={record.fields.minimumMinutes ?? "10"}
          />
        </label>
        <label>
          <span>Days per week</span>
          <input
            inputMode="numeric"
            max="7"
            min="1"
            onChange={(event) => onFieldChange("daysPerWeek", event.target.value)}
            type="number"
            value={record.fields.daysPerWeek ?? "4"}
          />
        </label>
        <label className={styles.fieldWide}>
          <span>One likely frustration</span>
          <input
            onChange={(event) => onFieldChange("frustration", event.target.value)}
            placeholder="My chord change stops the beat."
            type="text"
            value={record.fields.frustration ?? ""}
          />
        </label>
        <label className={styles.fieldWide}>
          <span>Constructive response plan</span>
          <textarea
            onChange={(event) => onFieldChange("responsePlan", event.target.value)}
            placeholder="I will keep one chord still, move only the changing fingers, and lower the tempo."
            rows={3}
            value={record.fields.responsePlan ?? ""}
          />
        </label>
        <label className={styles.fieldWide}>
          <span>First garden log entry</span>
          <textarea
            onChange={(event) => onFieldChange("gardenLog", event.target.value)}
            placeholder="Next session I will make eight relaxed Em-Asus2 changes and stop if my hand tightens."
            rows={4}
            value={record.fields.gardenLog ?? ""}
          />
        </label>
      </div>
    </section>
  );
}
