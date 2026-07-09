import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero" aria-labelledby="landing-title">
        <nav className="landing-nav" aria-label="Primary navigation">
          <Link className="brand-lockup" href="/">
            <img src="/brand/fretgarden-icon.svg" alt="" />
            <span>FretGarden</span>
          </Link>
          <Link className="landing-nav-link" href="/practice">
            Open app
          </Link>
        </nav>

        <div className="landing-hero-main">
          <div className="landing-copy">
            <p className="eyebrow">Guitar fretboard practice</p>
            <h1 id="landing-title">Grow your fretboard fluency.</h1>
            <p>
              Practice notes, chord tones, and scale degrees in short guitar
              drills that give immediate feedback.
            </p>
            <div className="landing-actions" aria-label="Choose a path">
              <Link className="landing-action primary" href="/practice">
                <span>Practice drills</span>
                <strong>Start a five-minute fretboard drill</strong>
              </Link>
              <Link className="landing-action secondary" href="/lessons">
                <span>Lessons</span>
                <strong>Learn the idea, then play it</strong>
              </Link>
              <Link className="landing-history-link" href="/history">
                History
              </Link>
            </div>
          </div>

          <div className="landing-product-panel" aria-label="FretGarden focus">
            <img
              className="landing-logo"
              src="/brand/fretgarden-logo.svg"
              alt="FretGarden"
            />
            <div className="landing-focus-grid">
              <span>Notes</span>
              <span>Chord tones</span>
              <span>Scale degrees</span>
            </div>
            <p>
              No account, no clutter. Open a short loop, answer on the
              fretboard, and see what needs another pass.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
