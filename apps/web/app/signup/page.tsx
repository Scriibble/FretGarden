import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { SignupForm } from "../components/marketing/SignupForm";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Sign Up Preview",
  description:
    "Preview the future FretGarden account creation experience. Account storage and authentication are not active yet."
};

const accountBenefits = [
  {
    title: "Save progress across devices",
    description: "Planned cloud history for lessons, drills, and review priorities."
  },
  {
    title: "Continue a guided learning path",
    description: "Planned recommendations based on completed lessons and practice results."
  },
  {
    title: "Keep personal practice settings",
    description: "Planned presets, preferences, and session goals attached to your account."
  }
];

export default function SignupPage() {
  return (
    <MarketingShell activePage="signup">
      <section className={styles.signupSection} aria-labelledby="signup-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Future account experience</span>
            <h1 id="signup-title">Create a place for your progress to grow.</h1>
            <p>
              FretGarden accounts will eventually connect practice history,
              lesson progress, saved settings, and a guided learning path. The
              interface is being designed now, but authentication and account
              storage have not been connected.
            </p>

            <div className={styles.previewNotice}>
              <div>
                <strong>Accounts are coming later.</strong>
                This page is an interactive frontend preview. It does not send,
                save, or permanently store any information you enter.
              </div>
            </div>

            <div className={styles.accountBenefits} aria-label="Planned account benefits">
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
              Prefer to practice now? Open the local app without an account.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Account creation preview</h2>
              <p>
                Test the form states and validation. A successful submission
                only displays a local confirmation message.
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
