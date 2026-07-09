import {
  buildChordTonePerformanceSummary,
  type ChordTonePerformanceStat,
  type ChordToneSession
} from "./chordToneRecognition";
import {
  buildIntervalLandmarkPerformanceSummary,
  type IntervalLandmarkPerformanceStat,
  type IntervalLandmarkSession
} from "./intervalLandmarkRecognition";
import {
  buildNoteRecognitionPerformanceSummary,
  type NoteRecognitionPerformanceStat,
  type NoteRecognitionSession
} from "./noteRecognition";
import {
  buildOctaveShapePerformanceSummary,
  type OctaveShapePerformanceStat,
  type OctaveShapeSession
} from "./octaveShapeRecognition";
import type { StoredPracticeData } from "./practiceStorage";
import {
  buildScaleDegreePerformanceSummary,
  type ScaleDegreePerformanceStat,
  type ScaleDegreeSession
} from "./scaleDegreeRecognition";
import {
  buildTriadInversionPerformanceSummary,
  type TriadInversionPerformanceStat,
  type TriadInversionSession
} from "./triadInversionRecognition";

export interface RecentPracticeSession {
  id: string;
  drillLabel: string;
  accuracy: number;
  correct: number;
  promptCount: number;
  completedAtLabel: string;
}

export interface PracticeWeakSpot {
  id: string;
  drillLabel: string;
  label: string;
  accuracy: number;
  missed: number;
  attempted: number;
}

export interface PracticeHistorySnapshot {
  recentSessions: RecentPracticeSession[];
  weakSpots: PracticeWeakSpot[];
}

type PerformanceStat =
  | ChordTonePerformanceStat
  | IntervalLandmarkPerformanceStat
  | NoteRecognitionPerformanceStat
  | OctaveShapePerformanceStat
  | ScaleDegreePerformanceStat
  | TriadInversionPerformanceStat;

export function buildPracticeHistorySnapshot(
  practiceData: StoredPracticeData
): PracticeHistorySnapshot {
  const notePerformance = buildNoteRecognitionPerformanceSummary(
    practiceData.noteSessionHistory
  );
  const chordPerformance = buildChordTonePerformanceSummary(
    practiceData.chordSessionHistory
  );
  const scaleDegreePerformance = buildScaleDegreePerformanceSummary(
    practiceData.scaleDegreeSessionHistory
  );
  const intervalPerformance = buildIntervalLandmarkPerformanceSummary(
    practiceData.intervalSessionHistory
  );
  const octavePerformance = buildOctaveShapePerformanceSummary(
    practiceData.octaveSessionHistory
  );
  const triadInversionPerformance = buildTriadInversionPerformanceSummary(
    practiceData.triadInversionSessionHistory
  );

  return {
    recentSessions: buildRecentPracticeSessions(
      practiceData.noteSessionHistory,
      practiceData.chordSessionHistory,
      practiceData.scaleDegreeSessionHistory,
      practiceData.intervalSessionHistory,
      practiceData.octaveSessionHistory,
      practiceData.triadInversionSessionHistory
    ),
    weakSpots: buildPracticeWeakSpots(
      notePerformance.weakSpots,
      chordPerformance.weakSpots,
      scaleDegreePerformance.weakSpots,
      intervalPerformance.weakSpots,
      octavePerformance.weakSpots,
      triadInversionPerformance.weakSpots
    )
  };
}

function buildRecentPracticeSessions(
  noteSessions: readonly NoteRecognitionSession[],
  chordSessions: readonly ChordToneSession[],
  scaleSessions: readonly ScaleDegreeSession[],
  intervalSessions: readonly IntervalLandmarkSession[],
  octaveSessions: readonly OctaveShapeSession[],
  triadInversionSessions: readonly TriadInversionSession[]
): RecentPracticeSession[] {
  return [
    ...noteSessions.map((session) => ({
      session,
      drillLabel: "Note recognition"
    })),
    ...chordSessions.map((session) => ({
      session,
      drillLabel: "Chord tones"
    })),
    ...scaleSessions.map((session) => ({
      session,
      drillLabel: "Scale degrees"
    })),
    ...intervalSessions.map((session) => ({
      session,
      drillLabel: "Interval landmarks"
    })),
    ...octaveSessions.map((session) => ({
      session,
      drillLabel: "Octave shapes"
    })),
    ...triadInversionSessions.map((session) => ({
      session,
      drillLabel: "Triad inversions"
    }))
  ]
    .sort(
      (left, right) =>
        new Date(right.session.completedAt).getTime() -
        new Date(left.session.completedAt).getTime()
    )
    .slice(0, 8)
    .map(({ session, drillLabel }) =>
      toRecentPracticeSession(session, drillLabel)
    );
}

function toRecentPracticeSession(
  session:
    | NoteRecognitionSession
    | ChordToneSession
    | ScaleDegreeSession
    | IntervalLandmarkSession
    | OctaveShapeSession
    | TriadInversionSession,
  drillLabel: string
): RecentPracticeSession {
  return {
    id: `${drillLabel}-${session.id}`,
    drillLabel,
    accuracy: session.accuracy,
    correct: session.correct,
    promptCount: session.promptCount,
    completedAtLabel: formatSessionDate(session.completedAt)
  };
}

function buildPracticeWeakSpots(
  noteWeakSpots: readonly NoteRecognitionPerformanceStat[],
  chordWeakSpots: readonly ChordTonePerformanceStat[],
  scaleWeakSpots: readonly ScaleDegreePerformanceStat[],
  intervalWeakSpots: readonly IntervalLandmarkPerformanceStat[],
  octaveWeakSpots: readonly OctaveShapePerformanceStat[],
  triadInversionWeakSpots: readonly TriadInversionPerformanceStat[]
): PracticeWeakSpot[] {
  return [
    ...noteWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Note recognition")),
    ...chordWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Chord tones")),
    ...scaleWeakSpots.map((stat) => toPracticeWeakSpot(stat, "Scale degrees")),
    ...intervalWeakSpots.map((stat) =>
      toPracticeWeakSpot(stat, "Interval landmarks")
    ),
    ...octaveWeakSpots.map((stat) =>
      toPracticeWeakSpot(stat, "Octave shapes")
    ),
    ...triadInversionWeakSpots.map((stat) =>
      toPracticeWeakSpot(stat, "Triad inversions")
    )
  ]
    .sort(
      (left, right) =>
        left.accuracy - right.accuracy ||
        right.missed - left.missed ||
        right.attempted - left.attempted ||
        left.label.localeCompare(right.label)
    )
    .slice(0, 8);
}

function toPracticeWeakSpot(
  stat: PerformanceStat,
  drillLabel: string
): PracticeWeakSpot {
  return {
    id: `${drillLabel}-${stat.category}-${stat.id}`,
    drillLabel,
    label: stat.label,
    accuracy: stat.accuracy,
    missed: stat.missed,
    attempted: stat.attempted
  };
}

export function formatSessionDate(completedAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(completedAt));
}
