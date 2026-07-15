import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the early-access FretGarden privacy policy, including account, local progress, waitlist, and tester feedback boundaries."
};

const sections = [
  {
    title: "Account information",
    body:
      "If you create an account, FretGarden uses Supabase Auth for sign-up, sign-in, email confirmation, password reset, and session management. The app stores a profile row with your user ID and optional display name."
  },
  {
    title: "Local practice information",
    body:
      "Lesson progress, drill history, weak spots, practice presets, curriculum progress, and pilot evidence are currently stored in this browser's localStorage. This data is not synced across devices."
  },
  {
    title: "Tester feedback",
    body:
      "Survey responses may be used to improve FretGarden and support release-readiness evidence. Testers should avoid sharing sensitive personal information."
  },
  {
    title: "What is not collected",
    body:
      "The current app does not require microphone access, camera access, audio uploads, video uploads, payment information, subscriptions, or cloud practice history."
  },
  {
    title: "Third-party services",
    body:
      "FretGarden currently relies on Supabase for authentication and profile storage, a hosting provider such as Vercel, an optional waitlist provider, and a survey tool if testers choose to submit feedback."
  },
  {
    title: "Changes",
    body:
      "This policy may change as FretGarden adds cloud sync, production persistence, analytics, subscriptions, or other features. Material changes should be reviewed before broader release."
  }
];

export default function PrivacyPage() {
  return (
    <MarketingShell activePage="privacy">
      <section className={styles.signupSection} aria-labelledby="privacy-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Privacy policy</span>
            <h1 id="privacy-title">Early-access data boundaries.</h1>
            <p>
              FretGarden is currently a local-first guitar practice app with
              real account access and local browser progress. This page explains
              what the current product uses and what remains planned.
            </p>
            <p className={styles.policyDate}>Effective date: July 15, 2026</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/tester-feedback">
                Open tester feedback
              </Link>
              <Link className={styles.secondaryCta} href="/terms">
                Read terms
              </Link>
            </div>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Current policy summary</h2>
              <p>
                This product policy draft should be reviewed before broad
                public launch.
              </p>
            </div>
            <div className={styles.noticeList}>
              {sections.map((section) => (
                <section key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
