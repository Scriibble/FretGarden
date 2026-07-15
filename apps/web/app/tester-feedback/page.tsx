import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Tester Feedback",
  description:
    "Help test FretGarden by sharing usability, accessibility, and lesson-quality feedback."
};

const surveyUrl = process.env.NEXT_PUBLIC_TESTER_SURVEY_URL?.trim();

const testerSteps = [
  {
    title: "Use the current app",
    body:
      "Open lessons, practice tools, progress, and account pages. Use your normal device, browser, and accessibility tools if applicable."
  },
  {
    title: "Try one real task",
    body:
      "Complete a short lesson or practice task without coaching. Notice where the app helps, where it over-explains, and where it leaves you guessing."
  },
  {
    title: "Submit the survey",
    body:
      "Share what worked, what blocked you, and whether the progress language felt honest. Avoid sensitive personal information."
  },
  {
    title: "Optional follow-up",
    body:
      "If you agree to follow-up, the project owner may ask a clarifying question about your feedback."
  }
];

export default function TesterFeedbackPage() {
  return (
    <MarketingShell activePage="testerFeedback">
      <section className={styles.signupSection} aria-labelledby="tester-feedback-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Tester feedback</span>
            <h1 id="tester-feedback-title">Help decide what is ready.</h1>
            <p>
              FretGarden needs real usability and accessibility testing before
              a broader release. Your feedback helps find blockers, unclear
              lessons, misleading progress wording, and rough edges in the
              learning flow.
            </p>
            <div className={styles.previewNotice}>
              <div>
                <strong>Current boundary.</strong> Practice progress is stored
                locally in this browser. Accounts are real, but cloud progress
                sync is not live yet.
              </div>
            </div>
            <div className={styles.heroActions}>
              {surveyUrl ? (
                <a className={styles.primaryCta} href={surveyUrl}>
                  Open tester survey
                </a>
              ) : (
                <span className={styles.disabledCta}>
                  Survey link not configured yet
                </span>
              )}
              <Link className={styles.secondaryCta} href="/practice">
                Open the app
              </Link>
            </div>
            {!surveyUrl ? (
              <p className={styles.policyNote}>
                Add the live Google Forms URL as
                <code> NEXT_PUBLIC_TESTER_SURVEY_URL </code>
                in the deployment environment when the form is ready.
              </p>
            ) : null}
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>How to test</h2>
              <p>
                We are testing the app, not judging anyone's musical ability.
              </p>
            </div>
            <div className={styles.noticeList}>
              {testerSteps.map((step) => (
                <section key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
