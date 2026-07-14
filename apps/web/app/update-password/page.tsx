import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "../components/marketing/MarketingShell";
import { UpdatePasswordForm } from "../components/marketing/UpdatePasswordForm";
import styles from "../components/marketing/marketing.module.css";

export const metadata: Metadata = {
  title: "Update Password",
  description:
    "Choose a new password for your FretGarden account."
};

export default function UpdatePasswordPage() {
  return (
    <MarketingShell activePage="login">
      <section className={styles.signupSection} aria-labelledby="update-title">
        <div className={styles.signupGrid}>
          <div className={styles.signupCopy}>
            <span className={styles.eyebrow}>Choose a new password</span>
            <h1 id="update-title">Reset your account key.</h1>
            <p>
              Use this page after opening the password reset link from your
              email. If the link is expired, request a new one.
            </p>

            <Link className={styles.textCta} href="/forgot-password">
              Request another reset link.
            </Link>
          </div>

          <div className={styles.signupCard}>
            <div className={styles.signupCardHeader}>
              <h2>Update password</h2>
              <p>Your new password should be unique to FretGarden.</p>
            </div>
            <UpdatePasswordForm />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
