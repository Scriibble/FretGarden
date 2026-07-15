"use client";

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

export interface HabitStat {
  id: string;
  label: string;
  value: string;
  detail: string;
  variant: "streak" | "xp" | "mastery";
}

interface ProgressDashboardProps {
  recommendationTitle: string;
  recommendationDescription: string;
  onStartRecommendation: () => void;
  habitStats: readonly HabitStat[];
  recentSessions: readonly RecentPracticeSession[];
  weakSpots: readonly PracticeWeakSpot[];
}

export function ProgressDashboard({
  recommendationTitle,
  recommendationDescription,
  onStartRecommendation,
  habitStats,
  recentSessions,
  weakSpots
}: ProgressDashboardProps) {
  return (
    <section className="progress-dashboard" aria-label="Practice progress">
      <article className="next-session-card">
        <div>
          <p className="eyebrow">Today's practice</p>
          <h2>{recommendationTitle}</h2>
          <p>{recommendationDescription}</p>
        </div>
        <div className="habit-stat-grid" aria-label="Practice habit stats">
          {habitStats.map((stat) => (
            <div
              className={`habit-stat habit-stat-${stat.variant}`}
              key={stat.id}
            >
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
        <button onClick={onStartRecommendation} type="button">
          Start this session
        </button>
      </article>

      <article className="progress-card">
        <div className="progress-card-heading">
          <span className="control-label">Recent sessions</span>
          <strong>{recentSessions.length}</strong>
        </div>
        {recentSessions.length > 0 ? (
          <div className="recent-session-list">
            {recentSessions.map((session) => (
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
            Finish a drill to start building your recent practice history.
          </p>
        )}
      </article>

      <article className="progress-card">
        <div className="progress-card-heading">
          <span className="control-label">Weak spots</span>
          <strong>{weakSpots.length}</strong>
        </div>
        {weakSpots.length > 0 ? (
          <div className="weak-spot-list">
            {weakSpots.map((spot) => (
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
