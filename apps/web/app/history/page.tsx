import Link from "next/link";
import { PracticeHistory } from "../components/PracticeHistory";

export default function HistoryPage() {
  return (
    <main className="lesson-shell">
      <header className="lesson-header">
        <div>
          <p className="eyebrow">FretGarden History</p>
          <h1>Practice history</h1>
          <p>
            Review recent sessions and weak spots saved locally on this browser.
          </p>
        </div>
        <div className="lesson-nav">
          <Link href="/practice#practice">Practice</Link>
          <Link href="/lessons">Lessons</Link>
        </div>
      </header>

      <PracticeHistory />
    </main>
  );
}
