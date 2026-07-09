import {
  CHORD_TONE_HISTORY_LIMIT,
  type ChordToneSession,
  type ChordToneSessionPreset
} from "./chordToneRecognition";
import {
  INTERVAL_LANDMARK_HISTORY_LIMIT,
  type IntervalLandmarkSession,
  type IntervalLandmarkSessionPreset
} from "./intervalLandmarkRecognition";
import {
  LESSON_PROGRESS_STORAGE_KEY,
  type LessonProgressRecord
} from "./lessonProgress";
import {
  NOTE_RECOGNITION_HISTORY_LIMIT,
  type NoteRecognitionSession,
  type NoteRecognitionSessionPreset
} from "./noteRecognition";
import {
  OCTAVE_SHAPE_HISTORY_LIMIT,
  type OctaveShapeSession,
  type OctaveShapeSessionPreset
} from "./octaveShapeRecognition";
import {
  SCALE_DEGREE_HISTORY_LIMIT,
  type ScaleDegreeSession,
  type ScaleDegreeSessionPreset
} from "./scaleDegreeRecognition";
import {
  TRIAD_INVERSION_HISTORY_LIMIT,
  type TriadInversionSession,
  type TriadInversionSessionPreset
} from "./triadInversionRecognition";
import {
  readStoredLessonProgress,
  readStoredPreset,
  readStoredSessionHistory
} from "./browserStorage";

export const NOTE_RECOGNITION_HISTORY_STORAGE_KEY =
  "pocket-practice:note-recognition-history";
export const CHORD_TONE_HISTORY_STORAGE_KEY =
  "pocket-practice:chord-tone-history";
export const SCALE_DEGREE_HISTORY_STORAGE_KEY =
  "pocket-practice:scale-degree-history";
export const INTERVAL_LANDMARK_HISTORY_STORAGE_KEY =
  "pocket-practice:interval-landmark-history";
export const OCTAVE_SHAPE_HISTORY_STORAGE_KEY =
  "pocket-practice:octave-shape-history";
export const TRIAD_INVERSION_HISTORY_STORAGE_KEY =
  "pocket-practice:triad-inversion-history";

export const NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:note-recognition-custom-preset";
export const CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:chord-tone-custom-preset";
export const SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:scale-degree-custom-preset";
export const INTERVAL_LANDMARK_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:interval-landmark-custom-preset";
export const OCTAVE_SHAPE_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:octave-shape-custom-preset";
export const TRIAD_INVERSION_CUSTOM_PRESET_STORAGE_KEY =
  "pocket-practice:triad-inversion-custom-preset";

export interface StoredPracticeData {
  lessonProgressRecords: LessonProgressRecord[];
  noteSessionHistory: NoteRecognitionSession[];
  chordSessionHistory: ChordToneSession[];
  scaleDegreeSessionHistory: ScaleDegreeSession[];
  intervalSessionHistory: IntervalLandmarkSession[];
  octaveSessionHistory: OctaveShapeSession[];
  triadInversionSessionHistory: TriadInversionSession[];
  customNotePreset: NoteRecognitionSessionPreset | null;
  customChordPreset: ChordToneSessionPreset | null;
  customScaleDegreePreset: ScaleDegreeSessionPreset | null;
  customIntervalPreset: IntervalLandmarkSessionPreset | null;
  customOctavePreset: OctaveShapeSessionPreset | null;
  customTriadInversionPreset: TriadInversionSessionPreset | null;
}

const practiceStorageKeys = [
  LESSON_PROGRESS_STORAGE_KEY,
  NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
  CHORD_TONE_HISTORY_STORAGE_KEY,
  SCALE_DEGREE_HISTORY_STORAGE_KEY,
  INTERVAL_LANDMARK_HISTORY_STORAGE_KEY,
  OCTAVE_SHAPE_HISTORY_STORAGE_KEY,
  TRIAD_INVERSION_HISTORY_STORAGE_KEY,
  NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY,
  CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY,
  SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY,
  INTERVAL_LANDMARK_CUSTOM_PRESET_STORAGE_KEY,
  OCTAVE_SHAPE_CUSTOM_PRESET_STORAGE_KEY,
  TRIAD_INVERSION_CUSTOM_PRESET_STORAGE_KEY
];

export function readStoredPracticeData(): StoredPracticeData {
  return {
    lessonProgressRecords: readStoredLessonProgress(),
    noteSessionHistory: readStoredSessionHistory<NoteRecognitionSession>(
      NOTE_RECOGNITION_HISTORY_STORAGE_KEY,
      NOTE_RECOGNITION_HISTORY_LIMIT
    ),
    chordSessionHistory: readStoredSessionHistory<ChordToneSession>(
      CHORD_TONE_HISTORY_STORAGE_KEY,
      CHORD_TONE_HISTORY_LIMIT
    ),
    scaleDegreeSessionHistory: readStoredSessionHistory<ScaleDegreeSession>(
      SCALE_DEGREE_HISTORY_STORAGE_KEY,
      SCALE_DEGREE_HISTORY_LIMIT
    ),
    intervalSessionHistory: readStoredSessionHistory<IntervalLandmarkSession>(
      INTERVAL_LANDMARK_HISTORY_STORAGE_KEY,
      INTERVAL_LANDMARK_HISTORY_LIMIT
    ),
    octaveSessionHistory: readStoredSessionHistory<OctaveShapeSession>(
      OCTAVE_SHAPE_HISTORY_STORAGE_KEY,
      OCTAVE_SHAPE_HISTORY_LIMIT
    ),
    triadInversionSessionHistory:
      readStoredSessionHistory<TriadInversionSession>(
        TRIAD_INVERSION_HISTORY_STORAGE_KEY,
        TRIAD_INVERSION_HISTORY_LIMIT
      ),
    customNotePreset: readStoredPreset<NoteRecognitionSessionPreset>(
      NOTE_RECOGNITION_CUSTOM_PRESET_STORAGE_KEY
    ),
    customChordPreset: readStoredPreset<ChordToneSessionPreset>(
      CHORD_TONE_CUSTOM_PRESET_STORAGE_KEY
    ),
    customScaleDegreePreset: readStoredPreset<ScaleDegreeSessionPreset>(
      SCALE_DEGREE_CUSTOM_PRESET_STORAGE_KEY
    ),
    customIntervalPreset: readStoredPreset<IntervalLandmarkSessionPreset>(
      INTERVAL_LANDMARK_CUSTOM_PRESET_STORAGE_KEY
    ),
    customOctavePreset: readStoredPreset<OctaveShapeSessionPreset>(
      OCTAVE_SHAPE_CUSTOM_PRESET_STORAGE_KEY
    ),
    customTriadInversionPreset: readStoredPreset<TriadInversionSessionPreset>(
      TRIAD_INVERSION_CUSTOM_PRESET_STORAGE_KEY
    )
  };
}

export function clearStoredPracticeData(): void {
  try {
    for (const storageKey of practiceStorageKeys) {
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    // Local progress is a convenience; practice should keep working if storage is unavailable.
  }
}
