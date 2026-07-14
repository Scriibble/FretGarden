import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Early Account Notice",
  description:
    "Read the early access account notice for FretGarden accounts."
};

const noticeItems = [
  {
    title: "What accounts do now",
    body:
      "You can create an account, confirm your email, sign in, edit your display name, reset your password, and sign out."
  },
  {
    title: "What stays local",
    body:
      "Lesson progress, drill history, missed prompts, and custom practice presets are still stored in this browser's local storage."
  },
  {
    title: "What is not ready yet",
    body:
      "Cloud progress sync, paid subscriptions, social features, and complete legal terms are not part of this early account pass."
  },
  {
    title: "What data is involved",
    body:
      "FretGarden uses Supabase Auth for account access and stores a profile row with your display name. Do not use sensitive personal information as your display name."
  }
];

export default function AccountNoticePage() {
  return (
    <MarketingShell activePage="accountNotice">
      <section className={styles.signupSection} aria-labelledby="notice-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Early account notice</span>
            <h1 id="notice-title">Accounts are real, but still early.</h1>
            <p>
              This notice keeps FretGarden&apos;s account boundary clear while
              the product grows toward cloud progress sync and fuller policy
              pages.
            </p>

            <Link className={styles.textCta} href="/signup">
              Create an account.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Current account scope</h2>
              <p>
                Review this before using account features in early testing.
              </p>
            </div>

            <div className={styles.noticeList}>
              {noticeItems.map((item) => (
                <section key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
