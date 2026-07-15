import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the early-access FretGarden terms of use and current product boundaries."
};

const sections = [
  {
    title: "Early-access status",
    body:
      "FretGarden is actively being developed. Features may change, break, move, or be removed while the product is tested."
  },
  {
    title: "Accounts",
    body:
      "You may create a FretGarden account using Supabase Auth. Accounts do not currently sync lesson progress, drill history, or practice presets across devices."
  },
  {
    title: "Local progress",
    body:
      "Practice data is currently stored in your browser. Clearing browser storage, switching devices, or using private browsing may remove or hide local progress."
  },
  {
    title: "Educational scope",
    body:
      "FretGarden provides educational practice guidance and self-check structures. It does not guarantee musical mastery, professional certification, audition readiness, therapeutic outcomes, or injury prevention."
  },
  {
    title: "Acceptable use",
    body:
      "Do not attack, disrupt, scrape, or attempt unauthorized access to the service. Do not submit abusive content or misrepresent FretGarden as providing certification or medical advice."
  },
  {
    title: "Availability",
    body:
      "FretGarden may be unavailable during development, testing, deployments, or maintenance. Early-access use is provided without uptime guarantees."
  }
];

export default function TermsPage() {
  return (
    <MarketingShell activePage="terms">
      <section className={styles.signupSection} aria-labelledby="terms-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Terms of use</span>
            <h1 id="terms-title">Use FretGarden with clear expectations.</h1>
            <p>
              These early-access terms describe the current product boundary:
              local-first practice, real account access, and no cloud progress
              sync yet.
            </p>
            <p className={styles.policyDate}>Effective date: July 15, 2026</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/practice">
                Open the app
              </Link>
              <Link className={styles.secondaryCta} href="/privacy">
                Read privacy policy
              </Link>
            </div>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Current terms summary</h2>
              <p>
                This product terms draft should be reviewed before broad public
                launch.
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
