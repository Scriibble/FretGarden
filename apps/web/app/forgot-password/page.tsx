import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "../components/marketing/ForgotPasswordForm";
import { MarketingShell } from "../components/marketing/MarketingShell";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Reset Your Password",
  description:
    "Request a FretGarden password reset link for your account."
};

export default function ForgotPasswordPage() {
  return (
    <MarketingShell activePage="login">
      <section className={styles.signupSection} aria-labelledby="reset-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Password reset</span>
            <h1 id="reset-title">Reset your password.</h1>
            <p>
              Enter your account email and FretGarden will send a reset link if
              the address belongs to an account.
            </p>

            <Link className={styles.textCta} href="/login">
              Return to sign in.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Reset your password</h2>
              <p>Use the latest reset email if you request more than one link.</p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
