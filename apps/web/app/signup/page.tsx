import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { SignupForm } from "../components/marketing/SignupForm";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Create a FretGarden account for early account access while practice progress remains local-first.",
};

const accountBenefits = [
  {
    title: "Create your account identity",
    description:
      "Confirm your email and reserve the profile that future sync features will use.",
  },
  {
    title: "Keep practicing locally",
    description:
      "Use the current browser-based drills while local progress continues to work without an account.",
  },
  {
    title: "Prepare for cloud progress",
    description:
      "Cloud lesson history, drill results, and saved settings are planned for the next account pass.",
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
              Create your FretGarden account now so the foundation is ready for
              cloud progress sync. The current practice app still stores lesson
              and drill progress in this browser.
            </p>

            <div className={styles.previewNotice}>
              <div>
                <strong>Grow at your own pace.</strong>
                Account creation is live, and practice progress remains
                local-first until the sync layer is built.
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
              Open the practice tools without creating an account.
            </Link>
            <Link className={styles.textCta} href="/account-notice">
              Read the early account notice.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Create your FretGarden account</h2>
              <p>
                Add your details below. You may need to confirm your email
                before signing in.
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
