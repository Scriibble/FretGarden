"use client";

interface PracticePromptState {
  label: string;
  title: string;
  status: string;
  description: string;
  canGoNext: boolean;
  onNextPrompt: () => void;
  onReset: () => void;
}

interface ReferencePromptState {
  title: string;
  status: string;
  description: string;
}

interface PracticePromptPanelProps {
  practicePrompt: PracticePromptState | null;
  referencePrompt: ReferencePromptState;
}

export function PracticePromptPanel({
  practicePrompt,
  referencePrompt
}: PracticePromptPanelProps) {
  return (
    <div className="prompt-panel" aria-live="polite">
      {practicePrompt ? (
        <>
          <div className="prompt-panel-header">
            <div>
              <span className="control-label">{practicePrompt.label}</span>
              <strong>{practicePrompt.title}</strong>
            </div>
            <span className="prompt-panel-status">
              {practicePrompt.status}
            </span>
          </div>
          <p>{practicePrompt.description}</p>
          <div className="prompt-actions">
            <button
              data-testid="drill-next"
              disabled={!practicePrompt.canGoNext}
              onClick={practicePrompt.onNextPrompt}
              type="button"
            >
              Next question
            </button>
            <button
              data-testid="drill-restart"
              onClick={practicePrompt.onReset}
              type="button"
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="prompt-panel-header">
            <div>
              <span className="control-label">Selected position</span>
              <strong>{referencePrompt.title}</strong>
            </div>
            <span className="prompt-panel-status">
              {referencePrompt.status}
            </span>
          </div>
          <p>{referencePrompt.description}</p>
        </>
      )}
    </div>
  );
}
