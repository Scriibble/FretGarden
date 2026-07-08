import { writeStoredSessionHistory } from "./browserStorage";

type SessionBuilder<Attempt, Session> = (
  attempts: Attempt[],
  completedAt: undefined,
  promptCount: number
) => Session;

type HistoryAppender<Session> = (
  previousHistory: Session[],
  session: Session
) => Session[];

type CompletedSessionSetter<Session> = (session: Session) => void;
type SessionHistorySetter<Session> = (
  updater: (previousHistory: Session[]) => Session[]
) => void;

export interface CompletePracticeSessionOptions<Attempt, Session> {
  appendSession: HistoryAppender<Session>;
  attempts: Attempt[];
  buildSession: SessionBuilder<Attempt, Session>;
  completedSession: Session | null;
  isComplete: boolean;
  onComplete: (session: Session) => void;
  promptCount: number;
  setCompletedSession: CompletedSessionSetter<Session>;
  setSessionHistory: SessionHistorySetter<Session>;
  storageKey: string;
}

export function completePracticeSession<Attempt, Session>({
  appendSession,
  attempts,
  buildSession,
  completedSession,
  isComplete,
  onComplete,
  promptCount,
  setCompletedSession,
  setSessionHistory,
  storageKey
}: CompletePracticeSessionOptions<Attempt, Session>): Session | null {
  if (!isComplete || completedSession !== null) {
    return null;
  }

  const nextSession = buildSession(attempts, undefined, promptCount);

  setCompletedSession(nextSession);
  setSessionHistory((previousHistory) => {
    const nextHistory = appendSession(previousHistory, nextSession);

    writeStoredSessionHistory(storageKey, nextHistory);

    return nextHistory;
  });
  onComplete(nextSession);

  return nextSession;
}
