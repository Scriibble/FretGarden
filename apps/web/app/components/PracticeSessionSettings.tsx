"use client";

import type { NoteName, ScaleQuality } from "@pocket-practice/music-theory-engine";
import type {
  ChordTonePromptOrder,
  ChordToneQualityFocus,
  ChordToneReviewMode,
  ChordToneSessionLength,
  ChordToneSessionPreset,
  ChordToneSessionSettings,
  ChordToneToneFocus
} from "../lib/chordToneRecognition";
import type {
  NoteRecognitionNoteFocus,
  NoteRecognitionPromptOrder,
  NoteRecognitionReviewMode,
  NoteRecognitionSessionLength,
  NoteRecognitionSessionPreset,
  NoteRecognitionSessionSettings,
  NoteRecognitionStringFocus
} from "../lib/noteRecognition";
import type {
  ScaleDegreeDegreeFocus,
  ScaleDegreePromptOrder,
  ScaleDegreeQualityFocus,
  ScaleDegreeReviewMode,
  ScaleDegreeSessionLength,
  ScaleDegreeSessionPreset,
  ScaleDegreeSessionSettings,
  ScaleDegreeStringFocus
} from "../lib/scaleDegreeRecognition";

type PracticeDrill = "note" | "chordTone" | "scaleDegree";

interface PracticeSessionSettingsProps {
  practiceDrill: PracticeDrill;
  note: {
    presetOptions: readonly NoteRecognitionSessionPreset[];
    settings: NoteRecognitionSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: NoteRecognitionSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (
      nextSettings: Partial<NoteRecognitionSessionSettings>
    ) => void;
  };
  chord: {
    presetOptions: readonly ChordToneSessionPreset[];
    settings: ChordToneSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: ChordToneSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (nextSettings: Partial<ChordToneSessionSettings>) => void;
  };
  scale: {
    presetOptions: readonly ScaleDegreeSessionPreset[];
    settings: ScaleDegreeSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: ScaleDegreeSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (
      nextSettings: Partial<ScaleDegreeSessionSettings>
    ) => void;
  };
}

const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
] as const satisfies readonly NoteName[];

const noteSessionLengthOptions = [6, 10, 20] as const satisfies readonly NoteRecognitionSessionLength[];
const noteFocusOptions = [
  { id: "all", label: "All" },
  ...notes.map((note) => ({ id: note, label: note }))
] as const satisfies ReadonlyArray<{
  id: NoteRecognitionNoteFocus;
  label: string;
}>;
const stringFocusOptions = [
  { id: "all", label: "All" },
  { id: 6, label: "Low E" },
  { id: 5, label: "A" },
  { id: 4, label: "D" },
  { id: 3, label: "G" },
  { id: 2, label: "B" },
  { id: 1, label: "High E" }
] as const satisfies ReadonlyArray<{
  id: NoteRecognitionStringFocus | ScaleDegreeStringFocus;
  label: string;
}>;
const promptOrderOptions = [
  { id: "fixed", label: "Fixed" },
  { id: "random", label: "Random" }
] as const satisfies ReadonlyArray<{
  id: NoteRecognitionPromptOrder | ChordTonePromptOrder | ScaleDegreePromptOrder;
  label: string;
}>;
const reviewModeOptions = [
  { id: "full", label: "Full set" },
  { id: "missed", label: "Missed only" }
] as const satisfies ReadonlyArray<{
  id: NoteRecognitionReviewMode | ChordToneReviewMode | ScaleDegreeReviewMode;
  label: string;
}>;
const chordSessionLengthOptions = [6, 12, 20] as const satisfies readonly ChordToneSessionLength[];
const qualityFocusOptions = [
  { id: "both", label: "Both" },
  { id: "major", label: "Major" },
  { id: "minor", label: "Minor" }
] as const satisfies ReadonlyArray<{
  id: ChordToneQualityFocus | ScaleDegreeQualityFocus;
  label: string;
}>;
const chordToneFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "root", label: "Root" },
  { id: "third", label: "3rd" },
  { id: "fifth", label: "5th" }
] as const satisfies ReadonlyArray<{
  id: ChordToneToneFocus;
  label: string;
}>;
const scaleDegreeSessionLengthOptions = [6, 12, 20] as const satisfies readonly ScaleDegreeSessionLength[];
const scaleDegreeFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "root", label: "Root" },
  { id: "second", label: "2nd" },
  { id: "third", label: "3rd" },
  { id: "fourth", label: "4th" },
  { id: "fifth", label: "5th" },
  { id: "sixth", label: "6th" },
  { id: "seventh", label: "7th" }
] as const satisfies ReadonlyArray<{
  id: ScaleDegreeDegreeFocus;
  label: string;
}>;

export function PracticeSessionSettings({
  practiceDrill,
  note,
  chord,
  scale
}: PracticeSessionSettingsProps) {
  if (practiceDrill === "note") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

        <PresetField
          presets={note.presetOptions}
          testIdPrefix="note"
          onPresetSelect={note.onPresetSelect}
          onSavePreset={note.onSavePreset}
        />

        <div className="setup-field">
          <span>Length</span>
          <div className="segmented-control option-grid three">
            {noteSessionLengthOptions.map((sessionLength) => (
              <button
                className={
                  note.settings.sessionLength === sessionLength
                    ? "is-selected"
                    : ""
                }
                data-testid={`note-length-${sessionLength}`}
                key={sessionLength}
                onClick={() => note.onSettingsChange({ sessionLength })}
                type="button"
              >
                {sessionLength}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-field">
          <span>Target note</span>
          <div className="note-grid">
            {noteFocusOptions.map((option) => (
              <button
                className={
                  note.settings.noteFocus === option.id ? "is-selected" : ""
                }
                data-testid={`note-focus-${formatNoteFocusTestId(option.id)}`}
                key={option.id}
                onClick={() =>
                  note.onSettingsChange({
                    noteFocus: option.id
                  })
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <StringFocusField
          selectedString={note.settings.stringFocus}
          testIdPrefix="note"
          onChange={(stringFocus) => note.onSettingsChange({ stringFocus })}
        />

        <PromptOrderField
          selectedOrder={note.settings.promptOrder}
          testIdPrefix="note"
          onChange={(promptOrder) => note.onSettingsChange({ promptOrder })}
        />

        <ReviewModeField
          missedReviewCount={note.missedReviewCount}
          selectedReviewMode={note.settings.reviewMode}
          testIdPrefix="note"
          emptyMessage="No missed note prompts yet, using the full set."
          reviewLabel="missed note prompt"
          onChange={(reviewMode) => note.onSettingsChange({ reviewMode })}
        />
      </div>
    );
  }

  if (practiceDrill === "chordTone") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

        <PresetField
          presets={chord.presetOptions}
          testIdPrefix="chord"
          onPresetSelect={chord.onPresetSelect}
          onSavePreset={chord.onSavePreset}
        />

        <div className="setup-field">
          <span>Length</span>
          <div className="segmented-control option-grid three">
            {chordSessionLengthOptions.map((sessionLength) => (
              <button
                className={
                  chord.settings.sessionLength === sessionLength
                    ? "is-selected"
                    : ""
                }
                data-testid={`chord-length-${sessionLength}`}
                key={sessionLength}
                onClick={() => chord.onSettingsChange({ sessionLength })}
                type="button"
              >
                {sessionLength}
              </button>
            ))}
          </div>
        </div>

        <QualityFocusField
          selectedQuality={chord.settings.qualityFocus}
          testIdPrefix="chord"
          onChange={(qualityFocus) => chord.onSettingsChange({ qualityFocus })}
        />

        <div className="setup-field">
          <span>Tone</span>
          <div className="segmented-control option-grid four">
            {chordToneFocusOptions.map((option) => (
              <button
                className={
                  chord.settings.toneFocus === option.id ? "is-selected" : ""
                }
                data-testid={`chord-tone-${option.id}`}
                key={option.id}
                onClick={() =>
                  chord.onSettingsChange({
                    toneFocus: option.id
                  })
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <PromptOrderField
          selectedOrder={chord.settings.promptOrder}
          testIdPrefix="chord"
          onChange={(promptOrder) => chord.onSettingsChange({ promptOrder })}
        />

        <ReviewModeField
          missedReviewCount={chord.missedReviewCount}
          selectedReviewMode={chord.settings.reviewMode}
          testIdPrefix="chord"
          emptyMessage="No missed chord prompts yet, using the full set."
          reviewLabel="missed chord prompt"
          onChange={(reviewMode) => chord.onSettingsChange({ reviewMode })}
        />
      </div>
    );
  }

  return (
    <div className="session-setup-panel">
      <span className="control-label">Session setup</span>

      <PresetField
        presets={scale.presetOptions}
        testIdPrefix="scale"
        onPresetSelect={scale.onPresetSelect}
        onSavePreset={scale.onSavePreset}
      />

      <div className="setup-field">
        <span>Length</span>
        <div className="segmented-control option-grid three">
          {scaleDegreeSessionLengthOptions.map((sessionLength) => (
            <button
              className={
                scale.settings.sessionLength === sessionLength
                  ? "is-selected"
                  : ""
              }
              data-testid={`scale-length-${sessionLength}`}
              key={sessionLength}
              onClick={() => scale.onSettingsChange({ sessionLength })}
              type="button"
            >
              {sessionLength}
            </button>
          ))}
        </div>
      </div>

      <QualityFocusField
        selectedQuality={scale.settings.qualityFocus}
        testIdPrefix="scale"
        onChange={(qualityFocus) => scale.onSettingsChange({ qualityFocus })}
      />

      <div className="setup-field">
        <span>Degree</span>
        <div className="segmented-control option-grid degree-options">
          {scaleDegreeFocusOptions.map((option) => (
            <button
              className={
                scale.settings.degreeFocus === option.id ? "is-selected" : ""
              }
              data-testid={`scale-degree-${option.id}`}
              key={option.id}
              onClick={() =>
                scale.onSettingsChange({
                  degreeFocus: option.id
                })
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <StringFocusField
        selectedString={scale.settings.stringFocus}
        testIdPrefix="scale"
        onChange={(stringFocus) => scale.onSettingsChange({ stringFocus })}
      />

      <PromptOrderField
        selectedOrder={scale.settings.promptOrder}
        testIdPrefix="scale"
        onChange={(promptOrder) => scale.onSettingsChange({ promptOrder })}
      />

      <ReviewModeField
        missedReviewCount={scale.missedReviewCount}
        selectedReviewMode={scale.settings.reviewMode}
        testIdPrefix="scale"
        emptyMessage="No missed scale prompts yet, using the full set."
        reviewLabel="missed scale prompt"
        onChange={(reviewMode) => scale.onSettingsChange({ reviewMode })}
      />
    </div>
  );
}

function PresetField<Preset extends { id: string; label: string }>({
  presets,
  testIdPrefix,
  onPresetSelect,
  onSavePreset
}: {
  presets: readonly Preset[];
  testIdPrefix: string;
  onPresetSelect: (preset: Preset) => void;
  onSavePreset: () => void;
}) {
  return (
    <div className="setup-field">
      <span>Preset</span>
      <div className="preset-grid">
        {presets.map((preset) => (
          <button
            data-testid={`${testIdPrefix}-preset-${preset.id}`}
            key={preset.id}
            onClick={() => onPresetSelect(preset)}
            type="button"
          >
            {preset.label}
          </button>
        ))}
        <button
          data-testid={`${testIdPrefix}-preset-save`}
          onClick={onSavePreset}
          type="button"
        >
          Save current
        </button>
      </div>
    </div>
  );
}

function QualityFocusField({
  selectedQuality,
  testIdPrefix,
  onChange
}: {
  selectedQuality: ChordToneQualityFocus | ScaleDegreeQualityFocus;
  testIdPrefix: "chord" | "scale";
  onChange: (qualityFocus: ScaleDegreeQualityFocus) => void;
}) {
  return (
    <div className="setup-field">
      <span>Quality</span>
      <div className="segmented-control option-grid three">
        {qualityFocusOptions.map((option) => (
          <button
            className={selectedQuality === option.id ? "is-selected" : ""}
            data-testid={`${testIdPrefix}-quality-${option.id}`}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StringFocusField({
  selectedString,
  testIdPrefix,
  onChange
}: {
  selectedString: NoteRecognitionStringFocus | ScaleDegreeStringFocus;
  testIdPrefix: "note" | "scale";
  onChange: (stringFocus: NoteRecognitionStringFocus) => void;
}) {
  return (
    <div className="setup-field">
      <span>String</span>
      <div className="segmented-control option-grid string-options">
        {stringFocusOptions.map((option) => (
          <button
            className={selectedString === option.id ? "is-selected" : ""}
            data-testid={`${testIdPrefix}-string-${option.id}`}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PromptOrderField({
  selectedOrder,
  testIdPrefix,
  onChange
}: {
  selectedOrder:
    | NoteRecognitionPromptOrder
    | ChordTonePromptOrder
    | ScaleDegreePromptOrder;
  testIdPrefix: "note" | "chord" | "scale";
  onChange: (promptOrder: NoteRecognitionPromptOrder) => void;
}) {
  return (
    <div className="setup-field">
      <span>Order</span>
      <div className="segmented-control compact">
        {promptOrderOptions.map((option) => (
          <button
            className={selectedOrder === option.id ? "is-selected" : ""}
            data-testid={`${testIdPrefix}-order-${option.id}`}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewModeField({
  missedReviewCount,
  selectedReviewMode,
  testIdPrefix,
  emptyMessage,
  reviewLabel,
  onChange
}: {
  missedReviewCount: number;
  selectedReviewMode:
    | NoteRecognitionReviewMode
    | ChordToneReviewMode
    | ScaleDegreeReviewMode;
  testIdPrefix: "note" | "chord" | "scale";
  emptyMessage: string;
  reviewLabel: string;
  onChange: (reviewMode: NoteRecognitionReviewMode) => void;
}) {
  return (
    <div className="setup-field">
      <span>Review</span>
      <div className="segmented-control compact">
        {reviewModeOptions.map((option) => (
          <button
            className={selectedReviewMode === option.id ? "is-selected" : ""}
            data-testid={`${testIdPrefix}-review-${option.id}`}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {selectedReviewMode === "missed" && missedReviewCount === 0 ? (
        <small>{emptyMessage}</small>
      ) : selectedReviewMode === "missed" ? (
        <small>
          Reviewing {missedReviewCount} {reviewLabel}
          {missedReviewCount === 1 ? "" : "s"}.
        </small>
      ) : null}
    </div>
  );
}

function formatNoteFocusTestId(noteFocus: NoteRecognitionNoteFocus): string {
  return noteFocus === "all" ? noteFocus : formatNoteTestId(noteFocus);
}

function formatNoteTestId(note: NoteName): string {
  return note.replace("#", "sharp").replace("b", "flat");
}
