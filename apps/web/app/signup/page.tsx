import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { SignupForm } from "../components/marketing/SignupForm";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Create a FretGarden account to save your progress, follow a guided learning path, and keep your practice settings in one place.",
};

const accountBenefits = [
  {
    title: "Save progress across devices",
    description:
      "Keep your lesson history, drill results, and review priorities together.",
  },
  {
    title: "Follow your learning path",
    description:
      "Pick up where you left off and focus on the skills that need more practice.",
  },
  {
    title: "Shape your practice sessions",
    description:
      "Save your preferences, session goals, and favorite practice settings.",
  },
];

export default function SignupPage() {
  return (
    <MarketingShell activePage="signup">
      <section className={styles.signupSection} aria-labelledby="signup-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Start your practice garden</span>
            <h1 id="signup-title">Create a place for your progress to grow.</h1>
            <p>
              Build your FretGarden account to track practice, continue lessons,
              and return each day with a clear next step.
            </p>

            <div className={styles.previewNotice}>
              <div>
                <strong>Grow at your own pace.</strong>
                Short, focused sessions help you strengthen your fretboard
                knowledge without turning practice into a grind.
              </div>
            </div>

            <div
              className={styles.accountBenefits}
              aria-label="Account benefits"
            >
              {accountBenefits.map((benefit, index) => (
                <div className={styles.accountBenefit} key={benefit.title}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{benefit.title}</strong>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link className={styles.textCta} href="/practice">
              Explore the practice tools before creating an account.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Create your FretGarden account</h2>
              <p>
                Add your details below and begin building a steady practice
                routine.
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
