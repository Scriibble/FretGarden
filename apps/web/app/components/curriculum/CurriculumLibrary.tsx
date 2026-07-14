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
  const currentUnit =
    units.find((unit) => !records.find((record) => record.unitId === unit.id)?.completedAt) ?? null;
  const progress = Math.round((completedCount / units.length) * 100);
  const statuses = useMemo(
    () => new Map(records.map((record) => [record.unitId, record])),
    [records]
  );

  return (
    <>
      <section className={styles.libraryOverview} aria-labelledby="foundation-path-title">
        <div>
          <p className={styles.eyebrow}>Foundation path</p>
          <h2 id="foundation-path-title">{currentUnit?.title ?? "Foundation self-checks complete"}</h2>
          <p>
            The first three units build a sustainable practice process before the instrument sequence begins.
            The remaining {mappedUnitCount} units are source-mapped and will appear as they are fully authored and validated.
          </p>
        </div>
        <div className={styles.progressSummary}>
          <strong>{completedCount}/{units.length}</strong>
          <span>foundation units</span>
          <div aria-label={`${progress}% of foundation units complete`}><span style={{ width: `${progress}%` }} /></div>
        </div>
      </section>

      <ol className={styles.unitList} aria-label="Implemented foundation units">
        {units.map((unit) => {
          const record = statuses.get(unit.id);
          const status = record?.completedAt ? "Complete" : record ? "In progress" : "Not started";
          return (
            <li key={unit.id}>
              <span className={styles.unitNumber}>{unit.order}</span>
              <div>
                <div className={styles.unitMeta}>
                  <span>{formatLevel(unit.level)}</span>
                  <strong>{status}</strong>
                </div>
                <h2><Link href={`/lessons/${unit.slug}`}>{unit.title}</Link></h2>
                <p>{unit.summary}</p>
                <ul>{unit.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              </div>
              <Link className={styles.openUnit} href={`/lessons/${unit.slug}`}>
                {record ? "Continue unit" : "Begin unit"}
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function formatLevel(level: CurriculumIndexEntry["level"]): string {
  return level.split("-").map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`).join(" ");
}
