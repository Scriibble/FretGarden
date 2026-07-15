"use client";

import type { CurriculumIndexEntry } from "@pocket-practice/education-content";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CURRICULUM_PROGRESS_STORAGE_KEY,
  parseCurriculumProgress,
  type CurriculumProgressRecord
} from "../../lib/curriculum/curriculumProgress";
import styles from "./curriculum.module.css";

interface CurriculumLibraryProps {
  units: readonly CurriculumIndexEntry[];
  mappedUnitCount: number;
}

export function CurriculumLibrary({ units, mappedUnitCount }: CurriculumLibraryProps) {
  const [records, setRecords] = useState<CurriculumProgressRecord[]>([]);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | CurriculumIndexEntry["level"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UnitStatus>("all");

  useEffect(() => {
    try {
      setRecords(
        parseCurriculumProgress(
          window.localStorage.getItem(CURRICULUM_PROGRESS_STORAGE_KEY)
        )
      );
    } catch {
      setRecords([]);
    }
  }, []);

  const completedCount = records.filter(({ completedAt, unitId }) =>
    completedAt && units.some(({ id }) => id === unitId)
  ).length;
  const statuses = useMemo(
    () => new Map(records.map((record) => [record.unitId, record])),
    [records]
  );
  const currentUnit =
    units.find((unit) => !records.find((record) => record.unitId === unit.id)?.completedAt) ?? null;
  const currentUnitStatus = currentUnit ? getUnitStatus(currentUnit, statuses) : null;
  const progress = Math.round((completedCount / units.length) * 100);
  const visibleUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return units.filter((unit) => {
      const unitStatus = getUnitStatus(unit, statuses);
      const searchableText = [
        unit.title,
        unit.summary,
        formatLevel(unit.level),
        ...unit.outcomes,
        ...unit.tags
      ].join(" ").toLowerCase();
      return (
        (levelFilter === "all" || unit.level === levelFilter) &&
        (statusFilter === "all" || unitStatus === statusFilter) &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [levelFilter, query, statusFilter, statuses, units]);

  return (
    <>
      <section className={styles.libraryOverview} aria-labelledby="foundation-path-title">
        <div>
          <p className={styles.eyebrow}>Curriculum path</p>
          <h2 id="foundation-path-title">{currentUnit?.title ?? "Curriculum self-checks complete"}</h2>
          <p>
            The 51-unit path begins with sustainable practice, then moves through
            playable guitar foundations, fretboard fluency, harmony, improvisation,
            songwriting, and portfolio work.
            {mappedUnitCount > 0
              ? ` The remaining ${mappedUnitCount} units are source-mapped and will appear as they are fully authored and validated.`
              : " Every listed unit is fully authored and validated for learner-facing study."}
          </p>
        </div>
        <div className={styles.nextStepPanel}>
          <div className={styles.progressSummary}>
            <strong>{completedCount}/{units.length}</strong>
            <span>units self-checked</span>
            <div aria-label={`${progress}% of curriculum units complete`}><span style={{ width: `${progress}%` }} /></div>
          </div>
          {currentUnit ? (
            <Link className={styles.nextUnitLink} href={`/lessons/${currentUnit.slug}`}>
              {currentUnitStatus === "in-progress" ? "Continue current unit" : "Begin next unit"}
            </Link>
          ) : (
            <Link className={styles.nextUnitLink} href="/progress">
              Review progress
            </Link>
          )}
        </div>
      </section>

      <section className={styles.libraryFilters} aria-label="Filter curriculum units">
        <label>
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Chord melody, metronome, portfolio"
          />
        </label>
        <label>
          <span>Level</span>
          <select
            value={levelFilter}
            onChange={(event) =>
              setLevelFilter(event.currentTarget.value as "all" | CurriculumIndexEntry["level"])
            }
          >
            <option value="all">All levels</option>
            <option value="absolute-beginner">Absolute beginner</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="upper-intermediate">Upper intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.currentTarget.value as "all" | UnitStatus)}
          >
            <option value="all">All statuses</option>
            <option value="not-started">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="preview">Preview available</option>
            <option value="complete">Complete</option>
          </select>
        </label>
        <p aria-live="polite">{visibleUnits.length} units shown</p>
      </section>

      <ol className={styles.unitList} aria-label="Implemented curriculum units">
        {visibleUnits.map((unit) => {
          const record = statuses.get(unit.id);
          const prerequisitesComplete = arePrerequisitesComplete(unit, statuses);
          const status = getUnitStatus(unit, statuses);
          return (
            <li key={unit.id}>
              <span className={styles.unitNumber}>{unit.order}</span>
              <div>
                <div className={styles.unitMeta}>
                  <span>{formatLevel(unit.level)}</span>
                  <strong>{formatStatus(status)}</strong>
                </div>
                <h2><Link href={`/lessons/${unit.slug}`}>{unit.title}</Link></h2>
                <p>{unit.summary}</p>
                <ul>{unit.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              </div>
              <Link className={styles.openUnit} href={`/lessons/${unit.slug}`}>
                {!prerequisitesComplete ? "Preview unit" : record ? "Continue unit" : "Begin unit"}
              </Link>
            </li>
          );
        })}
      </ol>
      {visibleUnits.length === 0 ? (
        <p className={styles.emptyLibraryResult}>No curriculum units match the current filters.</p>
      ) : null}
    </>
  );
}

type UnitStatus = "complete" | "in-progress" | "preview" | "not-started";

function arePrerequisitesComplete(
  unit: CurriculumIndexEntry,
  statuses: ReadonlyMap<string, CurriculumProgressRecord>
): boolean {
  return unit.requiredPriorUnitIds.every((unitId) => Boolean(statuses.get(unitId)?.completedAt));
}

function getUnitStatus(
  unit: CurriculumIndexEntry,
  statuses: ReadonlyMap<string, CurriculumProgressRecord>
): UnitStatus {
  const record = statuses.get(unit.id);
  if (record?.completedAt) return "complete";
  if (!arePrerequisitesComplete(unit, statuses)) return "preview";
  return record ? "in-progress" : "not-started";
}

function formatStatus(status: UnitStatus): string {
  if (status === "complete") return "Complete";
  if (status === "in-progress") return "In progress";
  if (status === "preview") return "Preview available";
  return "Not started";
}

function formatLevel(level: CurriculumIndexEntry["level"]): string {
  return level.split("-").map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`).join(" ");
}
