import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Read the FretGarden accessibility statement and current Gate 4 review boundary."
};

const supportItems = [
  "Semantic page structure and labeled controls.",
  "Keyboard-operable practice and pilot flows.",
  "Reduced-motion handling for pulse animation.",
  "Text equivalents for structured music blocks.",
  "Persistent feedback and local-storage error messages.",
  "Responsive layouts tested down to narrow mobile widths."
];

const remainingItems = [
  "Full screen-reader matrix execution and signoff.",
  "Visible-focus and zoom review.",
  "Assistive-input and touch-device review.",
  "Moderated learner and educator sessions.",
  "Resolution or explicit acceptance of findings."
];

export default function AccessibilityPage() {
  return (
    <MarketingShell activePage="accessibility">
      <section className={styles.signupSection} aria-labelledby="accessibility-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Accessibility statement</span>
            <h1 id="accessibility-title">Accessibility is part of release readiness.</h1>
            <p>
              FretGarden aims to make focused guitar practice usable by learners
              with different access needs. Automated checks are passing, but
              full human Gate 4 evidence still needs to be completed before
              final public release acceptance.
            </p>
            <p className={styles.policyDate}>Effective date: July 15, 2026</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/tester-feedback">
                Help test accessibility
              </Link>
              <Link className={styles.secondaryCta} href="/privacy">
                Read privacy policy
              </Link>
            </div>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Current accessibility status</h2>
              <p>
                The project has strong technical coverage, with human protocol
                evidence still pending.
              </p>
            </div>
            <div className={styles.policyColumns}>
              <section>
                <h3>Currently supported</h3>
                <ul>
                  {supportItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Still required</h3>
                <ul>
                  {remainingItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
