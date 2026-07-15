"use client";

import { useEffect, useState } from "react";
import {
  buildPracticeHistorySnapshot,
  type PracticeHistorySnapshot
} from "../lib/practiceHistory";
import { readStoredPracticeData } from "../lib/practiceStorage";

const emptyHistory: PracticeHistorySnapshot = {
  recentSessions: [],
  weakSpots: []
};

export function PracticeHistory() {
  const [history, setHistory] = useState<PracticeHistorySnapshot>(emptyHistory);

  useEffect(() => {
    setHistory(buildPracticeHistorySnapshot(readStoredPracticeData()));
  }, []);

  return (
    <section className="history-dashboard" aria-label="Practice history">
      <article className="progress-card history-card">
        <div className="progress-card-heading">
          <span className="control-label">Recent sessions</span>
          <strong>{history.recentSessions.length}</strong>
        </div>
        {history.recentSessions.length > 0 ? (
          <div className="recent-session-list">
            {history.recentSessions.map((session) => (
              <div className="recent-session-row" key={session.id}>
                <div>
                  <strong>{session.drillLabel}</strong>
                  <span>{session.completedAtLabel}</span>
                </div>
                <span>
                  {session.accuracy}% · {session.correct}/
                  {session.promptCount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-progress-copy">
            Finish a drill to start your practice history.
          </p>
        )}
      </article>

      <article className="progress-card history-card">
        <div className="progress-card-heading">
          <span className="control-label">Weak spots</span>
          <strong>{history.weakSpots.length}</strong>
        </div>
        {history.weakSpots.length > 0 ? (
          <div className="weak-spot-list">
            {history.weakSpots.map((spot) => (
              <div className="weak-spot-row" key={spot.id}>
                <div>
                  <strong>{spot.label}</strong>
                  <span>{spot.drillLabel}</span>
                </div>
                <span>
                  {spot.accuracy}% · {spot.missed}/{spot.attempted} missed
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-progress-copy">
            No weak spots yet. Complete a few sessions and this will get more
            useful.
          </p>
        )}
      </article>
    </section>
  );
}
