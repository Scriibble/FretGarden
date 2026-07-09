"use client";

import type { ScaleQuality } from "@pocket-practice/music-theory-engine";
import type { ReactNode } from "react";
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
  IntervalLandmarkFamilyFocus,
  IntervalLandmarkPromptOrder,
  IntervalLandmarkReviewMode,
  IntervalLandmarkSessionLength,
  IntervalLandmarkSessionPreset,
  IntervalLandmarkSessionSettings,
  IntervalLandmarkStringFocus
} from "../lib/intervalLandmarkRecognition";
import type {
  NoteRecognitionPromptOrder,
  NoteRecognitionReviewMode,
  NoteRecognitionSessionLength,
  NoteRecognitionSessionPreset,
  NoteRecognitionSessionSettings,
} from "../lib/noteRecognition";
import type {
  OctaveShapeFocus,
  OctaveShapePromptOrder,
  OctaveShapeReviewMode,
  OctaveShapeSessionLength,
  OctaveShapeSessionPreset,
  OctaveShapeSessionSettings,
  OctaveShapeStringFocus
} from "../lib/octaveShapeRecognition";
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
import type {
  TriadInversionFocus,
  TriadInversionPromptOrder,
  TriadInversionQualityFocus,
  TriadInversionReviewMode,
  TriadInversionSessionLength,
  TriadInversionSessionPreset,
  TriadInversionSessionSettings
} from "../lib/triadInversionRecognition";

type PracticeDrill =
  | "note"
  | "chordTone"
  | "scaleDegree"
  | "interval"
  | "octaveShape"
  | "triadInversion";

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
  interval: {
    presetOptions: readonly IntervalLandmarkSessionPreset[];
    settings: IntervalLandmarkSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: IntervalLandmarkSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (
      nextSettings: Partial<IntervalLandmarkSessionSettings>
    ) => void;
  };
  octave: {
    presetOptions: readonly OctaveShapeSessionPreset[];
    settings: OctaveShapeSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: OctaveShapeSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (
      nextSettings: Partial<OctaveShapeSessionSettings>
    ) => void;
  };
  triadInversion: {
    presetOptions: readonly TriadInversionSessionPreset[];
    settings: TriadInversionSessionSettings;
    missedReviewCount: number;
    onPresetSelect: (preset: TriadInversionSessionPreset) => void;
    onSavePreset: () => void;
    onSettingsChange: (
      nextSettings: Partial<TriadInversionSessionSettings>
    ) => void;
  };
}

const noteSessionLengthOptions = [6, 10, 20] as const satisfies readonly NoteRecognitionSessionLength[];
const stringFocusOptions = [
  { id: "all", label: "All" },
  { id: 6, label: "Low E" },
  { id: 5, label: "A" },
  { id: 4, label: "D" },
  { id: 3, label: "G" },
  { id: 2, label: "B" },
  { id: 1, label: "High E" }
] as const satisfies ReadonlyArray<{
  id:
    | ScaleDegreeStringFocus
    | IntervalLandmarkStringFocus
    | OctaveShapeStringFocus;
  label: string;
}>;
const promptOrderOptions = [
  { id: "fixed", label: "Fixed" },
  { id: "random", label: "Random" }
] as const satisfies ReadonlyArray<{
  id:
    | NoteRecognitionPromptOrder
    | ChordTonePromptOrder
    | ScaleDegreePromptOrder
    | IntervalLandmarkPromptOrder
    | OctaveShapePromptOrder
    | TriadInversionPromptOrder;
  label: string;
}>;
const reviewModeOptions = [
  { id: "full", label: "Full set" },
  { id: "missed", label: "Missed only" }
] as const satisfies ReadonlyArray<{
  id:
    | NoteRecognitionReviewMode
    | ChordToneReviewMode
    | ScaleDegreeReviewMode
    | IntervalLandmarkReviewMode
    | OctaveShapeReviewMode
    | TriadInversionReviewMode;
  label: string;
}>;
const chordSessionLengthOptions = [6, 12, 20] as const satisfies readonly ChordToneSessionLength[];
const qualityFocusOptions = [
  { id: "both", label: "Both" },
  { id: "major", label: "Major" },
  { id: "minor", label: "Minor" }
] as const satisfies ReadonlyArray<{
  id:
    | ChordToneQualityFocus
    | ScaleDegreeQualityFocus
    | TriadInversionQualityFocus;
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
const intervalSessionLengthOptions = [6, 12, 20] as const satisfies readonly IntervalLandmarkSessionLength[];
const intervalFamilyFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "seconds", label: "2nds" },
  { id: "thirds", label: "3rds" },
  { id: "fourths", label: "4ths" },
  { id: "fifths", label: "5ths" },
  { id: "sixths", label: "6ths" },
  { id: "sevenths", label: "7ths" }
] as const satisfies ReadonlyArray<{
  id: IntervalLandmarkFamilyFocus;
  label: string;
}>;
const octaveSessionLengthOptions = [6, 10, 20] as const satisfies readonly OctaveShapeSessionLength[];
const octaveShapeFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "C", label: "C" },
  { id: "A", label: "A" },
  { id: "G", label: "G" },
  { id: "E", label: "E" },
  { id: "D", label: "D" }
] as const satisfies ReadonlyArray<{
  id: OctaveShapeFocus;
  label: string;
}>;
const triadInversionSessionLengthOptions = [6, 12, 20] as const satisfies readonly TriadInversionSessionLength[];
const triadInversionFocusOptions = [
  { id: "mixed", label: "Mixed" },
  { id: "rootPosition", label: "Root" },
  { id: "firstInversion", label: "1st" },
  { id: "secondInversion", label: "2nd" }
] as const satisfies ReadonlyArray<{
  id: TriadInversionFocus;
  label: string;
}>;

export function PracticeSessionSettings({
  practiceDrill,
  note,
  chord,
  scale,
  interval,
  octave,
  triadInversion
}: PracticeSessionSettingsProps) {
  if (practiceDrill === "note") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

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

        <AdvancedSettings>
          <PromptOrderField
            selectedOrder={note.settings.promptOrder}
            testIdPrefix="note"
            onChange={(promptOrder) => note.onSettingsChange({ promptOrder })}
          />

          <ReviewModeField
            missedReviewCount={note.missedReviewCount}
            selectedReviewMode={note.settings.reviewMode}
            testIdPrefix="note"
            emptyMessage="No missed note questions yet, using the full set."
            reviewLabel="missed note question"
            onChange={(reviewMode) => note.onSettingsChange({ reviewMode })}
          />
        </AdvancedSettings>
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

        <AdvancedSettings>
          <PromptOrderField
            selectedOrder={chord.settings.promptOrder}
            testIdPrefix="chord"
            onChange={(promptOrder) => chord.onSettingsChange({ promptOrder })}
          />

          <ReviewModeField
            missedReviewCount={chord.missedReviewCount}
            selectedReviewMode={chord.settings.reviewMode}
            testIdPrefix="chord"
            emptyMessage="No missed chord questions yet, using the full set."
            reviewLabel="missed chord question"
            onChange={(reviewMode) => chord.onSettingsChange({ reviewMode })}
          />
        </AdvancedSettings>
      </div>
    );
  }

  if (practiceDrill === "interval") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

        <PresetField
          presets={interval.presetOptions}
          testIdPrefix="interval"
          onPresetSelect={interval.onPresetSelect}
          onSavePreset={interval.onSavePreset}
        />

        <div className="setup-field">
          <span>Length</span>
          <div className="segmented-control option-grid three">
            {intervalSessionLengthOptions.map((sessionLength) => (
              <button
                className={
                  interval.settings.sessionLength === sessionLength
                    ? "is-selected"
                    : ""
                }
                data-testid={`interval-length-${sessionLength}`}
                key={sessionLength}
                onClick={() => interval.onSettingsChange({ sessionLength })}
                type="button"
              >
                {sessionLength}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-field">
          <span>Interval family</span>
          <div className="segmented-control option-grid degree-options">
            {intervalFamilyFocusOptions.map((option) => (
              <button
                className={
                  interval.settings.familyFocus === option.id
                    ? "is-selected"
                    : ""
                }
                data-testid={`interval-family-${option.id}`}
                key={option.id}
                onClick={() =>
                  interval.onSettingsChange({
                    familyFocus: option.id
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
          selectedString={interval.settings.stringFocus}
          testIdPrefix="interval"
          onChange={(stringFocus) => interval.onSettingsChange({ stringFocus })}
        />

        <AdvancedSettings>
          <PromptOrderField
            selectedOrder={interval.settings.promptOrder}
            testIdPrefix="interval"
            onChange={(promptOrder) =>
              interval.onSettingsChange({ promptOrder })
            }
          />

          <ReviewModeField
            missedReviewCount={interval.missedReviewCount}
            selectedReviewMode={interval.settings.reviewMode}
            testIdPrefix="interval"
            emptyMessage="No missed interval questions yet, using the full set."
            reviewLabel="missed interval question"
            onChange={(reviewMode) =>
              interval.onSettingsChange({ reviewMode })
            }
          />
        </AdvancedSettings>
      </div>
    );
  }

  if (practiceDrill === "octaveShape") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

        <PresetField
          presets={octave.presetOptions}
          testIdPrefix="octave"
          onPresetSelect={octave.onPresetSelect}
          onSavePreset={octave.onSavePreset}
        />

        <div className="setup-field">
          <span>Length</span>
          <div className="segmented-control option-grid three">
            {octaveSessionLengthOptions.map((sessionLength) => (
              <button
                className={
                  octave.settings.sessionLength === sessionLength
                    ? "is-selected"
                    : ""
                }
                data-testid={`octave-length-${sessionLength}`}
                key={sessionLength}
                onClick={() => octave.onSettingsChange({ sessionLength })}
                type="button"
              >
                {sessionLength}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-field">
          <span>CAGED shape</span>
          <div className="segmented-control option-grid shape-options">
            {octaveShapeFocusOptions.map((option) => (
              <button
                className={
                  octave.settings.shapeFocus === option.id ? "is-selected" : ""
                }
                data-testid={`octave-shape-${option.id}`}
                key={option.id}
                onClick={() =>
                  octave.onSettingsChange({
                    shapeFocus: option.id
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
          selectedString={octave.settings.stringFocus}
          testIdPrefix="octave"
          onChange={(stringFocus) => octave.onSettingsChange({ stringFocus })}
        />

        <AdvancedSettings>
          <PromptOrderField
            selectedOrder={octave.settings.promptOrder}
            testIdPrefix="octave"
            onChange={(promptOrder) =>
              octave.onSettingsChange({ promptOrder })
            }
          />

          <ReviewModeField
            missedReviewCount={octave.missedReviewCount}
            selectedReviewMode={octave.settings.reviewMode}
            testIdPrefix="octave"
            emptyMessage="No missed octave questions yet, using the full set."
            reviewLabel="missed octave question"
            onChange={(reviewMode) => octave.onSettingsChange({ reviewMode })}
          />
        </AdvancedSettings>
      </div>
    );
  }

  if (practiceDrill === "triadInversion") {
    return (
      <div className="session-setup-panel">
        <span className="control-label">Session setup</span>

        <PresetField
          presets={triadInversion.presetOptions}
          testIdPrefix="triad-inversion"
          onPresetSelect={triadInversion.onPresetSelect}
          onSavePreset={triadInversion.onSavePreset}
        />

        <div className="setup-field">
          <span>Length</span>
          <div className="segmented-control option-grid three">
            {triadInversionSessionLengthOptions.map((sessionLength) => (
              <button
                className={
                  triadInversion.settings.sessionLength === sessionLength
                    ? "is-selected"
                    : ""
                }
                data-testid={`triad-inversion-length-${sessionLength}`}
                key={sessionLength}
                onClick={() =>
                  triadInversion.onSettingsChange({ sessionLength })
                }
                type="button"
              >
                {sessionLength}
              </button>
            ))}
          </div>
        </div>

        <QualityFocusField
          selectedQuality={triadInversion.settings.qualityFocus}
          testIdPrefix="triad-inversion"
          onChange={(qualityFocus) =>
            triadInversion.onSettingsChange({ qualityFocus })
          }
        />

        <div className="setup-field">
          <span>Inversion</span>
          <div className="segmented-control option-grid four">
            {triadInversionFocusOptions.map((option) => (
              <button
                className={
                  triadInversion.settings.inversionFocus === option.id
                    ? "is-selected"
                    : ""
                }
                data-testid={`triad-inversion-focus-${option.id}`}
                key={option.id}
                onClick={() =>
                  triadInversion.onSettingsChange({
                    inversionFocus: option.id
                  })
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <AdvancedSettings>
          <PromptOrderField
            selectedOrder={triadInversion.settings.promptOrder}
            testIdPrefix="triad-inversion"
            onChange={(promptOrder) =>
              triadInversion.onSettingsChange({ promptOrder })
            }
          />

          <ReviewModeField
            missedReviewCount={triadInversion.missedReviewCount}
            selectedReviewMode={triadInversion.settings.reviewMode}
            testIdPrefix="triad-inversion"
            emptyMessage="No missed inversion questions yet, using the full set."
            reviewLabel="missed inversion question"
            onChange={(reviewMode) =>
              triadInversion.onSettingsChange({ reviewMode })
            }
          />
        </AdvancedSettings>
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

      <AdvancedSettings>
        <PromptOrderField
          selectedOrder={scale.settings.promptOrder}
          testIdPrefix="scale"
          onChange={(promptOrder) => scale.onSettingsChange({ promptOrder })}
        />

        <ReviewModeField
          missedReviewCount={scale.missedReviewCount}
          selectedReviewMode={scale.settings.reviewMode}
          testIdPrefix="scale"
          emptyMessage="No missed scale questions yet, using the full set."
          reviewLabel="missed scale question"
          onChange={(reviewMode) => scale.onSettingsChange({ reviewMode })}
        />
      </AdvancedSettings>
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
    <details className="settings-disclosure preset-disclosure">
      <summary>
        <span>Quick presets</span>
        <small>Optional shortcuts and saved custom setup</small>
      </summary>
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
    </details>
  );
}

function AdvancedSettings({ children }: { children: ReactNode }) {
  return (
    <details className="settings-disclosure advanced-settings">
      <summary>
        <span>More options</span>
        <small>Question order and missed-answer review</small>
      </summary>
      <div className="advanced-settings-fields">{children}</div>
    </details>
  );
}

function QualityFocusField({
  selectedQuality,
  testIdPrefix,
  onChange
}: {
  selectedQuality:
    | ChordToneQualityFocus
    | ScaleDegreeQualityFocus
    | TriadInversionQualityFocus;
  testIdPrefix: "chord" | "scale" | "triad-inversion";
  onChange: (
    qualityFocus:
      | ChordToneQualityFocus
      | ScaleDegreeQualityFocus
      | TriadInversionQualityFocus
  ) => void;
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
  selectedString:
    | ScaleDegreeStringFocus
    | IntervalLandmarkStringFocus
    | OctaveShapeStringFocus;
  testIdPrefix: "scale" | "interval" | "octave";
  onChange: (
    stringFocus:
      | ScaleDegreeStringFocus
      | IntervalLandmarkStringFocus
      | OctaveShapeStringFocus
  ) => void;
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
    | ScaleDegreePromptOrder
    | IntervalLandmarkPromptOrder
    | OctaveShapePromptOrder
    | TriadInversionPromptOrder;
  testIdPrefix:
    | "note"
    | "chord"
    | "scale"
    | "interval"
    | "octave"
    | "triad-inversion";
  onChange: (
    promptOrder:
      | NoteRecognitionPromptOrder
      | ChordTonePromptOrder
      | ScaleDegreePromptOrder
      | IntervalLandmarkPromptOrder
      | OctaveShapePromptOrder
      | TriadInversionPromptOrder
  ) => void;
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
    | ScaleDegreeReviewMode
    | IntervalLandmarkReviewMode
    | OctaveShapeReviewMode
    | TriadInversionReviewMode;
  testIdPrefix:
    | "note"
    | "chord"
    | "scale"
    | "interval"
    | "octave"
    | "triad-inversion";
  emptyMessage: string;
  reviewLabel: string;
  onChange: (
    reviewMode:
      | NoteRecognitionReviewMode
      | ChordToneReviewMode
      | ScaleDegreeReviewMode
      | IntervalLandmarkReviewMode
      | OctaveShapeReviewMode
      | TriadInversionReviewMode
  ) => void;
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
